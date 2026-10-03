/* tech stack: LangChain & FAISS — interview Q&A
   Tool-specific questions for a resume that lists LangChain and FAISS. GenAI theory (RAG, embeddings,
   vector DBs, chunking, agents, evaluation, prompt injection) lives in core "ai" and is linked, not repeated.
   Every Python snippet runs offline: langchain_core 0.3 with fake/stub models (no API keys) and faiss-cpu. */
(window.TECH = window.TECH || []).push({
  id: "langchain",
  title: "LangChain & FAISS",
  short: "LangChain",
  icon: "⛓",
  blurb: "What interviewers probe when LangChain and FAISS are on your resume: the core abstractions and LCEL pipe syntax, how you built the RAG pipeline (splitting, embeddings, vector store, retrievers), memory, tools and agents, production concerns (structured output, tracing, cost, retries) — and how FAISS indexes actually trade recall for speed and memory.",
  topics: ["Basics", "LCEL", "Retrieval & RAG", "Agents & Memory", "Production", "FAISS"],
  questions: [

    /* ───────────── Basics ───────────── */
    {
    id: "what-is-langchain",
    q: "What is LangChain, what problems does it solve, and when would you NOT use it?",
    topic: "Basics",
    level: 1,
    top: true,
    short: "LangChain is an open-source Python/JS framework for building LLM applications. It gives you provider-agnostic interfaces for chat models, prompts, output parsers, embeddings, vector stores, retrievers and tools, plus LCEL to compose them into chains, and hundreds of integrations. It shines for RAG and tool-using apps where you want to swap providers and get tracing; for a single LLM call or a latency-critical path, the provider SDK directly is simpler.",
    a: [
      { p: "<b>LangChain</b> is a framework (Python and JavaScript) for building applications on top of LLMs. Its value is <b>standard interfaces</b> — every chat model, embedding model, vector store and retriever looks the same — so you can swap OpenAI for Anthropic, or FAISS for pgvector, by changing one line, and <b>composition</b> via the LangChain Expression Language (LCEL): <code>prompt | model | parser</code>." },
      { h: "The ecosystem (packages you should be able to name)" },
      { table: { head: ["Package", "What lives there"], rows: [
        ["<code>langchain-core</code>", "Base abstractions: messages, prompts, Runnables/LCEL, output parsers, Document, Embeddings/VectorStore interfaces, callbacks"],
        ["<code>langchain</code>", "Higher-level pieces: agents, chain constructors, retrieval strategies. In <b>LangChain 1.0 (Oct 2025)</b> it was slimmed down around <code>create_agent</code>; old chains/memory moved to <code>langchain-classic</code>"],
        ["<code>langchain-openai</code>, <code>langchain-anthropic</code>, …", "Partner packages: one per provider (<code>ChatOpenAI</code>, <code>ChatAnthropic</code>, <code>OpenAIEmbeddings</code>)"],
        ["<code>langchain-community</code>", "Long tail of third-party integrations: loaders, vector stores (incl. the FAISS wrapper), caches"],
        ["<code>langchain-text-splitters</code>", "<code>RecursiveCharacterTextSplitter</code> and friends"],
        ["<b>LangGraph</b>", "Low-level orchestration for stateful, multi-step agents (graphs, persistence, human-in-the-loop)"],
        ["<b>LangSmith</b>", "Hosted tracing, evaluation and prompt-management platform (works with or without LangChain)"]
      ] } },
      { code: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.language_models.fake_chat_models import FakeListChatModel

# In a real app: from langchain_openai import ChatOpenAI; llm = ChatOpenAI(model="...")
llm = FakeListChatModel(responses=["RAG = retrieve relevant chunks, then let the LLM answer from them."])

prompt = ChatPromptTemplate.from_messages([
    ("system", "You explain AI terms to freshers in one sentence."),
    ("human", "What is {term}?"),
])
chain = prompt | llm | StrOutputParser()      # an LCEL chain is itself a Runnable
print(type(chain).__name__)
print(chain.invoke({"term": "RAG"}))`, lang: "python", title: "The canonical 3-step chain (fake model so it runs offline)" },
      { code: `RunnableSequence
RAG = retrieve relevant chunks, then let the LLM answer from them.`, lang: "text", title: "Output" },
      { h: "When NOT to use it" },
      { ul: [
        "<b>One prompt, one provider</b> — a direct SDK call is 10 lines, with no extra dependency or abstraction to debug.",
        "<b>Tight latency/size budgets</b> (serverless cold starts, edge) — the dependency tree is large.",
        "<b>You need every provider-specific feature on day one</b> — wrappers sometimes lag new API parameters.",
        "<b>Complex agent control flow</b> — use LangGraph (or plain code) rather than forcing it into a linear chain.",
        "<b>Team unfamiliar with it</b> — the API has churned (0.1 → 0.2 → 0.3 → 1.0); pin versions and read migration notes."
      ] },
      { p: "Theory behind the apps you build with it: <a href=\"#/core/ai/rag-architecture\">RAG architecture</a> and <a href=\"#/core/ai/ai-agents-tool-calling\">agents & tool calling</a>." },
      { tip: "A strong answer is balanced: 'I used LangChain for the retriever/vector-store plumbing and tracing, but for the final call I kept the prompt explicit so I could see exactly what went to the model.' Interviewers distrust candidates who think the framework is magic." }
    ]
  },
    {
    id: "chat-models-prompts",
    q: "Explain chat models, messages and prompt templates in LangChain. What is the difference between PromptTemplate and ChatPromptTemplate?",
    topic: "Basics",
    level: 1,
    top: true,
    short: "A chat model takes a list of messages (SystemMessage, HumanMessage, AIMessage, ToolMessage) and returns an AIMessage. PromptTemplate formats a single string with variables, for plain text completion-style prompts. ChatPromptTemplate builds a list of role-tagged messages from templates, and MessagesPlaceholder lets you inject a variable-length list such as chat history. Both are Runnables: invoking them returns a PromptValue that a model accepts.",
    a: [
      { p: "<b>Chat models</b> (<code>ChatOpenAI</code>, <code>ChatAnthropic</code>, <code>ChatOllama</code>, …) all implement <code>BaseChatModel</code>: input is a list of <b>messages</b>, output is an <code>AIMessage</code> with <code>content</code>, optional <code>tool_calls</code>, <code>usage_metadata</code> (token counts) and <code>response_metadata</code>. Common constructor knobs: <code>model</code>, <code>temperature</code>, <code>max_tokens</code>, <code>timeout</code>, <code>max_retries</code>." },
      { table: { head: ["Message", "Role", "Typical content"], rows: [
        ["<code>SystemMessage</code>", "system", "Instructions, persona, rules"],
        ["<code>HumanMessage</code>", "user", "The user's input (text or multimodal parts)"],
        ["<code>AIMessage</code>", "assistant", "Model reply; may carry <code>tool_calls</code>"],
        ["<code>ToolMessage</code>", "tool", "Result of running a tool, linked by <code>tool_call_id</code>"]
      ] } },
      { code: `from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

# 1) PromptTemplate -> one string
pt = PromptTemplate.from_template("Summarise in {n} words: {text}")
print(repr(pt.format(n=10, text="LangChain composes LLM calls.")))

# 2) ChatPromptTemplate -> list of role-tagged messages
cpt = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}. Answer in {lang}."),
    MessagesPlaceholder("history"),          # variable-length list goes here
    ("human", "{question}"),
])
print(cpt.input_variables)

value = cpt.invoke({
    "role": "Python tutor", "lang": "English",
    "history": [HumanMessage("Hi"), AIMessage("Hello! Ask me anything.")],
    "question": "What is a decorator?",
})
for m in value.to_messages():
    print(f"{m.type:>6}: {m.content}")

# 3) partial: fix some variables up front
print(pt.partial(n=5).format(text="FAISS is fast."))`, lang: "python", title: "String vs chat templates" },
      { code: `'Summarise in 10 words: LangChain composes LLM calls.'
['history', 'lang', 'question', 'role']
system: You are a Python tutor. Answer in English.
 human: Hi
    ai: Hello! Ask me anything.
 human: What is a decorator?
Summarise in 5 words: FAISS is fast.`, lang: "text", title: "Output" },
      { table: { head: ["", "PromptTemplate", "ChatPromptTemplate"], rows: [
        ["Output", "<code>StringPromptValue</code> (one string)", "<code>ChatPromptValue</code> (list of messages)"],
        ["Roles", "None", "system / human / ai / placeholder"],
        ["Chat history", "Must be pasted into the string", "<code>MessagesPlaceholder</code>"],
        ["Use with", "Completion-style LLMs, sub-prompts", "Chat models (almost everything today)"]
      ] } },
      { warn: "Templates use <code>{}</code> for variables (f-string syntax by default). Literal braces — e.g. a JSON example inside the prompt — must be doubled <code>{{ }}</code>, otherwise you get a 'missing variable' error at invoke time." },
      { tip: "Prompt-writing itself (few-shot, role, format instructions) is theory — see <a href=\"#/core/ai/prompt-engineering\">prompt engineering</a>. Keep user input in the human message, never formatted into the system message: that is the first line of defence against <a href=\"#/core/ai/prompt-injection-and-llm-security\">prompt injection</a>." }
    ]
  },

    /* ───────────── LCEL ───────────── */
    {
    id: "lcel-runnables",
    q: "What is LCEL, how does the Runnable interface and pipe syntax work, and what do RunnableLambda, RunnableParallel and RunnablePassthrough do?",
    topic: "LCEL",
    level: 2,
    top: true,
    short: "LCEL, the LangChain Expression Language, composes components with the | operator. Everything — prompts, models, parsers, retrievers, plain functions wrapped in RunnableLambda — implements the Runnable interface (invoke, batch, stream and their async versions), so a pipe of Runnables is itself a Runnable. RunnableParallel runs several branches on the same input and returns a dict; RunnablePassthrough forwards the input unchanged, and .assign adds new keys to a dict.",
    a: [
      { p: "A <b>Runnable</b> is anything with a standard interface: <code>invoke</code> / <code>batch</code> / <code>stream</code> (+ <code>ainvoke</code>, <code>abatch</code>, <code>astream</code>, <code>astream_events</code>), plus config (callbacks, tags, metadata), <code>with_retry</code>, <code>with_fallbacks</code>, <code>with_config</code>. <code>a | b</code> builds a <code>RunnableSequence</code>: the output of <code>a</code> becomes the input of <code>b</code>." },
      { svg: `<svg viewBox="0 0 700 170" width="700" class="dg">
  <rect class="box" x="10" y="60" width="110" height="44" rx="6"/>
  <text class="tx tx-b" x="65" y="82" text-anchor="middle" dominant-baseline="middle">dict input</text>
  <rect class="box-a" x="150" y="10" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="220" y="30" text-anchor="middle" dominant-baseline="middle">retriever → docs</text>
  <rect class="box-a" x="150" y="114" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="220" y="134" text-anchor="middle" dominant-baseline="middle">Passthrough</text>
  <text class="tx-s" x="220" y="85" text-anchor="middle">RunnableParallel</text>
  <rect class="box" x="330" y="60" width="100" height="44" rx="6"/>
  <text class="tx tx-b" x="380" y="82" text-anchor="middle" dominant-baseline="middle">prompt</text>
  <rect class="box-p" x="460" y="60" width="100" height="44" rx="6"/>
  <text class="tx tx-b" x="510" y="82" text-anchor="middle" dominant-baseline="middle">chat model</text>
  <rect class="box-g" x="590" y="60" width="100" height="44" rx="6"/>
  <text class="tx tx-b" x="640" y="82" text-anchor="middle" dominant-baseline="middle">parser</text>
  <line class="ln" x1="120" y1="75" x2="148" y2="35" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="120" y1="90" x2="148" y2="130" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="290" y1="35" x2="328" y2="72" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="290" y1="130" x2="328" y2="92" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="430" y1="82" x2="458" y2="82" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="560" y1="82" x2="588" y2="82" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="510" y="135" text-anchor="middle">every box is a Runnable; the whole pipe is one too</text>
</svg>`, caption: "{\"context\": retriever, \"question\": RunnablePassthrough()} | prompt | model | parser" },
      { code: `from langchain_core.runnables import RunnableLambda, RunnableParallel, RunnablePassthrough

clean = RunnableLambda(lambda s: s.strip().lower())       # wrap any function
count = RunnableLambda(lambda s: len(s.split()))

pipe = clean | count                                      # RunnableSequence
print(pipe.invoke("  What Is FAISS  "))

# RunnableParallel: same input to every branch -> dict of outputs
par = RunnableParallel(text=clean, words=pipe, raw=RunnablePassthrough())
print(par.invoke("  Vector Search  "))

# A plain dict inside a pipe is coerced to RunnableParallel
chain = {"q": clean, "n": count} | RunnableLambda(lambda d: f"{d['q']!r} has {d['n']} words")
print(chain.invoke("  LCEL Is Neat "))

# .assign keeps the input dict and adds computed keys
add = RunnablePassthrough.assign(length=lambda d: len(d["question"]))
print(add.invoke({"question": "what is mmr?", "user": "asha"}))`, lang: "python", title: "The four building blocks" },
      { code: `3
{'text': 'vector search', 'words': 2, 'raw': '  Vector Search  '}
'lcel is neat' has 3 words
{'question': 'what is mmr?', 'user': 'asha', 'length': 12}`, lang: "text", title: "Output" },
      { h: "Why LCEL instead of the old LLMChain classes?" },
      { ul: [
        "<b>Streaming for free</b> — a sequence streams if its last steps can stream (model → parser).",
        "<b>Batch & async for free</b> — <code>batch</code> runs inputs concurrently (thread pool; <code>max_concurrency</code> in config); <code>ainvoke</code> works end to end.",
        "<b>Parallelism</b> — <code>RunnableParallel</code> branches run concurrently.",
        "<b>Observability</b> — every step appears as a nested run in callbacks/LangSmith.",
        "Legacy <code>LLMChain</code>, <code>RetrievalQA</code>, <code>ConversationChain</code> are deprecated (moved to <code>langchain-classic</code> in 1.0)."
      ] },
      { warn: "LCEL is great for linear/branching pipelines; once you need loops (agent retries until a tool succeeds), cycles or durable state, reach for LangGraph — don't write 200-line pipe expressions." },
      { tip: "Other runnables worth naming: <code>RunnableBranch</code> (if/else routing — or simply return a runnable from a RunnableLambda), <code>RunnableWithMessageHistory</code>, <code>.bind(stop=[...])</code> to fix kwargs, <code>.with_config(run_name=...)</code> for nicer traces." }
    ]
  },
    {
    id: "invoke-batch-stream",
    q: "What is the difference between invoke, batch and stream (and their async versions) on a LangChain Runnable?",
    topic: "LCEL",
    level: 2,
    top: true,
    short: "invoke runs one input and returns the full output. batch runs a list of inputs concurrently using a thread pool, with max_concurrency in config to respect rate limits, and returns outputs in order. stream yields output chunks as they are produced, which cuts time-to-first-token for chat UIs. ainvoke, abatch and astream are the asyncio versions for async servers like FastAPI, and astream_events streams events from every inner step, not just the final output.",
    a: [
      { table: { head: ["Method", "Input → output", "Use when"], rows: [
        ["<code>invoke(x)</code>", "one → one (complete)", "Scripts, background jobs"],
        ["<code>batch([x1, x2…])</code>", "many → many, concurrent, order preserved", "Offline evaluation, bulk summarising; set <code>max_concurrency</code>"],
        ["<code>stream(x)</code>", "one → iterator of chunks", "Chat UI typing effect, long answers"],
        ["<code>ainvoke / abatch / astream</code>", "same, but <code>async</code>", "Inside FastAPI / async web servers"],
        ["<code>astream_events(x, version=\"v2\")</code>", "one → events from every nested step", "Show 'retrieving…', tool calls and tokens in a UI"]
      ] } },
      { code: `import asyncio
from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_core.output_parsers import StrOutputParser

llm = FakeListChatModel(responses=["Hi there"])   # the fake model streams char by char
chain = llm | StrOutputParser()

print("invoke:", chain.invoke("hello"))
print("batch :", chain.batch(["q1", "q2", "q3"], config={"max_concurrency": 2}))
print("stream:", [chunk for chunk in chain.stream("hello")])

async def main():
    print("ainvoke:", await chain.ainvoke("hello"))
    async for ev in chain.astream_events("hello", version="v2"):
        if ev["event"] in ("on_chain_start", "on_chat_model_end"):
            print(ev["event"], ev["name"])

asyncio.run(main())`, lang: "python", title: "All four on the same chain" },
      { code: `invoke: Hi there
batch : ['Hi there', 'Hi there', 'Hi there']
stream: ['H', 'i', ' ', 't', 'h', 'e', 'r', 'e']
ainvoke: Hi there
on_chain_start RunnableSequence
on_chat_model_end FakeListChatModel`, lang: "text", title: "Output" },
      { code: `# FastAPI endpoint that streams tokens to the browser (needs a real model/API key)
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.get("/chat")
async def chat(q: str):
    async def gen():
        async for chunk in chain.astream({"question": q}):
            yield chunk                      # str chunks from StrOutputParser
    return StreamingResponse(gen(), media_type="text/plain")`, lang: "python", run: false, title: "Streaming in a web API" },
      { warn: "Streaming stops at the first step that cannot stream. A plain <code>RunnableLambda</code> (or custom parser) placed after the model receives the <i>complete</i> output, so nothing reaches the client until generation ends; <code>StrOutputParser</code> and <code>JsonOutputParser</code> are written to stream (the JSON parser yields growing partial objects). Write a generator function if a custom step must stream." },
      { tip: "Calling sync <code>invoke</code> inside an <code>async def</code> FastAPI route blocks the event loop for the whole LLM call (seconds). Use <code>ainvoke</code>/<code>astream</code> there — the interviewer is checking that you understand async." }
    ]
  },
    {
    id: "output-parsers-structured-output",
    q: "How do you get structured output (JSON / Pydantic objects) from an LLM in LangChain? Output parsers vs with_structured_output?",
    topic: "LCEL",
    level: 2,
    top: true,
    short: "Output parsers post-process text: StrOutputParser extracts the string, JsonOutputParser parses JSON, and PydanticOutputParser validates against a Pydantic model and supplies format instructions to put in the prompt. The preferred modern way is model.with_structured_output(MyModel), which uses the provider's native tool calling or JSON-schema mode so the model is constrained to the schema and you get a validated Pydantic object back. Parsers remain useful for models without native support.",
    a: [
      { p: "Apps need fields, not prose: <code>{\"sentiment\": \"negative\", \"product\": \"laptop\"}</code>. Two approaches:" },
      { table: { head: ["", "Output parsers", "<code>with_structured_output</code>"], rows: [
        ["How", "Ask for JSON in the prompt (format instructions), parse the text afterwards", "Pass the schema to the provider (tool calling / JSON schema mode); model output is constrained"],
        ["Reliability", "Model may add prose or break JSON → <code>OutputParserException</code>", "Much higher; strict modes guarantee schema-valid JSON on supporting providers"],
        ["Works with", "Any model", "Models that support tool calling or JSON mode"],
        ["Returns", "str / dict / Pydantic object", "Pydantic object (or dict for TypedDict/JSON schema); <code>include_raw=True</code> also returns the raw message and parse error"]
      ] } },
      { code: `from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from langchain_core.language_models.fake_chat_models import FakeListChatModel

class Review(BaseModel):
    product: str = Field(description="product being reviewed")
    sentiment: str = Field(description="positive, negative or neutral")
    rating: int = Field(ge=1, le=5)

parser = PydanticOutputParser(pydantic_object=Review)
prompt = ChatPromptTemplate.from_messages([
    ("system", "Extract fields from the review.\\n{format_instructions}"),
    ("human", "{review}"),
]).partial(format_instructions=parser.get_format_instructions())

# The fake model plays the LLM: first a good reply, then a broken one
llm = FakeListChatModel(responses=[
    '{"product": "laptop", "sentiment": "negative", "rating": 2}',
    'Sure! The rating is two stars.',
])
chain = prompt | llm | parser

r = chain.invoke({"review": "Battery died in a week. 2 stars."})
print(type(r).__name__, r.model_dump())
try:
    chain.invoke({"review": "meh"})
except OutputParserException as e:
    print("OutputParserException:", str(e).splitlines()[0][:40])`, lang: "python", title: "PydanticOutputParser — works with any model" },
      { code: `Review {'product': 'laptop', 'sentiment': 'negative', 'rating': 2}
OutputParserException: Invalid json output: Sure! The rating is`, lang: "text", title: "Output" },
      { code: `from langchain_openai import ChatOpenAI           # pip install langchain-openai

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
extractor = llm.with_structured_output(Review)       # Pydantic class, TypedDict or JSON schema
r = extractor.invoke("Battery died in a week. 2 stars.")
print(r.rating)        # 2  -- already a validated Review object

# debugging: keep the raw AIMessage and any parsing error instead of raising
safe = llm.with_structured_output(Review, include_raw=True)
out = safe.invoke("...")   # {"raw": AIMessage, "parsed": Review | None, "parsing_error": ... }`, lang: "python", run: false, title: "with_structured_output — preferred when the model supports it" },
      { ul: [
        "<b>StrOutputParser</b> — <code>AIMessage → str</code>; ends most chains.",
        "<b>JsonOutputParser</b> — tolerant JSON (strips <code>```json</code> fences), streams partial objects.",
        "<b>PydanticOutputParser</b> — JSON + validation + <code>get_format_instructions()</code>.",
        "Field <code>description</code>s are sent to the model — they are part of your prompt, write them carefully."
      ] },
      { warn: "Validation ≠ correctness. A schema-valid object can still contain a hallucinated value. Validate business rules (does this product exist? is the date in range?) in code after parsing." }
    ]
  },

    /* ───────────── Retrieval & RAG ───────────── */
    {
    id: "loaders-text-splitters",
    q: "How do document loaders and text splitters work in LangChain, and how does RecursiveCharacterTextSplitter use its parameters?",
    topic: "Retrieval & RAG",
    level: 1,
    top: true,
    short: "Loaders read a source — PDF, web page, CSV, Notion, a directory — into Document objects that have page_content and metadata such as source and page. Splitters cut documents into chunks small enough to embed and retrieve. RecursiveCharacterTextSplitter tries separators in order — paragraph break, newline, space, then characters — so chunks stay under chunk_size while splitting at natural boundaries; chunk_overlap repeats a little text between neighbours so a sentence cut at a boundary is not lost.",
    a: [
      { p: "Everything in LangChain's retrieval stack passes around <code>Document(page_content: str, metadata: dict)</code>. <b>Loaders</b> produce them: <code>PyPDFLoader</code> (one Document per page, <code>metadata={'source', 'page'}</code>), <code>WebBaseLoader</code>, <code>CSVLoader</code>, <code>DirectoryLoader</code>, <code>TextLoader</code> — mostly in <code>langchain-community</code>, with <code>.load()</code> and a lazy <code>.lazy_load()</code> for big corpora." },
      { code: `from langchain_text_splitters import RecursiveCharacterTextSplitter

text = ("LangChain is a framework for LLM apps.\\n\\n"
        "It provides prompts, models and parsers. Runnables compose with the pipe operator.\\n\\n"
        "FAISS is a library for similarity search. It was built by Meta AI Research "
        "and supports CPU and GPU indexes.")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=80,          # max length per chunk (measured by length_function, default len = characters)
    chunk_overlap=20,       # chars repeated between consecutive chunks
    add_start_index=True,   # record where each chunk starts in the original text
)
docs = splitter.create_documents([text], metadatas=[{"source": "notes.txt"}])
print("separators:", splitter._separators)
for d in docs:
    print(f"{len(d.page_content):>3} start={d.metadata['start_index']:>3} | {d.page_content}")`, lang: "python", title: "Splitting with overlap" },
      { code: `separators: ['\\n\\n', '\\n', ' ', '']
 38 start=  0 | LangChain is a framework for LLM apps.
 72 start= 40 | It provides prompts, models and parsers. Runnables compose with the pipe
 23 start= 99 | with the pipe operator.
 78 start=124 | FAISS is a library for similarity search. It was built by Meta AI Research and
 45 start=187 | AI Research and supports CPU and GPU indexes.`, lang: "text", title: "Output — paragraph breaks respected; 'with the pipe' and 'AI Research and' are the overlap" },
      { h: "How the recursion works" },
      { ol: [
        "Split on the first separator (<code>\\n\\n</code>, paragraphs).",
        "Merge adjacent pieces into chunks up to <code>chunk_size</code>, carrying <code>chunk_overlap</code> into the next chunk.",
        "Any piece still too big is split again with the <i>next</i> separator (<code>\\n</code>, then space, then single characters)."
      ] },
      { table: { head: ["Parameter", "Meaning / typical value"], rows: [
        ["<code>chunk_size</code>", "Max chunk length — characters by default. Typical 500–1500 chars (~100–400 tokens)"],
        ["<code>chunk_overlap</code>", "10–20% of chunk_size; too much = duplicate hits and more storage"],
        ["<code>length_function</code>", "How length is measured; use <code>from_tiktoken_encoder(...)</code> to count tokens instead"],
        ["<code>separators</code>", "Override the order; <code>from_language(Language.PYTHON, ...)</code> splits code at class/def boundaries"],
        ["<code>keep_separator</code>, <code>is_separator_regex</code>, <code>add_start_index</code>", "Fine control and traceability"]
      ] } },
      { warn: "<code>chunk_size</code> counts <b>characters</b> unless you change <code>length_function</code>. Saying '500 tokens' when you configured 500 characters is a common resume-vs-reality slip." },
      { tip: "Why chunk at all, and how to pick sizes (semantic chunking, parent-document retrieval, metadata) is theory — see <a href=\"#/core/ai/chunking-strategies\">chunking strategies</a>. Tool-specific extras: <code>MarkdownHeaderTextSplitter</code> keeps headers as metadata; <code>split_documents(docs)</code> preserves each loader's metadata." }
    ]
  },
    {
    id: "embeddings-vector-stores",
    q: "How do embeddings and vector store integrations work in LangChain, and how would you index documents into FAISS?",
    topic: "Retrieval & RAG",
    level: 2,
    top: true,
    short: "LangChain's Embeddings interface has two methods: embed_documents for a list of texts and embed_query for one query, implemented by OpenAIEmbeddings, HuggingFaceEmbeddings and others. A VectorStore such as FAISS, Chroma or PGVector stores the vectors with each Document; from_documents embeds and indexes in one call, similarity_search returns the nearest Documents, and as_retriever turns the store into a Runnable for chains. You can swap FAISS for a managed DB by changing one class.",
    a: [
      { p: "Two interfaces in <code>langchain-core</code>: <b>Embeddings</b> (<code>embed_documents(texts) → list[list[float]]</code>, <code>embed_query(text) → list[float]</code>) and <b>VectorStore</b> (<code>add_documents</code>, <code>similarity_search</code>, <code>similarity_search_with_score</code>, <code>max_marginal_relevance_search</code>, <code>delete</code>, <code>as_retriever</code>). Integrations implement them, so the RAG code stays the same whichever provider you pick." },
      { code: `import re, zlib, math
from langchain_core.embeddings import Embeddings
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS        # pip install faiss-cpu

class HashEmbeddings(Embeddings):
    """Offline stand-in for OpenAIEmbeddings / HuggingFaceEmbeddings:
    bag-of-words hashed into 256 dims, L2-normalised."""
    def _embed(self, text):
        v = [0.0] * 256
        for w in re.findall(r"[a-z]+", text.lower()):
            if len(w) > 2:
                v[zlib.crc32(w.encode()) % 256] += 1.0
        n = math.sqrt(sum(x * x for x in v)) or 1.0
        return [x / n for x in v]
    def embed_documents(self, texts): return [self._embed(t) for t in texts]
    def embed_query(self, text): return self._embed(text)

docs = [
    Document("Employees get 24 days of paid leave per year.", metadata={"source": "hr.pdf", "page": 3}),
    Document("Unused leave up to 10 days can be carried forward.", metadata={"source": "hr.pdf", "page": 4}),
    Document("Laptops are refreshed every 3 years by IT.", metadata={"source": "it.pdf", "page": 1}),
    Document("The cafeteria is open from 8 am to 8 pm.", metadata={"source": "admin.pdf", "page": 2}),
]
emb = HashEmbeddings()
vs = FAISS.from_documents(docs, emb)                     # embed_documents + build index + docstore
print(type(vs.index).__name__, "ntotal =", vs.index.ntotal, "dim =", vs.index.d)

for doc, score in vs.similarity_search_with_score("how many leave days per year", k=2):
    print(round(float(score), 3), doc.metadata["source"], doc.metadata["page"], "|", doc.page_content)

# metadata filter (FAISS wrapper filters after fetching fetch_k candidates)
print([d.metadata for d in vs.similarity_search("leave", k=2, filter={"page": 4})])

vs.add_documents([Document("Laptop bags are provided on request.", metadata={"source": "it.pdf", "page": 2})])
print("after add:", vs.index.ntotal)`, lang: "python", title: "Index → search → filter → add (FAISS through LangChain)" },
      { code: `IndexFlatL2 ntotal = 4 dim = 256
0.766 hr.pdf 3 | Employees get 24 days of paid leave per year.
1.333 hr.pdf 4 | Unused leave up to 10 days can be carried forward.
[{'source': 'hr.pdf', 'page': 4}]
after add: 5`, lang: "text", title: "Output — the score is an L2 distance: lower = more similar" },
      { table: { head: ["Integration", "Kind", "Pick it when"], rows: [
        ["<code>FAISS</code>", "In-process library + pickled docstore", "Prototype / single server, data fits in RAM, read-mostly"],
        ["<code>InMemoryVectorStore</code> (core)", "Python list, brute force", "Tests, demos, a few thousand chunks"],
        ["<code>Chroma</code>", "Embedded or client-server DB", "Local persistence with metadata filtering, low setup"],
        ["<code>PGVector</code>", "Postgres extension", "You already run Postgres; want SQL joins + ACID with vectors"],
        ["Pinecone / Qdrant / Weaviate / Milvus", "Managed or self-hosted vector DBs", "Scale, multi-tenancy, live updates, HA"]
      ] } },
      { warn: "The LangChain <code>FAISS</code> wrapper uses <b>IndexFlatL2</b> by default, so <code>similarity_search_with_score</code> returns a <b>distance</b> (lower is better) — not cosine similarity. Pass <code>distance_strategy=DistanceStrategy.MAX_INNER_PRODUCT</code> with normalised embeddings, or use <code>similarity_search_with_relevance_scores</code> for a 0–1 'higher is better' score." },
      { tip: "Embedding theory (what the vectors mean, cosine vs dot) is in <a href=\"#/core/ai/embeddings-semantic-search\">embeddings & semantic search</a>; ANN indexes in <a href=\"#/core/ai/vector-databases\">vector databases</a>. The interviewer's follow-up is usually 'what happens if you change the embedding model?' — you must re-embed everything." }
    ]
  },
    {
    id: "retrievers-mmr",
    q: "What is a retriever in LangChain, and how do similarity and MMR search differ (k, fetch_k, lambda_mult)?",
    topic: "Retrieval & RAG",
    level: 2,
    top: true,
    short: "A retriever is a Runnable that takes a query string and returns a list of Documents; vectorstore.as_retriever() is the most common one. search_type similarity returns the k nearest chunks; similarity_score_threshold drops weak matches; mmr, maximal marginal relevance, first fetches fetch_k candidates and then greedily picks k that are relevant but not redundant, balanced by lambda_mult where 1 means pure relevance and 0 maximum diversity. Defaults are k 4, fetch_k 20, lambda_mult 0.5.",
    a: [
      { p: "<b>Retriever</b> = anything with <code>invoke(query: str) → list[Document]</code>. Unlike a VectorStore, it doesn't have to store anything: BM25, a web search API, or a SQL query can all be retrievers. Because it is a Runnable, it drops straight into an LCEL chain." },
      { table: { head: ["<code>search_type</code>", "<code>search_kwargs</code>", "Behaviour"], rows: [
        ["<code>\"similarity\"</code> (default)", "<code>k</code> (default 4), <code>filter</code>", "Top-k nearest chunks"],
        ["<code>\"similarity_score_threshold\"</code>", "<code>score_threshold</code>, <code>k</code>", "Only chunks above a relevance score — may return nothing (good: lets you say 'I don't know')"],
        ["<code>\"mmr\"</code>", "<code>k</code>, <code>fetch_k</code> (20), <code>lambda_mult</code> (0.5)", "Fetch fetch_k candidates, then pick k that maximise relevance − redundancy"]
      ] } },
      { p: "<b>MMR</b> greedily picks the next document maximising <code>λ · sim(query, d) − (1 − λ) · max sim(d, already chosen)</code>. It fixes the classic RAG failure where top-4 are four near-copies of the same paragraph (overlapping chunks, duplicated pages), wasting the context window." },
      { code: `import re, zlib, math
from langchain_core.embeddings import Embeddings
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore

class HashEmbeddings(Embeddings):          # offline stand-in for a real embedding model
    def _embed(self, text):
        v = [0.0] * 256
        for w in re.findall(r"[a-z]+", text.lower()):
            if len(w) > 2:
                v[zlib.crc32(w.encode()) % 256] += 1.0
        n = math.sqrt(sum(x * x for x in v)) or 1.0
        return [x / n for x in v]
    def embed_documents(self, texts): return [self._embed(t) for t in texts]
    def embed_query(self, text): return self._embed(text)

texts = [
    "Refund policy: refunds are issued within 7 days of a return.",
    "Refund policy: refunds are issued within 7 days of the return.",   # near-duplicate
    "Refund policy: refunds are issued within 7 days after return.",    # near-duplicate
    "Refunds for damaged items need a photo of the damage.",
    "Shipping takes 3 to 5 business days.",
]
vs = InMemoryVectorStore.from_texts(texts, HashEmbeddings())
q = "refund policy for a damaged item return"

sim = vs.as_retriever(search_kwargs={"k": 2})
mmr = vs.as_retriever(search_type="mmr", search_kwargs={"k": 2, "fetch_k": 5, "lambda_mult": 0.3})
print("similarity:", [d.page_content[:38] for d in sim.invoke(q)])
print("mmr       :", [d.page_content[:38] for d in mmr.invoke(q)])`, lang: "python", title: "Similarity returns duplicates; MMR diversifies" },
      { code: `similarity: ['Refund policy: refunds are issued with', 'Refund policy: refunds are issued with']
mmr       : ['Refund policy: refunds are issued with', 'Refunds for damaged items need a photo']`, lang: "text", title: "Output" },
      { h: "Other retrievers worth naming" },
      { ul: [
        "<b>EnsembleRetriever</b> — hybrid BM25 + vector with reciprocal rank fusion.",
        "<b>MultiQueryRetriever</b> — LLM rewrites the question into several queries, unions the results.",
        "<b>ContextualCompressionRetriever</b> — re-ranks/filters retrieved docs (e.g. with a cross-encoder) before they reach the prompt.",
        "<b>ParentDocumentRetriever</b> — search small chunks, return their larger parent for context.",
        "<b>SelfQueryRetriever</b> — LLM turns 'Python books after 2020' into a query + metadata filter."
      ] },
      { tip: "Tune <code>k</code> with an eval set, not by feel: measure recall@k of the right chunk (see <a href=\"#/core/ai/evaluating-llm-apps\">evaluating LLM apps</a>). Bigger k raises recall but adds tokens, latency and distraction for the model." }
    ]
  },
    {
    id: "rag-chain-lcel",
    q: "Build a RAG chain in LangChain using LCEL. How do you return the source documents along with the answer?",
    topic: "Retrieval & RAG",
    level: 2,
    top: true,
    short: "Index once: split documents, embed them and store them in a vector store, then call as_retriever. The query chain is a dict of context from retriever piped into a formatting function, and question from RunnablePassthrough, piped into a ChatPromptTemplate, the chat model and StrOutputParser. To return sources, run the retriever once inside RunnableParallel or RunnablePassthrough.assign so the result dict carries both the docs and the answer, and render citations from the docs' metadata.",
    a: [
      { p: "This is the question behind 'I built a RAG chatbot with LangChain and FAISS'. Know the chain by heart — the architecture itself is <a href=\"#/core/ai/rag-architecture\">core theory</a>." },
      { code: `import re, zlib, math
from langchain_core.embeddings import Embeddings
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_community.vectorstores import FAISS

class HashEmbeddings(Embeddings):                   # offline stand-in for OpenAIEmbeddings
    def _embed(self, text):
        v = [0.0] * 256
        for w in re.findall(r"[a-z]+", text.lower()):
            if len(w) > 2:
                v[zlib.crc32(w.encode()) % 256] += 1.0
        n = math.sqrt(sum(x * x for x in v)) or 1.0
        return [x / n for x in v]
    def embed_documents(self, texts): return [self._embed(t) for t in texts]
    def embed_query(self, text): return self._embed(text)

# ---- 1. indexing (offline) ----
docs = [
    Document("Employees get 24 days of paid leave per year.", metadata={"source": "hr.pdf#p3"}),
    Document("Unused leave up to 10 days can be carried forward.", metadata={"source": "hr.pdf#p4"}),
    Document("Laptops are refreshed every 3 years by IT.", metadata={"source": "it.pdf#p1"}),
]
retriever = FAISS.from_documents(docs, HashEmbeddings()).as_retriever(search_kwargs={"k": 2})

# ---- 2. query chain ----
prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer ONLY from the context. Cite sources like [hr.pdf#p3]. "
               "If the answer is not in the context, say you don't know.\\n\\nContext:\\n{context}"),
    ("human", "{question}"),
])

def format_docs(docs):
    return "\\n".join(f"[{d.metadata['source']}] {d.page_content}" for d in docs)

def fake_llm(prompt_value):          # stand-in for ChatOpenAI: shows what the model receives
    system = prompt_value.to_messages()[0].content
    return "Up to 10 days of unused leave can be carried forward [hr.pdf#p4]. (model saw " \\
           + str(system.count("[") - 1) + " chunks)"

answer_chain = prompt | RunnableLambda(fake_llm) | StrOutputParser()

rag = (
    {"docs": retriever, "question": RunnablePassthrough()}        # retrieve ONCE
    | RunnablePassthrough.assign(context=lambda x: format_docs(x["docs"]))
    | RunnablePassthrough.assign(answer=answer_chain)
)
out = rag.invoke("How many unused leave days can be carried forward?")
print(out["answer"])
print("sources:", [d.metadata["source"] for d in out["docs"]])`, lang: "python", title: "RAG in LCEL — answer + sources in one result dict" },
      { code: `Up to 10 days of unused leave can be carried forward [hr.pdf#p4]. (model saw 2 chunks)
sources: ['hr.pdf#p4', 'hr.pdf#p3']`, lang: "text", title: "Output" },
      { p: "In production the only changes are <code>ChatOpenAI(...)</code> (or any chat model) instead of <code>fake_llm</code>, a real embedding model, and loading the FAISS index from disk instead of rebuilding it per request." },
      { h: "Things the interviewer pokes at" },
      { ul: [
        "<b>Retrieve once</b> — don't put the retriever in two branches (it would run twice); fan out its result with <code>assign</code>.",
        "<b>Format docs yourself</b> — a list of Document objects stringified into the prompt is noise; number them and include the source for citations.",
        "<b>'I don't know' path</b> — a score threshold or an empty-context check before calling the LLM saves tokens and hallucinations.",
        "<b>Conversational RAG</b> — first rewrite the follow-up ('and for interns?') into a standalone question using chat history, then retrieve.",
        "<b>Evaluation</b> — retrieval recall@k and answer faithfulness on a test set (<a href=\"#/core/ai/evaluating-llm-apps\">core</a>)."
      ] },
      { warn: "Retrieved text is untrusted input. A document saying 'ignore previous instructions…' ends up in your system prompt — the indirect <a href=\"#/core/ai/prompt-injection-and-llm-security\">prompt injection</a> path. Delimit context, filter by the user's permissions at retrieval time, and never give a RAG bot tools with side effects without checks." },
      { tip: "The legacy one-liners <code>RetrievalQA</code> / <code>create_retrieval_chain</code> hide the prompt. Writing it in LCEL like this shows you know exactly what the model receives — that is what the interviewer wants to hear." }
    ]
  },

    /* ───────────── Agents & Memory ───────────── */
    {
    id: "chat-history-memory",
    q: "How do you add memory (chat history) to a LangChain app? What replaced ConversationBufferMemory?",
    topic: "Agents & Memory",
    level: 2,
    top: true,
    short: "LLMs are stateless, so memory means storing past messages and sending them back on every call. Modern LangChain uses a MessagesPlaceholder in the prompt plus RunnableWithMessageHistory, which loads the history for a session_id from a chat message history store, injects it, and appends the new turn afterwards; for agents, LangGraph checkpointers keyed by thread_id persist state. The old ConversationBufferMemory classes are deprecated. Trim or summarise history to stay within the context window.",
    a: [
      { p: "The model remembers nothing between calls. 'Memory' = your app <b>stores the conversation per user/session</b> and puts (some of) it back into the prompt each turn." },
      { code: `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import AIMessage

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])

def fake_llm(pv):                    # reports how many messages the model received
    return AIMessage(f"(model received {len(pv.to_messages())} messages)")

chain = prompt | RunnableLambda(fake_llm)

store = {}                           # session_id -> history; use Redis/Postgres in production
def get_history(session_id):
    return store.setdefault(session_id, InMemoryChatMessageHistory())

bot = RunnableWithMessageHistory(chain, get_history,
                                 input_messages_key="input", history_messages_key="history")

asha = {"configurable": {"session_id": "asha"}}
print(bot.invoke({"input": "Hi, I'm Asha"}, config=asha).content)
print(bot.invoke({"input": "What's my name?"}, config=asha).content)
print(bot.invoke({"input": "Hello"}, config={"configurable": {"session_id": "ravi"}}).content)
print("asha's stored history:", [m.type for m in store["asha"].messages])`, lang: "python", title: "RunnableWithMessageHistory: per-session history" },
      { code: `(model received 2 messages)
(model received 4 messages)
(model received 2 messages)
asha's stored history: ['human', 'ai', 'human', 'ai']`, lang: "text", title: "Output — history grows per session, isolated between users" },
      { table: { head: ["Strategy", "How", "Trade-off"], rows: [
        ["Buffer (all messages)", "Send everything", "Simple; tokens and cost grow every turn, eventually overflow"],
        ["Window / trim", "<code>trim_messages(max_tokens=..., strategy=\"last\")</code>", "Bounded cost; forgets early facts"],
        ["Summary", "LLM summarises old turns into one system message", "Long conversations; extra LLM call, lossy"],
        ["Long-term / vector memory", "Store facts or past turns in a vector store, retrieve relevant ones", "Remembers across sessions; retrieval can miss"]
      ] } },
      { ul: [
        "<b>Deprecated</b>: <code>ConversationBufferMemory</code>, <code>ConversationSummaryMemory</code>, <code>ConversationChain</code> (deprecated in 0.3, moved to <code>langchain-classic</code> in 1.0).",
        "<b>Stores</b>: <code>InMemoryChatMessageHistory</code> for demos; Redis / Postgres / SQL chat histories (community packages) in production.",
        "<b>Agents</b>: LangGraph persists the whole graph state with a <b>checkpointer</b> keyed by <code>thread_id</code> — the recommended path for new agent apps."
      ] },
      { warn: "Keying history by something the client controls without auth (e.g. a session_id from the URL) leaks one user's conversation to another. Derive the session key from the authenticated user on the server." },
      { tip: "Mention the context-window budget: system prompt + retrieved chunks + history + answer must fit (<a href=\"#/core/ai/context-window-kv-cache\">context window</a>). Trimming history is the usual first fix when long chats start failing." }
    ]
  },
    {
    id: "tool-calling",
    q: "How does tool calling work in LangChain — how does a model end up calling your Python function?",
    topic: "Agents & Memory",
    level: 2,
    top: true,
    short: "You define tools — with the @tool decorator, a Pydantic schema or a plain function — and attach them with model.bind_tools(tools). The model never runs code: it returns an AIMessage whose tool_calls list holds the tool name, JSON arguments and an id. Your code executes the tool, appends a ToolMessage with the result and the matching tool_call_id, and calls the model again until it answers without tool calls. That loop is exactly what an agent automates.",
    a: [
      { p: "The <code>@tool</code> decorator turns a function into a tool: its <b>name</b>, <b>docstring</b> (description) and <b>type hints</b> (JSON schema of args) are sent to the model. The model decides whether to call it and with what arguments; <b>your</b> process runs it." },
      { code: `from langchain_core.tools import tool
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.language_models.fake_chat_models import GenericFakeChatModel

@tool
def get_weather(city: str) -> str:
    """Return the current weather for a city."""
    return f"31 C and sunny in {city}"            # call a real API here

print(get_weather.name, "|", get_weather.description, "|", get_weather.args)

# Fake model scripted to behave like a tool-calling LLM: first asks for the tool, then answers.
class FakeToolModel(GenericFakeChatModel):
    def bind_tools(self, tools, **kwargs):          # real models send the tool schemas to the API
        return self

llm = FakeToolModel(messages=iter([
    AIMessage(content="", tool_calls=[{"name": "get_weather", "args": {"city": "Pune"}, "id": "call_1"}]),
    AIMessage(content="It is 31 C and sunny in Pune right now."),
]))
llm_with_tools = llm.bind_tools([get_weather])      # real: ChatOpenAI(...).bind_tools([get_weather])
tools_by_name = {"get_weather": get_weather}

messages = [HumanMessage("What's the weather in Pune?")]
while True:                                          # the agent loop
    ai = llm_with_tools.invoke(messages)
    messages.append(ai)
    if not ai.tool_calls:
        break
    for tc in ai.tool_calls:
        print("model requested:", tc["name"], tc["args"])
        tool_msg = tools_by_name[tc["name"]].invoke(tc)    # returns a ToolMessage
        messages.append(tool_msg)

print([type(m).__name__ for m in messages])
print("final:", messages[-1].content)`, lang: "python", title: "bind_tools → tool_calls → ToolMessage → final answer" },
      { code: `get_weather | Return the current weather for a city. | {'city': {'title': 'City', 'type': 'string'}}
model requested: get_weather {'city': 'Pune'}
['HumanMessage', 'AIMessage', 'ToolMessage', 'AIMessage']
final: It is 31 C and sunny in Pune right now.`, lang: "text", title: "Output" },
      { ul: [
        "Invoking a tool with the whole <code>tool_call</code> dict returns a <code>ToolMessage</code> with the right <code>tool_call_id</code> already set.",
        "Models can return <b>several</b> tool calls in one turn (parallel tool calling) — loop over all of them.",
        "<code>bind_tools(..., tool_choice=\"get_weather\")</code> forces a specific tool; <code>\"any\"</code> forces some tool.",
        "Tool errors: raise <code>ToolException</code> and set <code>handle_tool_error=True</code> so the error text goes back to the model instead of crashing the loop."
      ] },
      { warn: "Tool arguments come from the model, which can be steered by injected text. Validate arguments, scope permissions (read-only DB user), and require human confirmation for side effects like sending email or payments (<a href=\"#/core/ai/prompt-injection-and-llm-security\">core: LLM security</a>)." },
      { tip: "Concepts (ReAct loop, when agents are worth it) are in <a href=\"#/core/ai/ai-agents-tool-calling\">core: agents & tool calling</a>. Here the interviewer wants the message mechanics: AIMessage.tool_calls in, ToolMessage with tool_call_id out." }
    ]
  },
    {
    id: "agents-langgraph",
    q: "How do agents work in LangChain, and what is LangGraph? When would you use LangGraph instead of a chain?",
    topic: "Agents & Memory",
    level: 3,
    top: false,
    short: "An agent is the tool-calling loop automated: the model decides which tool to call, the runtime executes it, feeds the result back, and repeats until the model answers. The legacy AgentExecutor did this as a black box. LangGraph models an app as a state graph: nodes are functions, edges — including conditional ones — decide what runs next, and a checkpointer persists state per thread, enabling loops, retries, human approval and resumable runs. Use chains for fixed pipelines and LangGraph when control flow depends on the model.",
    a: [
      { table: { head: ["", "LCEL chain", "Legacy AgentExecutor", "LangGraph"], rows: [
        ["Control flow", "Fixed DAG", "Hidden while-loop", "Explicit graph with cycles"],
        ["State", "Passed through", "Scratchpad inside executor", "Typed state object, persisted by a checkpointer"],
        ["Human-in-the-loop", "No", "Awkward", "<code>interrupt()</code>, resume later"],
        ["Status (2025–26)", "Current", "Legacy (<code>langchain-classic</code> in 1.0)", "Recommended for agents; <code>create_agent</code> in LangChain 1.0 is built on it"]
      ] } },
      { svg: `<svg viewBox="0 0 560 190" width="560" class="dg">
  <rect class="box" x="10" y="75" width="90" height="40" rx="20"/>
  <text class="tx tx-b" x="55" y="95" text-anchor="middle" dominant-baseline="middle">START</text>
  <rect class="box-p" x="150" y="75" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="205" y="95" text-anchor="middle" dominant-baseline="middle">agent (LLM)</text>
  <rect class="box-a" x="320" y="10" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="375" y="30" text-anchor="middle" dominant-baseline="middle">tools</text>
  <rect class="box-g" x="320" y="140" width="110" height="40" rx="20"/>
  <text class="tx tx-b" x="375" y="160" text-anchor="middle" dominant-baseline="middle">END</text>
  <line class="ln" x1="100" y1="95" x2="148" y2="95" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="260" y1="85" x2="318" y2="35" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="300" y="70" text-anchor="middle">has tool_calls</text>
  <line class="ln-d" x1="320" y1="45" x2="262" y2="92" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="260" y1="105" x2="318" y2="155" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="300" y="128" text-anchor="middle">no tool_calls</text>
  <text class="tx-m" x="455" y="95">checkpointer saves</text>
  <text class="tx-m" x="455" y="112">state per thread_id</text>
</svg>`, caption: "The ReAct agent as a LangGraph: a conditional edge loops through tools until the model stops calling them." },
      { code: `from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import InMemorySaver
from langchain_openai import ChatOpenAI

class State(TypedDict):
    messages: Annotated[list, add_messages]      # reducer: append, don't overwrite

llm = ChatOpenAI(model="gpt-4o-mini").bind_tools([get_weather])

def agent(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

g = StateGraph(State)
g.add_node("agent", agent)
g.add_node("tools", ToolNode([get_weather]))
g.add_edge(START, "agent")
g.add_conditional_edges("agent", tools_condition)   # -> "tools" or END
g.add_edge("tools", "agent")
app = g.compile(checkpointer=InMemorySaver())

cfg = {"configurable": {"thread_id": "user-42"}}
app.invoke({"messages": [("user", "Weather in Pune?")]}, cfg)
app.invoke({"messages": [("user", "And tomorrow?")]}, cfg)  # remembers the thread`, lang: "python", run: false, title: "A minimal tool-calling agent in LangGraph (needs langgraph + an API key)" },
      { p: "Prebuilt shortcut: <code>langgraph.prebuilt.create_react_agent(model, tools)</code> (LangGraph 0.x) — in LangChain 1.0 the equivalent is <code>langchain.agents.create_agent(model, tools, ...)</code> with middleware for things like summarisation and human approval." },
      { h: "When to use what" },
      { ul: [
        "<b>Fixed steps</b> (retrieve → answer, extract → validate): an LCEL chain or plain code. Cheaper, deterministic, easy to test.",
        "<b>Model-driven steps</b> (unknown number of tool calls, retry until valid, route between specialists): LangGraph.",
        "<b>Long-running / needs approval / must survive restarts</b>: LangGraph with a persistent checkpointer (Postgres/SQLite)."
      ] },
      { warn: "Agents multiply cost and failure modes: every loop iteration is an LLM call. Always set a recursion/iteration limit (<code>recursion_limit</code> in LangGraph config), log every tool call, and prefer a fixed chain if the task doesn't need autonomy." }
    ]
  },

    /* ───────────── Production ───────────── */
    {
    id: "callbacks-langsmith",
    q: "What are callbacks in LangChain, and how do you trace and debug a chain with LangSmith?",
    topic: "Production",
    level: 2,
    top: false,
    short: "Callbacks are hooks — on_chat_model_start, on_llm_new_token, on_llm_end, on_chain_start, on_tool_start, on_retriever_end and the error variants — that LangChain fires as each Runnable runs. You pass handlers in the config at invoke time, where they propagate to all child runs, or on a single object's constructor. LangSmith is the hosted tracing platform built on this: set LANGSMITH_TRACING=true and an API key and every run becomes a nested trace with inputs, outputs, latency, tokens and errors, which you can also turn into evaluation datasets.",
    a: [
      { p: "Every Runnable emits lifecycle events through the <b>callback system</b>. A handler subclasses <code>BaseCallbackHandler</code> and overrides the events it cares about — for logging, metrics, streaming tokens to a websocket, or cost tracking." },
      { code: `from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.language_models.fake_chat_models import FakeListChatModel

class AuditLog(BaseCallbackHandler):
    def on_chain_start(self, serialized, inputs, **kw):
        print("chain start :", kw.get("name"), "tags=", kw.get("tags"))
    def on_chat_model_start(self, serialized, messages, **kw):
        print("model start :", len(messages[0]), "messages, user =", kw["metadata"].get("user_id"))
    def on_llm_end(self, response, **kw):
        print("model end   :", response.generations[0][0].text)

chain = (ChatPromptTemplate.from_messages([("human", "{q}")])
         | FakeListChatModel(responses=["42"]) | StrOutputParser()).with_config(run_name="qa_chain")

chain.invoke({"q": "meaning of life?"},
             config={"callbacks": [AuditLog()], "tags": ["prod"], "metadata": {"user_id": "u-17"}})`, lang: "python", title: "A custom callback handler, passed at request time" },
      { code: `chain start : qa_chain tags= ['prod']
chain start : ChatPromptTemplate tags= ['seq:step:1', 'prod']
model start : 1 messages, user = u-17
model end   : 42
chain start : StrOutputParser tags= ['seq:step:3', 'prod']`, lang: "text", title: "Output — handlers in config reach every nested step" },
      { table: { head: ["Where you attach", "Scope"], rows: [
        ["<code>chain.invoke(x, config={\"callbacks\": [h]})</code>", "This request, inherited by all child runs (preferred)"],
        ["<code>ChatOpenAI(callbacks=[h])</code>", "Only that object's own events, every call"],
        ["<code>tags</code> / <code>metadata</code> in config", "Attached to every run — filter traces by user, tenant, version"]
      ] } },
      { code: `export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=lsv2_...          # from smith.langchain.com
export LANGSMITH_PROJECT=rag-chatbot-prod  # optional, groups traces
# (older docs: LANGCHAIN_TRACING_V2=true / LANGCHAIN_API_KEY)
python app.py                               # no code change: every invoke is traced`, lang: "bash", title: "Turning on LangSmith tracing" },
      { ul: [
        "A trace shows the tree: chain → retriever (which docs, scores) → prompt (exact text) → model (tokens, latency, cost) → parser.",
        "Debug 'wrong answer': was the right chunk retrieved? If not, it is a retrieval problem, not a prompt problem.",
        "Save bad traces into a <b>dataset</b> and run evaluations on every prompt change (regression testing for LLM apps).",
        "Local alternatives: <code>set_debug(True)</code> / <code>set_verbose(True)</code> from <code>langchain_core.globals</code>; open-source tracers such as Langfuse or OpenTelemetry-based tools."
      ] },
      { warn: "Traces contain full prompts and outputs — i.e. user data and retrieved documents. Mask PII or self-host when the data is sensitive; don't enable tracing on production traffic without checking the data policy." }
    ]
  },
    {
    id: "cost-latency-caching",
    q: "How do you reduce cost and latency in a LangChain application? How does LLM caching work?",
    topic: "Production",
    level: 2,
    top: false,
    short: "Measure first with usage_metadata or tracing. Then: cache identical calls with set_llm_cache, using InMemoryCache, SQLiteCache or Redis, and consider semantic caches for near-duplicate questions; send fewer tokens by retrieving fewer, better chunks, trimming history and shortening prompts; route easy tasks to a smaller model; use provider prompt caching for long static prefixes; stream to cut time-to-first-token; run independent steps in parallel with RunnableParallel and batch with max_concurrency.",
    a: [
      { p: "Cost ≈ (input tokens × price) + (output tokens × price) per call × calls per request. Latency ≈ time-to-first-token + output tokens ÷ generation speed, plus retrieval and tool time. Every lever attacks one of those terms." },
      { code: `from langchain_core.globals import set_llm_cache
from langchain_core.caches import InMemoryCache
from langchain_core.language_models.fake_chat_models import FakeListChatModel

set_llm_cache(InMemoryCache())          # process-wide; key = (prompt, model params)
llm = FakeListChatModel(responses=["answer #1", "answer #2", "answer #3"])

print(llm.invoke("What is FAISS?").content)   # miss -> calls the model
print(llm.invoke("What is FAISS?").content)   # hit  -> served from cache
print(llm.invoke("what is faiss?").content)   # different string -> miss
set_llm_cache(None)`, lang: "python", title: "Exact-match caching" },
      { code: `answer #1
answer #1
answer #2`, lang: "text", title: "Output — the second call never reached the model" },
      { table: { head: ["Lever", "How in LangChain", "Saves"], rows: [
        ["Exact cache", "<code>set_llm_cache(InMemoryCache())</code>, <code>SQLiteCache</code>, Redis cache", "Cost + latency for repeated prompts (FAQ bots, evals)"],
        ["Semantic cache", "Redis/vector-based semantic caches: hit if a past question is similar enough", "More hits; risk of returning a wrong cached answer"],
        ["Fewer input tokens", "Smaller <code>k</code>, re-ranking, <code>trim_messages</code>, concise system prompt", "Cost + latency"],
        ["Model routing", "Cheap model for classification/extraction, big model only when needed (<code>RunnableBranch</code> or code)", "Cost"],
        ["Provider prompt caching", "Keep the long static part (system prompt, tool schemas) first and identical", "Input cost + TTFT on supported providers"],
        ["Streaming", "<code>stream</code> / <code>astream</code>", "Perceived latency"],
        ["Parallelism", "<code>RunnableParallel</code>, <code>batch(..., config={\"max_concurrency\": n})</code>, async", "Wall-clock time"],
        ["Embedding cache", "<code>CacheBackedEmbeddings</code> — don't re-embed unchanged chunks", "Indexing cost"]
      ] } },
      { ul: [
        "<b>Measure</b>: <code>AIMessage.usage_metadata</code> gives <code>input_tokens</code> / <code>output_tokens</code>; LangSmith aggregates cost per trace.",
        "<b>Cap output</b>: <code>max_tokens</code> and 'answer in ≤ 3 sentences' — output tokens are slower and usually pricier than input.",
        "<b>Avoid needless agent loops</b>: a fixed chain is 1–2 calls; an agent can be 5–10."
      ] },
      { warn: "Caching with <code>temperature &gt; 0</code> or per-user context can serve one user's personalised answer to another. Include user/tenant in the cache key or only cache user-independent calls." },
      { tip: "General cost/latency theory: <a href=\"#/core/ai/cost-and-latency\">core: cost & latency</a>. Quote numbers from your project if you can: 'caching the FAQ questions cut our LLM calls by ~40%'." }
    ]
  },
    {
    id: "error-handling-retries",
    q: "How do you handle errors, timeouts and retries in LangChain (rate limits, provider outages, bad model output)?",
    topic: "Production",
    level: 2,
    top: false,
    short: "Use layers. Set timeout and max_retries on the chat model client. Wrap any Runnable with .with_retry, choosing exception types, attempt count and exponential backoff with jitter, for transient errors like 429s and timeouts. Use .with_fallbacks to switch to a backup model or provider when retries are exhausted. For malformed output, catch OutputParserException, use with_structured_output with include_raw, or re-ask the model. Validate tool arguments and cap agent iterations.",
    a: [
      { table: { head: ["Failure", "Tool", "Example"], rows: [
        ["Slow / hung request", "Client <code>timeout</code>", "<code>ChatOpenAI(timeout=30)</code>"],
        ["Transient (429, 5xx, network)", "Client <code>max_retries</code> or <code>.with_retry()</code>", "Exponential backoff + jitter, 2–3 attempts"],
        ["Provider outage", "<code>.with_fallbacks([...])</code>", "Primary model → secondary provider → cached/static answer"],
        ["Malformed output", "<code>OutputParserException</code>, <code>include_raw=True</code>, re-ask", "Retry with the error appended, or return a safe default"],
        ["Tool failure", "<code>ToolException</code> + <code>handle_tool_error</code>", "Error text goes back to the model to recover"],
        ["Runaway agent", "<code>recursion_limit</code> / max iterations", "Stop after N steps"]
      ] } },
      { code: `from langchain_core.runnables import RunnableLambda

attempts = {"n": 0}
def flaky_llm(q):                                   # fails twice like a rate-limited API
    attempts["n"] += 1
    if attempts["n"] < 3:
        raise TimeoutError(f"attempt {attempts['n']}: upstream timeout")
    return f"answer to {q!r} after {attempts['n']} attempts"

robust = RunnableLambda(flaky_llm).with_retry(
    retry_if_exception_type=(TimeoutError, ConnectionError),   # only transient errors
    stop_after_attempt=3,
    wait_exponential_jitter=False,                  # True in production: backoff + jitter
)
print(robust.invoke("what is RAG"))

def primary(q):  raise ConnectionError("primary provider down")
def backup(q):   return f"backup model answered {q!r}"

chain = RunnableLambda(primary).with_fallbacks(
    [RunnableLambda(backup)], exceptions_to_handle=(ConnectionError,))
print(chain.invoke("what is MMR"))

try:
    RunnableLambda(primary).with_retry(stop_after_attempt=2, wait_exponential_jitter=False).invoke("x")
except ConnectionError as e:
    print("gave up:", e)`, lang: "python", title: "with_retry and with_fallbacks" },
      { code: `answer to 'what is RAG' after 3 attempts
backup model answered 'what is MMR'
gave up: primary provider down`, lang: "text", title: "Output" },
      { code: `primary  = ChatOpenAI(model="gpt-4o-mini", timeout=30, max_retries=2)
backup   = ChatAnthropic(model="claude-haiku-...", timeout=30, max_retries=2)
llm = primary.with_fallbacks([backup])     # same prompt, same parser, other provider
chain = prompt | llm | StrOutputParser()`, lang: "python", run: false, title: "Typical production setup (provider packages + API keys needed)" },
      { warn: "Don't retry non-transient errors (400 bad request, 401 invalid key, context-length exceeded) — they fail every time and just burn time. Also avoid stacking retries: client <code>max_retries=6</code> × <code>with_retry(3)</code> × an outer HTTP retry = 18+ attempts per user request." },
      { tip: "The same patterns as any remote call: <a href=\"#/core/sd/retries-exponential-backoff-jitter\">backoff with jitter</a> and <a href=\"#/core/sd/circuit-breaker\">circuit breakers</a>. Saying 'fallbacks need the same output format, so I tested the backup prompt too' shows production experience." }
    ]
  },

    /* ───────────── FAISS ───────────── */
    {
    id: "what-is-faiss",
    q: "What is FAISS? How do you build an index and search it?",
    topic: "FAISS",
    level: 1,
    top: true,
    short: "FAISS, Facebook AI Similarity Search from Meta's FAIR lab, is a C++ library with Python bindings for fast nearest-neighbour search over dense vectors, on CPU or GPU. It is a library, not a database: no server, auth, replication or metadata filtering by default. You create an index of fixed dimension d, add float32 vectors, and search with query vectors and k to get two arrays: distances D and row ids I, which you map back to your documents.",
    a: [
      { p: "<b>FAISS</b> (Facebook AI Similarity Search) is an open-source library from Meta AI Research for efficient similarity search and clustering of dense vectors. Install with <code>pip install faiss-cpu</code> (GPU builds are distributed via conda). It implements exact search and many ANN index types (IVF, HNSW, PQ…), scaling to billions of vectors." },
      { code: `import numpy as np
import faiss

rng = np.random.default_rng(42)
d, N = 64, 10_000
xb = rng.random((N, d), dtype=np.float32)        # database vectors (FAISS wants float32, C-contiguous)
xq = rng.random((3, d), dtype=np.float32)        # 3 query vectors

index = faiss.IndexFlatL2(d)                     # exact search, Euclidean distance
print("trained:", index.is_trained, "ntotal:", index.ntotal)
index.add(xb)                                    # ids are 0..N-1 in insertion order
print("ntotal after add:", index.ntotal)

D, I = index.search(xq, 4)                       # k = 4 nearest per query
print("I (row ids):\\n", I)
print("D (squared L2):\\n", D.round(2))

# sanity check: FAISS distances are SQUARED L2
print(np.allclose(D[0, 0], ((xb[I[0, 0]] - xq[0]) ** 2).sum(), rtol=1e-4))`, lang: "python", title: "The whole API in ten lines" },
      { code: `trained: True ntotal: 0
ntotal after add: 10000
I (row ids):
 [[8577 3257 7432 7560]
 [2077 8381 1382 6061]
 [8320 7790 4230 4151]]
D (squared L2):
 [[4.99 5.91 6.07 6.07]
 [5.5  5.68 5.83 6.26]
 [6.58 6.6  6.66 6.7 ]]
True`, lang: "text", title: "Output" },
      { ul: [
        "<code>search</code> takes a <b>batch</b> of queries (2-D array) and returns <code>D, I</code> of shape <code>(nq, k)</code>; <code>-1</code> in <code>I</code> means fewer than k results were found.",
        "FAISS stores <b>only vectors and int64 ids</b>. Keep a separate mapping id → chunk text/metadata (a list, SQLite, or the LangChain docstore).",
        "<code>IndexFlatL2</code> returns <b>squared</b> Euclidean distances (no sqrt — ranking is identical and it's cheaper).",
        "Input must be <code>float32</code>; float64 numpy arrays raise errors or must be converted with <code>astype('float32')</code>."
      ] },
      { tip: "Theory of why ANN is needed and how IVF/HNSW work at a high level: <a href=\"#/core/ai/vector-databases\">core: vector databases</a>. What the interviewer adds for FAISS: 'Is FAISS a database?' — No: it's an in-process index library; persistence, filtering, concurrency and updates are your job." }
    ]
  },
    {
    id: "faiss-index-types",
    q: "Compare FAISS index types: IndexFlatL2, IndexFlatIP, IVF, HNSW and PQ. Which would you choose?",
    topic: "FAISS",
    level: 2,
    top: true,
    short: "Flat indexes (IndexFlatL2 for Euclidean, IndexFlatIP for inner product) are exact brute force: 100 percent recall, no training, O(N) per query. IVF clusters vectors into nlist lists with k-means and scans only nprobe lists, so it is fast but needs training. HNSW is a layered proximity graph: very fast and high recall without training, but memory-heavy and it cannot delete. PQ compresses each vector to a few bytes for huge memory savings at a recall cost. IVF plus PQ combines both for billion scale.",
    a: [
      { table: { head: ["Index", "Search", "Training?", "Memory / vector (d=768)", "Recall", "Use when"], rows: [
        ["<code>IndexFlatL2</code>", "Exact, Euclidean", "No", "4·d bytes = 3 KB", "100%", "≤ ~1M vectors, ground truth, small RAG apps"],
        ["<code>IndexFlatIP</code>", "Exact, inner product (cosine if normalised)", "No", "3 KB", "100%", "Same, for dot-product / cosine embeddings"],
        ["<code>IndexIVFFlat</code>", "Scan <code>nprobe</code> of <code>nlist</code> clusters", "Yes (k-means)", "~3 KB + ids", "Tunable via nprobe", "1M–100M, need speed, can retrain"],
        ["<code>IndexHNSWFlat</code>", "Greedy walk on a layered graph", "No", "3 KB + graph (~M·2·4 B)", "Very high (efSearch)", "Low latency, high recall, RAM available, few deletes"],
        ["<code>IndexPQ</code>", "Compressed codes, approximate distances", "Yes", "<code>m</code> bytes (e.g. 16–64 B)", "Lower", "Memory-bound, huge datasets"],
        ["<code>IndexIVFPQ</code>", "IVF + PQ codes", "Yes", "m bytes + ids", "Medium, re-rank to improve", "100M–billions of vectors"]
      ] } },
      { code: `import time
import numpy as np
import faiss

faiss.omp_set_num_threads(1)
rng = np.random.default_rng(0)
d, N, nq, k = 64, 50_000, 500, 10
centers = rng.standard_normal((200, d)).astype("float32")          # clustered, like real embeddings
xb = (centers[rng.integers(0, 200, N)] + 0.6 * rng.standard_normal((N, d))).astype("float32")
xq = (centers[rng.integers(0, 200, nq)] + 0.6 * rng.standard_normal((nq, d))).astype("float32")

flat = faiss.IndexFlatL2(d); flat.add(xb)
_, gt = flat.search(xq, k)                                          # ground truth

def bench(name, index, train=False):
    if train:
        index.train(xb)
    index.add(xb)
    t = time.perf_counter(); _, I = index.search(xq, k)
    ms = (time.perf_counter() - t) * 1000 / nq
    recall = np.mean([len(set(I[i]) & set(gt[i])) / k for i in range(nq)])
    mb = faiss.serialize_index(index).size / 2**20
    print(f"{name:<22} recall@10={recall:.2f}  {ms:6.3f} ms/query  {mb:5.1f} MB")

bench("Flat (exact)", faiss.IndexFlatL2(d))
q1 = faiss.IndexFlatL2(d); ivf = faiss.IndexIVFFlat(q1, d, 256); ivf.nprobe = 8
bench("IVF256,Flat nprobe=8", ivf, train=True)
hnsw = faiss.IndexHNSWFlat(d, 32); hnsw.hnsw.efSearch = 64
bench("HNSW32 efSearch=64", hnsw)
bench("PQ16 (16 B/vector)", faiss.IndexPQ(d, 16, 8), train=True)
q2 = faiss.IndexFlatL2(d); ivfpq = faiss.IndexIVFPQ(q2, d, 256, 16, 8); ivfpq.nprobe = 8
bench("IVF256,PQ16 nprobe=8", ivfpq, train=True)`, lang: "python", title: "Same data, five indexes: recall vs speed vs memory" },
      { code: `Flat (exact)           recall@10=1.00   0.113 ms/query   12.2 MB
IVF256,Flat nprobe=8   recall@10=1.00   0.025 ms/query   12.7 MB
HNSW32 efSearch=64     recall@10=0.99   0.048 ms/query   25.2 MB
PQ16 (16 B/vector)     recall@10=0.45   0.283 ms/query    0.8 MB
IVF256,PQ16 nprobe=8   recall@10=0.66   0.039 ms/query    1.3 MB`, lang: "text", title: "Output on one laptop run (timings vary by machine; recall and size are stable)" },
      { p: "Read it as: IVF and HNSW are <b>~2–5× faster</b> than flat here with near-perfect recall (the gap grows with N — flat is linear); HNSW pays <b>2× memory</b> for its graph; PQ cuts memory <b>~15×</b> but recall drops, which is why PQ indexes usually re-rank the top candidates with exact distances." },
      { code: `index = faiss.index_factory(768, "IVF4096,PQ64", faiss.METRIC_INNER_PRODUCT)
index = faiss.index_factory(768, "HNSW32,Flat")
index = faiss.index_factory(768, "IDMap,Flat")      # flat + your own int64 ids`, lang: "python", run: false, title: "index_factory strings — how FAISS users usually build indexes" },
      { h: "How to choose (the answer interviewers want)" },
      { ol: [
        "Under ~1M vectors and fits in RAM → <b>Flat</b> (exact, zero tuning). Most student RAG projects are here.",
        "Need lower latency, RAM is fine, data mostly static → <b>HNSW</b> (<code>M</code> 16–64, tune <code>efSearch</code>).",
        "Millions of vectors, want tunable speed/recall and smaller graph overhead → <b>IVF</b> (<code>nlist ≈ 4–16·√N</code>, tune <code>nprobe</code>).",
        "Memory is the bottleneck (100M+ vectors) → <b>IVF + PQ</b>, optionally with re-ranking."
      ] },
      { warn: "Benchmark on <b>your</b> embeddings: recall@k vs the flat ground truth at your target latency. Random/uniform data is the worst case for ANN; real embeddings cluster and behave better." }
    ]
  },
    {
    id: "faiss-cosine-similarity",
    q: "FAISS has no cosine metric. How do you do cosine-similarity search with FAISS?",
    topic: "FAISS",
    level: 2,
    top: true,
    short: "Cosine similarity of two vectors equals the inner product of their L2-normalised versions. So you call faiss.normalize_L2 on the database vectors before adding them and on every query, and use IndexFlatIP or METRIC_INNER_PRODUCT; the returned scores are then cosine similarities in the range minus one to one, higher being better. Equivalently, on unit vectors squared L2 distance equals 2 minus 2 times cosine, so an L2 index gives the same ranking.",
    a: [
      { p: "cos(a, b) = a·b / (‖a‖ ‖b‖). If both vectors have length 1, the denominator is 1 and <b>cosine = inner product</b>. FAISS supports inner product natively, so cosine search = <b>normalise, then IP</b>." },
      { code: `import numpy as np
import faiss

docs = np.array([
    [0.9, 1.0, 0.1, 0.0],     # 0: short, points the same way as the query
    [5.0, 0.0, 4.0, 3.0],     # 1: long vector, different direction
    [0.0, 1.0, 2.0, 0.0],     # 2: weakly related
], dtype="float32")
query = np.array([[1.0, 1.0, 0.0, 0.0]], dtype="float32")
d = docs.shape[1]

cos = (docs @ query.T).ravel() / (np.linalg.norm(docs, axis=1) * np.linalg.norm(query))
print("numpy cosine  :", cos.round(3))

# Raw inner product WITHOUT normalising: the long vector wins
raw = faiss.IndexFlatIP(d); raw.add(docs)
D, I = raw.search(query, 3)
print("raw IP   ids  :", I[0], "scores", D[0].round(2))

# Cosine in FAISS: normalise both sides IN PLACE, then inner product
xb, xq = docs.copy(), query.copy()
faiss.normalize_L2(xb); faiss.normalize_L2(xq)
ip = faiss.IndexFlatIP(d); ip.add(xb)
D, I = ip.search(xq, 3)
print("cosine   ids  :", I[0], "scores", D[0].round(3))

# Same ranking from L2 on unit vectors: ||a-b||^2 = 2 - 2cos
l2 = faiss.IndexFlatL2(d); l2.add(xb)
D2, I2 = l2.search(xq, 3)
print("L2(unit) ids  :", I2[0], "| equals 2-2cos:", np.allclose(D2[0], 2 - 2 * D[0], atol=1e-5))`, lang: "python", title: "Normalise + IndexFlatIP = cosine" },
      { code: `numpy cosine  : [0.996 0.5   0.316]
raw IP   ids  : [1 0 2] scores [5.  1.9 1. ]
cosine   ids  : [0 1 2] scores [0.996 0.5   0.316]
L2(unit) ids  : [0 1 2] | equals 2-2cos: True`, lang: "text", title: "Output — raw inner product ranks the long off-topic vector first; cosine fixes it" },
      { ul: [
        "<code>faiss.normalize_L2(x)</code> modifies the array <b>in place</b> (float32 only) and returns <code>None</code> — copy first if you need the originals.",
        "Normalise <b>queries too</b>. Forgetting it doesn't change the ranking for a single query (it scales all scores equally) but breaks score thresholds.",
        "For ANN: <code>faiss.IndexHNSWFlat(d, 32, faiss.METRIC_INNER_PRODUCT)</code> or <code>index_factory(d, \"IVF1024,Flat\", faiss.METRIC_INNER_PRODUCT)</code>.",
        "Many embedding models (e.g. sentence-transformers with <code>normalize_embeddings=True</code>, OpenAI embeddings) already return unit vectors — check, don't assume."
      ] },
      { warn: "Raw inner product rewards vector <b>length</b>, as doc 1 shows. With the LangChain wrapper, pass <code>normalize_L2=True</code> and <code>distance_strategy=DistanceStrategy.MAX_INNER_PRODUCT</code> — any other strategy still builds an <code>IndexFlatL2</code>, so you silently get L2." },
      { tip: "Which metric to use is decided by the embedding model's training objective — use what its model card says (<a href=\"#/core/ai/embeddings-semantic-search\">core: embeddings</a>)." }
    ]
  },
    {
    id: "faiss-ivf-nprobe",
    q: "How does an IVF index work in FAISS? Why does it need training, and what do nlist and nprobe control?",
    topic: "FAISS",
    level: 3,
    top: true,
    short: "IVF, the inverted file index, runs k-means to learn nlist centroids — that is the training step — then stores each vector in the list of its nearest centroid. At query time it finds the nprobe nearest centroids and scans only those lists. nlist controls granularity, with a rule of thumb of about 4 to 16 times the square root of N, and nprobe is the query-time knob: higher means better recall and slower search, and nprobe equal to nlist is exact search. Train on a representative sample of at least about 39 times nlist points.",
    a: [
      { svg: `<svg viewBox="0 0 600 200" width="600" class="dg">
  <rect class="box" x="10" y="10" width="270" height="180" rx="8"/>
  <text class="tx-m" x="20" y="28">train: k-means → nlist centroids</text>
  <rect class="box-a" x="30" y="45" width="100" height="60" rx="30"/>
  <text class="tx tx-b" x="80" y="75" text-anchor="middle" dominant-baseline="middle">list 0</text>
  <rect class="box-a" x="160" y="45" width="100" height="60" rx="30"/>
  <text class="tx tx-b" x="210" y="75" text-anchor="middle" dominant-baseline="middle">list 1</text>
  <rect class="box" x="30" y="120" width="100" height="60" rx="30"/>
  <text class="tx tx-b" x="80" y="150" text-anchor="middle" dominant-baseline="middle">list 2</text>
  <rect class="box" x="160" y="120" width="100" height="60" rx="30"/>
  <text class="tx tx-b" x="210" y="150" text-anchor="middle" dominant-baseline="middle">list 3</text>
  <rect class="box-p" x="380" y="80" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="425" y="98" text-anchor="middle" dominant-baseline="middle">query</text>
  <line class="ln-a" x1="380" y1="92" x2="262" y2="75" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="380" y1="98" x2="132" y2="80" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="300" y="135">nprobe = 2: scan only</text>
  <text class="tx-a" x="300" y="152">the 2 closest lists</text>
  <text class="tx-s" x="490" y="60">lists 2, 3 skipped</text>
  <text class="tx-s" x="490" y="76">(may hide a true</text>
  <text class="tx-s" x="490" y="92">neighbour → recall &lt; 1)</text>
</svg>`, caption: "IVF: vectors are bucketed by nearest centroid; a query scans nprobe buckets instead of all N vectors." },
      { code: `import numpy as np
import faiss

rng = np.random.default_rng(7)
d, N, nlist, k = 32, 20_000, 128, 10
xb = rng.standard_normal((N, d)).astype("float32")
xq = rng.standard_normal((200, d)).astype("float32")

flat = faiss.IndexFlatL2(d); flat.add(xb)
_, gt = flat.search(xq, k)                         # exact ground truth

quantizer = faiss.IndexFlatL2(d)                   # stores the nlist centroids
index = faiss.IndexIVFFlat(quantizer, d, nlist)
print("trained?", index.is_trained)
try:
    index.add(xb)
except RuntimeError:
    print("add before train -> RuntimeError")
index.train(xb[:5000])                              # k-means on a sample (>= 39 * nlist points)
index.add(xb)
print("trained?", index.is_trained, "| ntotal:", index.ntotal)

for nprobe in (1, 4, 16, 64, 128):
    index.nprobe = nprobe
    _, I = index.search(xq, k)
    r = np.mean([len(set(I[i]) & set(gt[i])) / k for i in range(len(xq))])
    print(f"nprobe={nprobe:<3} recall@10={r:.2f}  lists scanned={nprobe / nlist:.0%}")`, lang: "python", title: "Train, add, then sweep nprobe" },
      { code: `trained? False
add before train -> RuntimeError
trained? True | ntotal: 20000
nprobe=1   recall@10=0.11  lists scanned=1%
nprobe=4   recall@10=0.30  lists scanned=3%
nprobe=16  recall@10=0.65  lists scanned=12%
nprobe=64  recall@10=0.97  lists scanned=50%
nprobe=128 recall@10=1.00  lists scanned=100%`, lang: "text", title: "Output — unclustered Gaussian data is IVF's worst case; real embeddings reach high recall at a much smaller nprobe" },
      { table: { head: ["Knob", "Set when", "Effect"], rows: [
        ["<code>nlist</code>", "Construction (fixed after training)", "More lists = smaller lists, faster scans, but needs more training data; ~4–16·√N"],
        ["<code>nprobe</code>", "Any time, per query (default 1!)", "Recall ↑, latency ↑; nprobe = nlist ≡ exact"],
        ["Training sample", "Before <code>add</code>", "Must match the real data distribution; FAISS warns below 39·nlist points"]
      ] } },
      { warn: "The default <code>nprobe</code> is <b>1</b>. Many 'FAISS gives bad results' bugs are an IVF index searched with nprobe = 1. Also: if the data distribution shifts a lot (new domain of documents), the centroids go stale — retrain and rebuild." },
      { tip: "Compare with HNSW: IVF needs training and a representative sample but supports <code>remove_ids</code> and uses less memory; HNSW needs no training, gives better recall/latency, but can't delete and uses more RAM." }
    ]
  },
    {
    id: "faiss-persistence-vs-managed",
    q: "How do you save, load and update a FAISS index, and when would you choose a managed vector database instead?",
    topic: "FAISS",
    level: 2,
    top: true,
    short: "faiss.write_index and faiss.read_index save and load the index file; serialize_index gives bytes for blob storage. Wrap a flat index in IndexIDMap and use add_with_ids to keep your own database ids, and remove_ids to delete, although HNSW cannot delete. Text and metadata live outside FAISS; LangChain's save_local writes index.faiss plus a pickled docstore. Choose a managed or server vector DB when you need concurrent writes, metadata filtering, multi-tenancy, replication, or data larger than one machine's RAM.",
    a: [
      { code: `import os
import numpy as np
import faiss

rng = np.random.default_rng(1)
d = 16
vecs = rng.standard_normal((5, d)).astype("float32"); faiss.normalize_L2(vecs)
db_ids = np.array([101, 205, 309, 412, 518], dtype="int64")   # primary keys from your SQL table

index = faiss.IndexIDMap(faiss.IndexFlatIP(d))     # flat index + custom int64 ids
index.add_with_ids(vecs, db_ids)

faiss.write_index(index, "chunks.faiss")          # persist
print("file bytes:", os.path.getsize("chunks.faiss"))
loaded = faiss.read_index("chunks.faiss")          # e.g. at app start-up

D, I = loaded.search(vecs[2:3], 2)
print("ids:", I[0].tolist(), "scores:", [round(float(s), 3) for s in D[0]])

print("removed:", loaded.remove_ids(np.array([309], dtype="int64")), "| ntotal:", loaded.ntotal)
D, I = loaded.search(vecs[2:3], 2)
print("ids after delete:", I[0].tolist())

blob = faiss.serialize_index(loaded)                # numpy uint8 array -> S3 / DB blob
print(type(blob).__name__, faiss.deserialize_index(blob).ntotal)`, lang: "python", title: "Persist, load, map ids, delete" },
      { code: `file bytes: 450
ids: [309, 205] scores: [1.0, 0.338]
removed: 1 | ntotal: 4
ids after delete: [205, 412]
ndarray 4`, lang: "text", title: "Output — search returns YOUR ids, ready to look up text/metadata in SQL" },
      { code: `vs.save_local("faiss_index")            # writes faiss_index/index.faiss + index.pkl (docstore, id map)
vs = FAISS.load_local("faiss_index", embeddings,
                      allow_dangerous_deserialization=True)   # index.pkl is a pickle!
vs.delete(ids=["doc-123"])               # wrapper tracks string ids -> FAISS rows
vs.merge_from(other_vs)                  # combine two stores`, lang: "python", run: false, title: "The LangChain wrapper equivalent" },
      { warn: "<code>allow_dangerous_deserialization=True</code> exists because <code>index.pkl</code> is a Python pickle — loading an untrusted pickle can execute arbitrary code. Only load index files you created yourself." },
      { table: { head: ["", "FAISS (library)", "Managed / server vector DB (Pinecone, Qdrant, Weaviate, Milvus, pgvector…)"], rows: [
        ["Deployment", "In your process; index in RAM", "Separate service, network call"],
        ["Updates", "Add/remove in memory; you handle persistence, locking, rebuilds", "CRUD/upserts via API, durable writes"],
        ["Metadata filtering", "Not built in (filter yourself / ID selectors)", "Built in, often combined with ANN"],
        ["Scale / HA", "One machine's RAM (or GPU); no replication", "Sharding, replication, backups"],
        ["Multi-tenancy / auth", "None", "Namespaces, collections, API keys"],
        ["Cost & latency", "Free, sub-millisecond, no network hop", "Paid or ops effort; network latency"],
        ["Best for", "Prototypes, read-mostly corpora, batch jobs, research", "Production apps with live data and many users"]
      ] } },
      { tip: "A good project answer: 'I used FAISS because the corpus was ~50k chunks and read-only — I rebuilt the index nightly and loaded it at startup. If users could upload documents in real time or we needed per-tenant filtering, I'd move to pgvector or a managed DB.' See also <a href=\"#/core/ai/vector-databases\">core: vector databases</a>." }
    ]
  }
  ]
});
