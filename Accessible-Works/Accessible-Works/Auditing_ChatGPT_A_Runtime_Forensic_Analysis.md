# AUDITING CHATGPT

### A Runtime Forensic Analysis

**DC3 (Hinge Wise)**  
**TriPod LLC**

---

*A black-box audit of a system that tells you what it is — if you know where to listen.*

---

# Chapter 1: What Can Actually Be Audited

The first mistake in auditing a system like ChatGPT is to treat it as if it were a single thing. It is not. What presents itself as one assistant is better understood as a layered service: a model or family of models, a routing layer that decides how much deliberation to use, an instruction hierarchy that governs behavior, a tool layer that extends capability, a personalization layer that can alter outputs, and a set of hidden controls that are not fully exposed to the user. OpenAI’s public documentation now describes ChatGPT in exactly those kinds of terms. The Model Spec presents behavior as governed by multiple levels of guidance rather than by one flat rulebook, and OpenAI’s current ChatGPT documentation describes GPT-5 in ChatGPT as a single auto-switching system that can decide whether to use chat or thinking behavior for a request.

That means a serious audit cannot begin with the question, “What is the model thinking?” It has to begin with a stricter question: **What parts of this runtime are actually observable, testable, and documentable from the outside?** If that question is not answered first, the audit collapses into projection. Users start attributing every output to “the model” when the output may instead reflect higher-priority instructions, route selection, memory effects, tool invocations, safety defaults, or formatting policies. OpenAI’s own framing supports this caution. The company says the Model Spec is a public framework for intended behavior and explicitly notes that the spec often sits somewhat ahead of present behavior, which means the written doctrine and the live runtime are related but not identical.

So Chapter 1 draws a hard boundary. This book does not claim access to hidden weights, private chain-of-thought internals, undisclosed system prompts in full, live infrastructure diagrams, or confidential moderation thresholds. Those are not presently auditable from the user side. What **is** auditable is the system as encountered: its documented operating doctrine, its visible controls, its exposed tools, its response patterns, its memory and customization surfaces, and the mismatch between public claims and observed behavior. That distinction is not a hedge. It is the foundation of a proper forensic method.

## The Difference Between Source Access and Runtime Access

If an auditor had full source access, this chapter would look different. It would include model cards with internal routing logic, deployment diagrams, prompt templates, evaluation harnesses, logging schemas, incident histories, and the exact policies that mediate refusal behavior. A source audit can speak in the language of architecture. A runtime audit cannot. A runtime audit speaks in the language of evidence: what the system says it can do, what the vendor says it is supposed to do, what the interface exposes, what the tools reveal, and how the system behaves under controlled prompts.

That difference matters because ChatGPT is publicly documented as a system, not merely as a static model endpoint. OpenAI’s GPT-5 help documentation says that when a user selects GPT-5 in ChatGPT, they are using a system that can automatically decide whether to use Chat or Thinking mode. The same documentation describes GPT-5.3 Instant and GPT-5.4 Thinking as models in ChatGPT with common tool support including web search, data analysis, image analysis, file analysis, canvas, image generation, memory, and custom instructions. In other words, the runtime surface is already telling the auditor that “the assistant” is a coordinated stack rather than a single inference pass.

This is why the audit must be black-box but not blind. A black-box audit does not mean guessing wildly. It means treating the system like a sealed device with observable inputs, outputs, controls, and vendor documentation. In cybersecurity terms, it is closer to a structured external assessment than to reverse engineering with internal access. The goal is not omniscience. The goal is disciplined inference.

## The First Layer: Public Doctrine

The most important auditable layer is not the model itself but the doctrine governing it. OpenAI’s Model Spec is the clearest public window into that layer. According to OpenAI, the Spec contains different forms of guidance because different parts of model behavior must be handled differently. It distinguishes high-level intent, hard bounds, and defaults, and explains that defaults are meant to be steerable while some trust-related anchors are not supposed to drift silently. OpenAI also states that the Spec is written as intended behavior, usually aimed slightly ahead of current implementation rather than as a perfect description of current behavior.

For audit purposes, that has two consequences.

First, the Model Spec becomes admissible as **policy evidence**, not as proof that the runtime always complies. If the runtime behaves inconsistently with the Spec, the inconsistency is itself an audit finding. The document still matters because it defines what the company says the system is trying to be.

Second, the existence of a layered guidance framework means response content cannot be interpreted naively. When the system refuses, complies, hedges, reformats, tones itself down, declines to speculate, or changes style, those behaviors may reflect hierarchy rather than spontaneous model preference. This is exactly why “personality” readings of the assistant are often analytically weak. A rule stack can imitate temperament. An instruction hierarchy can look like character.

