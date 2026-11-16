from fastapi import APIRouter, HTTPException

from app.agent.agent import agent
from app.schemas.agent import ChatRequest, ChatResponse

router = APIRouter(tags=["Agent"])


@router.post("/agent/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    user_message = {"role": "user", "content": request.message}
    messages = [user_message]
    config = {"configurable": {"thread_id": request.thread_id}}

    try:
        result = await agent.ainvoke({"messages": messages}, config=config)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

    final_message = result["messages"][-1]
    return ChatResponse(reply=final_message.text)