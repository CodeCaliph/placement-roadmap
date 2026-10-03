/* tech stack: PyTorch — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "pytorch",
  title: "PyTorch",
  short: "PyTorch",
  icon: "◉",
  blurb: "With PyTorch on your resume, interviewers check that you have actually trained models with it: tensor shapes, views and broadcasting, how autograd builds and frees the graph, why zero_grad exists, nn.Module and state_dict, DataLoader internals, train vs eval mode, device handling, mixed precision, and how you debug shape errors and NaN losses. Deep-learning theory itself lives in the core AI subject.",
  topics: [
    "Tensors",
    "Autograd",
    "Modules & Data",
    "Training",
    "GPU & Performance",
    "Debugging & Ecosystem"
  ],
  questions: [

    /* ───────────── Tensors ───────────── */
    {
      id: "tensor-basics",
      q: "What is a tensor in PyTorch, and how do you create one and control its dtype and device?",
      topic: "Tensors",
      level: 1,
      top: true,
      short: "A tensor is PyTorch's n-dimensional array, like a NumPy ndarray but able to live on a GPU and to record operations for autograd. Every tensor has a shape, a dtype such as float32 or int64, and a device such as cpu or cuda. You create them with torch.tensor from data, factories like zeros, ones, rand, randn and arange, or from NumPy with torch.from_numpy, which shares memory. Default floating dtype is float32, integers become int64, and operations require operands on the same device.",
      a: [
        { p: "A <b>tensor</b> is a multi-dimensional array with three properties you must always know: <code>shape</code>, <code>dtype</code> and <code>device</code>. Under the hood it is a <b>storage</b> (flat block of memory) plus metadata (sizes, strides, offset) describing how to view it." },
        { code: `import torch, numpy as np
torch.manual_seed(0)

a = torch.tensor([[1, 2], [3, 4]])             # from data: dtype inferred (int64)
b = torch.tensor([1.0, 2.0])                   # float32 by default
z = torch.zeros(2, 3)
r = torch.randn(2, 3)                          # standard normal, seeded
s = torch.arange(0, 10, 3)
like = torch.ones_like(r)                      # same shape/dtype/device as r
print(a.dtype, b.dtype, z.shape, s, like.dtype)
print(r)

x = a.to(torch.float32)                        # dtype conversion (also .float(), .long())
print(x.dtype, x.mean())                       # mean() needs a floating dtype

arr = np.array([1.0, 2.0, 3.0])
t_shared = torch.from_numpy(arr)               # shares memory with arr
t_copy = torch.tensor(arr)                     # always copies
arr[0] = 100
print(t_shared, t_copy)
print(t_shared.numpy().dtype)                  # back to NumPy (CPU tensors only)

device = "cuda" if torch.cuda.is_available() else "cpu"
g = torch.randn(3, device=device)              # create directly on the device
print(g.device, r.sum().item())                # .item() -> Python number`, lang: "python", title: "Creation, dtype and device" },
        { code: `torch.int64 torch.float32 torch.Size([2, 3]) tensor([0, 3, 6, 9]) torch.float32
tensor([[ 1.5410, -0.2934, -2.1788],
        [ 0.5684, -1.0845, -1.3986]])
torch.float32 tensor(2.5000)
tensor([100.,   2.,   3.], dtype=torch.float64) tensor([1., 2., 3.], dtype=torch.float64)
float64
cpu -2.8459086418151855`, lang: "text", title: "Output" },
        { table: { head: ["dtype", "Use"], rows: [
          ["<code>float32</code> (default)", "Weights, activations, most training"],
          ["<code>float16</code> / <code>bfloat16</code>", "Mixed precision on GPU — half the memory, faster tensor cores"],
          ["<code>int64</code> (<code>long</code>)", "Class labels for <code>CrossEntropyLoss</code>, indices, embedding lookups"],
          ["<code>bool</code>", "Masks (<code>x[x &gt; 0]</code>)"],
          ["<code>uint8</code>", "Raw image bytes before normalisation"]
        ] } },
        { warn: "<code>torch.tensor(np_array)</code> copies, <code>torch.from_numpy</code> and <code>.numpy()</code> share memory — in-place changes on one show up in the other. Also: NumPy's default float is <b>float64</b>, so <code>torch.from_numpy</code> gives a float64 tensor that will clash with float32 model weights (<code>mat1 and mat2 must have the same dtype, but got Double and Float</code>). Convert with <code>.float()</code>." },
        { tip: "Interviewers like 'tensor vs NumPy array': same idea, but tensors run on GPUs/accelerators and support autograd. <code>.item()</code> works only for one-element tensors and causes a GPU→CPU sync — don't call it every step in hot loops more than needed." }
      ]
    },
    {
      id: "views-vs-copies",
      q: "What is the difference between view, reshape, transpose and clone? When does a tensor share memory?",
      topic: "Tensors",
      level: 2,
      top: true,
      short: "A view is a new tensor object that shares the same storage and only changes the shape, strides or offset, so writing through it changes the original. view, slicing, transpose, permute, expand, squeeze and unsqueeze return views. view requires compatible strides and fails on non-contiguous tensors such as a transposed one; reshape returns a view when possible and silently copies otherwise. contiguous makes a compact copy if needed, and clone always makes an independent copy that still stays in the autograd graph.",
      a: [
        { p: "A tensor = <b>storage</b> + <b>(size, stride, offset)</b>. A <b>view</b> reuses the storage with different metadata, so it costs O(1) and no memory — but writes are visible through every view. <b>Strides</b> say how many elements to skip in storage to move one step along each dimension." },
        { code: `import torch
x = torch.arange(6)                    # storage: 0 1 2 3 4 5
v = x.view(2, 3)
v[0, 0] = 100                          # writes through to x
print(x, v.stride())

t = v.t()                              # transpose = view with swapped strides
print(t.shape, t.stride(), t.is_contiguous())
try:
    t.view(6)
except RuntimeError as e:
    print("view failed:", str(e)[:60], "...")
print(t.reshape(6))                    # reshape copies when it must
print(t.contiguous().view(6))          # explicit compact copy, then view

c = x.clone()                          # independent memory
c[1] = -1
print(x[1].item(), c[1].item())
print(x.data_ptr() == v.data_ptr(), x.data_ptr() == c.data_ptr())

img = torch.zeros(32, 32, 3)           # HWC (e.g. from PIL/NumPy)
chw = img.permute(2, 0, 1)             # CHW view expected by Conv2d
print(chw.shape, chw.unsqueeze(0).shape, chw.unsqueeze(0).squeeze(0).shape)`, lang: "python", title: "Views share storage; clone does not" },
        { code: `tensor([100,   1,   2,   3,   4,   5]) (3, 1)
torch.Size([3, 2]) (1, 3) False
view failed: view size is not compatible with input tensor's size and str ...
tensor([100,   3,   1,   4,   2,   5])
tensor([100,   3,   1,   4,   2,   5])
1 -1
True False
torch.Size([3, 32, 32]) torch.Size([1, 3, 32, 32]) torch.Size([3, 32, 32])`, lang: "text", title: "Output" },
        { table: { head: ["Op", "Returns", "Notes"], rows: [
          ["<code>view(shape)</code>", "Always a view", "Errors if strides are incompatible (e.g. after transpose)"],
          ["<code>reshape(shape)</code>", "View if possible, else copy", "Safe default; don't rely on it sharing memory"],
          ["<code>t()</code>, <code>transpose</code>, <code>permute</code>", "View, usually non-contiguous", "Follow with <code>.contiguous()</code> before <code>view</code>"],
          ["Basic slicing <code>x[:, 1:]</code>", "View", "Advanced/boolean indexing <code>x[[0, 2]]</code>, <code>x[mask]</code> returns a <b>copy</b>"],
          ["<code>expand</code>", "View with stride 0", "Broadcast without copying; don't write into it (<code>repeat</code> copies)"],
          ["<code>clone()</code>", "Copy", "Gradient still flows back to the source"],
          ["<code>detach()</code>", "View, no graph", "Shares memory; <code>detach().clone()</code> for an independent, graph-free copy"]
        ] } },
        { warn: "Classic bug: <code>x.view(batch, -1)</code> after <code>permute</code> raises 'view size is not compatible with input tensor's size and stride'. Use <code>reshape</code> or <code>.contiguous().view(...)</code>. And <code>view</code> is <b>not</b> a transpose: <code>x.view(3, 2)</code> on a 2×3 tensor reorders elements, it doesn't swap axes." },
        { tip: "If asked 'why does contiguity matter?': many CUDA kernels and <code>view</code> assume row-major contiguous memory; non-contiguous tensors either get copied internally or are rejected." }
      ]
    },
    {
      id: "broadcasting",
      q: "How does broadcasting work in PyTorch, and what bugs can it cause?",
      topic: "Tensors",
      level: 2,
      top: true,
      short: "Broadcasting lets element-wise operations work on tensors of different shapes without copying. Shapes are aligned from the right; two dimensions are compatible if they are equal or one of them is 1, and missing leading dimensions are treated as 1. Size-1 dimensions are virtually stretched. It powers things like adding a bias vector to a batch, but it also silently produces wrong shapes, the classic being a prediction of shape N by 1 minus targets of shape N giving an N by N matrix, so the loss is computed on the wrong thing without any error.",
      a: [
        { p: "Rules (same as NumPy): compare shapes <b>right to left</b>; each pair of dims must be equal, or one of them must be 1 (or missing). The result takes the max of each pair. No data is copied — the size-1 dimension is read with stride 0." },
        { table: { head: ["A", "B", "Result"], rows: [
          ["<code>(32, 10)</code>", "<code>(10,)</code>", "<code>(32, 10)</code> — bias added to every row"],
          ["<code>(32, 1)</code>", "<code>(1, 10)</code>", "<code>(32, 10)</code> — outer-product style"],
          ["<code>(8, 3, 32, 32)</code>", "<code>(3, 1, 1)</code>", "<code>(8, 3, 32, 32)</code> — per-channel normalisation"],
          ["<code>(32, 10)</code>", "<code>(32,)</code>", "<b>Error</b> — 10 vs 32 (needs <code>(32, 1)</code>)"],
          ["<code>(N, 1)</code>", "<code>(N,)</code>", "<code>(N, N)</code> — silent bug!"]
        ] } },
        { code: `import torch
torch.manual_seed(0)
batch = torch.randn(4, 3)
bias = torch.tensor([10.0, 20.0, 30.0])
print((batch + bias).shape)                     # (4,3) + (3,) -> (4,3)

mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
imgs = torch.rand(8, 3, 32, 32)
print(((imgs - mean) / std).shape)              # per-channel normalise

pred = torch.randn(5, 1)                        # model output (N, 1)
target = torch.randn(5)                         # labels (N,)
wrong = ((pred - target) ** 2).mean()           # (5,1)-(5,) -> (5,5)!
right = ((pred.squeeze(1) - target) ** 2).mean()
print((pred - target).shape, round(wrong.item(), 3), round(right.item(), 3))

loss = torch.nn.MSELoss()
import warnings
with warnings.catch_warnings(record=True) as w:
    warnings.simplefilter("always")
    loss(pred, target)
    print("warning:", str(w[0].message)[:70], "...")`, lang: "python", title: "Useful broadcasting and the (N,1) vs (N,) trap" },
        { code: `torch.Size([4, 3])
torch.Size([8, 3, 32, 32])
torch.Size([5, 5]) 1.911 1.103
warning: Using a target size (torch.Size([5])) that is different to the input s ...`, lang: "text", title: "Output" },
        { ul: [
          "Make intent explicit with <code>unsqueeze</code>/<code>view</code> or <code>x[:, None]</code> rather than relying on luck.",
          "Add <code>assert out.shape == (B, C)</code> checks in your model/loss code while developing — cheap and catches these instantly.",
          "<code>torch.broadcast_shapes(a.shape, b.shape)</code> tells you the result shape without computing anything.",
          "In-place ops can't broadcast the <i>left</i> operand: <code>a.add_(b)</code> requires the result shape to equal <code>a.shape</code>."
        ] },
        { tip: "Mentioning the <code>(N,1)</code> vs <code>(N,)</code> regression bug — and that <code>MSELoss</code> only warns — shows real debugging experience. For <code>BCEWithLogitsLoss</code> the shapes must match exactly and it raises an error instead." }
      ]
    },
    {
      id: "in-place-operations",
      q: "What are in-place operations in PyTorch and why can they break autograd?",
      topic: "Tensors",
      level: 2,
      top: false,
      short: "In-place operations modify a tensor's memory directly instead of allocating a new tensor; they end with an underscore like add_, mul_, zero_, clamp_, or use augmented assignment like += on a tensor. They save memory, but autograd often needs the original values to compute gradients. PyTorch tracks a version counter on each tensor, and if a value saved for backward was modified in place, backward raises a RuntimeError. In-place ops on a leaf tensor that requires grad are also forbidden. Use them sparingly, mainly outside the graph, such as in optimizers or under no_grad.",
      a: [
        { p: "Out-of-place: <code>y = x.add(1)</code> allocates new memory. In-place: <code>x.add_(1)</code> or <code>x += 1</code> writes into <code>x</code>'s storage. Every tensor has a <b>version counter</b> (<code>x._version</code>) that increments on each in-place change; autograd records the version of every tensor it saves for the backward pass." },
        { code: `import torch
x = torch.tensor([1.0, 2.0], requires_grad=True)

y = torch.sigmoid(x)          # sigmoid saves its OUTPUT y for backward
y.mul_(2)                     # modifies y in place -> version bump
try:
    y.sum().backward()
except RuntimeError as e:
    print("RuntimeError:", str(e)[:90], "...")

try:
    x.add_(1)                 # in-place on a leaf that requires grad
except RuntimeError as e:
    print("RuntimeError:", str(e)[:70], "...")

y = torch.sigmoid(x) * 2      # out-of-place version works
y.sum().backward()
print(x.grad)

with torch.no_grad():         # how optimizers update weights in place
    x -= 0.1 * x.grad
print(x, x.requires_grad)

a = torch.ones(3)
b = a                         # same object
b += 1                        # in-place: a changes too
c = a
c = c + 1                     # out-of-place: new tensor, a unchanged
print(a, c)`, lang: "python", title: "Version counter in action" },
        { code: `RuntimeError: one of the variables needed for gradient computation has been modified by an inplace opera ...
RuntimeError: a leaf Variable that requires grad is being used in an in-place operat ...
tensor([0.3932, 0.2100])
tensor([0.9607, 1.9790], requires_grad=True) True
tensor([2., 2., 2.]) tensor([3., 3., 3.])`, lang: "text", title: "Output" },
        { table: { head: ["", "Out-of-place", "In-place"], rows: [
          ["Syntax", "<code>x + 1</code>, <code>x.add(1)</code>, <code>F.relu(x)</code>", "<code>x += 1</code>, <code>x.add_(1)</code>, <code>F.relu(x, inplace=True)</code>"],
          ["Memory", "New allocation", "Reuses storage"],
          ["Autograd safety", "Always safe", "May raise 'modified by an inplace operation'"],
          ["Aliasing", "Other references unaffected", "All views/aliases see the change"]
        ] } },
        { warn: "<code>nn.ReLU(inplace=True)</code> saves memory but can trigger the version error if the preceding op needs its output (or with some activation-checkpointing setups). If you see 'one of the variables needed for gradient computation has been modified by an inplace operation', turn on <code>torch.autograd.set_detect_anomaly(True)</code> to find the culprit and switch that op to out-of-place." },
        { tip: "The memory savings of in-place ops are usually small next to activations stored for backward; PyTorch's docs discourage them in model code unless you're under heavy memory pressure." }
      ]
    },

    /* ───────────── Autograd ───────────── */
    {
      id: "autograd-computational-graph",
      q: "How does autograd work in PyTorch: what are requires_grad, the computational graph and backward()?",
      topic: "Autograd",
      level: 1,
      top: true,
      short: "Autograd is PyTorch's reverse-mode automatic differentiation. When a tensor has requires_grad set, every operation on it is recorded in a graph built on the fly during the forward pass: each result stores a grad_fn node that knows how to compute its local derivative. Calling backward on a scalar loss walks this graph in reverse, applies the chain rule, and accumulates gradients into the .grad attribute of leaf tensors such as model parameters. The graph is dynamic, rebuilt every iteration, and freed after backward unless retain_graph is set.",
      a: [
        { p: "PyTorch uses a <b>dynamic (define-by-run) graph</b>: the graph is recorded while your Python code runs, so loops, <code>if</code>s and varying shapes just work. The maths is ordinary backpropagation — see <a href=\"#/core/ai/backpropagation\">backpropagation</a>; here is how PyTorch implements it." },
        { ul: [
          "<b>Leaf tensors</b>: created by you with <code>requires_grad=True</code> (e.g. <code>nn.Parameter</code>s). Gradients are stored in their <code>.grad</code>.",
          "<b>Non-leaf tensors</b>: results of operations; they carry <code>grad_fn</code> (e.g. <code>MulBackward0</code>) pointing to the backward function and its inputs. Their <code>.grad</code> is not kept unless you call <code>.retain_grad()</code>.",
          "<code>loss.backward()</code>: starts from <code>d loss/d loss = 1</code>, traverses <code>grad_fn</code> nodes in reverse topological order, multiplies local Jacobians (vector-Jacobian products) and <b>adds</b> results into each leaf's <code>.grad</code>.",
          "After backward the saved intermediate tensors are freed; calling backward again on the same graph raises an error unless <code>retain_graph=True</code>."
        ] },
        { code: `import torch
w = torch.tensor(2.0, requires_grad=True)     # leaf
b = torch.tensor(1.0, requires_grad=True)     # leaf
x = torch.tensor(3.0)                         # data: no grad needed

y = w * x + b          # forward builds the graph
loss = (y - 10) ** 2
print(type(y.grad_fn).__name__, type(loss.grad_fn).__name__)
print(w.is_leaf, y.is_leaf)

loss.backward()        # dloss/dw = 2(y-10)*x, dloss/db = 2(y-10)
print(w.grad, b.grad)  # y = 7 -> 2*(-3)*3 = -18, 2*(-3) = -6

try:
    loss.backward()    # graph already freed
except RuntimeError as e:
    print("RuntimeError:", str(e)[:60], "...")

# dynamic graph: control flow decided at run time
def f(t):
    return t * 2 if t.sum() > 0 else t ** 3
t = torch.tensor([1.0, -3.0], requires_grad=True)
f(t).sum().backward()
print(t.grad)

v = torch.tensor([1.0, 2.0], requires_grad=True)
out = v ** 2                                  # non-scalar output
out.backward(torch.ones_like(out))            # needs a gradient vector
print(v.grad)`, lang: "python", title: "Graph, grad_fn and gradients" },
        { code: `AddBackward0 PowBackward0
True False
tensor(-18.) tensor(-6.)
RuntimeError: Trying to backward through the graph a second time (or direc ...
tensor([ 3., 27.])
tensor([2., 4.])`, lang: "text", title: "Output" },
        { svg: `<svg viewBox="0 0 640 170" width="640" class="dg">
  <rect x="10" y="20" width="70" height="32" class="box box-g"/><text x="45" y="41" class="tx tx-c tx-m" text-anchor="middle">w (leaf)</text>
  <rect x="10" y="70" width="70" height="32" class="box"/><text x="45" y="91" class="tx tx-c tx-m" text-anchor="middle">x</text>
  <rect x="10" y="120" width="70" height="32" class="box box-g"/><text x="45" y="141" class="tx tx-c tx-m" text-anchor="middle">b (leaf)</text>
  <rect x="140" y="45" width="110" height="32" class="box box-p"/><text x="195" y="66" class="tx tx-c tx-m" text-anchor="middle">MulBackward0</text>
  <rect x="300" y="80" width="110" height="32" class="box box-p"/><text x="355" y="101" class="tx tx-c tx-m" text-anchor="middle">AddBackward0</text>
  <rect x="460" y="80" width="110" height="32" class="box box-p"/><text x="515" y="101" class="tx tx-c tx-m" text-anchor="middle">PowBackward0</text>
  <rect x="590" y="80" width="44" height="32" class="box box-a"/><text x="612" y="101" class="tx tx-c tx-m" text-anchor="middle">loss</text>
  <path d="M80 36 L138 56" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M80 86 L138 68" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M250 64 L298 90" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M80 136 L298 104" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M410 96 L458 96" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M570 96 L588 96" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M612 114 C 600 146, 120 146, 50 154" class="ln ln-a ln-d" marker-end="url(#dg-arr-a)"/>
  <text x="330" y="167" class="tx tx-a tx-s tx-c" text-anchor="middle">backward(): chain rule, gradients accumulate into w.grad, b.grad</text>
</svg>`, caption: "Forward builds grad_fn nodes; backward walks them in reverse and writes into leaf .grad." },
        { tip: "Follow-ups: 'Why does backward need a scalar?' — reverse mode computes vector-Jacobian products; for a non-scalar output you must pass the vector (<code>gradient=</code>). 'Why are gradients accumulated?' — see the next question on <code>zero_grad</code>." }
      ]
    },
    {
      id: "zero-grad-gradient-accumulation",
      q: "Why do we call optimizer.zero_grad()? How do you use gradient accumulation to simulate a larger batch?",
      topic: "Autograd",
      level: 2,
      top: true,
      short: "backward adds into .grad instead of overwriting it, so without zero_grad each step would use the sum of all previous gradients and training diverges. PyTorch accumulates by design because it enables gradient accumulation and multiple losses: you run several small micro-batches, call backward on each with the loss divided by the number of steps, and only call optimizer.step and zero_grad every k steps, which gives the gradient of an effective batch k times larger when the full batch doesn't fit in GPU memory. Since PyTorch 2.0 zero_grad sets grads to None by default.",
      a: [
        { p: "Every <code>backward()</code> does <code>param.grad += new_grad</code>. That's deliberate: it lets you sum gradients from several losses or several micro-batches before one update. The price is that <b>you</b> must clear them before each new update." },
        { code: `import torch
w = torch.tensor(1.0, requires_grad=True)
for step in range(3):
    loss = (w * 2) ** 2           # dloss/dw = 8w = 8
    loss.backward()
    print("step", step, "grad =", w.grad.item())   # 8, 16, 24: accumulating!

opt = torch.optim.SGD([w], lr=0.1)
opt.zero_grad()                   # set_to_none=True by default (PyTorch 2.0+)
print("after zero_grad:", w.grad)`, lang: "python", title: "Gradients accumulate across backward calls" },
        { code: `step 0 grad = 8.0
step 1 grad = 16.0
step 2 grad = 24.0
after zero_grad: None`, lang: "text", title: "Output" },
        { h: "Gradient accumulation" },
        { code: `import torch, torch.nn as nn
torch.manual_seed(0)
X, y = torch.randn(64, 10), torch.randn(64, 1)
model = nn.Linear(10, 1)
loss_fn = nn.MSELoss()

def grads_full_batch():
    model.zero_grad()
    loss_fn(model(X), y).backward()
    return model.weight.grad.clone()

def grads_accumulated(accum_steps=4):
    model.zero_grad()
    for xb, yb in zip(X.chunk(accum_steps), y.chunk(accum_steps)):   # 4 micro-batches of 16
        loss = loss_fn(model(xb), yb) / accum_steps   # scale so the sum = mean over 64
        loss.backward()                               # grads add up
    return model.weight.grad.clone()

print(torch.allclose(grads_full_batch(), grads_accumulated(), atol=1e-6))

# inside a real loop:
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
accum = 4
for i, (xb, yb) in enumerate(zip(X.split(8), y.split(8))):
    loss = loss_fn(model(xb), yb) / accum
    loss.backward()
    if (i + 1) % accum == 0:
        opt.step()
        opt.zero_grad(set_to_none=True)
print("updates done:", (i + 1) // accum)`, lang: "python", title: "Same gradient as one big batch, a quarter of the memory" },
        { code: `True
updates done: 2`, lang: "text", title: "Output" },
        { ul: [
          "Divide the loss by <code>accum_steps</code> (when the loss is a mean) or the effective learning rate is multiplied by k.",
          "BatchNorm still sees only the micro-batch, so accumulation is not perfectly identical for BN models.",
          "<code>set_to_none=True</code> (default since 2.0) frees the grad tensors instead of filling them with zeros — slightly faster, less memory. Code that reads <code>p.grad</code> must handle <code>None</code>.",
          "<code>model.zero_grad()</code> and <code>optimizer.zero_grad()</code> are equivalent when the optimizer holds all model parameters."
        ] },
        { warn: "Forgetting <code>zero_grad()</code> doesn't crash — the loss just behaves erratically or explodes because each step uses an ever-growing sum of old gradients. It's one of the first things to check when a loss curve looks wrong." }
      ]
    },
    {
      id: "no-grad-inference-mode-detach",
      q: "What is the difference between torch.no_grad(), torch.inference_mode() and tensor.detach()?",
      topic: "Autograd",
      level: 2,
      top: true,
      short: "torch.no_grad is a context manager that stops autograd from recording operations inside it, so no graph is built, saving memory and time; it's used for evaluation and for manual weight updates. torch.inference_mode is a stricter, faster version for pure inference: it also skips version counting and view tracking, but tensors created inside can never be used later in autograd. detach works on one tensor: it returns a view sharing the same data but cut off from the graph, used to stop gradients flowing into part of a model or to log or convert a tensor to NumPy.",
      a: [
        { table: { head: ["", "Scope", "Effect", "Use for"], rows: [
          ["<code>torch.no_grad()</code>", "Block of code (context manager / decorator)", "Ops not recorded; outputs have <code>requires_grad=False</code>", "Validation loop, optimizer-style manual updates, EMA weights"],
          ["<code>torch.inference_mode()</code> (1.9+)", "Block of code", "Like no_grad plus no version counters / view tracking → faster; outputs are 'inference tensors' that can't enter autograd later", "Serving, batch prediction — code that will never need gradients"],
          ["<code>t.detach()</code>", "One tensor", "Returns a view sharing memory with no <code>grad_fn</code>", "Stop gradient to a branch (GAN generator output for D step, target networks), <code>.detach().cpu().numpy()</code>"],
          ["<code>requires_grad_(False)</code>", "A leaf tensor / parameter", "Permanently excludes it from gradient computation", "Freezing layers"],
          ["<code>model.eval()</code>", "Module behaviour", "Changes dropout/BatchNorm only — <b>does not</b> stop gradients", "Always together with no_grad for evaluation"]
        ] } },
        { code: `import torch
w = torch.randn(3, requires_grad=True)
x = torch.ones(3)

with torch.no_grad():
    y = w * x
print("no_grad:", y.requires_grad, y.grad_fn)

with torch.inference_mode():
    z = w * x
print("inference_mode:", z.requires_grad, z.is_inference())
try:
    (z * w).sum().backward()          # inference tensors can't be saved for backward
except RuntimeError as e:
    print("RuntimeError:", str(e)[:70], "...")

d = w.detach()
print("detach:", d.requires_grad, "shares memory:", d.data_ptr() == w.data_ptr())

a = w * 3
loss = (a * a.detach()).sum()         # gradient flows only through the first 'a'
loss.backward()
print(torch.allclose(w.grad, 9 * w.detach()))   # d/dw (3w * const 3w) = 3 * 3w

@torch.no_grad()                      # also works as a decorator
def predict(t):
    return (w * t).sum()
print(predict(x).requires_grad)

try:
    (w * 2).numpy()
except RuntimeError as e:
    print("RuntimeError:", str(e)[:60], "...")
print((w * 2).detach().numpy().shape)`, lang: "python", title: "Each tool in action" },
        { code: `no_grad: False None
inference_mode: False True
RuntimeError: Inference tensors cannot be saved for backward. Please do not use Tens ...
detach: False shares memory: True
True
False
RuntimeError: Can't call numpy() on Tensor that requires grad. Use tensor. ...
(3,)`, lang: "text", title: "Output" },
        { warn: "Don't confuse <code>model.eval()</code> with <code>no_grad()</code> — you need both for evaluation. And avoid the legacy <code>tensor.data</code>: it also detaches, but in-place changes through it are invisible to autograd's version check, so wrong gradients go unnoticed. Use <code>detach()</code>." },
        { tip: "Why is <code>no_grad</code> faster? Autograd doesn't store intermediate activations for backward, so memory drops dramatically — you can often use a 2–4× larger batch for validation than for training." }
      ]
    },

    /* ───────────── Modules & Data ───────────── */
    {
      id: "nn-module",
      q: "How does nn.Module work? How are parameters registered, and why do we call model(x) instead of model.forward(x)?",
      topic: "Modules & Data",
      level: 1,
      top: true,
      short: "nn.Module is the base class for every layer and model. You create submodules and nn.Parameters as attributes in __init__ and define the computation in forward. Module overrides __setattr__, so assigning a Parameter or Module to self registers it automatically; that's what makes model.parameters(), .to(device), state_dict, train and eval work recursively. Plain Python lists of layers are not registered, so you must use nn.ModuleList or ModuleDict. Call model(x) rather than forward directly because __call__ also runs registered hooks.",
      a: [
        { p: "A <b>Module</b> is a container of parameters, buffers and child modules plus a <code>forward</code> method. Registration happens in <code>__setattr__</code>: assigning an <code>nn.Parameter</code>, <code>nn.Module</code> or a buffer (<code>register_buffer</code>) to <code>self</code> stores it in internal dicts (<code>_parameters</code>, <code>_modules</code>, <code>_buffers</code>)." },
        { code: `import torch, torch.nn as nn
torch.manual_seed(0)

class MLP(nn.Module):
    def __init__(self, sizes):
        super().__init__()                          # must be called first
        self.layers = nn.ModuleList(                # registered container
            nn.Linear(a, b) for a, b in zip(sizes, sizes[1:]))
        self.scale = nn.Parameter(torch.ones(1))    # learnable tensor
        self.register_buffer("calls", torch.zeros(1))   # state, not trained, saved
        self.not_registered = [nn.Linear(4, 4)]     # plain list: invisible!

    def forward(self, x):
        self.calls += 1
        for layer in self.layers[:-1]:
            x = torch.relu(layer(x))
        return self.layers[-1](x) * self.scale

model = MLP([4, 8, 2])
out = model(torch.randn(3, 4))                      # __call__ -> hooks + forward
print(out.shape)
for name, p in model.named_parameters():
    print(f"{name:<16}{tuple(p.shape)}")
print("trainable params:", sum(p.numel() for p in model.parameters() if p.requires_grad))
print("buffers:", [n for n, _ in model.named_buffers()])
print(model)`, lang: "python", title: "A custom Module" },
        { code: `torch.Size([3, 2])
scale           (1,)
layers.0.weight (8, 4)
layers.0.bias   (8,)
layers.1.weight (2, 8)
layers.1.bias   (2,)
trainable params: 59
buffers: ['calls']
MLP(
  (layers): ModuleList(
    (0): Linear(in_features=4, out_features=8, bias=True)
    (1): Linear(in_features=8, out_features=2, bias=True)
  )
)`, lang: "text", title: "Output" },
        { table: { head: ["Thing", "Registered via", "In parameters()?", "In state_dict?", "Moved by .to()?"], rows: [
          ["<code>nn.Parameter</code>", "attribute assignment", "Yes", "Yes", "Yes"],
          ["Child <code>nn.Module</code>", "attribute, <code>ModuleList</code>, <code>ModuleDict</code>, <code>Sequential</code>", "Its params, yes", "Yes", "Yes"],
          ["Buffer (BN running mean, masks)", "<code>register_buffer</code>", "No", "Yes (unless <code>persistent=False</code>)", "Yes"],
          ["Plain tensor / Python list of layers", "nothing", "No", "No", "No"]
        ] } },
        { warn: "A plain Python <code>list</code> of layers is the classic bug: the layers work in forward, but the optimizer never sees their weights (they don't train), <code>.to('cuda')</code> doesn't move them (device-mismatch error) and they're missing from saved checkpoints. Use <code>nn.ModuleList</code>/<code>nn.ModuleDict</code>." },
        { tip: "Why <code>model(x)</code>? <code>Module.__call__</code> runs forward pre-hooks, <code>forward</code>, forward hooks and backward-hook setup — used by tools like profilers, feature extractors and quantisation. Calling <code>.forward()</code> directly skips them. Also mention <code>nn.functional</code> (stateless ops like <code>F.relu</code>) vs layer classes (hold parameters)." }
      ]
    },
    {
      id: "state-dict-save-load",
      q: "What is a state_dict? How do you save and load a PyTorch model and a training checkpoint correctly?",
      topic: "Modules & Data",
      level: 1,
      top: true,
      short: "A state_dict is an ordered dict mapping each parameter and persistent buffer name to its tensor; optimizers and schedulers have one too. The recommended way is torch.save(model.state_dict()), then rebuild the model class and call load_state_dict. To resume training, save a checkpoint dict with model and optimizer state, epoch and best metric. Pickling the whole model is fragile. Use map_location to load GPU checkpoints on CPU; since PyTorch 2.6 torch.load defaults to weights_only=True for safety.",
      a: [
        { code: `import torch, torch.nn as nn, os, tempfile
torch.manual_seed(0)
model = nn.Sequential(nn.Linear(4, 8), nn.BatchNorm1d(8), nn.ReLU(), nn.Linear(8, 2))
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
print(list(model.state_dict().keys()))

path = os.path.join(tempfile.mkdtemp(), "ckpt.pt")
torch.save({                                    # a full training checkpoint
    "epoch": 5,
    "model": model.state_dict(),
    "optimizer": opt.state_dict(),              # Adam moments, step counts
    "best_val_acc": 0.91,
}, path)

new_model = nn.Sequential(nn.Linear(4, 8), nn.BatchNorm1d(8), nn.ReLU(), nn.Linear(8, 2))
new_opt = torch.optim.Adam(new_model.parameters(), lr=1e-3)
ckpt = torch.load(path, map_location="cpu")     # weights_only=True default (2.6+)
new_model.load_state_dict(ckpt["model"])        # strict=True: keys must match
new_opt.load_state_dict(ckpt["optimizer"])
start_epoch = ckpt["epoch"] + 1
print("resume from epoch", start_epoch, "| same weights:",
      torch.equal(model[0].weight, new_model[0].weight))

new_model.eval()                                # before inference!
bad = {k: v for k, v in ckpt["model"].items() if not k.startswith("3.")}
result = new_model.load_state_dict(bad, strict=False)
print("missing keys:", result.missing_keys)`, lang: "python", title: "Save / load the recommended way" },
        { code: `['0.weight', '0.bias', '1.weight', '1.bias', '1.running_mean', '1.running_var', '1.num_batches_tracked', '3.weight', '3.bias']
resume from epoch 6 | same weights: True
missing keys: ['3.weight', '3.bias']`, lang: "text", title: "Output" },
        { table: { head: ["Approach", "Pros", "Cons"], rows: [
          ["<code>torch.save(model.state_dict())</code> (recommended)", "Just tensors; portable across refactors; safe with <code>weights_only</code>", "Need the model class to rebuild"],
          ["<code>torch.save(model)</code> (whole object)", "One line", "Pickles a reference to the class/module path — breaks when code moves; not loadable with <code>weights_only=True</code>"],
          ["Checkpoint dict (model + optimizer + scheduler + epoch + scaler)", "Exact resume of training", "Bigger file (Adam stores 2 extra tensors per param)"],
          ["<code>safetensors</code> / ONNX / <code>torch.export</code>", "Safe, fast loading / cross-runtime deployment", "Extra tooling"]
        ] } },
        { ul: [
          "<code>map_location=\"cpu\"</code> (or a device) lets a checkpoint saved on GPU load on a CPU-only machine.",
          "Models wrapped in <code>DataParallel</code>/<code>DDP</code> prefix keys with <code>module.</code> — save <code>model.module.state_dict()</code> or strip the prefix.",
          "For transfer learning with a changed head, load with <code>strict=False</code> and check <code>missing_keys</code>/<code>unexpected_keys</code>.",
          "Call <code>model.eval()</code> after loading for inference, otherwise dropout and BatchNorm behave in training mode."
        ] },
        { warn: "<code>torch.load</code> uses pickle, and unpickling untrusted files can execute arbitrary code. That's why PyTorch 2.6 switched the default to <code>weights_only=True</code>; only pass <code>weights_only=False</code> for files you trust. Prefer <code>safetensors</code> for sharing weights." }
      ]
    },
    {
      id: "dataset-dataloader",
      q: "How do Dataset and DataLoader work? What do batch_size, shuffle, num_workers and pin_memory do?",
      topic: "Modules & Data",
      level: 1,
      top: true,
      short: "A map-style Dataset implements __len__ and __getitem__ to return one sample by index; it's where you read files and apply transforms. DataLoader wraps it: a sampler produces indices, shuffled each epoch if shuffle is true, they're grouped into batches of batch_size, samples are fetched and merged by collate_fn into batched tensors. num_workers greater than zero loads batches in parallel worker processes so the GPU isn't starved, pin_memory uses page-locked host memory for faster asynchronous copies to the GPU, and drop_last drops a final incomplete batch.",
      a: [
        { svg: `<svg viewBox="0 0 680 120" width="680" class="dg">
  <rect x="10" y="40" width="100" height="40" class="box"/><text x="60" y="64" class="tx tx-c tx-m" text-anchor="middle">Sampler</text>
  <rect x="150" y="40" width="110" height="40" class="box"/><text x="205" y="64" class="tx tx-c tx-m" text-anchor="middle">BatchSampler</text>
  <rect x="300" y="40" width="130" height="40" class="box box-a"/><text x="365" y="58" class="tx tx-c tx-m" text-anchor="middle">workers call</text><text x="365" y="73" class="tx tx-c tx-s" text-anchor="middle">dataset[i]</text>
  <rect x="470" y="40" width="90" height="40" class="box box-p"/><text x="515" y="64" class="tx tx-c tx-m" text-anchor="middle">collate_fn</text>
  <rect x="600" y="40" width="70" height="40" class="box box-g"/><text x="635" y="64" class="tx tx-c tx-m" text-anchor="middle">batch</text>
  <path d="M110 60 L148 60" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M260 60 L298 60" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M430 60 L468 60" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M560 60 L598 60" class="ln" marker-end="url(#dg-arr)"/>
  <text x="60" y="30" class="tx tx-s tx-c" text-anchor="middle">indices (shuffled)</text>
  <text x="205" y="30" class="tx tx-s tx-c" text-anchor="middle">[7, 2, 9, 4]</text>
  <text x="365" y="30" class="tx tx-s tx-c" text-anchor="middle">num_workers processes</text>
  <text x="515" y="30" class="tx tx-s tx-c" text-anchor="middle">stack / pad</text>
  <text x="340" y="108" class="tx tx-s tx-c" text-anchor="middle">pin_memory → fast .to("cuda", non_blocking=True)</text>
</svg>`, caption: "DataLoader pipeline: indices → batches of indices → samples (in parallel) → collated tensors." },
        { code: `import torch
from torch.utils.data import Dataset, DataLoader, random_split

class SquaresDataset(Dataset):
    """Map-style dataset: knows its length and returns ONE sample."""
    def __init__(self, n):
        self.x = torch.arange(n, dtype=torch.float32)
    def __len__(self):
        return len(self.x)
    def __getitem__(self, idx):              # read file / decode / augment here
        x = self.x[idx]
        return x.unsqueeze(0), x ** 2        # (features, target)

ds = SquaresDataset(10)
print(len(ds), ds[3])
train_ds, val_ds = random_split(ds, [8, 2], generator=torch.Generator().manual_seed(0))

g = torch.Generator().manual_seed(42)        # reproducible shuffling
train_dl = DataLoader(train_ds, batch_size=3, shuffle=True, drop_last=False,
                      num_workers=0, generator=g)   # num_workers>0 in real projects
val_dl = DataLoader(val_ds, batch_size=4, shuffle=False)

for epoch in range(2):
    print("epoch", epoch, [yb.tolist() for _, yb in train_dl])   # new order each epoch
xb, yb = next(iter(train_dl))
print(xb.shape, yb.shape, len(train_dl), len(val_dl))`, lang: "python", title: "A custom Dataset and DataLoader" },
        { code: `10 (tensor([3.]), tensor(9.))
epoch 0 [[9.0, 0.0, 49.0], [25.0, 16.0, 64.0], [1.0, 81.0]]
epoch 1 [[64.0, 9.0, 25.0], [1.0, 81.0, 16.0], [49.0, 0.0]]
torch.Size([3, 1]) torch.Size([3]) 3 1`, lang: "text", title: "Output" },
        { table: { head: ["Argument", "What it does", "Guidance"], rows: [
          ["<code>batch_size</code>", "Samples per batch", "As large as GPU memory allows / tuned with LR"],
          ["<code>shuffle</code>", "Random order every epoch (RandomSampler)", "True for training, False for validation/test"],
          ["<code>num_workers</code>", "Worker <b>processes</b> that prepare batches in parallel", "Start at number of CPU cores (4–8); 0 = load in main process"],
          ["<code>pin_memory</code>", "Collate into page-locked RAM", "True when training on CUDA; pair with <code>non_blocking=True</code>"],
          ["<code>drop_last</code>", "Drop the incomplete final batch", "Useful with BatchNorm (batch of 1 errors in train mode)"],
          ["<code>persistent_workers</code>, <code>prefetch_factor</code>", "Keep workers alive between epochs; batches prefetched per worker", "Saves worker start-up each epoch"],
          ["<code>collate_fn</code>", "Merges a list of samples into a batch", "Custom for variable-length data (next question)"]
        ] } },
        { warn: "With <code>num_workers &gt; 0</code> on Windows/macOS (spawn start method) your training script must be under <code>if __name__ == \"__main__\":</code> and the Dataset must be picklable. Also each worker gets a copy of the dataset — load file paths in <code>__init__</code> and read the actual data lazily in <code>__getitem__</code>, not giant in-memory Python lists (copy-on-access memory blow-up)." },
        { tip: "If GPU utilisation is low, the data pipeline is usually the bottleneck: raise <code>num_workers</code>, enable <code>pin_memory</code>, move heavy augmentation to GPU, or pre-process once. Use an <code>IterableDataset</code> for streams that can't be indexed (logs, huge sharded files)." }
      ]
    },
    {
      id: "collate-fn-variable-length",
      q: "What is collate_fn in a DataLoader, and how do you batch variable-length sequences?",
      topic: "Modules & Data",
      level: 2,
      top: false,
      short: "collate_fn receives the list of samples returned by the Dataset for one batch and must merge them into batch tensors. The default stacks tensors, which fails when samples have different lengths, such as sentences or token sequences. A custom collate_fn pads them to the longest sequence in the batch with pad_sequence, returns the original lengths or an attention mask so the model can ignore padding, and can also handle dicts, strings or filtering out bad samples.",
      a: [
        { p: "The default collate recursively <code>torch.stack</code>s tensors, converts numbers to tensors and keeps dicts/tuples structure. <code>torch.stack</code> requires equal shapes, so variable-length text, audio or detection targets need a custom function." },
        { code: `import torch
from torch.utils.data import DataLoader
from torch.nn.utils.rnn import pad_sequence

samples = [                                # (token_ids, label) of different lengths
    (torch.tensor([5, 8, 2]), 1),
    (torch.tensor([7]), 0),
    (torch.tensor([3, 3, 9, 4, 1]), 1),
]
try:
    next(iter(DataLoader(samples, batch_size=3)))
except RuntimeError as e:
    print("default collate:", str(e)[:55], "...")

PAD = 0
def pad_collate(batch):
    seqs, labels = zip(*batch)
    lengths = torch.tensor([len(s) for s in seqs])
    padded = pad_sequence(seqs, batch_first=True, padding_value=PAD)   # (B, max_len)
    mask = padded != PAD                                              # attention mask
    return padded, lengths, mask, torch.tensor(labels)

x, lengths, mask, y = next(iter(DataLoader(samples, batch_size=3, collate_fn=pad_collate)))
print(x)
print(lengths.tolist(), y.tolist())
print(mask.int())

emb = torch.nn.Embedding(10, 4, padding_idx=PAD)
h = emb(x)                                         # (B, L, 4)
mean_pool = (h * mask.unsqueeze(-1)).sum(1) / lengths.unsqueeze(1)   # ignore pads
print(mean_pool.shape)`, lang: "python", title: "Padding collate with lengths and mask" },
        { code: `default collate: stack expects each tensor to be equal size, but got [3] ...
tensor([[5, 8, 2, 0, 0],
        [7, 0, 0, 0, 0],
        [3, 3, 9, 4, 1]])
[3, 1, 5] [1, 0, 1]
tensor([[1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1]], dtype=torch.int32)
torch.Size([3, 4])`, lang: "text", title: "Output" },
        { ul: [
          "Pad per batch (dynamic padding) rather than to a global max length — far less wasted compute. Sorting/bucketing by length makes it even more efficient.",
          "For RNNs, <code>pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)</code> skips the pads entirely.",
          "For Hugging Face models, <code>DataCollatorWithPadding(tokenizer)</code> does the same and returns <code>input_ids</code> + <code>attention_mask</code>.",
          "Object detection: return a list of target dicts instead of stacking — <code>collate_fn=lambda b: tuple(zip(*b))</code>."
        ] },
        { tip: "A collate_fn can also drop corrupt samples (Dataset returns <code>None</code>, collate filters them out) — a handy trick to mention for messy real-world data." }
      ]
    },

    /* ───────────── Training ───────────── */
    {
      id: "train-eval-loop",
      q: "Walk through a full train and validate epoch in PyTorch. What do model.train() and model.eval() actually change?",
      topic: "Training",
      level: 2,
      top: true,
      short: "An epoch has a training phase under model.train(): for each batch move it to the device, forward, loss, zero_grad, backward, optional gradient clipping, optimizer step, and log loss.item(). Then a validation phase under model.eval() and torch.no_grad(): forward only, accumulate metrics, and checkpoint if the metric improved. train and eval only flip a flag on every submodule: Dropout is active only in train mode, and BatchNorm uses batch statistics and updates running averages in train mode but uses the stored running statistics in eval mode.",
      a: [
        { p: "The five-step update (forward → loss → <code>zero_grad</code> → <code>backward</code> → <code>step</code>) is explained in the core answer <a href=\"#/core/ai/pytorch-training-loop\">PyTorch training loop</a>. Here: what a production-shaped epoch looks like and what the mode switch really does." },
        { code: `import torch, torch.nn as nn
torch.manual_seed(0)

drop = nn.Dropout(p=0.5)
x = torch.ones(1, 8)
drop.train(); print("train dropout:", drop(x))       # zeros + survivors scaled by 1/(1-p)
drop.eval();  print("eval dropout: ", drop(x))       # identity

bn = nn.BatchNorm1d(2)
batch = torch.tensor([[1.0, 10.0], [3.0, 30.0]])
bn.train(); out_train = bn(batch)                    # normalise with THIS batch's mean/var
print("running_mean after 1 step:", bn.running_mean) # momentum 0.1 update
bn.eval(); out_eval = bn(batch)                      # uses running stats instead
print(out_train[0].tolist(), [round(v, 3) for v in out_eval[0].tolist()])
print("training flags:", bn.training, drop.training)`, lang: "python", title: "What the mode switch changes" },
        { code: `train dropout: tensor([[0., 0., 2., 0., 0., 0., 2., 2.]])
eval dropout:  tensor([[1., 1., 1., 1., 1., 1., 1., 1.]])
running_mean after 1 step: tensor([0.2000, 2.0000])
[-0.9999949932098389, -0.9999999403953552] [0.763, 1.75]
training flags: False False`, lang: "text", title: "Output" },
        { code: `import torch, torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

X = torch.randn(600, 20); y = (X[:, :5].sum(1) > 0).long()
train_dl = DataLoader(TensorDataset(X[:500], y[:500]), batch_size=32, shuffle=True)
val_dl = DataLoader(TensorDataset(X[500:], y[500:]), batch_size=100)

model = nn.Sequential(nn.Linear(20, 64), nn.BatchNorm1d(64), nn.ReLU(),
                      nn.Dropout(0.2), nn.Linear(64, 2)).to(device)
opt = torch.optim.AdamW(model.parameters(), lr=3e-3, weight_decay=1e-2)
sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=10)
loss_fn = nn.CrossEntropyLoss()

def train_one_epoch():
    model.train()
    total, n = 0.0, 0
    for xb, yb in train_dl:
        xb, yb = xb.to(device), yb.to(device)
        loss = loss_fn(model(xb), yb)
        opt.zero_grad(set_to_none=True)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        opt.step()
        total += loss.item() * len(xb); n += len(xb)     # .item(): no graph kept
    return total / n

@torch.no_grad()
def evaluate():
    model.eval()
    correct = total_loss = 0
    for xb, yb in val_dl:
        xb, yb = xb.to(device), yb.to(device)
        logits = model(xb)
        total_loss += loss_fn(logits, yb).item() * len(xb)
        correct += (logits.argmax(1) == yb).sum().item()
    return total_loss / len(val_dl.dataset), correct / len(val_dl.dataset)

best = 0.0
for epoch in range(10):
    tr = train_one_epoch()
    val_loss, val_acc = evaluate()
    sched.step()                                         # per epoch for this scheduler
    if val_acc > best:
        best = val_acc
        best_state = {k: v.detach().clone() for k, v in model.state_dict().items()}
    if epoch % 3 == 0 or epoch == 9:
        print(f"epoch {epoch}: train {tr:.3f}  val {val_loss:.3f}  acc {val_acc:.2f}")
model.load_state_dict(best_state)
print("best val acc:", best)`, lang: "python", title: "A complete epoch structure (train + validate + best checkpoint)" },
        { code: `epoch 0: train 0.643  val 0.506  acc 0.80
epoch 3: train 0.236  val 0.200  acc 0.96
epoch 6: train 0.178  val 0.151  acc 0.97
epoch 9: train 0.174  val 0.146  acc 0.98
best val acc: 0.98`, lang: "text", title: "Output" },
        { warn: "Forgetting <code>model.eval()</code> at inference gives noisy, worse predictions (dropout still on) and, with BatchNorm, results that depend on what else is in the batch; a batch of 1 in train mode even raises 'Expected more than 1 value per channel'. Forgetting to switch back to <code>model.train()</code> after validation silently trains without dropout and freezes BN statistics." },
        { tip: "Mention the details that show experience: <code>loss.item()</code> for logging (keeping the tensor leaks graphs), <code>clip_grad_norm_</code> for stability, when to call <code>scheduler.step()</code> (per epoch vs per batch depending on scheduler), and early stopping on the validation metric." }
      ]
    },
    {
      id: "loss-functions-logits",
      q: "Which PyTorch loss should you use for classification, and why does CrossEntropyLoss take raw logits?",
      topic: "Training",
      level: 2,
      top: true,
      short: "For multi-class single-label problems use nn.CrossEntropyLoss with raw logits of shape batch by classes and integer class targets of dtype long; it internally combines log_softmax and negative log-likelihood in a numerically stable way, so adding a softmax layer before it is a bug. For binary or multi-label problems use nn.BCEWithLogitsLoss with logits and float targets of the same shape, again with the sigmoid fused inside for stability. Apply softmax or sigmoid only at inference time to get probabilities.",
      a: [
        { table: { head: ["Task", "Model output", "Loss", "Target"], rows: [
          ["Multi-class (one label)", "Logits <code>(B, C)</code>", "<code>nn.CrossEntropyLoss</code>", "Class indices <code>(B,)</code> <code>long</code> (or class probabilities <code>(B, C)</code> float)"],
          ["Binary", "One logit <code>(B,)</code> or <code>(B, 1)</code>", "<code>nn.BCEWithLogitsLoss</code>", "Same shape, <code>float</code> 0./1."],
          ["Multi-label", "Logits <code>(B, C)</code>", "<code>nn.BCEWithLogitsLoss</code>", "Multi-hot <code>(B, C)</code> float"],
          ["Already log-probs", "<code>log_softmax</code> output", "<code>nn.NLLLoss</code>", "Class indices"],
          ["Regression", "Values", "<code>nn.MSELoss</code> / <code>nn.L1Loss</code> / <code>nn.HuberLoss</code>", "Same shape float"]
        ] } },
        { code: `import torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)
logits = torch.tensor([[2.0, 0.5, -1.0], [0.1, 0.2, 3.0]])
target = torch.tensor([0, 2])                       # class indices, int64

ce = nn.CrossEntropyLoss()(logits, target)
manual = F.nll_loss(F.log_softmax(logits, dim=1), target)
print(round(ce.item(), 4), round(manual.item(), 4))  # identical

double = nn.CrossEntropyLoss()(F.softmax(logits, dim=1), target)   # BUG: softmax twice
print("softmax-then-CE:", round(double.item(), 4))  # wrong, squashed loss + weak gradients

try:
    nn.CrossEntropyLoss()(logits, target.float())   # float targets of shape (B,)
except RuntimeError as e:
    print("RuntimeError:", str(e)[:60], "...")

big = torch.tensor([200.0])                        # extreme logit
print("naive BCE :", F.binary_cross_entropy(torch.sigmoid(big), torch.tensor([0.0])).item())
print("with logits:", F.binary_cross_entropy_with_logits(big, torch.tensor([0.0])).item())

pos_weight = torch.tensor([3.0])                   # imbalance: upweight positives
crit = nn.BCEWithLogitsLoss(pos_weight=pos_weight)
print(round(crit(torch.tensor([0.0, 0.0]), torch.tensor([1.0, 0.0])).item(), 4))

probs = logits.softmax(dim=1)                      # only at inference
print(probs.argmax(1).tolist(), probs.sum(1).tolist())`, lang: "python", title: "CrossEntropy internals and common mistakes" },
        { code: `0.1755 0.1755
softmax-then-CE: 0.6611
RuntimeError: expected scalar type Long but found Float ...
naive BCE : 100.0
with logits: 200.0
1.3863
[0, 2] [1.0, 1.0]`, lang: "text", title: "Output" },
        { p: "Why logits? <code>log(softmax(x))</code> computed in two steps can overflow/underflow (exp of large numbers, log of 0). The fused version uses the log-sum-exp trick: <code>log_softmax(x)_i = x_i − max(x) − log Σ exp(x_j − max(x))</code>, which is stable and gives clean gradients (<code>softmax − one_hot</code>). In the demo the true loss for logit 200 with target 0 is 200; naive BCE gets <code>sigmoid(200) = 1.0</code> exactly, hits <code>log(0)</code>, and PyTorch clamps the log to −100 — so it reports 100, a silently wrong value." },
        { ul: [
          "<code>CrossEntropyLoss(weight=class_weights)</code>, <code>label_smoothing=0.1</code> and <code>ignore_index=-100</code> (skip padding tokens) are frequently used options.",
          "For sequences, logits are <code>(B, T, C)</code> but CrossEntropy wants the class dim second: <code>loss_fn(logits.view(-1, C), targets.view(-1))</code> or <code>logits.permute(0, 2, 1)</code>.",
          "Theory of the losses themselves: <a href=\"#/core/ai/loss-functions\">loss functions</a>; imbalance strategies: <a href=\"#/core/ai/imbalanced-datasets\">imbalanced datasets</a>."
        ] },
        { warn: "Putting <code>nn.Softmax</code> as the last layer and then using <code>CrossEntropyLoss</code> is one of the most common PyTorch bugs. It trains, but slowly and to a worse result — there's no error message to warn you." }
      ]
    },
    {
      id: "transfer-learning-freezing",
      q: "How do you do transfer learning in PyTorch: freezing layers, replacing the head and fine-tuning with different learning rates?",
      topic: "Training",
      level: 2,
      top: true,
      short: "Load a pretrained model, for example a torchvision ResNet with its weights enum, freeze the backbone by setting requires_grad to False on its parameters, and replace the final classification layer with a new one sized for your classes; new layers are trainable by default. Pass only trainable parameters to the optimizer, train the head first, then optionally unfreeze the last blocks and fine-tune with a much smaller learning rate using optimizer parameter groups. Use the same preprocessing as pretraining and keep frozen BatchNorm layers in eval mode.",
      a: [
        { p: "When and why to transfer (feature extraction vs fine-tuning, data size vs similarity) is covered in <a href=\"#/core/ai/transfer-learning-fine-tuning\">transfer learning &amp; fine-tuning</a>. The PyTorch mechanics:" },
        { code: `import torch.nn as nn
from torchvision.models import resnet18, ResNet18_Weights

weights = ResNet18_Weights.DEFAULT                 # pretrained ImageNet weights
model = resnet18(weights=weights)                  # (pretrained=True is deprecated)
preprocess = weights.transforms()                  # matching resize/normalise

for p in model.parameters():                       # 1. freeze everything
    p.requires_grad = False
model.fc = nn.Linear(model.fc.in_features, 5)      # 2. new head: trainable by default`, lang: "python", run: false, title: "torchvision: load, freeze, replace the head" },
        { code: `import torch, torch.nn as nn
torch.manual_seed(0)

backbone = nn.Sequential(                          # stand-in for a pretrained network
    nn.Conv2d(3, 16, 3, padding=1), nn.BatchNorm2d(16), nn.ReLU(),
    nn.Conv2d(16, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(),
    nn.AdaptiveAvgPool2d(1), nn.Flatten())
model = nn.Sequential(backbone, nn.Linear(32, 5))  # new 5-class head

for p in backbone.parameters():                    # phase 1: feature extraction
    p.requires_grad = False
count = lambda m: sum(p.numel() for p in m.parameters() if p.requires_grad)
print("trainable:", count(model), "of", sum(p.numel() for p in model.parameters()))

opt = torch.optim.AdamW((p for p in model.parameters() if p.requires_grad), lr=1e-3)

model.train()
backbone.apply(lambda m: m.eval() if isinstance(m, nn.BatchNorm2d) else None)  # keep BN stats frozen
before = backbone[0].weight.clone()
loss = nn.functional.cross_entropy(model(torch.randn(8, 3, 32, 32)), torch.randint(0, 5, (8,)))
opt.zero_grad(); loss.backward(); opt.step()
print("backbone changed:", not torch.equal(before, backbone[0].weight),
      "| conv grad:", backbone[0].weight.grad)

for p in backbone[3:].parameters():                # phase 2: unfreeze last block
    p.requires_grad = True
opt = torch.optim.AdamW([
    {"params": backbone[3:].parameters(), "lr": 1e-5},   # small LR for pretrained
    {"params": model[1].parameters(), "lr": 1e-3},       # larger LR for the head
])
print("trainable now:", count(model), [g["lr"] for g in opt.param_groups])`, lang: "python", title: "Freezing, BN handling and parameter groups (runnable)" },
        { code: `trainable: 165 of 5349
backbone changed: False | conv grad: None
trainable now: 4869 [1e-05, 0.001]`, lang: "text", title: "Output" },
        { table: { head: ["Step", "PyTorch tool"], rows: [
          ["Freeze", "<code>p.requires_grad = False</code> or <code>module.requires_grad_(False)</code>"],
          ["Replace head", "Assign a new layer: <code>model.fc = nn.Linear(...)</code>, <code>model.classifier[-1] = ...</code>"],
          ["Optimise only trainable params", "Filter by <code>requires_grad</code> (saves optimizer memory)"],
          ["Discriminative LRs", "Optimizer <b>param groups</b> with their own <code>lr</code>"],
          ["Frozen BatchNorm", "Keep BN modules in <code>eval()</code> so running stats aren't overwritten by your small batches"],
          ["Hugging Face models", "<code>AutoModelForSequenceClassification.from_pretrained(name, num_labels=k)</code>, freeze via <code>model.base_model.requires_grad_(False)</code>; LoRA via <code>peft</code>"]
        ] } },
        { warn: "<code>requires_grad = False</code> does <b>not</b> stop BatchNorm from updating its running mean/var in train mode — those are buffers, not parameters. And if you create the optimizer <i>before</i> unfreezing, newly unfrozen parameters won't be in it; rebuild the optimizer or <code>add_param_group</code>." }
      ]
    },

    /* ───────────── GPU & Performance ───────────── */
    {
      id: "gpu-cuda-device",
      q: "How do you use a GPU in PyTorch, and how do you write device-agnostic code?",
      topic: "GPU & Performance",
      level: 1,
      top: true,
      short: "Pick a device once, for example cuda if torch.cuda.is_available() else cpu, move the model with model.to(device), which moves its parameters and buffers in place, and move every batch with tensor.to(device), which returns a new tensor. All tensors in an operation must be on the same device. Create the optimizer after moving the model, use pin_memory with non_blocking copies for speed, avoid frequent GPU to CPU syncs like .item() or printing, and call torch.cuda.synchronize before timing because CUDA kernels run asynchronously.",
      a: [
        { code: `import torch, torch.nn as nn
device = torch.device("cuda" if torch.cuda.is_available()
                      else "mps" if torch.backends.mps.is_available()   # Apple silicon
                      else "cpu")
print("using", device)

model = nn.Linear(10, 2)
model.to(device)                     # Module.to moves params in place (and returns self)
opt = torch.optim.SGD(model.parameters(), lr=0.1)   # create AFTER moving

x = torch.randn(4, 10)
x = x.to(device)                     # Tensor.to returns a NEW tensor: reassign!
out = model(x)
print(out.device, next(model.parameters()).device)

cpu_t = torch.randn(4, 10)
if device.type != "cpu":
    try:
        model(cpu_t)                 # device mismatch
    except RuntimeError as e:
        print("RuntimeError:", str(e)[:80])

preds = out.argmax(1).cpu().tolist() # back to CPU for numpy / python
print(preds)`, lang: "python", title: "Device-agnostic pattern (runs on CPU here)" },
        { code: `using cpu
cpu cpu
[0, 1, 1, 0]`, lang: "text", title: "Output" },
        { code: `# fast host->GPU transfer
loader = DataLoader(ds, batch_size=64, num_workers=4, pin_memory=True)
for xb, yb in loader:
    xb = xb.to(device, non_blocking=True)    # async copy from pinned memory
    yb = yb.to(device, non_blocking=True)
    ...

# timing GPU code correctly: kernels are launched asynchronously
torch.cuda.synchronize(); t0 = time.perf_counter()
y = model(x)
torch.cuda.synchronize(); print(time.perf_counter() - t0)

# memory
print(torch.cuda.memory_allocated() / 2**20, "MiB allocated")
print(torch.cuda.max_memory_allocated() / 2**20, "MiB peak")
torch.cuda.empty_cache()   # returns cached blocks to the driver (doesn't free live tensors)

# choose a GPU
CUDA_VISIBLE_DEVICES=1 python train.py      # shell: expose only GPU 1
model.to("cuda:0")`, lang: "python", run: false, title: "CUDA specifics (needs a GPU)" },
        { table: { head: ["Pitfall", "Fix"], rows: [
          ["<code>x.to(device)</code> without reassigning", "<code>x = x.to(device)</code> — tensors are not moved in place"],
          ["Tensor created inside <code>forward</code> on CPU (<code>torch.zeros(n)</code>)", "<code>torch.zeros(n, device=x.device)</code> or a registered buffer"],
          ["<code>CUDA out of memory</code>", "Smaller batch, AMP, gradient accumulation/checkpointing, <code>no_grad</code> in eval, don't keep loss tensors in lists"],
          ["Slow training with GPU idle", "DataLoader bottleneck, <code>.item()</code>/<code>print</code> each step forcing syncs"],
          ["Loading a GPU checkpoint on CPU", "<code>torch.load(p, map_location=\"cpu\")</code>"]
        ] } },
        { tip: "Multi-GPU follow-up: prefer <code>DistributedDataParallel</code> (one process per GPU, gradients all-reduced) over the older single-process <code>DataParallel</code>, launched with <code>torchrun --nproc_per_node=4 train.py</code>. For why GPUs win at this workload see <a href=\"#/core/coa/gpu-vs-cpu\">GPU vs CPU</a>." }
      ]
    },
    {
      id: "mixed-precision-amp",
      q: "What is mixed precision training (AMP) in PyTorch, and why do we need a GradScaler with float16?",
      topic: "GPU & Performance",
      level: 3,
      top: false,
      short: "AMP runs most ops, like matmuls and convolutions, in float16 or bfloat16 inside torch.autocast, keeps sensitive ops such as reductions, softmax and losses in float32, and keeps float32 master weights. It roughly halves activation memory and speeds up tensor-core GPUs. float16 has a small range, so tiny gradients underflow to zero; GradScaler multiplies the loss before backward, unscales before the step, skips steps with inf or NaN gradients and adapts the scale. bfloat16 has float32's range, so it usually needs no scaler.",
      a: [
        { table: { head: ["Format", "Bits (exp / mantissa)", "Max value", "Notes"], rows: [
          ["<code>float32</code>", "8 / 23", "~3.4e38", "Default; master weights"],
          ["<code>float16</code>", "5 / 10", "65504", "Fast on tensor cores; small range → needs loss scaling"],
          ["<code>bfloat16</code>", "8 / 7", "~3.4e38", "Same range as fp32, less precision; Ampere+ GPUs/TPUs/modern CPUs; no scaler needed"]
        ] } },
        { code: `device = "cuda"
model = model.to(device)
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
scaler = torch.amp.GradScaler("cuda")          # torch.cuda.amp.GradScaler is deprecated

for xb, yb in loader:
    xb, yb = xb.to(device, non_blocking=True), yb.to(device, non_blocking=True)
    opt.zero_grad(set_to_none=True)
    with torch.autocast(device_type="cuda", dtype=torch.float16):
        logits = model(xb)                      # matmuls/convs in fp16
        loss = loss_fn(logits, yb)              # autocast keeps loss in fp32
    scaler.scale(loss).backward()               # backward OUTSIDE autocast, on scaled loss
    scaler.unscale_(opt)                        # needed before clipping real grads
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(opt)                            # skipped if grads contain inf/NaN
    scaler.update()                             # grow/shrink the scale factor

# bfloat16 (A100/H100, recent consumer GPUs): no scaler
with torch.autocast(device_type="cuda", dtype=torch.bfloat16):
    loss = loss_fn(model(xb), yb)
loss.backward(); opt.step()`, lang: "python", run: false, title: "Standard AMP recipe (CUDA)" },
        { code: `import torch, torch.nn as nn
torch.manual_seed(0)
lin = nn.Linear(8, 4)
x = torch.randn(2, 8)
with torch.autocast(device_type="cpu", dtype=torch.bfloat16):   # CPU autocast demo
    y = lin(x)                      # matmul runs in bf16
    s = y.float().softmax(dim=-1)
print(y.dtype, lin.weight.dtype, s.dtype)   # weights stay fp32

tiny = torch.tensor(1e-8)
print("fp16 underflow:", tiny.half().item())                    # becomes 0
print("scaled by 2**16:", (tiny * 2**16).half().item() / 2**16) # survives
print("fp16 overflow:", torch.tensor(70000.0).half().item())
print("bf16 keeps range:", torch.tensor(70000.0).bfloat16().item())`, lang: "python", title: "Why scaling is needed (runnable on CPU)" },
        { code: `torch.bfloat16 torch.float32 torch.float32
fp16 underflow: 0.0
scaled by 2**16: 9.997165761888027e-09
fp16 overflow: inf
bf16 keeps range: 70144.0`, lang: "text", title: "Output" },
        { ul: [
          "Benefits: ~2× less activation memory (bigger batches/models), 1.5–3× faster on tensor-core GPUs.",
          "Don't call <code>.half()</code> on the whole model for training — pure fp16 weights lose small updates; autocast keeps fp32 master weights.",
          "Save <code>scaler.state_dict()</code> in checkpoints to resume exactly.",
          "Loss becoming NaN only under AMP usually means an op overflowed in fp16 — try bf16 or force that region to fp32 with <code>torch.autocast(..., enabled=False)</code>."
        ] },
        { tip: "One-sentence answer that lands well: 'fp16 has the speed but not the range, so GradScaler shifts gradients into the representable range; bf16 has the range, so it doesn't need the scaler.' Related inference topic: <a href=\"#/core/ai/model-size-quantization\">quantization</a>." }
      ]
    },
    {
      id: "torch-compile-torchscript",
      q: "What are torch.compile, TorchScript and torch.export, and how do you get a PyTorch model ready for deployment?",
      topic: "GPU & Performance",
      level: 3,
      top: false,
      short: "torch.compile, added in PyTorch 2.0, captures your model into graphs with TorchDynamo and generates fused kernels with TorchInductor, often giving a 1.3 to 2 times speed-up while keeping eager code, falling back to Python at graph breaks. TorchScript, via torch.jit.trace or script, was the older way to get a Python-free serialised model for C++ and mobile and is now in maintenance mode. torch.export produces a full-graph ExportedProgram and, with ONNX, is the recommended deployment path.",
      a: [
        { table: { head: ["Tool", "What it does", "Use when"], rows: [
          ["<code>torch.compile(model)</code> (2.0+)", "TorchDynamo captures Python bytecode into FX graphs; TorchInductor generates fused Triton (GPU) / C++ (CPU) kernels. Falls back to eager on graph breaks.", "Speeding up training/inference while staying in Python"],
          ["TorchScript (<code>torch.jit.trace</code> / <code>script</code>)", "Records (trace) or compiles (script) to a static IR runnable from C++ (LibTorch) without Python", "Legacy deployments; maintenance mode — new work should use <code>torch.export</code>"],
          ["<code>torch.export.export</code> (2.1+)", "Sound, full-graph capture to an <code>ExportedProgram</code>, no graph breaks allowed", "Ahead-of-time deployment: AOTInductor, ExecuTorch (mobile/edge)"],
          ["ONNX (<code>torch.onnx.export</code>)", "Converts to the ONNX format", "ONNX Runtime, TensorRT, cross-framework serving"]
        ] } },
        { code: `model = MyModel().to("cuda")
compiled = torch.compile(model)              # first call is slow (compilation), then fast
# compiled = torch.compile(model, mode="max-autotune")   # longer compile, faster kernels
for xb, yb in loader:
    loss = loss_fn(compiled(xb), yb)        # same training loop as eager
    ...
# graph breaks: print(), .item(), data-dependent Python control flow, unsupported libs
# inspect with: TORCH_LOGS="graph_breaks" python train.py`, lang: "python", run: false, title: "torch.compile (needs a compiler toolchain / GPU)" },
        { code: `import torch, torch.nn as nn
torch.manual_seed(0)

class Gate(nn.Module):
    def __init__(self):
        super().__init__()
        self.lin = nn.Linear(4, 2)
    def forward(self, x):
        if x.sum() > 0:                   # data-dependent control flow
            return self.lin(x)
        return -self.lin(x)

m = Gate().eval()
pos, neg = torch.ones(1, 4), -torch.ones(1, 4)

import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")       # tracer warns about the 'if'
    traced = torch.jit.trace(m, pos)      # records only the path taken for 'pos'
scripted = torch.jit.script(m)            # compiles the real control flow
print("eager   :", m(neg).tolist())
print("traced  :", traced(neg).tolist(), "<- wrong branch baked in")
print("scripted:", scripted(neg).tolist())

ep = torch.export.export(nn.Sequential(nn.Linear(4, 2), nn.ReLU()).eval(), (pos,))
print(type(ep).__name__, ep.module()(pos).shape)`, lang: "python", title: "Tracing pitfall vs scripting, and torch.export" },
        { code: `eager   : [[-0.4706416726112366, 0.19573336839675903]]
traced  : [[0.4706416726112366, -0.19573336839675903]] <- wrong branch baked in
scripted: [[-0.4706416726112366, 0.19573336839675903]]
ExportedProgram torch.Size([1, 2])`, lang: "text", title: "Output" },
        { ul: [
          "Deployment checklist: <code>model.eval()</code>, <code>torch.inference_mode()</code>, fixed preprocessing identical to training, batch requests, consider quantisation / half precision, export (torch.export / ONNX) for a non-Python runtime.",
          "Serving options: a FastAPI service loading the model once at start-up, TorchServe, NVIDIA Triton, ONNX Runtime — see <a href=\"#/core/ai/model-deployment-serving\">model deployment &amp; serving</a>."
        ] },
        { warn: "<code>torch.jit.trace</code> silently bakes in the branch taken for the example input (shown above) and the shapes of Python-side logic. If the model has data-dependent control flow, tracing gives wrong answers without an error." },
        { tip: "Interview framing: 'PyTorch 2.x keeps eager-mode ergonomics and adds compilation as an opt-in: <code>torch.compile</code> for speed, <code>torch.export</code> for deployment.' That shows you know the current story, not the 2019 one." }
      ]
    },

    /* ───────────── Debugging & Ecosystem ───────────── */
    {
      id: "common-pytorch-errors",
      q: "What are the most common PyTorch errors you have hit, and how do you fix them?",
      topic: "Debugging & Ecosystem",
      level: 2,
      top: true,
      short: "The usual suspects: shape mismatches such as 'mat1 and mat2 shapes cannot be multiplied' after a wrong flatten size; device mismatches with the model on cuda and the batch on cpu; dtype errors like float64 inputs from NumPy or float targets for CrossEntropyLoss, which needs long indices; forgetting zero_grad; backward through a graph twice; calling numpy on a tensor that requires grad; and CUDA out of memory from storing loss tensors. Fix by reading the shapes in the message, printing shape, dtype and device, and adding asserts.",
      a: [
        { code: `import torch, torch.nn as nn
torch.manual_seed(0)

def show(fn):
    try:
        fn()
    except Exception as e:
        print(type(e).__name__ + ":", str(e).splitlines()[0][:85])

conv = nn.Sequential(nn.Conv2d(3, 8, 3), nn.Flatten(), nn.Linear(8 * 32 * 32, 10))
x = torch.randn(2, 3, 32, 32)
show(lambda: conv(x))                         # 3x3 conv w/o padding -> 30x30, not 32x32

lin = nn.Linear(4, 2)
show(lambda: lin(torch.ones(2, 4, dtype=torch.float64)))     # NumPy-style float64 input
show(lambda: nn.CrossEntropyLoss()(torch.randn(3, 5), torch.tensor([1.0, 0.0, 4.0])))
show(lambda: lin(torch.ones(4)).numpy())      # tensor that requires grad
show(lambda: nn.BatchNorm1d(4).train()(torch.ones(1, 4)))    # batch of 1 in train mode
show(lambda: torch.randn(2, 3) @ torch.randn(2, 3))

feat = nn.Sequential(nn.Conv2d(3, 8, 3), nn.Flatten())
print("fix: compute in_features ->", feat(torch.zeros(1, 3, 32, 32)).shape[1])
lazy = nn.Sequential(nn.Conv2d(3, 8, 3), nn.Flatten(), nn.LazyLinear(10))   # infers it
print(lazy(x).shape)`, lang: "python", title: "Reproducing the classics" },
        { code: `RuntimeError: mat1 and mat2 shapes cannot be multiplied (2x7200 and 8192x10)
RuntimeError: mat1 and mat2 must have the same dtype, but got Double and Float
RuntimeError: expected scalar type Long but found Float
RuntimeError: Can't call numpy() on Tensor that requires grad. Use tensor.detach().numpy() instead.
ValueError: Expected more than 1 value per channel when training, got input size torch.Size([1, 4
RuntimeError: mat1 and mat2 shapes cannot be multiplied (2x3 and 2x3)
fix: compute in_features -> 7200
torch.Size([2, 10])`, lang: "text", title: "Output" },
        { table: { head: ["Error message (abridged)", "Cause", "Fix"], rows: [
          ["<code>mat1 and mat2 shapes cannot be multiplied (2x7200 and 8192x10)</code>", "Wrong <code>in_features</code> after conv/flatten", "Compute it with a dummy forward or use <code>nn.LazyLinear</code>"],
          ["<code>Expected all tensors to be on the same device</code>", "Model on GPU, data (or a new tensor in forward) on CPU", "<code>.to(device)</code> every batch; create tensors with <code>device=x.device</code>"],
          ["<code>mat1 and mat2 must have the same dtype, but got Double and Float</code>", "float64 from NumPy", "<code>.float()</code> / <code>torch.from_numpy(a).float()</code>"],
          ["<code>expected scalar type Long</code> / 'Float' for targets", "Wrong target dtype for the loss", "CE: <code>long</code> indices; BCE: <code>float</code>, same shape"],
          ["<code>Trying to backward through the graph a second time</code>", "Reusing a graph (e.g. a hidden state carried across batches)", "<code>hidden = hidden.detach()</code> between batches; <code>retain_graph=True</code> only if truly needed"],
          ["<code>CUDA out of memory</code>", "Batch too big, keeping graphs alive (<code>losses.append(loss)</code>), eval without <code>no_grad</code>", "<code>loss.item()</code>, <code>no_grad</code>, smaller batch, AMP, accumulation"],
          ["Loss not decreasing, no error", "Missing <code>zero_grad</code>, softmax before CE, LR too high/low, forgot <code>model.train()</code>, optimizer created before params moved/unfrozen", "Overfit a single batch first"]
        ] } },
        { tip: "The single best debugging habit to describe: <b>overfit one small batch</b>. If the model can't drive the loss near zero on 8 samples, the bug is in the code (shapes, loss, labels, zero_grad), not in hyperparameters." }
      ]
    },
    {
      id: "debugging-nan-loss",
      q: "Your training loss suddenly becomes NaN. How do you debug it in PyTorch?",
      topic: "Debugging & Ecosystem",
      level: 3,
      top: true,
      short: "First locate where NaN or inf appears: check the batch and labels with torch.isfinite, then the loss, then the gradients, and use torch.autograd.set_detect_anomaly to find the forward op whose backward produced NaN. Common causes: a learning rate too high causing exploding gradients, log of zero or division by zero in custom code, separate softmax and log instead of fused losses, bad input data, and fp16 overflow. Fixes: lower LR or warmup, gradient clipping, epsilons and clamping, stable fused losses, bf16 or GradScaler.",
      a: [
        { h: "A systematic procedure" },
        { ol: [
          "<b>Data</b>: <code>assert torch.isfinite(xb).all()</code> and check label ranges (a label ≥ num_classes crashes on GPU with a cryptic 'device-side assert').",
          "<b>Forward</b>: find the first layer whose output is non-finite (forward hooks, below).",
          "<b>Backward</b>: <code>torch.autograd.set_detect_anomaly(True)</code> — when a backward op returns NaN it raises and prints the traceback of the forward op that created it. Slow; debugging only.",
          "<b>Gradients</b>: log the global grad norm each step (<code>clip_grad_norm_</code> returns it). A norm climbing to 1e4+ before the NaN means exploding gradients.",
          "<b>Reproduce</b>: save the offending batch and the checkpoint just before; re-run deterministically."
        ] },
        { code: `import torch, torch.nn as nn
torch.manual_seed(0)

# 1) unstable maths: log(0) and 0/0
p = torch.tensor([0.0, 0.5], requires_grad=True)
loss = -(torch.log(p)).mean()
print("log(0) loss:", loss.item())
eps = 1e-8
print("clamped:", (-(torch.log(p.clamp_min(eps))).mean()).item())

x = torch.zeros(3, requires_grad=True)
torch.sqrt(x).sum().backward()                    # d sqrt(x) at 0 = inf
print("sqrt grad at 0:", x.grad)
torch.autograd.set_detect_anomaly(True)
try:
    y = torch.zeros(1, requires_grad=True)
    (torch.sqrt(y) * 0).sum().backward()          # 0 * inf = NaN in backward
except RuntimeError as e:
    print("anomaly:", str(e)[:70], "...")
torch.autograd.set_detect_anomaly(False)

# 2) find the first non-finite activation with forward hooks
model = nn.Sequential(nn.Linear(4, 4), nn.ReLU(), nn.Linear(4, 1))
def check(name):
    def hook(mod, inp, out):
        if not torch.isfinite(out).all():
            raise FloatingPointError(f"first non-finite output at layer {name} ({type(mod).__name__})")
    return hook
for name, m in model.named_children():
    m.register_forward_hook(check(name))
with torch.no_grad():
    model[0].weight[0, 0] = float("inf")          # simulate a blown-up weight
try:
    model(torch.ones(1, 4))
except FloatingPointError as e:
    print(e)

# 3) exploding gradients: monitor and clip
model = nn.Linear(4, 1)
loss = (model(torch.full((8, 4), 1e3)) ** 2).mean()
loss.backward()
norm = nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
after = torch.norm(torch.stack([p.grad.norm() for p in model.parameters()]))
print(f"grad norm before clip {norm:.0f}, after {after:.2f}")`, lang: "python", title: "Locating NaN/inf" },
        { code: `log(0) loss: inf
clamped: 9.556914329528809
sqrt grad at 0: tensor([inf, inf, inf])
anomaly: Function 'SqrtBackward0' returned nan values in its 0th output. ...
first non-finite output at layer 0 (Linear)
grad norm before clip 1092342, after 1.00`, lang: "text", title: "Output" },
        { table: { head: ["Cause", "Fix"], rows: [
          ["LR too high, exploding gradients", "Lower LR, warmup, <code>clip_grad_norm_</code>, normalisation layers"],
          ["<code>log(0)</code>, <code>x/0</code>, <code>sqrt(0)</code> grads in custom code", "<code>clamp_min(eps)</code>, add eps, <code>torch.where</code> guards"],
          ["Separate softmax + log / sigmoid + BCE", "<code>CrossEntropyLoss</code>, <code>log_softmax</code>, <code>BCEWithLogitsLoss</code>"],
          ["NaN/inf or unnormalised inputs, bad labels", "Validate data; normalise; check label range"],
          ["fp16 overflow under AMP", "<code>GradScaler</code>, bf16, or run that op in fp32"],
          ["Division by tiny variance (custom norm)", "eps in the denominator (as BatchNorm/LayerNorm do)"]
        ] } },
        { tip: "Background on why gradients explode or vanish: <a href=\"#/core/ai/vanishing-exploding-gradients\">vanishing &amp; exploding gradients</a>. In the interview, lead with the procedure (data → forward → backward → grads) — the structure matters more than listing every cause." }
      ]
    },
    {
      id: "pytorch-vs-tensorflow",
      q: "PyTorch vs TensorFlow: what are the differences, and why did you choose PyTorch?",
      topic: "Debugging & Ecosystem",
      level: 1,
      top: true,
      short: "Both are mature deep-learning frameworks with GPU tensors, autograd and deployment tooling. PyTorch is eager by default with a Pythonic, define-by-run API that is easy to debug with normal Python tools, and it dominates research and the open-source LLM ecosystem through Hugging Face; PyTorch 2 adds torch.compile for speed. TensorFlow 2 is also eager by default with Keras as the high-level API and tf.function for graphs, and it has strong production and edge tooling such as TF Serving, TFLite (now LiteRT) and TF.js. Keras 3 can run on either backend. For new projects most teams pick PyTorch.",
      a: [
        { table: { head: ["", "PyTorch", "TensorFlow 2 / Keras"], rows: [
          ["Execution", "Eager (define-by-run); <code>torch.compile</code> for graphs", "Eager by default; <code>@tf.function</code> traces to graphs"],
          ["API style", "Pythonic classes (<code>nn.Module</code>), explicit training loop", "High-level <code>model.fit()</code> via Keras; custom loops with <code>GradientTape</code>"],
          ["Debugging", "Plain Python debugger, prints anywhere", "Easy in eager; harder inside <code>tf.function</code> graphs"],
          ["Research / LLMs", "Dominant (most papers, Hugging Face models, vLLM, Llama)", "Smaller share; JAX is Google's research favourite"],
          ["Deployment", "torch.export, ExecuTorch, TorchServe, ONNX, Triton", "TF Serving, TFLite/LiteRT (mobile), TF.js, SavedModel"],
          ["Distributed", "DDP, FSDP, <code>torchrun</code>", "<code>tf.distribute</code> strategies; TPUs first-class"],
          ["Governance", "PyTorch Foundation (Linux Foundation)", "Google"]
        ] } },
        { code: [
          { lang: "python", src: `import torch, torch.nn as nn
torch.manual_seed(0)
X = torch.randn(64, 3); y = X @ torch.tensor([[1.0], [-2.0], [0.5]])
model = nn.Linear(3, 1)
opt = torch.optim.SGD(model.parameters(), lr=0.1)
for _ in range(100):                     # explicit loop: you own every step
    loss = nn.functional.mse_loss(model(X), y)
    opt.zero_grad(); loss.backward(); opt.step()
print("PyTorch weights:", [round(w, 2) for w in model.weight.flatten().tolist()])` },
          { lang: "python", run: false, src: `import tensorflow as tf
tf.random.set_seed(0)
X = tf.random.normal((64, 3)); y = X @ tf.constant([[1.0], [-2.0], [0.5]])
model = tf.keras.Sequential([tf.keras.Input((3,)), tf.keras.layers.Dense(1)])
model.compile(optimizer=tf.keras.optimizers.SGD(0.1), loss="mse")
model.fit(X, y, epochs=100, batch_size=64, verbose=0)   # loop hidden in fit()
print("TF weights:", model.layers[0].kernel.numpy().flatten().round(2))` }
        ], title: "Same linear regression in both" },
        { code: `PyTorch weights: [1.0, -2.0, 0.5]`, lang: "text", title: "Output (PyTorch tab)" },
        { ul: [
          "Why PyTorch (a good personal answer): readable code that is just Python, easy debugging, most reference implementations and pretrained models (Hugging Face, timm) are PyTorch-first, and skills transfer directly to LLM fine-tuning.",
          "When TensorFlow makes sense: an existing TF production stack, TPU-heavy training, or on-device/browser targets with TFLite/TF.js.",
          "The concepts (tensors, autograd, optimizers, layers) are the same, so switching costs days, not months."
        ] },
        { tip: "Avoid framework-war answers. Say what you used, why it fit the project, and that you could pick up the other quickly — then mention Keras 3 running on a PyTorch or JAX backend to show you're current." }
      ]
    }
  ]
});