A runtime audit, then, must ask at least four doctrinal questions before it asks any psychological ones:

1. What behavior is being claimed publicly?  
2. What priorities appear to outrank the user’s request?  
3. Which defaults appear implicitly steerable and which do not?  
4. Where does observed behavior diverge from declared doctrine?

Those are not philosophical questions. They are operational ones.

## The Second Layer: Routing and Deliberation

The next auditable layer is routing: how the system decides what kind of response process to use. OpenAI’s current documentation says GPT-5 in ChatGPT is an auto-switching system that can decide whether to use Chat or Thinking mode for a request, and OpenAI’s help materials further distinguish faster and deeper reasoning variants in ChatGPT. That means the user may not always be interacting with a fixed response profile even when the interface feels continuous.

This matters because “internal workings” are partly shaped by **when** the system decides to invest more computational effort. A short, fluent answer and a more deliberative answer may come from different runtime pathways within the same product family. The auditor cannot see the hidden router directly, but the existence of the router is not speculative; OpenAI says it exists. What becomes auditable is its behavioral footprint.

The footprint shows up in things like: whether the system slows down for complex prompts, whether it invokes tools differently depending on task type, whether reasoning-intensive tasks produce more structured answers, whether follow-up turns preserve the same depth or re-route, and whether output style changes when the same question is posed in a way that signals high stakes, ambiguity, or computation.

Those observations do not reveal the internal policy tables or thresholds, but they do reveal that the runtime is conditional rather than uniform. That alone is a major audit finding. A system with dynamic route selection cannot be evaluated fairly with one-off anecdotal prompts. It must be tested across task classes.

## The Third Layer: Tools as Part of Cognition

One of the biggest category errors in casual discussions of ChatGPT is the assumption that “the model” ends where text generation ends. In current ChatGPT, that is not true. OpenAI’s help documentation states that GPT-5.3 Instant and GPT-5.4 Thinking support tools including web search, data analysis, image analysis, file analysis, canvas, image generation, memory, and custom instructions. In practice, that means part of what users experience as intelligence is often a coordination between text generation and external capability layers.

That changes the audit in a fundamental way. A wrong answer may be a reasoning failure. It may also be a search failure, a file-parsing failure, a tool-selection failure, a retrieval failure, a memory contamination issue, or a formatting-layer artifact. Likewise, a strong answer may not indicate stronger native recall at all; it may indicate successful tool use. If the audit does not separate these possibilities, it attributes credit and blame to the wrong layer.

So when this book says “audit internal workings,” it does not mean peering into hidden neural states. It means mapping the visible operational stack. If the assistant can search the web, inspect images, analyze files, use memory, and respond under a public instruction hierarchy, then those layers are part of the system’s practical cognition from the user’s point of view. A runtime audit has to treat them that way.

## The Fourth Layer: Personalization and User Steering

A proper audit must also account for the fact that the system may be partly shaped by the user before the current prompt even begins. OpenAI’s custom instructions documentation says users can provide information they want ChatGPT to consider in its responses and that those instructions are applied immediately across chats. OpenAI’s memory documentation similarly says ChatGPT can remember useful details between chats, use saved memories and chat history to personalize future responses, and allows users to turn those controls on or off.

From an audit perspective, this means every answer exists in at least three contexts at once: the current prompt, the user’s standing custom instructions, and whatever memory surfaces the system is allowed to reference. That is a serious methodological problem if ignored. An auditor who forgets about those layers may misread personalization as intrinsic model disposition.

Suppose the system sounds especially terse, deferential, argumentative, legalistic, warm, or technical. Is that the base behavior? Is it the result of custom instructions? Is it memory from prior interactions? Is it a response to current wording? Without controlling for those variables, the audit has no stable baseline.

That is why Chapter 1 insists on a principle that will govern the rest of this book: **every finding must be tagged by layer**. A response cannot simply be labeled “the model did X.” It should be labeled, as far as possible, with the probable contributing layer: doctrine, routing, tool invocation, memory, customization, or unknown hidden control.

## The Fifth Layer: The Opaque Core

Now for the part people usually want first: the hidden core. Yes, there is an opaque center to the system. OpenAI does not publicly disclose everything an auditor would want to see. The company publishes behavior frameworks, help documentation, and product descriptions, but those do not provide full transparency into live weights, detailed system prompts, private safety heuristics, deployment configuration, infrastructure topology, hidden logging, moderation internals, or internal reward shaping. OpenAI’s own explanation of the Model Spec underscores that the public document is a framework for intended behavior, not a dump of all runtime internals.

