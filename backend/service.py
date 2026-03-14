import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser
from langsmith import Client

load_dotenv()

ls_client = Client(api_key=os.getenv("LANGSMITH_API_KEY"))


def run_ai_call(model_name: str, prompt_name: str, parser: JsonOutputParser, user_input: dict) -> dict:
    """Run AI call with dynamic model and LangSmith prompt"""

    llm = ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model=model_name,
        temperature=0
    )

    # Fetch prompt from LangSmith
    ls_prompt = ls_client.pull_prompt(prompt_name)

    # Build and run chain
    chain = ls_prompt | llm | parser
    response = chain.invoke(user_input)

    return response

