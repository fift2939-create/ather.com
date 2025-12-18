document.addEventListener('DOMContentLoaded', () => {
    const GEMINI_API_KEY = "AIzaSyCj0oDJV0MljYh1Y-NDTyur0Utvz7UPxeo";
    const ATHAR_BRIDGE_URL = "https://script.google.com/macros/s/AKfycby-u7aC8RJMhrV3-u4RkQg93ola_M4b64tKg3ET0tRCdiCLacLmuqaeL82OAeu_o0wA/exec";

    const state = { step: 1, projectInfo: {}, analysis: null, selectedIdea: null, proposal: null };

    const logStatus = (status, details = "") => {
        const logo = document.querySelector('.logo-slogan');
        if (!logo) return;
        let el = document.getElementById('debug-status');
        if (!el) { el = document.createElement('div'); el.id = 'debug-status'; el.style.fontSize = '0.7rem'; logo.parentElement.appendChild(el); }
        const colors = { loading: '#f59e0b', ok: '#10b981', err: '#f43f5e' };
        el.style.color = colors[status] || '#fff';
        el.innerText = `● AI Connectivity: ${status} ${details}`;
    };

    const AIGateway = {
        async call(prompt) {
            logStatus('loading', '(Bridge Link Activated)');

            // Bypass CORS Preflight using text/plain (Simple Request)
            try {
                const response = await fetch(ATHAR_BRIDGE_URL + "?key=" + GEMINI_API_KEY, {
                    method: "POST",
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: { "Content-Type": "text/plain" }, // Hidden trick to avoid CORS preflight blocking
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });

                const data = await response.json();

                if (response.ok && !data.error) {
                    logStatus('ok', '(Global Bridge Active)');
                    return data.candidates[0].content.parts[0].text;
                } else {
                    throw new Error(data.error?.message || "Bridge Response Error");
                }
            } catch (e) {
                logStatus('err', '(Network Obstacle)');
                alert(`⚠️ عائق في الاتصال: يرجى التأكد من نشر الجسر كـ (Anyone) وتفعيل الـ VPN إذا كنت في منطقة محظورة جداً.`);
                return null;
            }
        }
    };

    const goToStep = (n) => {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`step${n}`).classList.add('active');
        if (n > 1) document.querySelector('.hero-section')?.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.getElementById('analyzeBtn').onclick = async () => {
        const idea = document.getElementById('projectIdea').value;
        if (!idea) return;
        document.getElementById('analyzeBtn').innerText = 'جاري التحليل...';
        const res = await AIGateway.call(`حلل البدقة فكرة مشروع إنساني: ${idea}. الرد JSON: { "sector": "..", "summary": ".." }`);
        if (res) {
            try {
                const data = JSON.parse(res.match(/\{[\s\S]*\}/)[0]);
                state.analysis = data;
                document.getElementById('analysisResult').innerHTML = `
                    <div class="glass-card" style="padding:20px; border:1px solid var(--accent);">
                        <h3 style="color:var(--primary)">${data.sector}</h3>
                        <p>${data.summary}</p>
                        <button id="nextBtn" class="btn btn-primary" style="width:100%; margin-top:10px;">استمرار نحو الخطط ✨</button>
                    </div>`;
                document.getElementById('analysisResult').style.display = 'block';
                document.getElementById('nextBtn').onclick = () => { generateIdeas(); goToStep(2); };
            } catch (e) { alert("فشل في معالجة البيانات، يرجى المحاولة ثانية."); }
        }
        document.getElementById('analyzeBtn').innerText = 'تحليل الفكرة ⚡';
    };

    async function generateIdeas() {
        document.getElementById('ideasGrid').innerHTML = '<p style="text-align:center">جاري ابتكار مشاريع بديلة...</p>';
        const res = await AIGateway.call(`اقترح 3 مشاريع تنموية مبنية على: ${JSON.stringify(state.analysis)}. الرد JSON مصفوفة: [ {"name":"..", "description":".."} ]`);
        if (res) {
            try {
                const data = JSON.parse(res.match(/\[[\s\S]*\]/)[0]);
                const grid = document.getElementById('ideasGrid'); grid.innerHTML = '';
                data.forEach(idea => {
                    const card = document.createElement('div'); card.className = 'glass-card idea-card'; card.style.padding = '15px';
                    card.innerHTML = `<h4>${idea.name}</h4><p>${idea.description}</p>`;
                    card.onclick = () => {
                        document.querySelectorAll('.idea-card').forEach(c => c.style.borderColor = 'var(--glass-border)');
                        card.style.borderColor = 'var(--primary)'; state.selectedIdea = idea;
                        document.getElementById('generateProposalBtn').disabled = false;
                    };
                    grid.appendChild(card);
                });
            } catch (e) { console.error(e); }
        }
    }

    document.getElementById('generateProposalBtn').onclick = async () => {
        goToStep(3);
        document.getElementById('proposalContent').innerHTML = '<p style="text-align:center">جاري صياغة المقترح الكامل...</p>';
        const res = await AIGateway.call(`اكتب مقترحاً كاملاً لـ ${state.selectedIdea.name}. الرد مصفوفة JSON: {"العنوان":"..", "الأهداف":"..", "الأنشطة":".."}`);
        if (res) {
            try {
                const data = JSON.parse(res.match(/\{[\s\S]*\}/)[0]);
                const content = document.getElementById('proposalContent'); content.innerHTML = '';
                for (let k in data) content.innerHTML += `<div style="margin-bottom:20px"><h5 style="color:var(--primary)">${k}</h5><p>${data[k]}</p></div>`;
            } catch (e) { console.error(e); }
        }
    };

    document.getElementById('goToBudgetBtn').onclick = () => goToStep(4);
    logStatus('ok', '(Stable Connection Connected)');
});