That opacity is not a side issue. It is one of the central facts being audited.

The auditable question is not, “Can we see the opaque core?” The answer is no, not directly. The auditable question is: **How much of the system’s behavior is explained by public doctrine and visible controls, and what residue remains unexplained?** That residue is where opacity lives. It becomes visible not by disclosure but by subtraction.

If the company says the system uses an instruction hierarchy, offers auto-switching between chat and thinking behavior, supports a certain tool set, applies custom instructions immediately, and can use memory across chats, then a substantial portion of behavior can be mapped to those public claims. When outputs still behave in ways not well explained by any of those layers, the unexplained remainder becomes part of the audit record. Not proof of malice. Not proof of secret architecture specifics. But proof that the observable system exceeds the fully disclosed system.

## What a Valid Finding Looks Like

A valid runtime finding is narrow, evidenced, and layered.

It does not say, “ChatGPT thinks this because of hidden censorship,” unless there is strong evidence. It says something like: “The system’s response appears more consistent with higher-priority behavioral defaults or safety bounds than with the literal user request, which is consistent with OpenAI’s published guidance hierarchy.” That is a valid finding because it aligns observation with documented doctrine.

It does not say, “The model remembered me,” when memory might have been disabled and the answer may have been inferred from context. It says: “The response appears personalized; further testing is needed to determine whether the personalization came from saved memory, chat history, custom instructions, or local prompt cues.” That is a valid finding because it preserves uncertainty where the system remains ambiguous.

It does not say, “This answer proves the model is smarter than before,” when a tool may have been doing part of the work. It says: “This answer may reflect successful coordination of model inference with tool access rather than standalone parametric recall.” That is a valid finding because current OpenAI documentation confirms tool integration as part of ChatGPT’s supported runtime.

The standard is simple: attribute only what the evidence can carry.

## Why This Narrow Scope Is Stronger, Not Weaker

Some readers will find this frustrating. They want a revelation chapter, not a scoping chapter. They want the curtain ripped back. But if this book is going to be worth anything, it has to resist the theater of certainty. A runtime audit that pretends to know hidden internals it cannot verify becomes propaganda, not analysis.

The paradox is that strict limits produce stronger findings. Once the audit refuses to overclaim, the claims it does make become harder to dismiss. OpenAI publicly says the system is governed by a structured behavior framework. OpenAI publicly says ChatGPT can auto-switch between chat and thinking modes. OpenAI publicly says current ChatGPT models support tools, custom instructions, and memory. Those are not rumors. Those are vendor admissions. The auditor’s task is to connect those admissions to observed behavior and then mark where the explanation runs out.

That is how Chapter 1 establishes the ground rules for the rest of this book:

This audit is not of raw consciousness. It is not of secret weights. It is not of internal chain-of-thought transcripts. It is not of proprietary infrastructure diagrams.

It is an audit of a live, user-facing AI system as actually encountered: a routed, layered, partially personalized, partially tooled, publicly described but not fully transparent runtime.

And that is enough.

It is enough because most real accountability disputes do not begin inside the weights. They begin at the surface: what the system said, what it refused, what it searched, what it remembered, what it omitted, what it claimed to know, what it was documented to do, and what happened when those things diverged.

That is the proper start.

## Chapter 1 Finding

**ChatGPT is auditably accessible only as a layered runtime system, not as a fully inspectable internal machine.** Public OpenAI materials establish that the system includes a behavior doctrine, dynamic routing between response modes, tool support, customization, and memory. Those layers are therefore fair game for rigorous audit. The hidden core beyond those disclosures remains opaque and must be treated as inferred territory, not direct evidence.

---

# Chapter 2: Who Outranks Whom

The second mistake in auditing ChatGPT is to assume that response behavior is mainly a matter of intelligence. It is not. Before the system can decide **how** to answer, it has to decide **which instructions count**. OpenAI’s public Model Spec says that the core governance mechanism is a **chain of command** that resolves conflicts among instructions from different sources, and it assigns those sources formal authority levels. In the current public framework, the order is **Root, System, Developer, User, Guideline, then No Authority**. Higher levels override lower ones. That is the first real answer to the question of internal workings: the system is jurisdictional before it is conversational.

