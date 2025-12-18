document.addEventListener('DOMContentLoaded', () => {
    // المفاتيح والروابط
    const GEMINI_API_KEY = "AIzaSyCj0oDJV0MljYh1Y-NDTyur0Utvz7UPxeo";
    const ATHAR_BRIDGE_URL = "https://script.google.com/macros/s/AKfycby-u7aC8RJMhrV3-u4RkQg93ola_M4b64tKg3ET0tRCdiCLacLmuqaeL82OAeu_o0wA/exec";

    const state = { step: 1, projectInfo: {}, analysis: null, selectedIdea: null, proposal: null };

    // مؤشر الحالة الذكي
    const logStatus = (status, details = "") => {
        const logo = document.querySelector('.logo-slogan');
        if (!logo) return;
        let el = document.getElementById('debug-status');
        if (!el) { el = document.createElement('div'); el.id = 'debug-status'; el.style.fontSize = '0.7rem'; el.style.marginTop = '5px'; logo.parentElement.appendChild(el); }
        const colors = { loading: '#f59e0b', ok: '#10b981', err: '#f43f5e' };
        el.style.color = colors[status] || '#fff';
        el.innerHTML = `<span style="width:7px; height:7px; border-radius:50%; background:${colors[status]}; display:inline-block; animation: pulse 1s infinite;"></span> AI Connectivity: ${status} ${details}`;
    };

    const AIGateway = {
        async call(prompt) {
            logStatus('loading', '(Mapping Paths...)');

            // المحاولة 1: الجسر السحابي (لتجاوز الحظر الجغرافي)
            try {
                const bridgeRes = await fetch(ATHAR_BRIDGE_URL + "?key=" + GEMINI_API_KEY, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                if (bridgeRes.ok) {
                    const data = await bridgeRes.json();
                    if (data.candidates) {
                        logStatus('ok', '(Global Bridge)');
                        return data.candidates[0].content.parts[0].text;
                    }
                }
            } catch (e) { console.log("Bridge failed, moving to direct..."); }

            // المحاولة 2: الاتصال المباشر (إذا كان الـ VPN يعمل)
            try {
                const directRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                if (directRes.ok) {
                    const data = await directRes.json();
                    logStatus('ok', '(Direct AI Path)');
                    return data.candidates[0].content.parts[0].text;
                }
            } catch (e) {
                logStatus('err', '(Network Blocked)');
                alert("🚨 عائق في الاتصال:\n\n1. يرجى إيقاف مانع الإعلانات (AdBlock).\n2. تأكد من تشغيل الـ VPN في حال كنت في منطقة محظورة.\n3. تأكد من تحديث الصفحة (Ctrl + F5).");
                return null;
            }
            return null;
        }
    };

    // منطق التنقل والواجهة
    const goToStep = (n) => {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`step${n}`).classList.add('active');
        if (n > 1) document.querySelector('.hero-section')?.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.getElementById('analyzeBtn').onclick = async () => {
        const idea = document.getElementById('projectIdea').value;
        if (!idea) return alert("يرجى إدخال فكرة المشروع");

        document.getElementById('analyzeBtn').innerText = 'جاري التحليل...';
        const res = await AIGateway.call(`حلل فكرة مشروع إنساني: ${idea}. الرد JSON: { "sector": "..", "summary": ".." }`);

        if (res) {
            try {
                const data = JSON.parse(res.match(/\{[\s\S]*\}/)[0]);
                state.analysis = data;
                const area = document.getElementById('analysisResult');
                area.innerHTML = `<div class="glass-card" style="padding:20px; border:1px solid var(--accent);"><h3>${data.sector}</h3><p>${data.summary}</p><button id="nextBtn" class="btn btn-primary" style="width:100%; margin-top:10px;">استمرار نحو الخطط ✨</button></div>`;
                area.style.display = 'block';
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
        const res = await AIGateway.call(`اكتب مقترحاً لـ ${state.selectedIdea.name}. الرد JSON: {"العنوان":"..", "الأهداف":".."}`);
        if (res) {
            const data = JSON.parse(res.match(/\{[\s\S]*\}/)[0]);
            const content = document.getElementById('proposalContent'); content.innerHTML = '';
            for (let k in data) content.innerHTML += `<h5>${k}</h5><p>${data[k]}</p>`;
        }
    };

    document.getElementById('goToBudgetBtn').onclick = () => goToStep(4);
    logStatus('ok', '(System Ready)');
});
