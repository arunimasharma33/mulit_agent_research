from typing import Callable, Iterator

from agents import build_reader_agent, build_search_agent, writer_chain, critic_chain
from content_utils import normalize_agent_content

ProgressCallback = Callable[[dict], None]


def _emit(callback: ProgressCallback | None, event: dict) -> None:
    if callback:
        callback(event)


def run_research_pipeline(
    topic: str,
    on_progress: ProgressCallback | None = None,
) -> dict:
    state: dict = {}

    _emit(on_progress, {"step": "search", "status": "started", "label": "Search Agent"})
    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]
    })
    state["search_results"] = normalize_agent_content(search_result["messages"][-1].content)
    _emit(on_progress, {
        "step": "search",
        "status": "completed",
        "label": "Search Agent",
        "content": state["search_results"],
    })

    _emit(on_progress, {"step": "reader", "status": "started", "label": "Reader Agent"})
    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]
    })
    state["scraped_content"] = normalize_agent_content(reader_result["messages"][-1].content)
    _emit(on_progress, {
        "step": "reader",
        "status": "completed",
        "label": "Reader Agent",
        "content": state["scraped_content"],
    })

    _emit(on_progress, {"step": "writer", "status": "started", "label": "Writer"})
    research_combined = (
        f"SEARCH RESULTS : \n {state['search_results']} \n\n"
        f"DETAILED SCRAPED CONTENT : \n {state['scraped_content']}"
    )
    state["report"] = normalize_agent_content(writer_chain.invoke({
        "topic": topic,
        "research": research_combined,
    }))
    _emit(on_progress, {
        "step": "writer",
        "status": "completed",
        "label": "Writer",
        "content": state["report"],
    })

    _emit(on_progress, {"step": "critic", "status": "started", "label": "Critic"})
    state["feedback"] = normalize_agent_content(critic_chain.invoke({"report": state["report"]}))
    _emit(on_progress, {
        "step": "critic",
        "status": "completed",
        "label": "Critic",
        "content": state["feedback"],
    })

    _emit(on_progress, {"step": "done", "status": "completed", "result": state})
    return state


def run_research_pipeline_stream(topic: str) -> Iterator[dict]:
    events: list[dict] = []

    def collect(event: dict) -> None:
        events.append(event)

    run_research_pipeline(topic, on_progress=collect)
    yield from events



if __name__ == "__main__":
    topic = input("\n Enter a research topic : ")
    result = run_research_pipeline(topic)
    print("\n--- Final Report ---\n", result["report"])
    print("\n--- Critic Feedback ---\n", result["feedback"])