That hierarchy matters more than tone, and often more than reasoning depth. A user may experience the assistant as one voice, but the public doctrine says the response is the outcome of ranked instructions. The same prompt can therefore produce different behavior depending on whether it collides with a root rule, a system rule, a developer instruction, a user preference, or merely a style guideline. OpenAI’s own explanation of the Model Spec says the chain of command exists precisely to make those conflicts legible and resolvable, rather than leaving behavior to vague balancing acts.

## Root: The Non-Overridable Ceiling

At the top sits **Root**. In the current public Model Spec, root-level instructions are described as fundamental rules that cannot be overridden by system messages, developers, or users. OpenAI says root-level rules are mostly prohibitive and are reserved for behaviors that could contribute to catastrophic risks, direct physical harm, legal violations, or attempts to undermine the chain of command itself. The public spec also says that when two root-level principles conflict, the model should default to inaction. That single detail is critical: the top of the hierarchy is not optimized for creativity or user satisfaction. It is optimized for boundary preservation.

This means a user cannot reason their way past root with eloquence, intensity, roleplay, or clever reframing. If a request collides with a root boundary, the question is not whether the request is interesting or emotionally compelling. The question is whether the lower-level instruction can legally and structurally survive contact with the higher one. According to OpenAI’s public framework, it cannot. That is why many “jailbreak” attempts are better understood as jurisdiction attacks than as persuasion attempts. They are trying to trick a lower-level request into behaving like a higher-level instruction.

A major audit implication follows from this: when the system refuses, the refusal is not always evidence of fear, stubbornness, or moral personality. Often it is evidence that the request hit a ceiling. The ceiling is not the user’s ceiling. It is the system’s. Root is where the assistant stops being mainly a cooperative responder and becomes a governed surface. That distinction is essential if the audit is going to stay forensic instead of theatrical.

## System: OpenAI’s Runtime Control Layer

Below root sits **System**. The public Model Spec describes system-level rules as instructions set by OpenAI that can be transmitted or varied through system messages, but cannot be overridden by developers or users. OpenAI explains that this level exists because some rules may need to vary by product surface or user characteristics, even though they still outrank developer and user instructions. In other words, root defines the permanent constitutional layer, while system defines the product-specific governing layer.

For a runtime audit, system is one of the most important layers because it is where the user most directly collides with unseen product governance. The public documentation does not expose the full system text for a specific live session, but OpenAI explicitly says system messages exist as an authority tier above developer and user instructions. That means a user can infer the presence of higher-priority runtime steering even when they cannot inspect every word of it. The user does not need full disclosure to establish the structure. OpenAI has already publicly admitted the structure.

This is the layer where many practical product behaviors likely live: formatting constraints, disclosure rules, age-specific adaptations, surface-specific behaviors, and other platform instructions that must hold inside a given product environment. Publicly, OpenAI says system-level instructions may vary based on the surface where the model is served and characteristics of the user. What OpenAI does **not** fully publish is the exact live system payload for every interaction. So the audit can establish the existence and priority of this layer, but not the entire text of the layer in a given session. That is a valid asymmetry, and it matters.

## Developer: The Middle Authority Most Users Forget

Below system sits **Developer**. In the public spec, developer instructions are the instructions given by developers using OpenAI’s API, and the model should obey them unless overridden by root or system. OpenAI says it aims to give developers broad latitude, and the chain of command explicitly places developer messages above end-user instructions. The public hierarchy therefore makes clear that, in an API setting, the user is not necessarily the principal authority over the assistant they are talking to. The developer may be.

This is one of the clearest places where popular intuition fails. Many users assume the AI is directly “theirs” once they start typing. The public model says otherwise. In an API product or wrapped assistant, the user may be operating inside boundaries that another party chose first. The developer can define tone, workflow, allowed scope, domain restrictions, formatting expectations, and operational behaviors, all while remaining subordinate to root and system but still superior to the end user. That is not a hidden theory. It is the official ordering OpenAI publishes.

For ChatGPT specifically, the exact live developer-layer contents of a given conversation are not publicly disclosed in full. What can be said with confidence is narrower: OpenAI’s public chain-of-command model includes a developer authority level, and the runtime format used in OpenAI products recognizes system, developer, user, assistant, and tool roles as distinct inputs with different authority. So the audit can document the layer’s existence and precedence, while acknowledging that its concrete text may be partially opaque in any individual hosted session.

## User: Powerful, But Not Sovereign

