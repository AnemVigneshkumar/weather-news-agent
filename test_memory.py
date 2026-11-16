import asyncio

from app.agent.agent import agent


async def main():
    venkat = {"configurable": {"thread_id": "venkat-1"}}
    other = {"configurable": {"thread_id": "other-person"}}

    r1 = await agent.ainvoke(
        {"messages": [{"role": "user", "content": "My name is Venkat"}]},
        config=venkat,
    )
    print("1:", r1["messages"][-1].text)

    r2 = await agent.ainvoke(
        {"messages": [{"role": "user", "content": "What is my name?"}]},
        config=venkat,
    )
    print("2:", r2["messages"][-1].text)

    r3 = await agent.ainvoke(
        {"messages": [{"role": "user", "content": "What is my name?"}]},
        config=other,
    )
    print("3:", r3["messages"][-1].text)


asyncio.run(main())