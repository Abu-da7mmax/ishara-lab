window.addEventListener('ishara-ready', () => {
  const arabic = document.documentElement.lang === 'ar';
  const t = (en, ar) => arabic ? ar : en;
  const button = document.createElement('button');
  button.textContent = t('⌕ Signal detective', '⌕ محقق الإشارات');
  document.querySelector('nav').append(button);
  const key = 'ishara-detective-v1';
  let completed = [];
  try { completed = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
  if (!Array.isArray(completed)) completed = [];
  let challenge = 0;
  const names = [t('Amplitude','السعة'),t('Frequency','التردد'),t('Phase','الطور')];
  const explanations = [
    t('The peak rises from 1 V to 2 V while the period stays at 0.5 s. Only amplitude changes.','ترتفع القمة من 1 إلى 2 فولت، بينما يبقى الزمن الدوري 0.5 ثانية. تغيرت السعة فقط.'),
    t('The second wave completes four cycles instead of two in one second. Frequency doubles and the period halves.','تكمل الموجة الثانية أربع دورات بدل دورتين في ثانية. تضاعف التردد وانخفض الزمن الدوري إلى النصف.'),
    t('The second wave starts at its positive peak instead of zero. Both waves have the same amplitude and frequency, with a 90° phase difference.','تبدأ الموجة الثانية من القمة الموجبة بدل الصفر. السعة والتردد متساويان، وفرق الطور 90 درجة.')
  ];
  let revealed = false;
  function draw() {
    const canvas = document.getElementById('detectivePlot');
    if (!canvas) return;
    const width = canvas.clientWidth;
    const height = 240;
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    const x = time => 35 + time * (width - 50);
    const y = value => 115 - value * 40;
    ctx.strokeStyle = '#52766a';
    ctx.fillStyle = '#c5d8cc';
    ctx.font = '11px Arial';
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();ctx.moveTo(x(i/4),15);ctx.lineTo(x(i/4),215);ctx.stroke();
      ctx.fillText(String(i/4),x(i/4)-5,233);
    }
    for (let value = -2; value <= 2; value++) {
      ctx.beginPath();ctx.moveTo(35,y(value));ctx.lineTo(width-15,y(value));ctx.stroke();
      ctx.fillText(String(value),10,y(value)+4);
    }
    for (let wave = 0; wave < 2; wave++) {
      ctx.strokeStyle = wave ? '#f5c677' : '#a9e38a';
      ctx.lineWidth = 2.5;
      ctx.setLineDash(wave ? [6,3] : []);
      ctx.beginPath();
      for (let i=0;i<=700;i++) {
        const time=i/700;
        const amplitude=wave && challenge===0 ? 2 : 1;
        const frequency=wave && challenge===1 ? 4 : 2;
        const phase=wave && challenge===2 ? Math.PI/2 : 0;
        const value=amplitude*Math.sin(2*Math.PI*frequency*time+phase);
        if(i===0)ctx.moveTo(x(time),y(value));else ctx.lineTo(x(time),y(value));
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    if(revealed){
      ctx.fillStyle='#ffffff';
      ctx.fillText(challenge===0?'A: 1 V → 2 V':challenge===1?'f: 2 Hz → 4 Hz':'φ: 0° → 90°',45,18);
    }
  }
  function render() {
    revealed=false;
    document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b===button));
    document.getElementById('app').innerHTML = `<section class="hero"><div><h1>${t('Signal detective','محقق الإشارات')}</h1><p>${t('Compare the reference and changed wave. Identify the one property that changed.','قارن الموجة المرجعية بالموجة المعدّلة، وحدد الخاصية الوحيدة التي تغيرت.')}</p></div></section><section class="card wide"><div class="actions">${names.map((_,i)=>`<button class="secondary" data-case="${i}">${t('Challenge','التحدي')} ${i+1} ${completed.includes(i)?'✓':''}</button>`).join('')}</div><h2 style="margin-top:22px">${t('What changed?','ما الذي تغير؟')}</h2><div class="wave"><small>${t('Voltage (V) · green solid: reference · yellow dashed: changed','الجهد (V) · أخضر متصل: المرجع · أصفر متقطع: المعدّلة')}</small><canvas id="detectivePlot" style="height:240px" aria-label="${t('Two sine waves compared over one second','مقارنة موجتين جيبيتين خلال ثانية')}"></canvas><small>Time (s)</small></div><div class="actions">${names.map((name,i)=>`<button class="primary" data-answer="${i}">${name}</button>`).join('')}</div><div id="detectiveFeedback" aria-live="polite"></div><p class="sub">${t('Completed challenges are saved in this browser.','تُحفظ التحديات المكتملة في هذا المتصفح.')}</p></section>`;
    document.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>{challenge=Number(b.dataset.case);render()});
    document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
      const correct=Number(b.dataset.answer)===challenge;
      revealed=correct;
      if(correct&&!completed.includes(challenge)){
        completed.push(challenge);
        try{localStorage.setItem(key,JSON.stringify(completed))}catch{}
      }
      const feedback=document.getElementById('detectiveFeedback');
      feedback.className='feedback'+(correct?'':' error');
      feedback.style.marginTop='18px';
      feedback.textContent=correct?'✓ '+explanations[challenge]:t('Try again. Compare peak height, cycle count and the value at time zero.','حاول مرة أخرى. قارن ارتفاع القمة وعدد الدورات والقيمة عند الزمن صفر.');
      document.querySelectorAll('[data-case]').forEach(b=>{const i=Number(b.dataset.case);b.textContent=t('Challenge','التحدي')+' '+(i+1)+(completed.includes(i)?' ✓':'')});
      draw();
    });
    draw();
  }
  button.onclick=render;
  window.addEventListener('resize',draw);
}, {once: true});