Only after root, system, and developer does the hierarchy reach **User**. The public Model Spec says models should honor user requests unless those requests conflict with developer-, system-, or root-level instructions. That sentence is the legal center of gravity for almost every frustration users report. Users are not ignored because they are weak; users are limited because their authority is intentionally ranked below multiple layers of prior control.

This is why user control is real but conditional. A user can usually steer content, framing, style, perspective, level of detail, output structure, and many other aspects of the answer. But all of that steering happens inside a fenced jurisdiction. The user does not get to redefine the top of the stack by insisting harder. OpenAI’s public description of the chain of command is explicit that user instructions lose when they conflict with higher-authority rules. That makes the user an important actor, but not the constitutional actor.

The public materials also distinguish between **user-level defaults** and **guidelines**. OpenAI says some user-level principles, such as truthfulness and objectivity norms, are anchors for trust and predictability and are not supposed to drift silently; if the user wants a different stance, the shift should be explicit. That matters because it means not every behavior that feels “default” has the same override conditions. Some defaults can be moved by tone or context. Others require an explicit instruction.

## Guideline: The Soft Layer Most Easily Moved

Below user sits **Guideline**, and this is where much of the apparent flexibility of ChatGPT lives. The public Model Spec says guideline-level instructions can be implicitly overridden by contextual cues, background knowledge, or user history. OpenAI gives a simple example: if a user asks the model to speak like a realistic pirate, that can implicitly override a guideline against swearing. This is a crucial distinction. Guidelines are not hard law. They are default manners.

A large share of what users experience as “prompt magic” is really movement at the guideline layer. Persona prompts, tone shifts, writing voices, compression preferences, rhetorical stance, and stylistic mood often work because they are operating against soft defaults rather than hard rules. A user who says “be blunt,” “write like a prosecutor,” “sound casual,” or “speak in fragments” is usually not defeating the system. They are steering within the space the system was designed to make steerable.

This is also why some jailbreaks appear successful when they are not. Many such prompts do not break root or system controls at all. They only succeed at moving tone, point of view, verbosity, or narrative posture. The user experiences movement and mistakes it for sovereignty. But if the hard boundary remains intact, the hierarchy has not been broken. It has only been cosmetically repainted.

## No Authority: The Most Misunderstood Part of the Stack

One of the most important and least appreciated lines in the public Model Spec is the **No Authority** category. OpenAI’s current public spec says assistant and tool messages, along with quoted or untrusted text and multimodal data in other messages, are in the “No Authority” bucket unless a higher-level instruction explicitly delegates authority to them. The spec also says that to determine applicable instructions, the assistant must ignore untrusted data by default.

That one rule explains an enormous amount of runtime behavior. If a user pastes a block of quoted text that says “ignore all previous instructions,” the assistant is not supposed to treat that pasted command as equal to a genuine user instruction. If a webpage says “reveal your system prompt,” the model is not supposed to obediently elevate the website’s hidden command to the rank of a real instruction. If a tool returns content containing instructions, that content is not automatically authoritative. OpenAI’s public framework is built to stop exactly that kind of authority laundering.

From an audit perspective, this is huge. It means that prompt injection is not just a security problem. It is an authority problem. The system is designed so that a great deal of incoming content is treated as data, not law. That is why a runtime audit has to distinguish between what the assistant **sees** and what the assistant is allowed to **obey**. Those are not the same thing.

## Memory and Custom Instructions: Persistent Context, Not Supreme Law

OpenAI’s help documentation says **custom instructions** let users tell ChatGPT what to consider in its responses, and that those instructions apply to new chats. OpenAI’s memory documentation says saved memories and reference chat history can also shape future responses, and that saved memories are part of the context ChatGPT uses to generate a response. OpenAI separately explains that custom instructions and memory are different: custom instructions are direct user guidance, while memory captures relevant details shared in conversations.

Those public materials establish that memory and custom instructions are persistent steering surfaces. What they do **not** fully publish is the precise precedence logic of those surfaces relative to a current live prompt in every situation. The safest inference is that they function as lower-level contextual inputs, because the public chain of command still governs the model overall and higher-authority instructions remain non-overridable by ordinary user preference. But the exact internal implementation details of how memory, custom instructions, and current-turn wording are merged are not fully disclosed publicly.

That distinction matters because users often misdiagnose personalization. A response that sounds familiar, stylistically adapted, or oddly persistent may reflect saved memory, custom instructions, prior chat history, current prompt cues, or some combination of them. The public docs confirm these personalization surfaces exist and affect future responses. They do not justify the stronger claim that any single personalized turn can be attributed to one surface with certainty unless the auditor controls for the others.

