document.addEventListener('DOMContentLoaded', () => {
    // API KEY
    const GEMINI_API_KEY = "AIzaSyCj0oDJV0MljYh1Y-NDTyur0Utvz7UPxeo";

    // YOUR SMART BRIDGE URL
    const ATHAR_BRIDGE_URL = "https://script.google.com/macros/s/AKfycbyKczMPQUbG4x79fS3wbfC48nyHlJL80j8a1DOpX5FM_to4DfGbkQSGahJUSEmd7RCv/exec";

    const state = {
        step: 1,
        projectInfo: { idea: '', country: '', language: 'ar', currency: 'USD' },
        analysis: null, selectedIdea: null, proposal: null, budget: []
    };

    // UI Feedback Helper
    const showAIStatus = (status, msg = "") => {
        const logoSlogan = document.querySelector('.logo-slogan');
        if (!logoSlogan) return;
        let el = document.getElementById('ai-pulse');
        if (!el) {
            el = document.createElement('div'); el.id = 'ai-pulse'; el.style.fontSize = '0.7rem'; el.style.marginTop = '5px';
            logoSlogan.parentElement.appendChild(el);
        }
        const colors = { loading: '#f59e0b', ok: '#10b981', err: '#f43f5e' };
        const label = status === 'loading' ? 'جاري الاتصال السحابي...' : (status === 'ok' ? 'متصل وآمن ✅' : 'عائق في الشبكة ⚠️');
        el.style.color = colors[status];
        el.innerHTML = `<span style="width:7px; height:7px; border-radius:50%; background:${colors[status]}; display:inline-block; animation: pulse 1s infinite;"></span> ${label} ${msg}`;
    };

    // AI Gateway - The Resilience Core
    const AIGateway = {
        async call(prompt) {
            showAIStatus('loading');

            // 1. Try BRIDGE first (Bypasses all blocks)
            if (ATHAR_BRIDGE_URL) {
                const res = await this.request('bridge', prompt);
                if (res) { showAIStatus('ok', '(Global)'); return res; }
            }

            // 2. Try DIRECT Backup (Only stable paths)
            const backupPaths = [
                { v: 'v1', m: 'gemini-1.5-flash' },
                { v: 'v1beta', m: 'gemini-1.5-flash' }
            ];

            for (const path of backupPaths) {
                const res = await this.request(path, prompt);
                if (res) { showAIStatus('ok', '(Local)'); return res; }
            }

            showAIStatus('err');
            alert("⚠️ عائق شبكة حرج. يرجى التأكد من تشغيل الجسر أو الـ VPN.");
            return null;
        },

        async request(target, prompt) {
            let url = (target === 'bridge')
                ? `${ATHAR_BRIDGE_URL}?key=${GEMINI_API_KEY}`
                : `https://generativelanguage.googleapis.com/${target.v}/models/${target.m}:generateContent?key=${GEMINI_API_KEY}`;

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                if (response.ok) {
                    const data = await response.json();
                    return data.candidates?.[0]?.content?.parts?.[0]?.text || data.reply || null;
                }
                return null;
            } catch (e) { return null; }
        }
    };

    // Navigation & UI Logic
    const goToStep = (n) => {
        state.step = n;
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`step${n}`).classList.add('active');
        document.querySelectorAll('.step').forEach(s => {
            const sn = parseInt(s.dataset.step);
            s.classList.toggle('active', sn === n);
            s.classList.toggle('completed', sn < n);
        });
        if (n > 1) document.querySelector('.hero-section')?.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.querySelectorAll('.prevStep').forEach(b => b.onclick = () => goToStep(state.step - 1));

    // Module 1: Analysis
    document.getElementById('analyzeBtn').onclick = async () => {
        const idea = document.getElementById('projectIdea').value;
        if (!idea) return alert('يرجى وصف فكرة المشروع أولاً');

        document.getElementById('analyzeBtn').innerText = 'جاري التحليل الذكي...';
        const prompt = `حلل بدقة كخبير تنموي فكرة: "${idea}". الرد JSON: { "sector": "..", "summary": "..", "target": "..", "challenges": ".." }`;
        const res = await AIGateway.call(prompt);

        try {
            const data = JSON.parse(res.match(/\{[\s\S]*\}/)[0]);
            state.analysis = data;
            const resArea = document.getElementById('analysisResult');
            resArea.innerHTML = `
                <div class="glass-card" style="padding:20px; border:1px solid var(--accent); animation: fadeIn 0.5s;">
                    <h3 style="color:var(--primary)">${data.sector}</h3>
                    <p style="line-height:1.7">${data.summary}</p>
                    <button id="nextToIdeas" class="btn btn-primary" style="margin-top:15px; width:100%">عرض المقترحات والأفكار المتوفرة ✨</button>
                </div>`;
            resArea.style.display = 'block';
            document.getElementById('nextToIdeas').onclick = () => { generateIdeas(); goToStep(2); };
        } catch (e) { alert("حدث خطأ في معالجة البيانات، يرجى المحاولة مرة أخرى."); }

        document.getElementById('analyzeBtn').innerText = 'تحليل الفكرة ⚡';
    };

    // Module 2: Ideas
    async function generateIdeas() {
        document.getElementById('ideasGrid').innerHTML = '<div style="text-align:center; padding:40px;">جاري ابتكار مشاريع بديلة...</div>';
        const prompt = `على ضوء التحليل: ${JSON.stringify(state.analysis)}، ولد 3 مشاريع إنسانية. الرد JSON: [ { "name": "..", "description": "..", "goal": ".." } ]`;
        const res = await AIGateway.call(prompt);
        try {
            const data = JSON.parse(res.match(/\[[\s\S]*\]/)[0]);
            const grid = document.getElementById('ideasGrid');
            grid.innerHTML = '';
            data.forEach(idea => {
                const card = document.createElement('div'); card.className = 'glass-card idea-card'; card.style.padding = '20px';
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

    // Module 3: Proposal
    document.getElementById('generateProposalBtn').onclick = async () => {
        document.getElementById('proposalContent').innerHTML = '<div style="text-align:center; padding:40px;">جاري صياغة مقترح احترافي للمانحين...</div>';
        goToStep(3);
        const prompt = `اكتب مقترحاً كاملاً لـ "${state.selectedIdea.name}". الرد JSON حصراً بأقسام: { "العنوان": "نص مفصل..." }`;
        const res = await AIGateway.call(prompt);
        try {
            const data = JSON.parse(res.match(/\{[\s\S]*\}/)[0]);
            state.proposal = data;
            const content = document.getElementById('proposalContent');
            content.innerHTML = '';
            for (let k in data) {
                content.innerHTML += `<div style="margin-bottom:25px"><h5 style="color:var(--primary); font-weight:bold; border-right:3px solid var(--primary); padding-right:10px">${k}</h5><p style="text-align:justify; line-height:1.8">${data[k]}</p></div>`;
            }
        } catch (e) { console.error(e); }
    };

    // Module 4: Budget
    document.getElementById('goToBudgetBtn').onclick = async () => {
        document.getElementById('budgetBody').innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">جاري بناء الميزانية التقديرية...</td></tr>';
        goToStep(4);
        const prompt = `صمم ميزانية لمشروع "${state.selectedIdea.name}". الرد JSON مصفوفة: [ { "name": "فئة", "items": [{"item":"بند","qty":1,"price":100,"unit":".."}] } ]`;
        const res = await AIGateway.call(prompt);
        try {
            const data = JSON.parse(res.match(/\[[\s\S]*\]/)[0]);
            const body = document.getElementById('budgetBody');
            body.innerHTML = ''; let total = 0;
            data.forEach(cat => {
                cat.items.forEach(i => {
                    total += (i.qty * i.price);
                    body.innerHTML += `<tr><td>${i.item}</td><td>${i.item}</td><td>${i.qty}</td><td>${i.unit || 'نصيب'}</td><td>${i.price}</td><td>${(i.qty * i.price).toLocaleString()}</td></tr>`;
                });
            });
            document.getElementById('grandTotal').innerText = total.toLocaleString() + " USD";
        } catch (e) { console.error(e); }
    };

    // Final Preview
    document.getElementById('goToExportBtn').onclick = () => {
        let h = `<h2 style="text-align:center; color:var(--primary)">${state.selectedIdea.name}</h2><hr opacity="0.1">`;
        for (let k in state.proposal) h += `<h4>${k}</h4><p style="text-align:justify">${state.proposal[k]}</p>`;
        document.getElementById('finalPreview').innerHTML = h;
        goToStep(5);
    };

    showAIStatus('ok');
});
