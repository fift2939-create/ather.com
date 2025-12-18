document.addEventListener('DOMContentLoaded', () => {
    const GEMINI_API_KEY = "AIzaSyCj0oDJV0MljYh1Y-NDTyur0Utvz7UPxeo";
    const ATHAR_BRIDGE_URL = "https://script.google.com/macros/s/AKfycbwtgqXb5Tpfu4wAeLH5VR9WKghwG2PcCfo3KoyWv1gpDpN9uIgs5XSocmGTyqp_IIFh/exec";

    const state = { step: 1, projectInfo: {}, analysis: null, selectedIdea: null, proposal: null };

    const logStatus = (status, details = "") => {
        const logo = document.querySelector('.logo-slogan');
        if (!logo) return;
        let el = document.getElementById('debug-status');
        if (!el) { el = document.createElement('div'); el.id = 'debug-status'; el.style.fontSize = '0.7rem'; logo.parentElement.appendChild(el); }
        const colors = { loading: '#f59e0b', ok: '#10b981', err: '#f43f5e' };
        el.style.color = colors[status] || '#fff';
        el.innerText = `● AI State: ${status} ${details}`;
    };

    const AIGateway = {
        async call(prompt) {
            logStatus('loading', '(Trying Bridge...)');
            // Try Bridge
            const bridgeRes = await this.request(ATHAR_BRIDGE_URL + "?key=" + GEMINI_API_KEY, prompt);
            if (bridgeRes.ok) { logStatus('ok', '(via Bridge)'); return bridgeRes.data; }

            logStatus('loading', '(Bridge failed, trying Direct...)');
            // Try Direct
            const directRes = await this.request(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, prompt);
            if (directRes.ok) { logStatus('ok', '(Direct)'); return directRes.data; }

            logStatus('err', `(Error: ${bridgeRes.error || directRes.error})`);
            alert(`⚠️ عائق تقني: ${bridgeRes.error || directRes.error}\nيرجى التأكد من نشر الجسر كـ Anyone.`);
            return null;
        },
        async request(url, prompt) {
            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                const data = await res.json();
                if (res.ok && !data.error) return { ok: true, data: data.candidates[0].content.parts[0].text };
                return { ok: false, error: data.error?.message || `Status ${res.status}` };
            } catch (e) { return { ok: false, error: "Network/CORS Block" }; }
        }
    };

    // UI Logic
    const goToStep = (n) => {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`step${n}`).classList.add('active');
        if (n > 1) document.querySelector('.hero-section')?.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.getElementById('analyzeBtn').onclick = async () => {
        const idea = document.getElementById('projectIdea').value;
        if (!idea) return;
        document.getElementById('analyzeBtn').innerText = 'جاري المعالجة...';
        const res = await AIGateway.call(`تحليل فكرة مشروع إنساني: ${idea}. الرد JSON: { "sector": "..", "summary": ".." }`);
        if (res) {
            const data = JSON.parse(res.match(/\{[\s\S]*\}/)[0]);
            state.analysis = data;
            document.getElementById('analysisResult').innerHTML = `<div class="glass-card" style="padding:20px;"><h3>${data.sector}</h3><p>${data.summary}</p><button id="nextBtn" class="btn btn-primary" style="width:100%; margin-top:10px;">استمرار ✨</button></div>`;
            document.getElementById('analysisResult').style.display = 'block';
            document.getElementById('nextBtn').onclick = () => { generateIdeas(); goToStep(2); };
        }
        document.getElementById('analyzeBtn').innerText = 'تحليل الفكرة ⚡';
    };

    async function generateIdeas() {
        document.getElementById('ideasGrid').innerHTML = 'جاري الابتكار...';
        const res = await AIGateway.call(`اقترح 3 مشاريع لمجال ${state.analysis.sector}. الرد JSON مصفوفة: [ {"name":"..", "description":".."} ]`);
        if (res) {
            const data = JSON.parse(res.match(/\[[\s\S]*\]/)[0]);
            const grid = document.getElementById('ideasGrid');
            grid.innerHTML = '';
            data.forEach(idea => {
                const card = document.createElement('div'); card.className = 'glass-card'; card.style.padding = '15px';
                card.innerHTML = `<h4>${idea.name}</h4><p>${idea.description}</p>`;
                card.onclick = () => { state.selectedIdea = idea; document.getElementById('generateProposalBtn').disabled = false; };
                grid.appendChild(card);
            });
        }
    }

    document.getElementById('generateProposalBtn').onclick = async () => {
        goToStep(3);
        document.getElementById('proposalContent').innerHTML = 'جاري الكتابة...';
        const res = await AIGateway.call(`اكتب مقترحاً لـ ${state.selectedIdea.name}. الرد JSON: {"العنوان":"..", "بيان المشكلة":"..", "الأهداف":".."}`);
        if (res) {
            const data = JSON.parse(res.match(/\{[\s\S]*\}/)[0]);
            const content = document.getElementById('proposalContent');
            content.innerHTML = '';
            for (let k in data) content.innerHTML += `<h5>${k}</h5><p>${data[k]}</p>`;
        }
    };

    document.getElementById('goToBudgetBtn').onclick = () => goToStep(4);
    logStatus('ok', '(Ready)');
});