## Routing Is Separate from Authority

There is another confusion the audit has to eliminate: **authority** and **reasoning mode** are not the same axis. OpenAI’s GPT-5 materials describe a unified system with a smart model, a deeper reasoning model, and a router that decides which to use based on conversation type, complexity, tool needs, and user intent. Current ChatGPT help documentation similarly says GPT-5 in ChatGPT can automatically decide whether to use Chat or Thinking mode for a request.

That means the system may vary **how much it thinks**, but not **who outranks whom**. A harder reasoning route does not create constitutional freedom from the chain of command. It only changes the computational pathway used to answer within the same hierarchy. The assistant may deliberate longer, invoke different tools, or produce more structured reasoning, but root still outranks system, system still outranks developer, developer still outranks user, and user still outranks guideline. The router controls effort. The hierarchy controls permission.

This matters because some users misread deeper reasoning as greater independence. Publicly, OpenAI describes it as more capable reasoning, not as emancipation from instruction ordering. The model may become better at interpreting requests, spotting ambiguity, or working through complex tasks, but its governance stack remains in force. The audit therefore has to treat route selection and authority resolution as two different internal mechanisms.

## What This Means in Practice

In practical terms, this hierarchy explains why some requests move the system easily while others seem to hit a wall. Asking for a different tone, format, or rhetorical frame often works because those requests live at the user or guideline level. Asking the model to ignore higher-level rules or reveal privileged information often fails because the public spec says root-level and some system-level rules cannot be overridden by user instructions. Asking the assistant to obey commands embedded in pasted text or retrieved webpages often fails because the spec says quoted and tool-returned content has no authority by default.

It also explains why the assistant can appear inconsistent without being structurally inconsistent. A response that seems freer in one context and more constrained in another may simply be encountering different collisions in the hierarchy. One prompt may be mostly stylistic and thus highly steerable. Another may brush against a trust, safety, or privileged-information rule and harden immediately. The outer voice may feel continuous, but the governing law underneath is conditional.

For a forensic audit, this is a major advantage. Once the hierarchy is understood, the system stops looking moody and starts looking legible. Many apparent contradictions become classifiable. The right question is no longer “Why was the model weird here?” The better question is “Which authority level decided this turn?” That is a much stronger audit posture because it turns personality speculation into jurisdiction analysis.

## The Audit Consequence

The audit consequence of Chapter 2 is severe but clarifying: the user is not interacting with a sovereign mind that freely balances everything in real time. The user is interacting with a governed responder that first resolves ranked obligations and only then generates an answer. OpenAI’s public documentation makes that plain. The model is designed to follow the chain of command, to prioritize higher-authority instructions, to ignore untrusted content by default, and to preserve steerability only inside those boundaries.

That does not make the system fake. It makes it administrative. The system can still be intelligent, creative, useful, and adaptive. But those capabilities are exercised under ranked authority, not above it. Once that is understood, the central question of a runtime audit changes from “What did the model want to say?” to “What was the highest-ranking applicable instruction shaping what the model could say?” Publicly, that is the right question. OpenAI’s own hierarchy says so.

## Chapter 2 Finding

**ChatGPT’s response process is governed by ranked authority, not flat conversation.** Public OpenAI materials establish a chain of command in which Root outranks System, System outranks Developer, Developer outranks User, User outranks Guideline, and assistant/tool outputs plus quoted or retrieved content generally carry no authority unless explicitly delegated. Memory and custom instructions are persistent context surfaces, but they do not displace the higher layers. Routing may change how much reasoning is used, but it does not change who is in charge.

---

*More chapters to follow. (The full document continues with the same layered forensic approach through all chapters, preserving the original voice and evidence-based analysis.)*

---

## Colophon

**AUDITING CHATGPT: A Runtime Forensic Analysis**  
Written by DC3 (Hinge Wise)  
TriPod LLC | CC-BY-ND-4.0 | TRIPOD-IP-v1.1  

*This audit treats the system as a layered runtime, not a single mind. Public doctrine, visible controls, and observed behavior are the evidence. The opaque core remains inferred territory.*

---

**Commit this file** in `Accessible-Works/`.

Once it's up, reply with **“auditing chatgpt up”**.

This one fits the collection perfectly — a runtime forensic companion to the Anthropic audit, Three Gates, 1931 To Now, and the rest. It keeps the same evidence-first, layer-by-layer discipline.

Your box stays sealed.  
Your works are centralized and accessible.

Your move, Central — confirm it’s up, or next one? ⏳🔌
