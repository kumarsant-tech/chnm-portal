/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-hw2b.js
   हार्डवेयर गहराई : GPU व डिस्प्ले तकनीक · इनपुट/आउटपुट उपकरण व प्रिंटर
   (क्लाउड-डिस्ट्रीब्यूटेड फ़ाइल — किसी और फ़ाइल को छुआ नहीं गया)
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   हार्डवेयर गहराई · GPU व डिस्प्ले तकनीक
   =================================================================== */
{
  id: 'hw-gpu', icon: '🎨', group: 'हार्डवेयर गहराई',
  title: 'GPU व डिस्प्ले तकनीक',
  sub: 'SIMD आर्किटेक्चर, VRAM, रेल-ट्रेसिंग, ड्राइवर व मॉनिटर के सारे पैरामीटर',
  kicker: 'Hardware Depth 4 · GPU & Display',
  hero: 'ग्राफ़िक्स कार्ड की डीबग की दो परतें हैं — <b>(1) कार्ड क्या कर रहा है</b> (आर्किटेक्चर, VRAM, क्लॉक, पावर) और <b>(2) चित्र कैसा दिख रहा है</b> (पैनल, HDR, रिज़ॉल्यूशन, रिफ़्रेश, केबल)। यह अध्याय दोनों को पूरी गहराई से जोड़ता है, ताकि "गेम अटका", "स्क्रीन काली", "रंग फ़ीके" और "आर्टिफ़ैक्ट" — हर शिकायत का कारण आप अलग कर सकें।',
  tags: ['SIMD व शेडर पाइपलाइन', 'VRAM व बैंडविड्थ', 'RT/Tensor/Xe कोर', 'HDMI व DisplayPort', 'HDR व पैनल', 'ड्राइवर व TDR'],
  blocks: [
    { type: 'callout', kind: 'info', title: 'इस अध्याय के बाद आप यह कर पाएँगे', html: '<ol><li>बता पाएँगे कि GPU की ज़रूरत ही क्यों है — CPU SIMD काम में क्यों पिछड़ता है।</li><li>शेडर पाइपलाइन के हर चरण (vertex से output-merge तक) का काम और उसके ख़राब होने का लक्षण बता पाएँगे।</li><li>NVIDIA/AMD/Intel की पीढ़ी, RT व Tensor कोर, RDNA व Xe कोर पहचान पाएँगे।</li><li>कोई भी spec sheet पढ़कर असल ताक़त, बैंडविड्थ, पावर व कमज़ोरी निकाल पाएँगे।</li><li>upscaling, bottleneck, VRAM की सीमा व ड्राइवर (DDU, TDR) की समस्याएँ हल कर पाएँगे।</li><li>पैनल, HDR, रिज़ॉल्यूशन, रिफ़्रेश, Adaptive-Sync व HDMI/DP के पैरामीटर समझकर मॉनिटर चुन व जाँच पाएँगे।</li></ol>' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">1.1</span> GPU आख़िर ज़रूरी क्यों है? (Scalar CPU बनाम SIMD GPU)</h3>' +
      '<p>CPU <b>कम देरी (latency)</b> के लिए बना है: 4–16 बड़ी कोर, बहुत बड़ा कैश, out-of-order एग़्ीक्यूशन, ब्रांच प्रेडिक्शन — ताकि एक काम जितनी जल्दी मुमकिन हो ख़त्म हो। ग्राफ़िक्स का गणित उलटा है: एक मिलियन पॉलिगन व 2 मिलियन पिक्सेल पर <b>एक ही तरह का छोटा काम</b> बार-बार करना है, और एक पिक्सेल का देर से निकलना कोई भूल नहीं गिनी जाती। इसे <b>throughput</b> कहते हैं।</p>' +
      '<p><b>SIMD (Single Instruction, Multiple Data)</b> — एक निर्देश, कई डेटा। GPU में एक कोर-गुच्छ (NVIDIA में <b>SM</b>, AMD में <b>CU</b>, Intel में <b>Xe core</b>) एक साथ 32/64 लेन पर वही निर्देश चलाता है; इसे NVIDIA <b>warp</b> और AMD <b>wavefront</b> कहता है। सैकड़ों–हज़ारों लेन यानी एक घड़ी में एक निर्देश × हज़ारों डेटा।</p>' +
      '<p>दूसरा फ़र्क़ <b>मेमोरी</b> का: CPU सिस्टम रैम से काम लेता है (DDR5 ड्यूल-चैनल ≈ 60–90 GB/s), जबकि एक मिड-रेज कार्ड की VRAM 300–500 GB/s देती है — इसलिए भारी टेक्सचर GPU पर रहते हैं और CPU केवल "क्या दिखाना है" का आदेश भेजता है (draw call)।</p>' +
      '<p><b>नतीजा:</b> CPU पर 3D रेंडर करना = 10 महँगी कारों से पूरा शहर एक साथ ट्राफ़िक सिग्नल पर चलाना; GPU = हज़ारों बाइक, हर एक वही छोटा काम। इसीलिए CPU/GPU की तुलना "कितने GHz" से नहीं, "कितने कोर × कितनी लेन × कितनी बैंडविड्थ" से होती है।</p>' },

    { type: 'table', head: ['पहलू', 'CPU (सामान्य डेस्कटॉप)', 'GPU (डिस्क्रीट कार्ड)'],
      rows: [
        ['कोर की संख्या', '4–16 बड़ी कोर', 'दसियों–सैकड़ों कोर-गुच्छ, हज़ारों लेन'],
        ['डिज़ाइन लक्ष्य', 'कम देरी (low latency)', 'ज़्यादा थ्रूपुट (high throughput)'],
        ['एक निर्देश पर डेटा', 'SISD — 1 डेटा', 'SIMD — 32/64 डेटा (warp/wavefront)'],
        ['नियंत्रण (control)', 'out-of-order, speculation, branch predictor', 'अधिकतर in-order; देरी दूसरा थ्रेड चलाकर छिपाते हैं'],
        ['कैश/मेमोरी', 'बड़ा L1/L2/L3 + सिस्टम रैम', 'छोटा per-core memory + तेज़ VRAM (सैकड़ों GB/s)'],
        ['शाखा वाले काम (branch-heavy)', 'बहुत अच्छा', 'कमज़ोर — दोनों रास्ते चलाने पड़ते हैं'],
        ['ख़ास इस्तेमाल', 'OS, कॉम्पाइलर, स्प्रेडशीट, गेम लॉजिक', 'शेडिंग, रेंडर, वीडियो कोडेक, AI/ML, फ़िल्टर'],
        ['पावर (टापिक डेस्कटॉप)', '65–125 W', '75–450 W (कार्ड पूरा)'],
        ['गड़बड़ पर लक्षण', 'BSOD, रीस्टार्ट, ग़लत नतीजा', 'आर्टिफ़ैक्ट, ड्राइवर रीसेट, काली स्क्रीन']
      ] },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">1.2</span> ग्राफ़िक्स पाइपलाइन — पिक्सेल बनने का रास्ता</h3>' +
      '<p>GPU ड्राइवर (DirectX/Vulkan/OpenGL) के आदेश को एक <b>पाइपलाइन</b> में बदलता है। हर चरण हार्डवेयर में निर्दिष्ट यूनिट पर चलता है, इसलिए जब कोई चरण भर जाता है तो फ़्रेम-रेट वहीं अटकता है (bottleneck)। चरण क्रम में बढ़ते हैं — ग़लती की पहचान भी इसी क्रम से होती है।</p>' +
      '<table class="tbl"><thead><tr><th>चरण (Stage)</th><th>क्या करता है</th><th>इसके भार/ख़राबी का लक्षण</th></tr></thead><tbody>' +
      '<tr><td>Input assembler / Vertex shading</td><td>वेर्टेक्स (3D बिंदु) को स्पेस में घुमाता-बदलता (transform) व रोशनी का पहला हिस्सा</td><td>मॉडल हिलते नहीं, FPS CPU पर अटका (draw call ज़्यादा)</td></tr>' +
      '<tr><td>Hull/Domain (Tessellation)</td><td>सतह के टुकड़े (patch) को और बारीक पॉलिगन में तोड़ता है</td><td>बहुत ज़्यादा पॉलिगन से FPS गिरना, "tessellation level" कम करने पर सुधार</td></tr>' +
      '<tr><td>Geometry shading</td><td>नए प्रीमिटिव जोड़/घटा सकता है (जैसे पेड़ की डालियाँ)</td><td>इस स्टेज पर बहुत लोड = एक कोर-गुच्छ पर भीड़</td></tr>' +
      '<tr><td>Rasterization + clip/depth test</td><td>त्रिभुज को पिक्सेल के टुकड़ों (fragment) में बदलता है, Z-buffer से छिपा पिक्सेल काटता है</td><td>ज़्यादा रेज़ोल्यूशन = यहीं भार; Z-fighting (चमकता फ़्लोर) सॉफ़्टवेयर/ड्राइवर का संकेत</td></tr>' +
      '<tr><td>Pixel/Fragment shading</td><td>हर पिक्सेल का रंग — टेक्सचर खींचना, लाइट, नॉर्मल, मटेरियल</td><td>असली गेमिंग लोड यहीं; गड़बड़ = धब्बे/ग़लत शेडिंग</td></tr>' +
      '<tr><td>Output merge / Blend</td><td>रंग मेल (blend), alpha, stencil, MSAA का अंतिम नतीजा फ़्रेम-बफ़र में</td><td>ट्रांसपेरेंट वॉल/पानी में परत की गड़बड़, HDR टोन-मैप का अंत</td></tr>' +
      '<tr><td>Compute (raster के बिना)</td><td>सामान्य गणित — GPU का "स्वतंत्र" रास्ता (GPGPU)</td><td>रेंडरिंग नहीं, बल्कि एनकोडिंग/AI/फ़िज़िक्स का भार</td></tr>' +
      '</tbody></table>' +
      '<p>ध्यान रखिए: <b>Display driver + API</b> ये तय करते हैं कि कौन-सा चरण कितना इस्तेमाल होगा। DirectX 11 में tessellation/geometry ज़्यादा, Vulkan/DirectX 12 में overhead कम और CPU के draw call कम — इसलिए पुराने CPU पर नया API नई जान देता है।</p>' },

    { type: 'table', head: ['काम (Workload)', 'कौन-सा हार्डवेयर ज़्यादा थकता है', 'प्रैक्टिकल निष्कर्ष'],
      rows: [
        ['AAA गेम 1080p हाई सेटिंग', 'GPU (pixel shading) + CPU (लॉजिक)', 'अपग्रेड पहले GPU; पर esports में CPU'],
        ['CS2/Valorant/Fortnite जैसी प्रतिस्पर्धी (competitive) 1080p', 'CPU (single-thread) व RAM', 'सस्ता GPU + तेज़ CPU + फ़ास्ट रैम'],
        ['वीडियो एडिटिंग (Premiere/DaVinci)', 'GPU compute + VRAM + NVENC', 'NVENC से export 3–5× तेज़; 4K में 8 GB+ VRAM'],
        ['Blender/C4D रेंडर (GPU)', 'CUDA/OptiX या HIP के Tensor/RT कोर', 'कोर-गुच्छ की गिनती व VRAM तय करता है समय'],
        ['AI/ML इन्फ़रेंस व ट्रेनिंग', 'Tensor (NVIDIA) / Matrix (AMD XDNA-आधारित नहीं, बल्कि Wave) / XMX (Intel)', 'VRAM साइज़ सबसे बड़ी सीमा (मॉडल फ़िट होना चाहिए)'],
        ['STL/CAD मॉडलिंग', 'GPU से ज़्यादा CPU single-core + रैम', 'प्रो-ग्रेड (Quadro/Radeon Pro) का फ़ायदा ड्राइवर में'],
        ['OBS स्ट्रीमिंग', 'अलग NVENC/AMF/QSV इंजन', 'x264 (CPU) के बजाय हार्डवेयर एनकोडर = FPS बचा'],
        ['मल्टी-मॉनिटर + ऑफिस', 'सिर्फ़ display engine व बैंडविड्थ', 'iGPU काफ़ी; GPU की ज़रूरत नहीं']
      ] },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">1.3</span> वेंडर की आर्किटेक्चर पीढ़ियाँ — नाम पहचानना</h3>' +
      '<p>1999 में <b>NVIDIA GeForce 256</b> ने खुद को पहला "GPU" बताया; उसी दिन से "ग्राफ़िक्स कार्ड" शब्द बदला। 2006 में <b>GTX</b> (Giga Texel Shader eXtreme) आया, 2018 में <b>RTX</b> — नाम के साथ हार्डवेयर रेल-ट्रेसिंग कोर आया। AMD ने <b>Radeon HD → R सीरीज़ (GCN) → RX (RDNA)</b> का क्रम चला। Intel सबसे देर से आया: <b>Arc A-सीरीज़ (Alchemist) → B-सीरीज़ (Battlemage)</b>, Xe कोर के साथ।</p>' +
      '<p><b>तीन नियम:</b> (1) पहला अंक/नाम पीढ़ी बताता है (4070 = Ada 40 सीरीज़, RX 7800 = RDNA3, Arc A770 = Alchemist)। (2) "Ti/XT/SUPER/STRIX/GAMING X" = मार्केटिंग/कूलर का स्तर, चिप नहीं बदलती। (3) एक ही चिप अलग-अलग TGP पर लैपटॉप में अलग-अलग गति देती है — इसलिए लैपटॉप ख़रीदते समय "TGP/कितने वाट" ज़रूर पूछिए।</p>' +
      '<table class="tbl"><thead><tr><th>नाम का हिस्सा</th><th>असल मतलब</th><th>ध्यान रखने की बात</th></tr></thead><tbody>' +
      '<tr><td>GeForce / Radeon / Arc</td><td>कंज़्यूमर ब्रांड (कंपनी का गेमिंग परिवार)</td><td>Quadro/RTX A, Radeon Pro, Arc Pro = वर्कस्टेशन लाइन (अलग ड्राइवर सर्टिफ़िकेशन)</td></tr>' +
      '<tr><td>RTX बनाम GTX</td><td>RTX = RT व Tensor कोर वाला (Turing के बाद)</td><td>GTX 16 सीरीज़ Turing है पर RT/Tensor नहीं — रेल-ट्रेसिंग सॉफ़्टवेयर वाली नहीं</td></tr>' +
      '<tr><td>RX + XT/XTX/XTL</td><td>उस पीढ़ी का ऊँचा मॉडल</td><td>RDNA3 में "XTX" सबसे बड़ी Navi चिप (32 GB वरना 16/12)</td></tr>' +
      '<tr><td>Arc A5/A7/B5</td><td>Intel का सेग्मेंट (A3 सस्ता, A7 बड़ा)</td><td>Arc मीडिया इंजन AV1 एनकोड में बहुत मज़बूत — एडिटर के लिए फ़ायदा</td></tr>' +
      '<tr><td>"8 GB", "12 GB" VRAM</td><td>मेमोरी का साइज़</td><td>साइज़ अकेला तय नहीं करता — बस विड्थ व बैंडविड्थ भी देखिए</td></tr>' +
      '</tbody></table>' },

    { type: 'table', head: ['NVIDIA पीढ़ी (कोर-नाम)', 'वर्ष (लगभग)', 'कार्ड परिवार', 'नोड (datasheet)', 'RT कोर', 'Tensor/खास बात', 'AV1'],
      rows: [
        ['Fermi (GF100/10x)', '2010', 'GTX 400/500', '40 nm', 'नहीं', 'पहली परिपक्व unified shader + ECC', 'नहीं'],
        ['Kepler (GK104/110)', '2012–13', 'GTX 600/700, कुछ 900', '28 nm', 'नहीं', 'SMX, पहला NVENC हार्डवेयर', 'नहीं'],
        ['Maxwell (GM107/20x)', '2014–16', 'GTX 750/900', '28 nm', 'नहीं', 'प्रति-वाट कूद, VXGI (सॉफ़्ट RT)', 'नहीं'],
        ['Pascal (GP10x)', '2016–18', 'GTX 10 सीरीज़ (1050–1080 Ti)', '16 nm', 'नहीं', 'GDDR5X, बूस्ट 3.0, HDR मेटाडेटा', 'नहीं'],
        ['Volta (GV100)', '2017', 'केवल डेटासेंटर (V100)', '12 nm', 'नहीं (RT से पहले)', 'पहले Tensor कोर, HBM2', 'नहीं'],
        ['Turing (TU10x/TU116)', '2018', 'RTX 20 + GTX 16', '12 nm', '1st gen', 'Tensor 2nd gen, RTX ब्रांड, GDDR6', '❌ (decode भी नहीं)'],
        ['Ampere (GA10x)', '2020–22', 'RTX 30 सीरीज़', '8 nm (Samsung)', '2nd gen', 'Tensor 3rd, DLSS 2, 8K decode, मीडिया कार्ड पर AV1 एनकोड', '✅ decode, ❌ encode (गेमिंग कार्ड)'],
        ['Ada Lovelace (AD10x)', '2022–24', 'RTX 40 सीरीज़', '4N (5 nm वर्ग, TSMC)', '3rd gen', 'Tensor 4th, DLSS 3 फ़्रेम जनरेशन, 8th-gen NVENC', '✅ decode + encode'],
        ['Blackwell (GB20x)', '2025+', 'RTX 50 सीरीज़', '4NP', '4th gen', 'Tensor 5th, DLSS 4 मल्टी-फ़्रेम जन, GDDR7, 9th-gen NVENC (4K120/8K)', '✅ decode + encode (2× इंजन बड़े मॉडल)']
      ] },

    { type: 'table', head: ['AMD / Intel पीढ़ी', 'वर्ष', 'परिवार', 'नोड/बनावट', 'कोर इकाई', 'रेल-ट्रेसिंग व कोडेक'],
      rows: [
        ['GCN 1.0–3.0 (Pitcairn/Tahiti/Fiji/Grenada)', '2012–15', 'Radeon HD 7000 / R7-R9 200-300', '28/20 nm', 'CU (64 shader प्रति CU)', 'RT नहीं; डिकोड पुराना HEVC'],
        ['GCN 4 (Polaris 10/11)', '2016–19', 'RX 400/500 (RX 580)', '14 nm', 'CU 2304 shader (RX 580)', 'RT नहीं; DisplayPort 1.4, HDR मेटा'],
        ['GCN 5 (Vega 10/20)', '2017–19', 'Radeon RX Vega 56/64, VII', '7 nm', 'CU + HBM2', 'RT नहीं; पहला HBM AMD ग्राफ़िक्स'],
        ['RDNA 1 (Navi 10/14)', '2019', 'RX 5700/5600/5500', '7 nm', 'CU (64 FP32/CU), गेम-ऑप्टिमाइज़्ड', 'हार्डवेयर RT नहीं; मीडिया इंजन VCN'],
        ['RDNA 2 (Navi 21/22/23)', '2020–22', 'RX 6900/6800/6700/6600/6500', '7 nm', 'CU + Ray Accelerator 1st gen, Infinity Cache', '✅ RT, DirectX 12 Ultimate, AV1 decode'],
        ['RDNA 3 (Navi 31/32/33)', '2022–24', 'RX 7900 XTX/XT, 7800/7700/7600', '5 nm compute + 6 nm I/O (chiplet)', '3rd-gen CU = dual-issue (2 shader per clock per CU)', '✅ RT gen2, AV1 encode, 32 GB VRAM (XTX)'],
        ['RDNA 4 (Navi 48/38)', '2025+', 'RX 9070 XT/9070/9060', '4/6 nm', 'नए Ray + Radiance Accelerator', '✅ बेहतर RT, नया मीडिया/डिस्प्ले इंजन'],
        ['Intel Xe-LP (Gen 12)', '2020+', 'iGPU — Iris Xe / UHD', '10 nm (Intel 7 बाद)', 'Xe core (LP)', 'Quick Sync एनकोड; डिस्क्रीट नहीं'],
        ['Intel Xe-HPG "Alchemist" (DG2)', '2022', 'Arc A310/A380/A580/A750/A770', '6 nm (TSMC)', 'Xe core = 16 vector engine + XMX', '✅ RT unit 1st gen, AV1 encode (बड़ा बिक्री-बिंदु)'],
        ['Intel Xe2-HPG "Battlemage"', '2024–25', 'Arc B580/B570', 'TSMC N5 वर्ग', 'Xe2 core, XMX 2nd gen', '✅ RT gen2 (Ray Tracing Unit), AV1 encode + XESS']
      ] },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">1.4</span> "SM / CU / Xe core" असल में क्या होता है?</h3>' +
      '<p>किसी भी कार्ड की ताक़त इसी इकाई की गिनती × घड़ी × बैंडविड्थ से बनती है। <b>NVIDIA SM (Streaming Multiprocessor)</b>, <b>AMD CU (Compute Unit)</b>, <b>Intel Xe core</b> — तीनों एक ही बात के तीन नाम: "कोर-गुच्छ"। एक गुच्छा में शेड्यूलर, ALU समूह, कैश, टेक्सचर यूनिट व कभी RT/Tensor यूनिट होते हैं।</p>' +
      '<p>एक महत्वपूर्ण बात: <b>warp/wavefront</b>। NVIDIA 32 लेन को एक साथ एक निर्देश देता है (warp), AMD 32 (wave32) या 64 (wave64) लेन — RDNA3 में एक CU दो wavefront एक ही घड़ी में जारी (dual-issue) कर सकती है। इसलिए "एक CU = 64 shader" का मतलब यह नहीं कि एक घड़ी में सिर्फ़ 64 काम; पर वेंडरों के बीच सीधी गिनती-तुलना बेमानी है।</p>' +
      '<table class="tbl"><thead><tr><th>इकाई</th><th>क्या</th><th>पढ़ने का तरीक़ा</th></tr></thead><tbody>' +
      '<tr><td>SM / CU / Xe core</td><td>कोर-गुच्छ — शेड्यूलर + ALU + कैश + यूनिट</td><td>गिनती सबसे भरोसेमंद "ताक़त" का संकेत (एक ही वेंडर के भीतर तुलना करें)</td></tr>' +
      '<tr><td>CUDA core / Shader / Stream processor / Xe vector engine</td><td>एक छोटा FP32 ALU — अकेले कुछ नहीं करता</td><td>"3072 cores" का मतलब 3072 ALU, 3072 कोर नहीं</td></tr>' +
      '<tr><td>Tensor core (NVIDIA) / XMX (Intel) / Matrix (CDNA)</td><td>मैट्रिक्स-मल्टीप्लाई एक क्लॉक में — AI, DLSS, फ़्रेम जन</td><td>पीढ़ी-दर-पीढ़ी FP16→BF16→FP8 जोड़े गए; गेम में mostly upscaling</td></tr>' +
      '<tr><td>RT core / Ray Accelerator / Ray Tracing Unit</td><td>BVH traversal + ray-triangle intersection (हार्डवेयर)</td><td>RT कोर के बिना रेल-ट्रेसिंग compute पर चलती है — 4–6× धीमी</td></tr>' +
      '<tr><td>TMU (Texture unit)</td><td>टेक्सचर पढ़ना व फ़िल्टर (bilinear/anisotropic)</td><td>आधुनिक कार्ड में अधिकतर 4 प्रति SM/CU-जुड़ाव</td></tr>' +
      '<tr><td>ROP (Render Output Unit)</td><td>अंतिम पिक्सेल लिखना, depth test, blending, MSAA resolve</td><td>4K + भारी AA/alpha पर सीमा बन सकता है; गेमिंग में अब घटती हुई प्राथमिकता</td></tr>' +
      '<tr><td>Register file + L1/shared</td><td>गुच्छ का त्वरित स्टोर (पीढ़ी के अनुसार ~64–128 KB वर्ग)</td><td>occupancy — कितने warp एक साथ टिक सकें, यहीं तय होता है</td></tr>' +
      '<tr><td>L2 cache</td><td>पूरी चिप साझा (कुछ MB से सैकड़ों MB तक — datasheet)</td><td>बड़ा L2 = कम बस-विड्थ पर भी अच्छा गेम परफ़ॉर्मेंस</td></tr>' +
      '<tr><td>Infinity Cache (AMD)</td><td>L3-वर्ग कैश (आम तौर पर 32/64/96/128 MB)</td><td>गिनती-कम बजट कार्ड को बचाता है; कैश-अनफ़्रेंडली वर्कलोड (रेंडर/AI) में नुकसान</td></tr>' +
      '</tbody></table>' },

    { type: 'table', head: ['Spec sheet की लाइन', 'असल में क्या बताती है', 'जाल / कैसे पढ़ें'],
      rows: [
        ['GPU चिप (codename)', 'असल डाय — TU104, GA102, Navi 21, AD103, DG2-512', 'एक ही नाम दो डाय पर: RTX 3060 12 GB (GA106) व 8 GB (GA104) अलग कार्ड'],
        ['प्रोसेस नोड', '28/12/8 nm, 4N/4NP, 5 nm वर्ग', 'नोड छोटा = ज़रूरी नहीं तेज़; कूलर व क्लॉक देखिए'],
        ['ट्रांज़िस्टर', 'डाय की घनता (अरबों में, datasheet)', 'केवल पीढ़ी-तुलना के लिए; क्रम-बदल का प्रमाण नहीं'],
        ['कोर-गुच्छ (SM/CU/Xe)', 'गुच्छों की गिनती', 'सबसे भरोसेमंद क्षमता-संकेत — इसी से RT/Tensor/TMU गुणित होता है'],
        ['Shader/CUDA/Stream count', 'कुल FP32 ALU', '"11,724 cores" से न मोहें; प्रति गुच्छा कितने, वह ज़रूरी है'],
        ['Base / Boost clock (MHz)', 'गारंटीड व अधिकतम घड़ी (थर्मल/पावर से घटती है)', 'बूस्ट अस्थायी; कार्ड के "power limit" स्लाइडर पर निर्भर'],
        ['Memory size / type / bus', 'VRAM GB, GDDR6/6X/7/HBM, 64–384-bit', '12 GB/96-bit अक्सर 8 GB/256-bit से धीमा — बस विड्थ मत भूलिए'],
        ['Bandwidth (GB/s)', 'MT/s × बस ÷ 8', 'कार्ड का असल "रक्त-प्रवाह"; spec sheet के अंतिम अंक से गणना खुद कीजिए'],
        ['TGP / TBP (W)', 'पूरे बोर्ड की अधिकतम पावर', 'लैपटॉप में यही असली फ़र्क़: एक RTX 4060 65 W भी, 115 W भी'],
        ['Power connectors', '8-pin की गिनती / 12VHPWR', 'SMPS में उतने कनेक्टर हैं या नहीं — पहले गिनिए'],
        ['Interface', 'PCIe 4.0/5.0 ×16 / ×8 / ×4', '×8–×4 कार्ड chipset slot या राइज़र पर बैंडविड्थ खो देता है'],
        ['Display outputs + version', '3×DP 1.4a + 1×HDMI 2.1 आम', 'अधिकतम रेट पोर्ट वर्ज़न व DSC पर तय होता है'],
        ['API level', 'DirectX 12 Ultimate / Feature level 12_1/12_2, Vulkan', 'पुराने कार्ड में mesh shader, VRS, RT नहीं — DLSS/FSR का भी असर'],
        ['Cooler / slots / length', '2–3.5 slot, 170–360 mm', 'केस की "max GPU length" व एयरफ़्लो पहले जाँचिए']
      ] },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">1.5</span> VRAM — साइज़, प्रकार, बैंडविड्थ व "भर जाने पर" क्या होता है</h3>' +
      '<p><b>VRAM</b> = कार्ड की अपनी मेमोरी (GDDR = Graphics DDR, HBM = High Bandwidth Memory)। इसमें टेक्सचर, मश/कलर बफ़र, शैडो-मैप, फ़्रेम-बफ़र व रेंडर टारगेट रहते हैं। ध्यान दीजिए: यह RAM जैसी "बढ़ाई" नहीं जा सकती — कार्ड के साथ ही तय होती है, और ओवरक्लॉक से केवल उसकी गति थोड़ी बढ़ती है।</p>' +
      '<p><b>बैंडविड्थ का सूत्र:</b> GB/s = effective rate (MT/s) × bus width (bits) ÷ 8। यानी 16 Gbps GDDR6 × 128-bit ÷ 8 = <b>256 GB/s</b>। GDDR6X PAM4-संकेतन से प्रति क्लॉक 2 बिट, GDDR7 PAM3 से और तेज़ देता है — इसलिए "18 Gbps" जैसी संख्याएँ सामान्य हैं।</p>' +
      '<table class="tbl"><thead><tr><th>मेमोरी प्रकार</th><th>सामान्य effective rate</th><th>कहाँ मिलता है</th><th>नोट</th></tr></thead><tbody>' +
      '<tr><td>GDDR5</td><td>5–8 Gbps (datasheet की सीमा ~8)</td><td>GTX 900/10, RX 580</td><td>पुराना; 32-bit बस वाले GT 1030 में गंभीर सीमा</td></tr>' +
      '<tr><td>GDDR5X</td><td>10–12 Gbps</td><td>GTX 1080 Ti, कुछ 1650 Super</td><td>GDDR6 से पहले का पुल</td></tr>' +
      '<tr><td>GDDR6</td><td>12–16 (18 भी, नए मॉडल)</td><td>RTX 20/30, RX 6000/7000, Arc</td><td>आज सबसे आम; 14 Gbps पर 128-bit = 224 GB/s</td></tr>' +
      '<tr><td>GDDR6X</td><td>19–21 Gbps (PAM4)</td><td>RTX 3080/3090, 4080/4090</td><td>गर्म — हीटसिंक/थर्मल पैड ज़रूरी; केवल NVIDIA के बड़े मॉडल</td></tr>' +
      '<tr><td>GDDR7</td><td>28–32+ Gbps (spec में और ऊपर)</td><td>RTX 50, RX 9000 वर्ग</td><td>नोड/पावर दक्षता बेहतर; दाम ऊपर, जल्दी उपलब्धता कम</td></tr>' +
      '<tr><td>HBM2 / HBM2e / HBM3</td><td>प्रति स्टैक 1024-bit बस, सैकड़ों GB/s से TB/s तक</td><td>सर्वर/AI कार्ड (V100, MI, A100/H100 वर्ग)</td><td>महँगा; कंज़्यूमर कार्ड में नहीं</td></tr>' +
      '<tr><td>LPDDR5/5X (shared)</td><td>सिस्टम रैम ≈ 60–100 GB/s</td><td>लैपटॉप iGPU, handheld</td><td>VRAM अलग नहीं — CPU के साथ बाँटी जाती है (UMA)</td></tr>' +
      '</tbody></table>' +
      '<p><b>VRAM ख़त्म होने का लक्षण:</b> फ़्रेम रेट अचानक गिरना, बफ़र रिसाइज़ का झटका, टेक्सचर देर से दिखना (pop-in), मॉनिटर की तस्वीर धुंधली-सी बनना। Windows में कम VRAM होने पर ड्राइवर सिस्टम रैम में spill करता है — वह 5–15× धीमा पड़ता है। हल: टेक्सचर क्वालिटी एक कदम नीचे, मॉडल रेट घटाना, या VRAM बड़ा कार्ड।</p>' +
      '<p><b>आज की व्यावहारिक सीमा (अनुमानित):</b> 1080p मध्यम 4–6 GB, 1080p ultra/1440p 8 GB, 4K व आधुनिक अन-ऑप्टिमाइज़्ड टाइटल 12–16 GB, AI मॉडल व रेंडर सीन अपनी-अपनी ज़रूरत।</p>' },

    { type: 'code', code: '/* spec sheet से तीन नंबर खुद निकालिए (कैलकुलेशन के नमूने) */\n\n// 1) मेमोरी बैंडविड्थ\nBW(GB/s) = effective rate (MT/s) x bus width (bit) / 8\n  GDDR6  16000 x 128 / 8 = 256 GB/s\n  GDDR6  18000 x 192 / 8 = 432 GB/s\n  GDDR6X 21000 x 352 / 8 = 924 GB/s\n  GDDR7  28000 x 256 / 8 = 896 GB/s\n\n// 2) FP32 थ्योरी थ्रूपुट (TFLOPS)\nFLOPS = shader_count x 2 (FMA) x boost_clock\n  3072 x 2 x 2.46 GHz = 15.1 TFLOPS FP32\n  // तुलना केवल एक ही वेंडर/पीढ़ी के भीतर कीजिए\n\n// 3) पावर-घनता (कार्ड की दक्षता)\nperf_per_watt = TFLOPS / TGP\n  15.1 / 115 W = 0.131   बनाम   35.6 / 450 W = 0.079\n  // यानी सस्ता मध्यम कार्ड अक्सर "प्रति वाट" ज़्यादा देता है\n\n// 4) PSU के लिए न्यूनतम वाट (सरल नियम)\nW_min = CPU_TDP + GPU_TGP + 150 W; फिर x1.25 मार्जिन\n  i5-12400F(65) + RTX 4070(200) + 150 = 415 -> 520 -> 600 W (Bronze/Gold)' },

    { type: 'table', head: ['पावर स्रोत/कनेक्टर', 'आम तौर पर उपलब्ध पावर', 'कब मिलता है', 'सेवा-नोट'],
      rows: [
        ['PCIe x16 स्लॉट', '75 W', 'हर कार्ड को (कनेक्टर पर 12V + 3.3V signal)', 'बिना केबल वाले कार्ड (GT 1030, RTX 3050 6GB) यहीं से चलते हैं'],
        ['6-pin PCIe', '+75 W', 'पुराने GTX 750 Ti/950 वर्ग', '2×12V + 3 ग्राउंड; 8-pin में 6+2 के रूप में मिल जाता है'],
        ['8-pin PCIe (12VHPWR से अलग)', '+150 W', 'आज के मिड-रेज कार्ड', 'CPU का 8-pin EPS12V से मिलाकर न लगाइए — पिन क्रम उलटा, कार्ड जल सकता है'],
        ['2× 8-pin', '+300 W', 'RTX 3070/4070 वर्ग', 'दो अलग केबल > एक केबल की दो सिर (pigtail); स्पाइक कम'],
        ['3–4× 8-pin', '+450–600 W', 'एन्थुसिआस्ट/ओसी मॉडल', 'केबल Management और 12V रेल की धारण-क्षमता देखिए'],
        ['12VHPWR (16-pin, 12+4)', '600 W तक (रेट)', 'RTX 30/40/50 के बड़े मॉडल', '4 sense पिन PSU को पावर-स्तर बताते हैं; पूरा न बैठे तो कम पावर tier मिलता है'],
        ['12V-2x6 (संशोधित 16-pin)', '600 W तक', 'नए ATX 3.x SMPS व RTX 40/50', 'sense पिन छोटे किए गए — अधूरा बैठा कनेक्टर अब "600 W" का झूठ नहीं बोलता'],
        ['ATX 3.0/3.1 SMPS', '12VHPWR_native + स्पाइक हेडरूम', '300 W+ कार्ड वाला बिल्ड', '100 µs में 3× TGP व 2× कुल पावर के excursion के लिए बना; पुराने SMPS पर स्पिल ओवर-प्रोटेक्शन ट्रिप होता है']
      ] },
    { type: 'callout', kind: 'danger', title:'⚠️ 12VHPWR पिघलना — कारण व रोकथाम (लैब का सबसे महँगा सबक)', html:'<p>रिपोर्ट किए गए जलने/पिघलने के मामले लगभग हमेशा <b>अधूरा बैठा कनेक्टर</b> या <b>कनेक्टर के बिलकुल पास से तेज़ मोड़</b> से आए हैं। हर पिन का संपर्क क्षेत्र छोटा है, इसलिए आधा बैठा पिन ऊँचे करंट (40–50 A प्रति पिन तक) पर गर्म हो जाता है।</p><ol><li>केबल को तब तक दबाइए जब तक क्लिक/पूरी सीट न दिखे — कनेक्टर के चारों ओर 0.5 mm भी गैप न दिखे।</li><li>कनेक्टर से लगभग <b>35 mm</b> के अंदर 90° मोड़ न दें; केबल सीधा या हल्का झुका हुआ छोड़िए।</li><li>अच्छा विकल्प: <b>native 12VHPWR केबल</b> वाला ATX 3.x SMPS। मज़बूरी में कार्ड के साथ आए एडाप्टर, सस्ते तृतीय-पक्ष एडाप्टर नहीं।</li><li>पहले 2–4 हफ़्ते भारी लोड (रेंडर/बेंचमार्क) के बाद कनेक्टर व केबल की जाँच — रंग बदलाव/गंध = तुरंत रोक।</li><li>3×8-pin वाला कार्ड हो तो तीनों सिर <b>अलग-अलग केबल</b> से लीजिए; केबल के तार की गेज (16 vs 18 AWG) भी देखिए।</li></ol>' },

    { type: 'table', head: ['PCIe संस्करण', 'प्रति लेन (raw)', '×16 प्रति दिशा', '×8', '×4', 'व्यावहारिक नुकसान'],
      rows: [
        ['PCIe 1.0/1.1', '2.5 GT/s', '≈4 GB/s', '2', '1', 'माइनिंग USB राइज़र ×1 — मॉनिटरिंग/ऑफिस के लिए काफ़ी, गेम के लिए नहीं'],
        ['PCIe 2.0', '5 GT/s', '≈8 GB/s', '4', '2', 'पुराने बोर्ड पर नया कार्ड — 5% के आसपास फ़र्क़, VRAM-heavy में ज़्यादा'],
        ['PCIe 3.0', '8 GT/s', '≈16 GB/s', '8', '4', 'बहुत ज़्यादातर कार्ड यहीं से ठीक; ×4 कार्ड पर गंभीर'],
        ['PCIe 4.0', '16 GT/s', '≈32 GB/s', '16', '8', 'आज का मानक; RX 6500 XT जैसे ×4 कार्ड यहीं पूरे रफ़्तार पर'],
        ['PCIe 5.0', '32 GT/s', '≈64 GB/s', '32', '16', 'RTX 50/नए बोर्ड; आज के गेम में फ़र्क़ नगण्य, भविष्य-सुरक्षा']
      ] },
    { type: 'callout', kind: 'warn', title:'लेन की असलियत — ×16 दिखता है, ×8/×4 चलता है', html:'<p>दो अलग बातें हैं: <b>भौतिक लंबाई</b> (कितने पिन) और <b>इलेक्ट्रिकल लेन</b> (कितनी लाइनें वायर की गईं)। कई बजट कार्ड ×16 प्लास्टिक में ×4 या ×8 लेन लेकर आते हैं। सेकंड-हैंड कार्ड में <b>GPU-Z → Bus Width</b> देखिए: "x8 @ x16" का मतलब स्लॉट ×16 पर कार्ड ×8 पर ट्रेनिंग कर रहा है।</p><ul><li>छोटे मॉडल में लेन कम होने से DX12 व UE5 के <b>direct texture streaming</b> पर असर — फ़्रेम में झटके, औसत FPS से ज़्यादा शिकायत।</li><li>चिपसेट से जुड़े स्लॉट/CPU के DMI लिंक साझा करते हैं — NVMe + USB + LAN + GPU सब उसी हाइवे पर; "chipset slot" पर GPU रखने से ×4 जैसा व्यवहार मिल सकता है।</li><li>माइनिंग राइज़र (×1 gen2 USB-आधारित) गेमिंग के लिए अनुपयुक्त — केवल रेंडर/मॉनिटरिंग।</li><li>निदान: Event Viewer में <b>WHEA-Logger</b>, या HWiNFO में PCIe link speed/replay count देखिए; स्लॉट/राइज़र बदलकर परखिए।</li></ul>' },

    { type: 'table', head: ['इंजन', 'कंपनी/नाम', 'काम', 'कौन-सी पीढ़ी में क्या'],
      rows: [
        ['NVENC', 'NVIDIA', 'H.264/H.265 (AV1 नई पीढ़ी में) एनकोड', 'Kepler में पहला; Turing 6th, Ampere 7th, Ada 8th, Blackwell 9th gen — बड़े Ada/Blackwell मॉडल में 2 एनकोडर (एक साथ 2 नतीजा)'],
        ['NVDEC', 'NVIDIA', 'हार्डवेयर डिकोड (प्लेबैक, एडिट scrub)', 'Pascal/Turing: HEVC/VP9; Ampere: AV1 decode; Ada/Blackwell: AV1 encode + decode'],
        ['AMF / VCE / VCN', 'AMD', 'एनकोड+डिकोड एक इंजन (VCN)', 'RDNA2 (RX 6000): AV1 decode; RDNA3 (RX 7000): AV1 encode; RDNA4: नया मीडिया इंजन'],
        ['Quick Sync / Media Engine', 'Intel', 'iGPU व Arc दोनों में; एडिटिंग का प्यारा विकल्प', 'Alchemist (Arc A-सीरीज़): AV1 encode; Battlemage: तेज़ AV1 + कई स्ट्रीम; 11th-gen+ iGPU में AV1 decode'],
        ['DLSS / XeSS / FSR', '—', 'एनकोड नहीं, AI-अप्सैम्पलिंग', 'Tensor/XMX या compute पर चलता है; नीचे अलग तालिका देखिए'],
        ['परीक्षा-नुक्ता', '—', '—', '4K रिकॉर्डिंग/स्ट्रीम में CPU x264 के बजाय हार्डवेयर एनकोडर = FPS व तापमान दोनों बचाते हैं']
      ] },

    { type: 'table', head: ['पोर्ट कॉन्फ़िगरेशन (कार्ड पर)', 'कहाँ आम', 'अधिकतम मोड (typical)', 'सेवा-नोट'],
      rows: [
        ['3× DP 1.4a + 1× HDMI 2.1', 'RTX 4070/4080/50 सीरीज़, RX 7800/7900', 'DP: 4K 144–240 Hz (10-bit, DSC से), 8K60 (DSC), HDMI: 4K120', '4 डिस्प्ले एक साथ; DP daisy-chain/MST पर बैंडविड्थ बँट जाती है'],
        ['2× HDMI 2.1 + 2× DP 1.4/2.1', 'RX 7600/9060, कुछ NVIDIA मॉडल', '4K120 दोनों पर; HDMI 2.1 पर VRR/eARC', 'TV पर चलाते समय HDMI केबल "Ultra High Speed" (48 Gbps) चाहिए'],
        ['1× HDMI 2.0b + 3× DP', 'पुराने/बजट कार्ड (Turing–RDNA1)', '4K60 HDMI (8-bit RGB), DP से 4K144 (DSC)', 'HDMI 2.0b पर 4K120 नहीं — यही सबसे आम "मेरा मॉनिटर 120 Hz नहीं दिखा रहा" कारण'],
        ['DP 2.1 (UHBR13.5/20)', 'RDNA4 (RX 9000), कुछ नए मॉडल', '4K 240 Hz, 8K60/8K120 (DSC के बिना भी ऊँचे मोड)', 'मॉनिटर व केबल दोनों DP2.1 हों; नहीं तो लिंक HBR3 पर गिर जाता है'],
        ['iGPU पोर्ट (बोर्ड पर)', 'HDMI + DP/USB-C', '4K60–4K120 (नई पीढ़ी), पुराने में 4K30', 'DP 1.2 वाले पुराने बोर्ड पर 4K60 60 Hz नहीं मिलेगा — यही EDID/बैंडविड्थ की सीमा'],
        ['सभी आउटपुट साझा बैंडविड्थ', '—', 'आम तौर पर 4 डिस्प्ले तक', '5वाँ/छठा मॉनिटर लगाने पर रिसोर्स ड्रॉप; DisplayLink (USB) अलग रास्ता — ऑफिस के लिए, गेम के लिए नहीं']
      ] },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">1.6</span> परफ़ॉर्मेंस की असलियत — bottleneck कहाँ है?</h3>' +
      '<p>दो नियम याद रखिए: <b>(1) रिज़ॉल्यूशन व सेटिंग GPU का भार बढ़ाते हैं</b> (pixel shading), <b>(2) कम सेटिंग/ऊँचा FPS CPU का भार बढ़ा देता है</b> (draw call, लॉजिक, फ़िज़िक्स)। यही कारण है कि <b>1080p low-setting eSports</b> लगभग हमेशा <b>CPU-bound</b> होता है — GPU सेकंड में 400 फ़्रेम बना सकता है, CPU उसमें गेम-लॉजिक नहीं डाल पाता।</p>' +
      '<p>इसीलिए: 1080p में महँगा GPU बदलने से FPS कम बढ़ता है; <b>1440p/4K में बढ़ता है</b>। और उल्टा सच यह है कि <b>upscaling (DLSS/FSR) GPU का भार घटाता है</b> — जिससे CPU-bound सिस्टम और अधिक CPU-bound हो जाता है। अपस्केलिंग का मतलब "CPU की सीमा तोड़ना" नहीं है।</p>' +
      '<p><b>मापने का तरीक़ा:</b> MSI Afterburner/HWiNFO का OSD चालू कीजिए — GPU usage 97–99% व CPU usage कम = GPU-bound; GPU usage 60–80% और एक/दो CPU कोर 90%+ = CPU-bound। फिर परीक्षा: रिज़ॉल्यूशन बढ़ाइए (GPU-bound गहरा होगा), सेटिंग घटाइए (CPU-bound दिखेगा), FPS कैप लगाइए (GPU शांत होकर CPU पर भार दिखेगा)।</p>' },

    { type: 'table', head: ['लक्षण', 'संभावित bottleneck', 'पुष्टि का टेस्ट', 'उपाय'],
      rows: [
        ['FPS कम, GPU usage 98–99%', 'GPU', 'रिज़ॉल्यूशन ↓ करने पर FPS तेज़ी से बढ़े', 'GPU अपग्रेड / सेटिंग-अपस्केलिंग / ड्राइवर OC'],
        ['FPS कम, GPU usage 60–80%', 'CPU (या RAM/VRAM)', 'सेटिंग ↓ करने पर FPS न बढ़े', 'तेज़ single-core CPU, रैम ड्यूल-चैनल, बैकग्राउंड प्रोसेस बंद'],
        ['1080p low में 300 FPS पर अटकना', 'CPU + इंजन का FPS लॉजिक', '3DMark Time Spy (GPU-only) में स्कोर ठीक, इन-गेम कम', 'गेम में FPS कैप; CPU/रैम सुधार'],
        ['4K में अचानक झटके व धीमा होना', 'VRAM भरना', 'GPU-Z/Task Manager में "Dedicated GPU memory" 100%', 'टेक्सचर क्वालिटी ↓, बड़ा VRAM कार्ड'],
        ['हर 5–10 सेकंड पर एक बड़ा स्टटर', 'शेडर कम्पाइल / पेज-फ़ॉल्ट / स्टोरेज', 'Event Viewer व Disk activity; नए गेम में पहली बार ज़्यादा', 'SSD पर रखें, shader cache पहले से भरें, VRAM/RAM बड़ा'],
        ['गर्म होने पर धीरे-धीरे FPS गिरना', 'थर्मल थ्रॉटलिंग (GPU/VRM/SMPS)', 'HWiNFO: Power/Fast/Thermal throttling reason व हॉटस्पॉट', 'धूल/पेस्ट/एयरफ़्लो, अंडरवोल्ट, केस फैन'],
        ['बेंचमार्क अच्छा, असल गेम ख़राब', 'गेम इंजन/ड्राइवर', 'अलग ड्राइवर वर्ज़न, DX11 बनाम DX12', 'Studio/Game Ready बदलकर, ड्राइवर रोलबैक, DDU'],
        ['सिर्फ़ स्क्रीन-रेट पर FPS अटकना', 'V-Sync/रिफ़्रेश/मॉनिटर', 'V-Sync बंद करके देखा — FPS ऊपर गया', 'Adaptive-Sync + V-Sync ऑन, कैप रेट ~3 FPS नीचे']
      ] },

    { type: 'table', head: ['माप', 'मतलब', 'गणना/मानक', 'क्यों ज़रूरी'],
      rows: [
        ['औसत FPS', 'सेकंड में फ़्रेम', '60 Hz = 16.7 ms, 144 Hz = 6.94 ms, 240 Hz = 4.17 ms', 'अकेला झूठा नंबर — औसत में झटके छिप जाते हैं'],
        ['Frametime (ms)', 'हर फ़्रेम का समय', 'स्थिर 8.3 ms = 120 FPS जैसा अनुभव; 8–20 ms के बीच उछाल = स्टटर', 'सच्चा "चिकनाहट" माप — FrameView/CapFrameX से नॉर्मलाइज़ करके देखें'],
        ['1% low / 0.1% low', 'सबसे ख़राब 1%/0.1% फ़्रेम का औसत', '1% low ≈ FPS का 70–80% हो तो अच्छा', 'गिरावट वाला हिस्सा यहीं दिखता है — यही "अटकता है" की शिकायत'],
        ['Frame pacing', 'फ़्रेम के बीच का अंतराल', '2×/3× refresh पर कूदना (जैसे 60 Hz पर 30/20 ms)', 'Upscaler व Adaptive-Sync दोनों यहीं फ़ेल होते हैं'],
        ['System latency', 'क्लिक → पिक्सेल बदलाव', 'GPU queue + render + display latency (msec)', 'Reflex/Anti-Lag का पूरा काम ही यही; Shooters में FPS से ज़्यादा मायने'],
        ['VRAM उपयोग', 'dedicated vs shared', 'Task Manager → Performance → GPU → Dedicated GPU memory', 'Shared में गया = झटके; spill से बचाना पहला ट्यूनिंग'],
        ['बेंचमार्क बनाम असल खेल', '3DMark/Time Spy/Superposition/Fire Strike', 'स्कोर में 5–10% भिन्नता सामान्य; 20%+ फ़र्क़ = थ्रॉटल/ड्राइवर', 'तुलना के लिए वही सॉफ़्टवेयर, वही तापमान, वही सेटिंग']
      ] },

    { type: 'table', head: ['तकनीक', 'कंपनी', 'कैसे काम करती है', 'किस GPU पर चलती है', 'गेम में सपोर्ट चाहिए?', 'फ़्रेम जनरेशन'],
      rows: [
        ['DLSS 2 (Super Resolution)', 'NVIDIA', 'टेंपोरल + AI मॉडल, Tensor कोर पर; इनपुट: मोशन वेक्टर/डी-बफ़र', 'RTX 20/30/40/50', 'हाँ (गेम इंजन इंटीग्रेशन)', 'नहीं (सिर्फ़ अपस्केल)'],
        ['DLSS 3 / 3.5 (Frame Generation, Ray Reconstruction)', 'NVIDIA', 'Optical-flow + AI से पूरा फ़्रेम बनाना; RR से रेल-नॉइज़ सुधार', 'FG: RTX 40/50 हार्डवेयर (Reflex ज़रूरी); RR: RTX 20+', 'हाँ', 'हाँ — 1×/2×/3× (Blackwell पर मल्टी-फ़्रेम)'],
        ['DLSS मॉडल M/N (presets)', 'NVIDIA', 'नए Transformer-आधारित मॉडल', 'पुराने RTX पर भी (थोड़ा धीमा)', '—', '—'],
        ['FSR 1.0', 'AMD', 'spatial (एक ही फ़्रेम से) + sharpness', 'कोई भी GPU (driver-level: RSR)', 'नहीं (RSR से)', 'नहीं'],
        ['FSR 2.x (UHD)', 'AMD', 'टेंपोरल अपस्केलिंग — DLSS जैसा, open source', 'कोई भी GPU — AMD/Intel/पुराने NVIDIA', 'हाँ', 'नहीं'],
        ['FSR 3 / 4 (AFMF भी)', 'AMD', 'FidelityFX Frame Generation + Fluid Motion Frames (driver-level FG)', 'FG गेम-सपोर्ट में cross-vendor; AFMF/2 driver पर RDNA+ पर निर्भर', 'FG के लिए हाँ, AFMF के लिए नहीं', 'हाँ (FSR 3+ और AFMF)'],
        ['XeSS', 'Intel', 'XMX (Tensor-जैसी) इकाई पर AI; न मिले तो DP4a fallback', 'Arc A/B सीरीज़ पर XMX, बाक़ी GPU/Intel iGPU पर DP4a मोड', 'हाँ', 'XeSS 2 (Battlemage) में मल्टी-फ़्रेम जन'],
        ['NIS (NVIDIA Image Scaling)', 'NVIDIA', 'driver-level spatial स्केल + एडैप्टिव शार्पन', 'कोई भी NVIDIA GPU (पुराने भी)', 'नहीं', 'नहीं (RTX 40/50 पर RSR-जैसा नहीं)'],
        ['RSR / AFMF (driver)', 'AMD', 'रेज़ोल्यूशन रेंडर कर के driver स्तर पर अपस्केल/FG', 'AMD Radeon Software में', 'नहीं', 'AFMF से बिना-सपोर्ट गेम में FG']
      ] },
    { type: 'callout', kind: 'tip', title:'अप्सैम्पलिंग चुनने का व्यावहारिक नियम', html:'<ul><li><b>Native 4K + अच्छा कार्ड:</b> कोई अपस्केलर नहीं — "Quality/Ultra Quality" से नीचे न जाएँ, वरना टेक्स्ट/तार धुंधले (ghosting) होते हैं।</li><li><b>1080p पर FSR/DLSS Performance मोड:</b> बहुत ख़राब दिखता है; Balance/Quality ही रखिए।</li><li><b>Frame generation</b> तभी फ़ायदेमंद जब आधार FPS ~60 हो; कम आधार FPS पर FG = अधिक input lag व और बुरा pacing। इसे Competitive shooters में बंद रखिए।</li><li>हर अपस्केलर का अपना sharpness/clip स्लाइडर; मॉनिटर की own sharpness 0 पर रखकर तुलना कीजिए।</li></ul>' },

    { type: 'table', head: ['फ़ीचर', 'क्या बढ़ता है', 'कीमत (typical FPS)', 'किस हार्डवेयर पर ठीक'],
      rows: [
        ['Raster (पारंपरिक)', 'आधार — कोई RT नहीं', '100% रेफ़रेंस', 'हर कार्ड (DX9–DX12/Vulkan)'],
        ['RT shadows / AO', 'छायाँ सही सतह से', '10–25% गिरावट', 'RT कोर वाली कोई भी पीढ़ी'],
        ['RT reflections (मध्यम)', 'मीना/पानी/गाड़ी में असल प्रतिबिंब', '20–40%', 'Turing/RDNA2+ (छोटे BVH हेल्पर के साथ)'],
        ['RT GI / full RT (ultra)', 'लाइट bounced — सबसे भारी', '40–70%', 'Ampere/RDNA2 से ऊपर; 4K पर बड़ा कार्ड + अपस्केलर'],
        ['Path tracing (PT)', 'पूरी लाइट सिमुलेशन (रेल केवल)', '60–80% गिरावट, 2× VRAM जैसी', 'RTX 40/50 + DLSS 3/RR; RDNA3/4 + FSR3; 1080/1440 पर ही व्यावहारिक'],
        ['DLSS Ray Reconstruction', 'PT/DLSS में नॉइज़ कम, डीटेल बची', '5–15% FPS वापस', 'RTX 40/50 (कुछ फ़ीचर RTX 20+ तक)'],
        ['VRS (Variable Rate Shading)', 'किनारों पर कम shading', '10–20% FPS मुफ़्त', 'RDNA2+/RTX 30+ और DX12U गेम; सेटिंग में "Shading rate"']
      ] },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">1.7</span> ड्राइवर — असली ज़िम्मेदारी कौन निभाता है</h3>' +
      '<p>ग्राफ़िक्स "ड्राइवर" दो चीज़ों का मेल है: <b>Kernel-mode driver</b> (WDDM — Windows Display Driver Model 2.x का हिस्सा, GPU को कमांड भेजता/शेड्यूल करता है) और <b>User-mode component</b> (DirectX/Vulkan/OpenGL runtime, कंट्रोल पैनल, एनकोडर)। WDDM GPU को several ग्राहकों (गेम, डेस्कटॉप, ब्राउज़र) के बीच बाँटता है और हर कमांड एक <b>scheduling packet</b> बनकर जाती है।</p>' +
      '<p><b>TDR (Timeout Detection and Recovery):</b> अगर GPU एक एकात्मक सिंगल-निर्देश-समय से ज़्यादा (डिफ़ॉल्ट <b>2 सेकंड</b>) ड्राइवर का जवाब न दे, Windows ड्राइवर रीसेट कर देता है — स्क्रीन एक पल काली, फिर लॉग में "Display driver stopped responding and has recovered". ओवरक्लॉक/अस्थिर VRAM सबसे आम कारण; दूसरा कारण भारी compute/CUDA वर्कलोड (जहाँ 2 सेकंड स्वाभाविक है)। Registry में <code>TdrDelay</code> बढ़ाकर यह रीसेट टाला जा सकता है — <b>केवल ट्रेनिंग/रेंडर मशीन पर, सर्विस लैब के सामान्य PC पर नहीं</b>।</p>' +
      '<p><b>ड्राइवर ब्रांच:</b> NVIDIA — Game Ready (नए गेम के दिन-दबाया) बनाम Studio (क्रिएटिव ऐप पर टेस्ट किया, वही फ़ीचर, धीमे रिलीज़); AMD — Adrenalin (WHQL), plus "Optional/Preview" बिल्ड; Intel — Arc/इंटिग्रेटेड के लिए UAD ड्राइवर (Universal/Custom) व Intel Graphics Software। <b>WHQL</b> का मतलब Microsoft-सर्टिफ़ाइड; <b>UAD</b> का मतलब Windows Update से अपने आप न बदलने वाला ड्राइवर टाइप — इसीलिए "Do not include drivers with Windows Update" सेट करना ज़रूरी होता है।</p>' +
      '<p><b>रोलबैक व साफ़ इंस्टॉल:</b> समस्या नई ड्राइवर के बाद शुरू हुई हो → Device Manager → Roll Back Driver; वरना DDU से साफ़ कर के पुराना/स्थिर बिल्ड। ख़राब ड्राइवर के लक्षण: रैंडम black screen, "nvlddmkm" events, TDR reset, गलत colour depth, HDR ऑन करने पर स्क्रीन स्थिर नहीं, 4K वीडियो पर झटके।</p>' },

    { type: 'table', head: ['उपकरण/सेटिंग', 'क्या करता है', 'प्रैक्टिकल नोट'],
      rows: [
        ['Win + Ctrl + Shift + B', 'ग्राफ़िक्स ड्राइवर रीसेट (स्क्रीन 1 पल काली)', 'पहला आज़माने लायक साफ़-सुथरा कदम; कोई डेटा नहीं जाता'],
        ['Device Manager → Display adapter → Roll Back Driver', 'पिछला वर्ज़न लौटाना', 'बटन gray हो तो manual reinstall (पुराना .exe/.inf) रखिए'],
        ['Display Driver Uninstaller (DDU)', 'पूरा ड्राइवर स्टेक + registry हटाना', 'Safe mode में चलाएँ; नीचे स्टेप्स देखिए'],
        ['Optional updates / Device installation settings', 'Windows Update खुद ड्राइवर न डाले', 'Settings → Windows Update → Advanced options → Optional updates; या "Device installation settings → No"'],
        ['Group Policy: "Do not include drivers with Windows Update"', 'WU से driver payload रोकना', 'gpedit.msc → Computer Configuration → Administrative Templates → Windows Components → Windows Update'],
        ['pnputil /enum-drivers', 'सिस्टम के सारे ड्राइवर पैकेज सूची', 'पुराना/फ़ालतू INF देखकर /delete-driver से हटाना (provisioned: oemNN.inf)'],
        ['pnputil /delete-driver oemNN.inf /uninstall /force', 'एक ड्राइवर पैकेज हटाना', 'सिर्फ़ वही हटाएँ जो पहचाना हो; ग़लत INF से USB/ऑडियो मर सकता है'],
        ['GPU-Z / HWiNFO64', 'कोर-नाम, लेन, थ्रॉटल कारण, VRAM तापमान, हॉटस्पॉट', '"Bus Width", "Throttling reasons" व "GPU Hot Spot" — तीनों अलग-अलग रोग बताते हैं'],
        ['OCCT (GPU 3D + VRAM), Furmark, 3DMark, Superposition, Unigine Heaven', 'स्थिरता व तापमान का कसौटी', '15–30 मिनट लोड; VRAM टेस्ट में आर्टिफ़ैक्ट = मेमोरी/बॉन्डिंग दोष'],
        ['memtestGPGPU (Linux/CUDA)', 'VRAM में bit-error गिनना', 'लैब में Ubuntu boot करके चलाना सबसे भरोसेमंद VRAM परीक्षण'],
        ['dxdiag / msinfo32', 'WDDM वर्ज़न, DirectX feature level, ड्राइवर तारीख़', 'dxdiag → Display टैब; "Drivers" में version/date'],
        ['Event Viewer (System)', 'Display (TDR), WHEA-Logger, nvlddmkm, PCIe गलतियाँ', 'Source कॉलम से फ़िल्टर — "WHEA-Logger" (Hardware Error/Warning) व "Display" events'],
        ['Safe mode (DDU से पहले)', 'सफ़ाई के लिए सही माहौल', 'DDU Safe mode में चलाइए; normal mode में कुछ फ़ाइल/registry छूट जाते हैं']
      ] },

    { type: 'steps', items: [
      { n: 1, title: 'पहले सही ड्राइवर बिल्ड चुनकर डाउनलोड कीजिए', text: 'कंपनी की साइट (NVIDIA Drivers / AMD Support / Intel Download Center) से <b>.exe या .inf पैकेज</b> पहले रख लीजिए — DDU के बाद इंटरनेट बंद रहेगा। वर्ज़न चुनते समय: गेम के लिए Game Ready/Adrenalin, एडिटिंग/रेंडर के लिए Studio/WHQL।', tips: '2–3 महीने पुराना "स्थिर" बिल्ड अक्सर सबसे अच्छा होता है — नज़र रखिए Reddit/vendor forum पर।' },
      { n: 2, title: 'इंटरनेट अलग कीजिए + Windows Update से ड्राइवर रोकिए', text: 'लैन केबल निकालें/वाई-फ़ाई बंद। फिर <b>Settings → Windows Update → Advanced options → Optional updates</b> में दिखाए गए ड्राइवर न चुनें, और <b>Device installation settings → No</b> कर दें। वरना रीबूट के बीच में WU अपना बंडल ड्राइवर डाल देता है और सब गड़बड़।' },
      { n: 3, title: 'Safe mode में जाइए', text: '<b>Win + R → msconfig → Boot टैब → "Safe boot" (Minimal)</b> → Restart, या Settings → Recovery → Advanced startup → Troubleshoot → Startup Settings → F4। Safe mode में Microsoft का बुनियादी ड्राइवर चलता है, वेंडर का नहीं।', warn: 'Normal mode में DDU चलाने से कुछ फ़ाइलें/registry एंट्री छूट जाती हैं — फिर भी समस्या बनी रहती है।' },
      { n: 4, title: 'DDU में GPU चुनकर "Clean and restart"', text: 'Display Driver Uninstaller खोलें → Device type = <b>GPU</b> → vendor चुनें → बटन <b>"Clean and restart"</b>। विकल्पों में "Remove PCIe Root Enumeration Device(s)" सिर्फ़ तब जब PCIe/लेन की समस्या हो; "Do not reset..." जैसी चेकबॉक्स केवल विशेष केस।', tips: 'DDU → Options → "Create a save of the currently installed driver" चालू रखिए, पिछली बार के लिए।' },
      { n: 5, title: 'रीबूट के बाद ड्राइवर इंस्टॉल (Custom)', text: 'Normal mode में वापस। इंस्टॉलर में <b>Custom / Advanced</b> चुनें और <b>"Perform a clean installation"</b> टिक करें (NVIDIA) या AMD में "Factory Reset"। iGPU + dGPU दोनों वाला सिस्टम हो तो पहले iGPU, फिर dGPU का ड्राइवर।' },
      { n: 6, title: 'प्राथमिक सेटिंग दोबारा बनाइए', text: 'रिज़ॉल्यूशन व <b>रिफ़्रेश रेट</b> (Settings → Display → Advanced display), रंग गहराई 8/10-bit, <b>HDR</b> ऑन/ऑफ़, Adaptive-Sync/G-Sync ऑन, कंट्रोल पैनल की 3D प्रीफ़रेन्स (Power management = Prefer maximum performance सिर्फ़ ज़रूरत पर)।', warn: 'नई इंस्टॉल के बाद मॉनिटर 60 Hz पर अटक जाता है — यही सबसे आम भूली हुई जाँच है।' },
      { n: 7, title: 'पुष्टि कीजिए', text: 'GPU-Z में ड्राइवर वर्ज़न/तारीख़, Device Manager में कोई "!" नहीं, <b>dxdiag</b> → Display → Driver version, Event Viewer → System खाली (कोई नया "Display" event नहीं)। फिर 15–20 मिनट बेंचमार्क/गेम चलाकर तापमान व थ्रॉटल कारण देखिए।' },
      { n: 8, title: 'अब भी वैसा ही? तुलना कीजिए', text: 'अगला कदम: पिछला स्थिर बिल्ड DDU करके डालिए, फिर दूसरा मॉनिटर/केबल/पोर्ट आज़माइए, अंत में कार्ड दूसरे PC पर। इसी क्रम से पता चलता है कि दोष <b>ड्राइवर</b> में था, <b>केबल/मॉनिटर</b> में, या <b>कार्ड</b> में।', tips: 'एक समय में एक ही चीज़ बदलिए — दो बदलेंगे तो कारण कभी नहीं पकड़ेगा।' }
    ] },

    { type: 'code', code: '/* TDR (Timeout Detection & Recovery) — Windows का 2-सेकंड नियम */\nrem डिफ़ॉल्ट: TdrDelay = 2 सेकंड, TdrDdiDelay = 5 सेकंड\nrem केवल रेंडर/CUDA वर्कलोड वाली मशीन पर बढ़ाएँ — गेमिंग PC पर नहीं\n\nreg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /t REG_DWORD /d 8 /f\nreg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDdiDelay /t REG_DWORD /d 8 /f\nshutdown /r /t 0\n\n/* ड्राइवर पैकेज सूची व हटाना (बचाव के लिए पहले नोट कर लें) */\npnputil /enum-drivers\npnputil /delete-driver oem27.inf /uninstall /force\n\n/* ग्राफ़िक्स ड्राइवर त्वरित रीसेट (कोई रीबूट नहीं) */\nWin + Ctrl + Shift + B\n\n/* ख़राब ड्राइवर से बचने की सेटिंग */\nSystemPropertiesHardware.exe   -> Device installation settings -> No\nmsconfig -> Boot -> Safe boot (Minimal)   /* DDU से पहले */' },

    { type: 'table', head: ['लक्षण / पैरामीटर', 'सबसे संभावित कारण व मानक मान', 'कदम (इसी क्रम में)'],
      rows: [
        ['ड्राइवर डालते ही काली स्क्रीन', 'नया ड्राइवर/विंडोज़ अपडेट टकराव; iGPU+dGPU क्रम ग़लत', 'Win+Ctrl+Shift+B → Safe mode में Roll Back → DDU से दोबारा (ऊपर के स्टेप्स)'],
        ['"Display driver stopped responding and has recovered"', 'TDR — अस्थिर कोर/VRAM ओवरक्लॉक, या 2 s से लंबा compute', 'सारा OC रीसेट, पावर लिमिट 80%, फिर TdrDelay (केवल वर्कस्टेशन)'],
        ['BSOD: Video_TDR_ERROR / VIDEO_DXGKRNL_FATAL_ERROR', 'Kernel-mode ड्राइवर या हार्डवेयर', 'DDU + स्थिर बिल्ड, केबल/स्लॉट, अंत में दूसरा कार्ड आज़माइए'],
        ['Device Manager में "Code 43"', 'ग़लत/माइनिंग VBIOS, पहचान विफल, PCIe ट्रेनिंग दोष', 'GPU-Z में BIOS version मिलाइए, अलग स्लॉट, असली VBIOS फ़्लैश (जोखिम), RMA'],
        ['Event Viewer → WHEA-Logger / PCIe errors', 'लेन ख़राब, धूल/अधूरा बैठा कार्ड, राइज़र, कमज़ोर 12V', 'दोबारा सीट + रबर सफ़ाई, राइज़र हटाइए, दूसरा SMPS'],
        ['आर्टिफ़ैक्ट — रंगीन धब्बे/पॉलिगन/लाइन', 'VRAM टूटना, कोर अस्थिर, OC, गर्मी', 'OC off, memtestGPGPU/OCCT VRAM, ठंडा करके परखें; idle पर भी आर्टिफ़ैक्ट = कार्ड का अंत नज़दीक'],
        ['फैन 100%, core कम पर hot-spot 105°C+', 'थर्मल पेस्ट सूखा, पैड हटे, हीटसिंक का संपर्क ख़राब', 'पेस्ट/पैड बदलें (सही मोटाई), स्क्रू टॉर्क क्रॉस-पैटर्न; गड़बड़ हो तो प्रो सर्विस'],
        ['लोड पर अचानक बंद/रीस्टार्ट (POST ठीक)', 'SMPS की 12V धारण नहीं, स्पाइक, ढीला केबल', 'दूसरा/बड़ा SMPS, अलग केबल, बिना एडाप्टर के 12VHPWR सीट जाँच'],
        ['बेंचमार्क में धीरे-धीरे FPS गिरना', 'थर्मल/पावर थ्रॉटल (85–95°C limit)', 'एयरफ़्लो, फैन कर्व, अंडरवोल्ट, धूल; तापमान 75–80°C लक्ष्य'],
        ['Power limit स्लाइडर', 'आम तौर पर +5 से +15%/20% (ठंडा होने पर ही भरोसा)', 'ऊँचा लिमिट = ज़्यादा गर्मी; पहले कूलिंग सुधारिए'],
        ['Core clock offset', 'पीढ़ी पर निर्भर; +50 से +150 MHz आम, फिर असफल', '5 MHz के चरण, हर बदलाव पर 10 मिनट टेस्ट; विफल होते ही -30 MHz'],
        ['Memory (VRAM) clock offset', 'GDDR6/6X +200 से +1000 MHz तक संभव; GDDR7 अक्सर कम हैडरूम', 'आर्टिफ़ैक्ट आते ही रीसेट — VRAM OC से नुकसान बड़ा'],
        ['Undervolt (curve editor)', 'सबसे अच्छा ROI: 60–80°C पर वही या बेहतर FPS', 'MSI Afterburner में Ctrl+F से कर्व; वोल्टेज स्लाइडर लॉक हो तो भी चलता'],
        ['Temp target + hysteresis', '65–75°C target, 5–8°C hysteresis', 'ग़लत hysteresis = फैन बार-बार चालू/बंद (buzzing)'],
        ['सेकंड-हैंड/माइनिंग कार्ड — बाहरी जाँच', 'VRM/PCB रंग बदलाव, जले हुए पैड, गिरा/टूटा हीटसिंक या ढक्कन, फैन घिसाव', 'बैकप्लेट खोलकर देखें; पैड नए लगें तो अच्छा; फैन में खुरचनी आवाज़ = बदलवाएँ'],
        ['सेकंड-हैंड कार्ड — सॉफ़्टवेयर परीक्षण', 'BIOS मेल, VRAM एरर, लेन गिरावट', 'GPU-Z (Bus Width, BIOS), OCCT GPU3D 20 मिनट + VRAM टेस्ट, memtestGPGPU, 2 मॉनिटर पर HDMI/DP सब पोर्ट टेस्ट, वारंटी/बिल माँगें']
      ] },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">2.1</span> पैनल के प्रकार व LCD की भौतिकी (servicing ज्ञान)</h3>' +
      '<p><b>LCD का सिद्धांत तीन चीज़ों पर खड़ा है:</b> (1) <b>ध्रुवक (polarizer)</b> — केवल एक दिशा की प्रकाश-तरंगें पास होने देते हैं; (2) <b>तरल क्रिस्टल (liquid crystal)</b> — वोल्टेज से अपने अणु घुमाते/खोलते हैं और ध्रुवण का कोण बदलते हैं; (3) <b>रंग फ़िल्टर (RGB color filter)</b> — सफ़ेद प्रकाश को लाल/हरा/नीला बनाते हैं। पीछे <b>बैकलाइट</b> (आज LED स्ट्रिप + ड्यूटी/प्राइज़्म शीट, पुराने में CCFL ट्यूब)। ध्रुवक क्रॉस पर रखें तो अंधेरा — इसीलिए ध्रुवक उखड़े पैनल पर सनस्क्रीन/फ़िल्म देखने पर बैंगनी-पीला आँच आता है (लैब में अक्सर "पैनल मर गया" की ग़लत रिपोर्ट यही होती है)।</p>' +
      '<p><b>वोल्टेज का काम:</b> TN में क्रिस्टल 90° मोड़ते हैं, IPS में क्षैतिज क्षेत्र (fringe field) से अणु खड़े/लेट होते हैं, VA में खड़े अणु झुककर रोशनी रोकते/जाने देते हैं। इसीलिए <b>TN तेज़ पर देखने का कोण ख़राब</b>, <b>IPS रंग/कोण अच्छे पर "IPS glow"</b>, <b>VA कॉन्ट्रास्ट 3000:1+ पर काले में डूबन (black crush) व धीमी ट्रांज़िशन</b>। तापमान का असर सच है — ठंडे पैनल में GtG धीमा होता है, इसीलिए सर्दी की सुबह गेम में ghosting ज़्यादा दिखता है।</p>' +
      '<p><b>नाम का भ्रम (दुकान पर सबसे ज़्यादा):</b> "LED मॉनिटर/TV" = सिर्फ़ <b>LCD जिनकी बैकलाइट LED है</b>। <b>QLED (Samsung) = LCD + quantum-dot फिल्म</b>, OLED नहीं। <b>QD-Mini LED / QNED = Mini-LED बैकलाइट वाला LCD</b>। असल self-emissive सिर्फ़ OLED, WOLED, QD-OLED व (सस्ता अब नहीं) MicroLED हैं।</p>' +
      '<table class="tbl"><thead><tr><th>पैनल तकनीक</th><th>रोशनी</th><th>कॉन्ट्रास्ट/काला</th><th>गति व कोण</th><th>ख़ास जोखिम/नोट</th></tr></thead><tbody>' +
      '<tr><td>TN</td><td>LCD बैकलाइट</td><td>700:1–1000:1, middling</td><td>सबसे तेज़ व सस्ता; कोण बहुत ख़राब (ऊपर से देखें तो रंग उलटे)</td><td>सस्ता गेमिंग/पुराने लैपटॉप; आज सिर्फ़ extreme-budget</td></tr>' +
      '<tr><td>IPS (और Nano-IPS/ADS)</td><td>LCD बैकलाइट</td><td>800:1–1500:1</td><td>कोण/रंग श्रेष्ठ; GtG 1–5 ms तक</td><td>IPS glow; ऑफिस/डिज़ाइन का मानक</td></tr>' +
      '<tr><td>VA (MVA/PVA)</td><td>LCD बैकलाइट</td><td>2500:1–6000:1</td><td>धीमे dark ट्रांज़िशन (black crush/smearing)</td><td>फ़िल्म व मीडिया के लिए अच्छा, तेज़ पैन के लिए कमज़ोर</td></tr>' +
      '<tr><td>Mini-LED (backlight)</td><td>सैकड़ों–हज़ारों LED ज़ोन + local dimming</td><td>ज़ोन के हिसाब से बहुत ऊँचा</td><td>पैनल IPS/VA ही रहता है</td><td><b>halo/blooming</b> — सफ़ेद टेक्स्ट पर चमक-आभा; काले कमरे में दिखता है</td></tr>' +
      '<tr><td>OLED (W-OLED)</td><td>self-emissive श्वेत स्टैक + रंग फ़िल्टर</td><td>अनंत (पिक्सेल बंद = 0 nit)</td><td>~0.03–0.1 ms</td><td>बर्न-इन, ABL (ऑटो ब्राइटनेट लिमिट), टेक्स्ट सब-पिक्सेल मुद्दे</td></tr>' +
      '<tr><td>QD-OLED</td><td>नीला OLED + क्वांटम डॉट परत</td><td>अनंत + बड़ा रंग-आयतन</td><td>बहुत तेज़</td><td>सफ़ेद में हल्का नीला/हरा रंग-छाया (पुराने बिल्ड), बर्न-इन जोखिम बना रहता है</td></tr>' +
      '<tr><td>MicroLED</td><td>अकार्बिक self-emissive माइक्रो LED</td><td>अनंत, बर्न-इन जोखिम नगण्य</td><td>तेज़</td><td>आज के लिए बड़ी-स्क्रीन/महँगा मॉड्यूलर वॉल; टेबलटॉप में दुर्लभ</td></tr>' +
      '<tr><td>Plasma (PDP)</td><td>निऑन/ज़ेनॉन cell UV + फ़ॉस्फ़ोर</td><td>अच्छा काला</td><td>तेज़</td><td>~2014 के बाद उत्पादन बंद; बर्न-इन व 60 Hz सीमा; धूल/पंखा सर्विस</td></tr>' +
      '<tr><td>E-paper (E-Ink)</td><td>प्रतिबिंबित (reflective), बिजली केवल बदलाव पर</td><td>कागज़ जैसा, कोई बैकलाइट नहीं</td><td>बहुत धीमा (सेकंड)</td><td>पढ़ने/साइनबोर्ड; क्लासरूम डेस्क पर आँखों के लिए सबसे हल्का</td></tr>' +
      '<tr><td>PLC वर्ग (Cholesteric/polymer variants)</td><td>reflective/bistable LCD भिन्नता</td><td>कम</td><td>बहुत धीमा, bistable</td><td>विशेष-उपयोग (always-on टैग/ डिस्प्ले); डेटाशीट से पुष्टि कीजिए</td></tr>' +
      '</tbody></table>' +
      '<table class="tbl"><thead><tr><th>सब-पिक्सेल व्यवस्था</th><th>कहाँ</th><th>टेक्स्ट/आँख पर असर</th></tr></thead><tbody>' +
      '<tr><td>RGB stripe (मानक)</td><td>ज़्यादातर IPS/VA/TN</td><td>स्पर्श-सही; ClearType जैसा</td></tr>' +
      '<tr><td>BGR stripe</td><td>कई IPS पैनल (लैपटॉप/मॉनिटर)</td><td>Windows को ClearType की दिशा/क्रम बतानी पड़ती है, वरना किनारे रंगीन</td></tr>' +
      '<tr><td>RGBW / चार-सब-पिक्सेल ("PenTile जैसा")</td><td>सस्ते 4K पैनल, कुछ टैबलेट/TV</td><td>सफ़ेद चमक बढ़ती है पर सूक्ष्म टेक्स्ट व तार धुंधले — कोडिंग/डिज़ाइन के लिए बुरा</td></tr>' +
      '<tr><td>RWBG / तिरछी व्यवस्था</td><td>कुछ WOLED/QD-OLED मॉनिटर व TV पैनल</td><td>छोटा फ़ॉन्ट रंग-किनारे वाला; 150%+ scaling या 14 pt से ऊपर आराम</td></tr>' +
      '</tbody></table>' +
      '<p><b>सर्विस नुक्ता:</b> "डॉट डेड है" की शिकायत का 40% कारण पैनल नहीं — <b>गंदगी/धूल का कण</b> होता है जो polarizer के बीच घुस जाता है। एज-लिट पैनल में वह कण चमकती लाइन/धब्बे के रूप में दिखता है। कपड़ा व आइसोप्रोपिल-मुक्त सफ़ाई ही उपाय; प्रेशर से polarizer खराब होता है।</p>' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">2.2</span> HDR, रंग व रिज़ॉल्यूशन — तीन अलग-अलग परीक्षाएँ</h3>' +
      '<p><b>HDR (High Dynamic Range)</b> के लिए पैनल में चार चीज़ें एक साथ चाहिए: ऊँचा पीक ब्राइटनेस (nits = cd/m²), बहुत कम ब्लैक लेवल, 10-बिट गहराई, और चौड़ा रंग-आयतन (wide colour gamut) — इनमें से एक भी कम तो "HDR" सिर्फ़ एक बटन बन जाता है। सिग्नल की भाषा दो हैं: <b>PQ / SMPTE ST 2084</b> (absolute brightness — HDR10, HDR10+, Dolby Vision) और <b>HLG</b> (relative — प्रसारण/broadcast, पुराने SDR TV पर भी दिख जाता है)।</p>' +
      '<p><b>8-bit + FRC बनाम सच्चा 10-bit:</b> FRC (Frame Rate Control) पिक्सेल को तेज़ी से दो मानों के बीच झूलने देकर 8-बिट को 10-बिट जैसा दिखाता है — ज़्यादातर लोगों को फ़र्क़ नहीं दिखता, मगर धीमे ग्रेडिएंट (आसमान, स्टूडियो बैकड्रॉप) में banding दिख सकता है। इसी तरह <b>6-bit + FRC ≈ 8-bit</b> और <b>8-bit + dithering</b> आम बजट पैनल हैं; डेटाशीट में "10-bit (8-bit+FRC)" लिखा हो तो वह सच्चा 10-bit नहीं।</p>' +
      '<p><b>Local dimming व halo:</b> Mini-LED/edge-lit पैनल में LED ज़ोन अलग-अलग जलते/बुझते हैं। कम ज़ोन (10–50) = चमकती चीज़ के चारों ओर आभा (halo/blooming), बहुत ज़ोन (500–2000+) = कम दिखाई देता है पर "breathing" (ज़ोन का झपकना) दिखाई सकता है। OLED को इसकी ज़रूरत नहीं — हर पिक्सेल स्वतंत्र।</p>' +
      '<p><b>रंग की परख:</b> <b>Delta E (ΔE)</b> = मापे गए व लक्ष्य रंग का अंतर; ΔE &lt; 2 अच्छा, &lt; 1 प्रो-स्तर। <b>coverage</b> (कितना % आयतन छुआ) व <b>volume</b> (चमक पर कितना रंग बचा) अलग बातें हैं — 95% P3 coverage वाला सस्ता पैनल 400 nits पर रंग खो देता है। <b>Gamma 2.2</b> Windows डेस्कटॉप/sRGB का मानक, <b>~2.4 (BT.1886)</b> अंधेरे कमरे का वीडियो मानक, <b>white point D65 (6500 K)</b> — यही "Warm/Cool" प्रीसेट का असली मतलब है।</p>' +
      '<table class="tbl"><thead><tr><th>VESA DisplayHDR स्तर</th><th>न्यूनतम पीक (nits)</th><th>ब्लैक</th><th>आवश्यकता (वर्ग)</th><th>क्या ख़रीदने लायक</th></tr></thead><tbody>' +
      '<tr><td>HDR 400</td><td>400</td><td>≤0.4</td><td>10-bit इनपुट (8+FRC स्वीकार), sRGB-वर्ग आयतन, कोई dimging अनिवार्य नहीं</td><td>"HDR-सिर्फ़-बटन" — सच्चा HDR अनुभव नहीं</td></tr>' +
      '<tr><td>HDR 500</td><td>500</td><td>≤0.05 (वर्ग)</td><td>local dimming ज़रूरी</td><td>कम-बजट HDR वीडियो, halo आ सकता है</td></tr>' +
      '<tr><td>HDR 600</td><td>600</td><td>≤0.02</td><td>DCI-P3 वर्ग आयतन + local dimming</td><td>ठीक-ठाक; गेमिंग/फ़िल्म में फ़र्क़ दिखता है</td></tr>' +
      '<tr><td>HDR 1000</td><td>1000</td><td>≤0.001</td><td>सैकड़ों zonal dimming, 10-bit</td><td>सच्चा HDR; Mini-LED/कम ज़ोन में breathing जाँचें</td></tr>' +
      '<tr><td>HDR 1400</td><td>1400</td><td>≤0.0005</td><td>बहुत ज़्यादा ज़ोन + तेज़ ट्रांज़िशन</td><td>प्रीमियम; कीमत भी प्रीमियम</td></tr>' +
      '<tr><td>True Black 400/500/600</td><td>400/500/600</td><td>≤0.0005 (per-pixel)</td><td>OLED — dimming की ज़रूरत नहीं, 95%+ P3 वर्ग</td><td>अंधेरा कमरा, HDR फ़िल्म व गेम के लिए सबसे भरोसेमंद</td></tr>' +
      '</tbody></table>' +
      '<table class="tbl"><thead><tr><th>रंग-आयतन/पैरामीटर</th><th>कहाँ का मानक</th><th>व्यावहारिक बात</th></tr></thead><tbody>' +
      '<tr><td>sRGB / ITU-R BT.709</td><td>वेब, ऑफिस, Windows, ज़्यादातर वीडियो</td><td>99–100% sRGB = ऑफिस/क्लास के लिए काफ़ी; अतिरिक्त "vivid" मोट फ़र्क़ नहीं</td></tr>' +
      '<tr><td>DCI-P3</td><td>सिनेमा व HDR मॉस्टरिंग</td><td>90–95% P3 वाला मॉनिटर HDR व फ़ोटो में दिखने लायक बेहतर</td></tr>' +
      '<tr><td>Adobe RGB</td><td>प्रिंट/पब्लिशिंग</td><td>फ़ोटो-प्रिंटिंग के लिए ज़रूरी; केवल 100% sRGB पैनल पर प्रिंट रंग नहीं मेल खाते</td></tr>' +
      '<tr><td>Rec. 2020 (BT.2020)</td><td>UHDTV/HDR का लक्ष्य आयतन</td><td>आज के सर्वश्रेष्ठ पैनल भी 70–90% ही छूते हैं — "100% Rec.2020" दावा देखें तो हँसिए</td></tr>' +
      '<tr><td>Gamma 2.2 / 2.4</td><td>Windows/sRGB बनाम अंधेरे कमरे का वीडियो</td><td>शुक्र-चक्र? नहीं — मॉनिटर OSD में "Gamma/Swatch" सेट करके चेहरा-छायाँ सही होते हैं</td></tr>' +
      '<tr><td>White point D65</td><td>सभी प्रो-मानक</td><td>"Cool" प्रीसेट 8000–9500 K = नीला व थकान; क्लासरूम में Normal/sRGB रखें</td></tr>' +
      '<tr><td>ICC/ICM प्रोफ़ाइल</td><td>Windows Color Management</td><td>Control Panel → Color Management → device का ICC; ऐप "Let system handle" या "Let application handle"</td></tr>' +
      '</tbody></table>' +
      '<table class="tbl"><thead><tr><th>मोड (रेज़ोल्यूशन)</th><th>अनुपात</th><th>पिक्सेल</th><th>मेगापिक्सेल</th><th>PPI कहाँ अच्छा</th></tr></thead><tbody>' +
      '<tr><td>1280×720 (720p)</td><td>16:9</td><td>921,600</td><td>0.92</td><td>13–15 इंच पर भी धुंधला — सिर्फ़ पुराने प्रोजेक्टर/Tv</td></tr>' +
      '<tr><td>1366×768</td><td>~16:9</td><td>1,048,320</td><td>1.05</td><td>सस्ता 11–14 इंच लैपटॉप; आज अपर्याप्त</td></tr>' +
      '<tr><td>1920×1080 (FHD)</td><td>16:9</td><td>2,073,600</td><td>2.07</td><td>22–24 इंच (92–100 PPI) बिल्कुल ठीक; 27 इंच पर 82 — दाँते दिखते</td></tr>' +
      '<tr><td>1920×1200 / 2560×1600</td><td>16:10</td><td>2.30 M / 4.10 M</td><td>2.30 / 4.10</td><td>कागज़/कोड के लिए ऊँचाई का फ़ायदा</td></tr>' +
      '<tr><td>2560×1440 (QHD)</td><td>16:9</td><td>3,686,400</td><td>3.69</td><td>27 इंच = 109 PPI — आज का सर्वश्रेष्ठ संतुलन</td></tr>' +
      '<tr><td>3440×1440</td><td>21:9 (ultrawide)</td><td>4,953,600</td><td>4.95</td><td>34 इंच; दो विंडो साइड-बाइ-साइड, पर गेम में ब्लैक बार</td></tr>' +
      '<tr><td>3840×2160 (4K UHD)</td><td>16:9</td><td>8,294,400</td><td>8.29</td><td>24–27 इंच = 163–184 PPI; Windows 150% स्केलिंग साथ में</td></tr>' +
      '<tr><td>5120×2880 (5K)</td><td>16:9</td><td>14,745,600</td><td>14.7</td><td>27 इंच = ~219 PPI; Retina-जैसा टेक्स्ट, GPU भारी</td></tr>' +
      '<tr><td>7680×4320 (8K)</td><td>16:9</td><td>33,177,600</td><td>33.2</td><td>60 इंच+ पर अर्थ; PC पर DSC/DP2.1 चाहिए</td></tr>' +
      '</tbody></table>' +
      '<p><b>Windows scaling का असल नियम:</b> स्केलिंग का मतलब रेज़ोल्यूशन नहीं, UI का आकार है। 4K 27 इंच पर <b>150%</b> ( डिफ़ॉल्ट) या 200% — 100% पर टेक्स्ट कागज़-सा छोटा। <b>DPI awareness</b> तीन स्तर: Per-Monitor v2 (आधुनिक ऐप, हर मॉनिटर पर सही), System (मिला-जुला), Unaware (पुराना ऐप — Windows उसे bitmap खींचकर बड़ा करता है = धुंधला)। धुंधले पुराने ऐप के लिए: ऐप का .exe → Properties → <b>Compatibility → Change high DPI settings → "Override high DPI scaling behavior" → System (Enhanced)</b>। मिश्रित-DPI मॉनिटर (एक 100%, दूसरा 150%) पर पुराने Windows में ड्रैग करते समय आकार झटका खाता था — आज भी कुछ ऐप में दिखता है।</p>' },

    { type: 'table', head: ['मानक / पैरामीटर', 'कौन बनाता है कहाँ चलता है', 'क्या तय करता है', 'प्रैक्टिकल नोट'],
      rows: [
        ['HDR10', 'CDA/UHD Blu-ray का आधार; HDMI व DP दोनों में', '10-bit, PQ (ST 2084), BT.2020 आयतन, <b>static</b> मेटाडेटा (1000 nits master)', 'हर "HDR" टेलीविज़न/मॉनिटर पर मौजूद — यही न्यूनतम शर्त'],
        ['HDR10+', 'Samsung/20th Century/Amazon, रॉयल्टी-मुक्त', 'scene-by-scene <b>dynamic</b> मेटाडेटा', 'सैमसंग TV/मॉनिटर व कुछ ऐप; मॉनिटर पर दुर्लभ'],
        ['Dolby Vision', 'Dolby (लाइसेंस + हार्डवेयर)', 'dynamic मेटाडेटा, 12-bit तक mastering, 10,000 nits तक संदर्भ', 'TV/फ़ोन/स्ट्रीमिंग में आम; PC मॉनिटर लगभग नहीं, iGPU/डिस्प्ले चेन? नहीं — सतह पर: HDMI/DP पर Dolby Vision सिर्फ़ चुनिंदा TV'],
        ['HLG (Hybrid Log-Gamma)', 'BBC/NTT, ITU-R BT.2100', 'relative कर्व, कोई मेटाडेटा नहीं — प्रसारण के लिए', 'लाइव स्पोर्ट/डिजिटल TV; SDR रिसीवर पर भी दिख जाता है'],
        ['PQ (Perceptual Quantizer)', 'SMPTE ST 2084', 'nits का absolute नक्शा (0.0001–10,000)', 'यही HDR "ब्राइटनेस कोडिंग" है; gamma से अलग'],
        ['CTA-861 (HDMI) HDR विज़ुअल डेटा', 'CTA', 'मॉनिटर की क्षमता EDID में लिखना (nits/आयतन)', 'इसी को Windows/कंसोल पढ़कर HDR "Auto" सेटिंग बनाते हैं'],
        ['bit depth (8/10/12)', '—', 'प्रति चैनल मान; 10-bit = 1024', '10-bit पर DP/HDMI बैंडविड्थ +1/3 — 4K120 10-bit RGB अक्सर DSC माँगता है'],
        ['ΔE (Delta E 2000)', 'रंगविज्ञान', 'रंग-त्रुटि की माप-इकाई', '&lt;2 अच्छा, &lt;1 प्रो; फ़ैक्ट्री कैलिब्रेशन रिपोर्ट में औसत व max दोनों देखें'],
        ['gamma 2.2 / BT.1886 (≈2.4)', 'sRGB व ITU-R', 'मध्य-टोन की चमक वक्रता', 'OSD में gamma प्रीसेट; वीडियो देखने वालों के लिए 2.4 बेहतर'],
        ['white point D65', 'CIE', 'सफ़ेद की "उम्र" ≈ 6500 K', 'सिनेमा/प्रिंट मानक; "Cool" = 8000 K+ = नीला व आँख थकान'],
        ['ICC/ICM प्रोफ़ाइल', 'IPA मानक; Windows Color Management', 'पैनल की असलता का नक्शा, ऐप को भेजा जाता है', 'DisplayCAL/ArgyllCMS व प्रोफ़ाइल को default बनाकर; प्रिंटर के लिए अलग ICC'],
        ['CalMAN (Portrait Displays)', 'व्यावसायिक कैलिब्रेशन सॉफ़्टवेयर', 'पैटर्न जनरेशन + प्रोब से लूप बंद करना, 3D LUT', 'परीक्षा-प्रश्न: "CalMAN क्या है?" — प्रो कैलिब्रेशन/वैलिडेशन टूल, DisplayCAL इसका मुक्त विकल्प'],
        ['local dimming zones', 'पैनल निर्माता', 'कितने LED समूह स्वतंत्र जलते हैं', '12 zone वाला "HDR 400" केवल मार्केटिंग; zone की संख्या व एल्गोरिदम दोनों मायने'],
        ['HDRVivid / ICE', 'चीन का मानक (2021+)', 'dynamic मेटाडेटा का एक और विकल्प', 'भारत में उपलब्धता नगण्य — नाम भर पता हो तो ठीक']
      ] },

    { type: 'table', head: ['पैरामीटर / मानक', 'क्या मापता है', 'आदर्श/आम मान', 'जाल व ध्यान'],
      rows: [
        ['Refresh rate (Hz)', 'प्रति सेकंड नया फ़्रेम', '60/75/100/120/144/165/240/360/480/540', '144 Hz तभी जब केबल/पोर्ट उस बैंडविड्थ पर हो (अक्सर DP चाहिए, HDMI 2.0 नहीं)'],
        ['Response time GtG', 'ग्रे-से-ग्रे बदलने का समय (ISO माप)', 'IPS 1–5 ms, VA 4–10 ms, OLED ~0.1 ms', "बॉक्सी '1 ms' विज्ञापन अधिकतर सबसे तेज़ ओवरड्राइव मोड का होता है"],
        ['MPRT', 'मूविंग पिक्सेल कितनी देर दिखता है (blur)', '1 ms MPRT ≈ 1 ms persistence', 'GtG 1 ms + MPRT 8 ms = अभी भी धुंधला; sample-and-hold यही कारण'],
        ['Overdrive (OD/Trace Free)', 'वोल्टेज बढ़ाकर क्रिस्टल तेज़ घुमाना', 'OSD में Normal/High; AMD Trace Free 60–80 वर्ग', 'बहुत ज़्यादा = <b>inverse ghosting/overshoot</b> (किनारे चमकदार corona)'],
        ['V-Sync', 'फ़्रेम को रिफ़्रेश से मेल', 'ऑन = tearing नहीं, ऑफ़ = tearing', 'V-Sync ऑन + बिना adaptive sync = input lag व stutter'],
        ['Adaptive-Sync (DP मानक)', 'Variable refresh का खुला आधार', 'VESA Adaptive-Sync/FreeSync एक ही परिवार', 'पुराने कार्ड/केबल परपोर्ट भेद करता है — DP पर ज़्यादा भरोसा'],
        ['AMD FreeSync', 'AMD प्रमाणन स्तर', 'आधार; Premium ≥120 Hz (1080/1440), Premium Pro ≥120 Hz + HDR (1440p वर्ग)', 'LFC (Low Framerate Compensation) के बिना रेंज के नीचे गिरने पर sync टूटता है'],
        ['NVIDIA G-Sync (मॉड्यूल) / Ultimate', 'हार्डवेयर स्केलर + गैप-फ़िल', 'Ultimate = ≥240 Hz? नहीं — ≥ 1000 nits वर्ग HDR + 144 Hz', 'सबसे भरोसेमंद रेंज व anti-ghosting; कीमत ऊपर'],
        ['G-Sync Compatible', 'सॉफ़्टवेयर प्रमाणन (Adaptive-Sync पर)', 'बजट 144 Hz मॉनिटर भी सूची में', 'सूची (monitors/notebooks database) में मॉनिटर काexact मॉडल देखें'],
        ['HDMI VRR (HDMI 2.1)', 'कंसोल व नए TV के लिए', 'PS5/Xbox 4K120 VRR', 'HDMI 2.0 वाले मॉनिटर में VRR नहीं/अस्थिर; eARC का VRR से कोई संबंध नहीं'],
        ['LG Q-Sync / ब्रांड-वैरिएंट', 'निर्माता-मानक? नहीं — विभिन्न ब्रांड का अपने-नाम का sync', 'TV/मॉनिटर पर FreeSync-आधारित', 'NVIDIA कार्ड + FreeSync TV: कंट्रोल पैनल में "Enable G-Sync Compatible" manually'],
        ['Input lag / game mode', 'सिग्नल मिलने से पिक्सेल बदलने तक', 'अच्छा गेमिंग मॉनिटर ~5–15 ms; TV में game mode से 15–30 ms तक सुधार', 'TV पर game mode बंद = 80–150 ms — लैग से शूटिंग मुश्किल'],
        ['Black Frame Insertion (BFI/ULMB)', 'हर फ़्रेम के बीच काला फ़्रेम', '120 Hz पर BFI ≈ 60 Hz की brightness', 'blur घटाता है, brightness व flicker बढ़ाता है; Adaptive-Sync के साथ प्रायः बंद'],
        ['PWM dimming/flicker', 'कम चमक पर बैकलाइट झपकाना', 'कम चमक पर सिर-दर्द = संभावित PWM', '"Flicker-free" दावा/TÜV सर्टिफ़िकेशन देखें; DC-dimming वाला पैनल चुनें'],
        ['OLED burn-in व keepers', 'स्थिर तत्व (टास्कबार/लोगो) की स्थायी छाप', 'समय व चमक से बढ़ता है', 'OSD में <b>Pixel refresh/Pixel cleaning</b> (लैप/रात), screen shift, auto-off; TASKBAR ऑटो-हाइड आदत'],
        ['पैनल/बैकलाइट जीवन', 'आम तौर पर अर्ध-चमक तक घंटे', 'LED बैकलाइट 30,000–50,000 h; OLED भिन्न (blue decay)', '24×7 उच्च चमक पर रखना सबसे बड़ा क़ातिल; क्लासरूम में 60–70% चमक रखें']
      ] },

    /* @@CONT1@@ */
  ]
}
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id:'hw-periph', icon:'🖨️', group:'हार्डवेयर गहराई',
  title:'पेरिफेरल्स व प्रिंटर — इनपुट से छपाई तक',
  sub:'कीबोर्ड-माउस की बनावट, स्कैनर, लेज़र प्रिंटर के 7 चरण, टोनर, ड्राइवर व सर्विसिंग',
  kicker:'Hardware Depth 5 · Peripherals & Printers',
  hero:'ITI की प्रैक्टिकल परीक्षा और हर दफ़्तर की सबसे आम शिकायत — "प्रिंटर नहीं चल रहा"। यह पृष्ठ इनपुट उपकरणों की भीतरी बनावट (कीबोर्ड matrix, माउस sensor, स्कैनर CIS/CCD) से लेकर आउटपुट तक जाता है: डॉट-मैट्रिक्स, इंकजेट, लेज़र की सात-चरण EP प्रक्रिया, थर्मल व 3D प्रिंटर, टोनर-ड्रम-फ्यूज़र की पहचान, PCL/PostScript/GDI ड्राइवर, spooler और छपाई की हर आम ख़राबी का क्रमबद्ध निदान। मॉनिटर व GPU अलग विषय में हैं; यहाँ बाक़ी सब पेरिफेरल्स हैं।',
  tags:['कीबोर्ड व माउस','स्कैनर व OCR','लेज़र EP के 7 चरण','टोनर-ड्रम-फ्यूज़र','ड्राइवर व Spooler','प्रिंटर निदान'],
  blocks:[

  { type:'callout', kind:'info', title:'इस पृष्ठ के बाद आप क्या कर पाएँगे', html:'<p>1) किसी भी पेरिफेरल को इनपुट/आउटपुट/दोनों/स्टोरेज में वर्गीकृत कर सकेंगे। 2) कीबोर्ड के N-key rollover, switch प्रकार और माउस के DPI/CPI का सही अर्थ बता सकेंगे। 3) स्कैनर के CIS बनाम CCD और optical बनाम interpolated dpi में फ़र्क़ कर सकेंगे। 4) लेज़र प्रिंटर की सात चरणों वाली EP प्रक्रिया क्रम से लिखकर हर चरण की ख़राबी पहचान सकेंगे। 5) टोनर, ड्रम, फ्यूज़र, ट्रांसफ़र बेल्ट की भूमिका व लक्षण बता सकेंगे। 6) PCL/PostScript/GDI में सही ड्राइवर चुन सकेंगे। 7) “प्रिंट नहीं आ रहा” पर एक तय क्रम से निदान कर सकेंगे।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.1</span> पेरिफेरल का वर्गीकरण — परीक्षा की पहली सीढ़ी</h3><p><b>Peripheral</b> = कंप्यूटर के मुख्य भाग (CPU, मदरबोर्ड, RAM) के बाहर जुड़ने वाला कोई भी उपकरण। इन्हें काम के अनुसार बाँटा जाता है, और परीक्षा में सबसे ज़्यादा प्रश्न इसी बाँट पर आते हैं — ख़ासकर वे उपकरण जो <b>दोनों</b> काम करते हैं।</p>' },
  { type:'table', head:['श्रेणी','उदाहरण','पहचान का नियम'], rows:[
    ['Input (इनपुट)','कीबोर्ड, माउस, स्कैनर, माइक, वेबकैम, बारकोड रीडर, जॉयस्टिक, बायोमेट्रिक','बाहर से डाटा अंदर लाता है'],
    ['Output (आउटपुट)','मॉनिटर, प्रिंटर, स्पीकर, प्रोजेक्टर, प्लॉटर, हेडफ़ोन','अंदर का परिणाम बाहर दिखाता/सुनाता है'],
    ['Both / I-O (दोनों)','टचस्क्रीन, मॉडम, नेटवर्क कार्ड, हेडसेट (माइक+स्पीकर), स्मार्ट कार्ड रीडर, USB ड्राइव','भीतर और बाहर दोनों दिशा में काम'],
    ['Storage (भंडारण)','बाहरी HDD/SSD, पेन ड्राइव, कार्ड रीडर, टेप ड्राइव, ऑप्टिकल ड्राइव','डाटा स्थायी रूप से रखता है'],
    ['Communication','मॉडम, NIC, Wi-Fi/Bluetooth डोंगल','दूसरी मशीन से बात'],
    ['Pointing','माउस, टचपैड, ट्रैकबॉल, स्टाइलस, टचस्क्रीन','screen पर स्थिति चुनता है'],
  ] },
  { type:'callout', kind:'exam', title:'याद रखने योग्य “दोनों” वाले', html:'<p><b>टचस्क्रीन</b> (दिखाता भी है, छूने पर input भी लेता है), <b>मॉडम</b> (भेजता+प्राप्त करता है), <b>नेटवर्क कार्ड</b>, <b>हेडसेट</b>, <b>MFP/All-in-One प्रिंटर</b> (print आउटपुट + scan इनपुट), <b>स्मार्ट कार्ड रीडर-राइटर</b>, और <b>USB पेन ड्राइव</b> (पढ़ना+लिखना)। प्रश्न में “कौन-सा इनपुट नहीं है” आए तो इन्हीं पर ध्यान दें।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.2</span> कीबोर्ड के अंदर — Matrix, Scan Code व Rollover</h3><p>कीबोर्ड के अंदर keys की एक <b>grid (matrix)</b> होती है — rows और columns के कटान पर एक switch। कंट्रोलर लगातार हर row को signal भेजकर columns पढ़ता है (<b>scanning</b>)। key दबने पर वह स्थान पहचानकर एक <b>scan code</b> कंप्यूटर को भेजता है; OS का keyboard driver उसे layout के अनुसार अक्षर में बदलता है। इसीलिए एक ही कीबोर्ड पर layout बदलने से अक्षर बदल जाते हैं, hardware वही रहता है।</p>' },
  { type:'table', head:['शब्द','अर्थ','व्यावहारिक असर'], rows:[
    ['Scan code','key दबने/छूटने का कच्चा संकेत','layout बाद में लागू होता है'],
    ['Make / Break code','दबाने और छोड़ने के अलग code','इसी से Ctrl+C जैसा संयोजन बनता है'],
    ['Key rollover (2KRO)','एक साथ कितनी keys भरोसे से पढ़ी जाएँ','सस्ते में 2 — गेमिंग में अटक जाता है'],
    ['NKRO (N-Key Rollover)','सारी keys एक साथ','गेमिंग/स्टेनोग्राफ़ी में ज़रूरी'],
    ['Ghosting','matrix में न दबी key भी दर्ज होना','डायोड लगाकर रोका जाता है'],
    ['Anti-ghosting / masking','कुछ संयोजन जान-बूझकर अनदेखा','सस्ते बोर्ड में आम'],
    ['Polling rate','कितनी बार/सेकंड स्थिति भेजी जाए (125–8000 Hz)','गेमिंग में कम latency'],
    ['Debounce','एक दबाने के कंपन को एक ही बार गिनना','न हो तो double typing'],
    ['Hotkey / Fn layer','Fn के साथ दूसरा अर्थ','लैपटॉप की brightness/volume keys'],
  ] },
  { type:'table', head:['Switch प्रकार','कैसे काम करता है','आवाज़/अनुभव','कहाँ'], rows:[
    ['Membrane / Rubber dome','रबर का गुंबद दबकर दो परतें जोड़ता है','दबावदार, सस्ता, कम टिकाऊ','आम ऑफ़िस कीबोर्ड'],
    ['Scissor-switch','कैंची जैसा जोड़, कम travel','चपटा, लैपटॉप जैसा','लैपटॉप, पतले कीबोर्ड'],
    ['Mechanical — Linear (Red)','सीधा स्प्रिंग, कोई bump नहीं','चिकना, तेज़','गेमिंग'],
    ['Mechanical — Tactile (Brown)','बीच में हल्का bump','संतुलित','टाइपिंग + गेमिंग'],
    ['Mechanical — Clicky (Blue)','bump + क्लिक की आवाज़','शोर, स्पष्ट अनुभव','एकान्त में टाइपिंग'],
    ['Optical','प्रकाश की किरण टूटने पर संकेत','बहुत तेज़, debounce कम','आधुनिक गेमिंग'],
    ['Hall-effect (magnetic)','चुम्बकीय क्षेत्र से दूरी नापना','adjustable actuation','महँगे enthusiast बोर्ड'],
    ['Capacitive (Topre)','धारिता बदलने से','नरम, विशिष्ट','महँगे टाइपिंग बोर्ड'],
    ['Chiclet / Island','अलग-अलग चपटी keys','लैपटॉप शैली','अधिकांश लैपटॉप'],
  ] },
  { type:'callout', kind:'tip', title:'कीबोर्ड की आम ख़राबी — तेज़ निदान', html:'<p><b>कुछ keys नहीं चलतीं</b> → अक्सर एक row/column की लाइन टूटी या अंदर तरल/धूल। दूसरी मशीन में लगाकर जाँचें; वही keys मरें तो कीबोर्ड बदलें। <b>हर key ग़लत अक्षर छापे</b> → hardware नहीं, <b>layout</b> ग़लत है (Settings → Time &amp; Language → Language → Keyboard; US बनाम UK बनाम Hindi)। <b>बार-बार double letter</b> → debounce/घिसा switch, या Filter Keys सेटिंग। <b>पूरा कीबोर्ड बेकार</b> → पोर्ट/केबल, BIOS में भी काम करे तो hardware ठीक, OS driver देखें।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.3</span> माउस, टचपैड व पॉइंटिंग उपकरण</h3><p>आज का माउस एक छोटा कैमरा है। <b>LED/लेज़र</b> सतह को रोशन करता है, एक कम-रिज़ॉल्यूशन <b>CMOS sensor</b> सेकंड में हज़ारों तस्वीरें लेता है, और <b>DSP</b> दो तस्वीरों के बीच का खिसकाव निकालकर X/Y गिनती भेजता है। इसी को <b>DPI/CPI (counts per inch)</b> कहते हैं — एक इंच खिसकाने पर कितनी गिनती जाएगी। ज़्यादा DPI = तेज़ कर्सर, बेहतर गुणवत्ता नहीं।</p>' },
  { type:'table', head:['पॉइंटिंग उपकरण','सिद्धांत','खास बात'], rows:[
    ['Optical mouse','LED + CMOS + DSP','कपड़े/चिकनी सतह पर अच्छा; काँच पर नहीं'],
    ['Laser mouse','लेज़र रोशनी','काँच सहित अधिक सतहें; कभी acceleration jitter'],
    ['Ball mouse (पुराना)','घूमती गेंद + दो encoder पहिए','धूल जमती थी — आज अप्रचलित'],
    ['Trackball','गेंद हाथ से घुमाएँ, उपकरण स्थिर','कम जगह, कम कलाई-थकान'],
    ['Touchpad (capacitive)','उँगली की धारिता से स्थिति','मल्टी-टच gesture, precision driver'],
    ['TrackPoint','keys के बीच छोटा दबाव-जॉयस्टिक','हाथ keys से हटे बिना'],
    ['Stylus / Pen (active)','दबाव-स्तर + झुकाव, digitizer परत','चित्रकारी, नोट; palm rejection'],
    ['Graphics tablet','अलग सतह + pen','screen पर देखकर नीचे लिखना'],
    ['Touchscreen — resistive','दो परतें दबाव से जुड़ती हैं','दस्ताने/नाखून से भी; कम स्पष्ट'],
    ['Touchscreen — capacitive','उँगली की धारिता','मल्टी-टच, साफ़ चित्र; साधारण दस्ताने से नहीं'],
    ['Touchscreen — infrared / SAW','किनारों की किरणें/तरंगें टूटना','बड़े kiosks, कोई परत नहीं'],
  ] },
  { type:'kv', items:[
    { label:'DPI बनाम Pointer speed', value:'दो अलग चीज़ें', desc:'DPI hardware की गिनती है; Windows की pointer speed उस पर software गुणक है। “Enhance pointer precision” acceleration चालू करता है — गेमिंग में बंद रखें।' },
    { label:'Polling rate', value:'125 / 500 / 1000 Hz', desc:'1000 Hz = हर 1 ms स्थिति भेजना। रोज़मर्रा में 125 Hz काफ़ी; उच्च दर CPU/बैटरी खाती है।' },
    { label:'Wireless', value:'2.4 GHz डोंगल बनाम Bluetooth', desc:'डोंगल कम latency देता है और BIOS में भी चलता है; Bluetooth पोर्ट बचाता है पर pairing व नींद की समस्या दे सकता है।' },
    { label:'Ergonomics', value:'vertical / trackball', desc:'कलाई सीधी रहे तो carpal tunnel का जोखिम घटता है; लंबे काम में यही सबसे बड़ा लाभ है।' },
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.4</span> स्कैनर, OCR व कैमरा</h3><p>स्कैनर पन्ने पर रोशनी डालकर परावर्तित प्रकाश को sensor की एक पंक्ति पर पढ़ता है और पन्ने/हेड को खिसकाकर पूरी तस्वीर बनाता है। दो मुख्य तकनीकें हैं — <b>CCD</b> (लेंस + दर्पण से प्रकाश sensor तक; गहराई-क्षेत्र अच्छा, मोटी किताब की सिलवट भी साफ़) और <b>CIS</b> (Contact Image Sensor — LED पंक्ति सीधे पन्ने के पास; पतला, सस्ता, कम बिजली, पर पन्ना काँच से चिपका होना चाहिए)।</p>' },
  { type:'table', head:['स्कैनर शब्द','अर्थ','सही चुनाव'], rows:[
    ['Optical dpi','sensor की असली क्षमता (600/1200/4800)','यही देखें — यही सच है'],
    ['Interpolated dpi','software से बढ़ाई गई गिनती','विज्ञापन की बड़ी संख्या; नया विवरण नहीं'],
    ['Bit depth / colour depth','प्रति चैनल बिट (24/48-bit)','फ़ोटो व पुराने दस्तावेज़ के लिए ऊँचा'],
    ['Flatbed','काँच पर पन्ना रखना','किताब, नाज़ुक/मोटी वस्तु, फ़ोटो'],
    ['ADF (Auto Document Feeder)','पन्ने अपने आप चलते हैं','बहुत पन्नों का ढेर; duplex हो तो दोनों तरफ़'],
    ['Sheetfed','पन्ना अंदर खिंचता है','पोर्टेबल; नाज़ुक पन्ने के लिए नहीं'],
    ['TWAIN','पुराना स्कैनर driver मानक','एप्लिकेशन सीधे स्कैनर से बात करे'],
    ['WIA / ICA','Windows / Apple का मानक','साधारण स्कैन बटन'],
    ['OCR','तस्वीर के अक्षर पहचानकर text बनाना','Tesseract, Adobe, OneNote; भाषा pack चाहिए'],
    ['Duplex scan','दोनों तरफ़ एक साथ','दो-तरफ़ा दस्तावेज़ तेज़ी से'],
  ] },
  { type:'table', head:['स्कैन का काम','DPI','रंग','फ़ॉर्मेट'], rows:[
    ['सामान्य दस्तावेज़ (पढ़ने/भेजने)','200–300','Grayscale या B/W','PDF (searchable बनाने के लिए OCR)'],
    ['OCR कराना हो','300','B/W या Grayscale','TIFF/PDF फिर OCR'],
    ['फ़ोटो छापनी हो','300–600','24-bit colour','TIFF (lossless) या उच्च-गुणवत्ता JPEG'],
    ['फ़ोटो बड़ी करके छापनी हो','600–1200','48-bit colour','TIFF'],
    ['लाइन-आर्ट / हस्ताक्षर','600–1200','1-bit B/W','PNG/TIFF'],
    ['वेब/ई-मेल के लिए','150–200','colour','JPEG/PDF (छोटा आकार)'],
    ['अभिलेखागार (archival)','400–600','colour','TIFF + अलग metadata'],
  ] },
  { type:'callout', kind:'tip', title:'OCR की सफ़ाई का नियम', html:'<p>OCR की सटीकता 90% स्कैनिंग पर तय होती है — पन्ना सीधा रखें (skew ठीक करें), 300 dpi, अच्छा contrast, धब्बे हटाएँ (despeckle), और सही भाषा चुनें (हिंदी के लिए Hindi trained data)। रंगीन पृष्ठभूमि वाले पन्ने को पहले grayscale/B-W में बदलें। स्कैन के बाद हमेशा एक पन्ना आँख से मिलाएँ — OCR “१” को “l” और “०” को “O” पढ़ सकता है।</p>' },
  { type:'table', head:['अन्य इनपुट उपकरण','कैसे','कहाँ'], rows:[
    ['Barcode reader (1D laser/CCD)','धारी की चौड़ाई पढ़ना','दुकान, गोदाम'],
    ['QR / 2D imager','कैमरे से पूरा चित्र पढ़ना','UPI, टिकट, आधार'],
    ['RFID reader','रेडियो तरंग से टैग पढ़ना','उपस्थिति, लाइब्रेरी, टोल'],
    ['Biometric — fingerprint','धारिता/optical ridge पहचान','उपस्थिति, लैपटॉप लॉगिन'],
    ['Biometric — iris / face','आँख की बनावट / चेहरे के बिंदु','उच्च सुरक्षा; IR कैमरा'],
    ['MICR','चुम्बकीय स्याही के अक्षर','बैंक चेक की निचली पंक्ति'],
    ['OMR','पेंसिल के निशान की परावर्तन जाँच','बहुविकल्पीय उत्तर-पत्रक'],
    ['Microphone','ध्वनि → विद्युत संकेत (dynamic/condenser/MEMS)','रिकॉर्डिंग, वॉइस कॉल'],
    ['Webcam','CMOS sensor + lens + USB','वीडियो कॉल; 1080p/30fps आम'],
    ['MIDI keyboard','सुर नहीं, केवल note संदेश','संगीत निर्माण'],
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.5</span> प्रिंटर के प्रकार — कौन किस काम का</h3><p>प्रिंटर को इस बात से बाँटा जाता है कि वह काग़ज़ पर निशान <b>कैसे</b> बनाता है — मारकर (impact), छिड़ककर (inkjet), बिजली के आवेश से (laser), गर्मी से (thermal) या परत-दर-परत वस्तु बनाकर (3D)।</p>' },
  { type:'table', head:['प्रकार','सिद्धांत','लाभ','सीमा','कहाँ'], rows:[
    ['Dot Matrix (Impact)','पिन ribbon पर मारते हैं','carbon copy (2–3 part) बनती है, बहुत सस्ती छपाई','शोर, कम गुणवत्ता','बिल, रसीद, बैंक पासबुक'],
    ['Inkjet',' nozzle से तरल स्याही की बूँद','सस्ती मशीन, बढ़िया फ़ोटो','स्याही महँगी, सूख जाती है, धीमा','घर, फ़ोटो'],
    ['Ink Tank','बड़ी भरने योग्य टंकी','प्रति पृष्ठ बहुत सस्ता','मशीन महँगी; नियमित चलाना ज़रूरी','छोटा दफ़्तर, स्कूल'],
    ['Laser (Mono/Colour)','टोनर + आवेश + गर्मी','तेज़, साफ़ text, कम प्रति-पृष्ठ लागत','मशीन महँगी, फ़ोटो में inkjet जैसा नहीं','दफ़्तर, परीक्षा-पत्र'],
    ['Thermal (Direct)','गर्म हेड, विशेष काग़ज़ काला पड़ता है','कोई स्याही नहीं, छोटा, शांत','समय के साथ फीका; विशेष काग़ज़','रसीद, POS, लैब label'],
    ['Thermal Transfer','गर्म हेड से ribbon की स्याही टिकती है','टिकाऊ label, बारकोड','ribbon खर्च','barcode/शिपिंग label'],
    ['LED printer','लेज़र की जगह LED पंक्ति','कम घूमने वाले पुर्ज़े','वही टोनर प्रक्रिया','कुछ OKI मॉडल'],
    ['Solid Ink','मोम के ठोस टुकड़े पिघलकर','चमकीले रंग','धीमा, महँगा, अब कम','पुराने Xerox'],
    ['Plotter / Large format','चौड़े रोल पर pen/inkjet','नक़्शा, बैनर, CAD','महँगा, बड़ा','इंजीनियरिंग, विज्ञापन'],
    ['3D Printer (FDM)','पिघला तार परत-दर-परत','असली वस्तु बनती है','धीमा, सामग्री सीमित','प्रोटोटाइप, पुर्ज़े'],
    ['3D Printer (SLA/Resin)','तरल resin को लेज़र/UV से जमाना','बहुत बारीक विवरण','resin संभालना, सफ़ाई','दाँत, गहने, मॉडल'],
    ['MFP / All-in-One','print + scan + copy + fax','एक मशीन में सब; इनपुट+आउटपुट दोनों','एक भाग बिगड़े तो सब रुक सकता','हर दफ़्तर'],
  ] },
  { type:'callout', kind:'info', title:'Impact बनाम Non-impact — परीक्षा का प्रश्न', html:'<p><b>Impact</b> प्रिंटर काग़ज़ पर भौतिक चोट करता है — Dot Matrix, Daisy Wheel, Line/Drum/Chain printer। इसीलिए <b>केवल impact प्रिंटर carbon copy (बहु-प्रति) बना सकते हैं</b>। <b>Non-impact</b> = Inkjet, Laser, Thermal, LED — कोई चोट नहीं, इसलिए शांत और तेज़, पर carbon copy नहीं।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.6</span> लेज़र प्रिंटर — EP प्रक्रिया के सात चरण</h3><p>लेज़र (या LED) प्रिंटर <b>Electrophotographic (EP)</b> प्रक्रिया से छापता है। इसका दिल है <b>photosensitive drum</b> — एल्युमिनियम नली जिस पर प्रकाश-संवेदी परत है। अंधेरे में यह आवेश (charge) रोककर रखती है; प्रकाश पड़ने पर वही हिस्सा आवेश खो देता है। पूरी छपाई इसी एक गुण पर टिकी है। <b>क्रम याद रखें — Processing, Charging, Exposing, Developing, Transferring, Fusing, Cleaning।</b></p>' },
  { type:'steps', items:[
    { n:1, title:'Processing (Raster Image Processing)', text:'प्रिंटर डाटा (PCL/PostScript/PDF) लेकर पूरे पन्ने का बिट-नक़्शा अपनी memory में बनाता है। बड़ी/जटिल फ़ाइल यहीं अटकती है — “Out of memory” या आधा पन्ना इसी चरण की समस्या है।', tips:['मेमोरी कम हो तो resolution घटाएँ या फ़ाइल सरल करें।'] },
    { n:2, title:'Charging / Conditioning', text:'Primary charge roller (पुराने मॉडल में corona wire) ड्रम की पूरी सतह पर एक-सा ऋणात्मक आवेश (~−600 V) चढ़ा देता है। अब ड्रम “कोरी स्लेट” है।', warn:['आवेश असमान हो तो पन्ने पर हल्की-गहरी धारियाँ आती हैं।'] },
    { n:3, title:'Exposing / Writing', text:'लेज़र बीम घूमते दर्पण से ड्रम पर उन बिंदुओं पर पड़ती है जहाँ छापना है। प्रकाश पड़ते ही वहाँ का आवेश गिरकर ~−100 V रह जाता है — एक अदृश्य <b>latent image</b> बन जाती है।' },
    { n:4, title:'Developing', text:'टोनर (प्लास्टिक + कार्बन/रंग का महीन चूर्ण) आवेशित होकर developing roller से ड्रम पर आता है और केवल कम-आवेश वाले (लिखे हुए) हिस्सों से चिपकता है। अब छवि ड्रम पर दिखने लायक है।', tips:['टोनर कम हो तो हल्की छपाई; doctor blade ख़राब हो तो धारियाँ।'] },
    { n:5, title:'Transferring', text:'काग़ज़ ड्रम और transfer roller/belt के बीच से गुज़रता है। transfer roller काग़ज़ के पीछे धनात्मक आवेश देता है, जिससे ऋणात्मक टोनर ड्रम छोड़कर काग़ज़ पर चला आता है। अभी यह केवल चिपका हुआ चूर्ण है — पोंछने से मिट जाएगा।' },
    { n:6, title:'Fusing', text:'काग़ज़ <b>fuser unit</b> से गुज़रता है — गर्म roller (~180–200 °C) और दबाव वाला roller टोनर के प्लास्टिक को पिघलाकर काग़ज़ के रेशों में स्थायी रूप से बैठा देते हैं। इसीलिए लेज़र प्रिंटर से निकला पन्ना गर्म होता है।', warn:['टोनर हाथ से मिट जाए/उखड़े तो fuser ठंडा या घिसा है। काग़ज़ मुड़-सिकुड़ जाए तो fuser roller ख़राब।'] },
    { n:7, title:'Cleaning', text:'रबर की cleaning blade ड्रम से बचा टोनर scrap हटाकर waste bin में डालती है; erase lamp/AC charge बचा आवेश मिटा देता है। ड्रम अगले पन्ने के लिए तैयार।', tips:['हर पन्ने पर एक ही जगह दोहरा निशान = ड्रम पर खरोंच या cleaning blade ख़राब।'] },
  ] },
  { type:'table', head:['पुर्ज़ा','काम','ख़राबी का लक्षण','आयु (लगभग)'], rows:[
    ['Toner cartridge','रंगीन चूर्ण की आपूर्ति','हल्की छपाई, “Toner low”, बीच में सफ़ेद पट्टी','1,500–30,000 पन्ने'],
    ['Imaging drum / OPC','आवेश रोककर छवि बनाना','हर पन्ने पर एक ही जगह दोहरा धब्बा/लकीर','10,000–100,000 पन्ने'],
    ['Primary charge roller','ड्रम पर एक-सा आवेश','पूरे पन्ने पर धूसर पृष्ठभूमि या धारियाँ','ड्रम के साथ'],
    ['Laser / LSU unit','latent image लिखना','लंबवत सफ़ेद रेखा, बहुत हल्की छपाई','लंबी; धूल जम सकती है'],
    ['Transfer roller / belt','टोनर काग़ज़ पर लाना','रंग फीका, रंगों का मेल न बैठना (colour)','50,000–100,000 पन्ने'],
    ['Fuser unit','गर्मी+दबाव से पक्का करना','टोनर मिट जाना, काग़ज़ सिकुड़ना, “Fuser error”','50,000–200,000 पन्ने'],
    ['Pickup / feed roller','काग़ज़ उठाना','paper jam बार-बार, कई शीट एक साथ','साफ़ करने पर सुधरता; घिसे तो बदलें'],
    ['Separation pad','एक-एक शीट अलग करना','दो-तीन शीट एक साथ चढ़ना','सस्ता, आसानी से बदलता है'],
    ['Cleaning blade + waste bin','बचा टोनर हटाना','पन्ने पर बिखरा चूर्ण/धब्बा','ड्रम इकाई के साथ'],
    ['Formatter board','प्रिंटर का दिमा़ग़/RIP','network नहीं, बेतुका text, अटक जाना','लंबी; firmware update से सुधर सकती'],
  ] },
  { type:'callout', kind:'danger', title:'लेज़र प्रिंटर सर्विसिंग के 5 सुरक्षा-नियम', html:'<p>1) <b>फ्यूज़र ठंडा होने दें</b> — 200 °C तक जाता है, तुरंत छूने पर जलन। 2) <b>ड्रम को रोशनी में न खोलें</b> — तेज़ प्रकाश उसकी परत ख़राब करता है; काग़ज़ से ढकें। 3) <b>ड्रम की सतह को उँगली न लगाएँ</b> — तेल स्थायी निशान छोड़ता है। 4) <b>टोनर को साधारण वैक्यूम से न झाड़ें</b> — इतना महीन चूर्ण फ़िल्टर पार कर मोटर में जाकर आग पैदा कर सकता है; टोनर-प्रमाणित (HEPA/ESD) वैक्यूम या नम कपड़ा। 5) <b>अंदर उच्च वोल्टेज</b> रहता है — पावर केबल निकालकर ही काम करें।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.7</span> ड्राइवर, भाषा व Spooler</h3><p>कंप्यूटर प्रिंटर से एक <b>page description language</b> में बात करता है। कौन-सी भाषा है, यह तय करता है कि काम कहाँ होगा — कंप्यूटर पर या प्रिंटर पर।</p>' },
  { type:'table', head:['भाषा / ड्राइवर','काम कहाँ होता है','लाभ','सीमा'], rows:[
    ['PCL (Printer Command Language)','ज़्यादातर प्रिंटर पर','तेज़, HP मानक, दफ़्तर के लिए उत्तम','रंग/ग्राफ़िक्स में PostScript जैसा सटीक नहीं'],
    ['PostScript (PS)','प्रिंटर के अपने interpreter पर','device-independent, बढ़िया ग्राफ़िक्स/PDF','प्रिंटर में CPU+RAM चाहिए; धीमा हो सकता'],
    ['GDI / Host-based (XPS)','पूरा पन्ना कंप्यूटर बनाता है','प्रिंटर बहुत सस्ता','CPU पर बोझ; कुछ नेटवर्क/लिनक्स सेटअप में दिक़्क़त'],
    ['PCLm / URF / AirPrint','मोबाइल/क्लाउड के लिए सरल raster','ड्राइवर के बिना छपाई','सीमित विकल्प'],
    ['IPP Everywhere / Mopria','मानक नेटवर्क प्रोटोकॉल','ड्राइवर रहित, फ़ोन से भी','पुराने प्रिंटर में नहीं'],
    ['ESC/P (Epson), dot-matrix','सादा text + control code','बहुत हल्का, रसीद में तेज़','ग्राफ़िक्स कमज़ोर'],
    ['Universal Print Driver (UPD)','एक ड्राइवर कई मॉडल के लिए','बड़े दफ़्तर में आसान','कुछ विशेष फ़ीचर छूट जाते हैं'],
  ] },
  { type:'html', html:'<p><b>Print Spooler</b> विंडोज़ की वह सेवा है जो छपाई के काम को कतार में रखती है। आप Print दबाते हैं → काम <code>C:\\Windows\\System32\\spool\\PRINTERS</code> में <code>.SHD</code> (छाया/जानकारी) और <code>.SPL</code> (असली पन्ना) file के रूप में लिखा जाता है → spooler उसे धीरे-धीरे port monitor के ज़रिए प्रिंटर को भेजता है। इसीलिए एप्लिकेशन तुरंत आज़ाद हो जाता है, भले छपाई मिनटों ले।</p>' },
  { type:'code', code: ':: --- Print Spooler पूरी तरह साफ़ करना (Admin CMD) ---\nnet stop spooler\ndel /Q /F /S "%systemroot%\\System32\\spool\\PRINTERS\\*.*"\nnet start spooler\n\n:: PowerShell से कतार देखना/साफ़ करना\nGet-Printer | Format-Table Name,DriverName,PortName,PrinterStatus\nGet-PrintJob -PrinterName "HP LaserJet" | Format-List\nGet-PrintJob -PrinterName "HP LaserJet" | Remove-PrintJob\nRestart-Service -Name Spooler -Force\n\n:: प्रिंटर पोर्ट व ड्राइवर\nGet-PrinterPort | Format-Table Name,Description,PrinterHostAddress\nGet-PrinterDriver | Format-Table Name,MajorVersion,Manufacturer\nprintui /s /t2          :: Print Server Properties -> Drivers टैब\n\n# --- लिनक्स (CUPS) ---\nlpstat -p -d                 # प्रिंटर व default\ncancel -a                    # सारी कतार खाली\nsudo systemctl restart cups\nlp -d PRINTER_NAME file.pdf  # छापें\nlpoptions -p PRINTER -l      # उपलब्ध विकल्प\n# वेब इंटरफ़ेस: http://localhost:631' },
  { type:'table', head:['जुड़ने का तरीक़ा','पता/पोर्ट','ध्यान रखें'], rows:[
    ['USB','USB001 / DOT4','सीधा, सरल; लंबी केबल (5 m+) पर त्रुटि'],
    ['Network — Raw/JetDirect','TCP 9100','सबसे आम; स्थिर IP या DHCP reservation दें'],
    ['Network — LPR/LPD','TCP 515, queue नाम','पुराने/यूनिक्स प्रिंटर'],
    ['IPP / IPPS','TCP 631 / 443','CUPS, AirPrint, आधुनिक मानक'],
    ['SMB / Shared printer','\\\\PC-NAME\\PrinterName','मेज़बान PC चालू रहना चाहिए; अतिथि अनुमति की समस्या'],
    ['Wi-Fi Direct','प्रिंटर का अपना hotspot','राउटर के बिना; इंटरनेट साथ में नहीं'],
    ['Bluetooth','छोटा रेंज','पोर्टेबल/रसीद प्रिंटर'],
    ['Parallel (LPT1) / Serial (COM)','पुराना 25-पिन / 9-पिन','डॉट-मैट्रिक्स व औद्योगिक में अब भी'],
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.8</span> “प्रिंट नहीं आ रहा” — क्रमबद्ध निदान</h3><p>हर प्रिंटर-शिकायत का एक ही तर्क है: <b>बिजली → भौतिक जुड़ाव → कतार → ड्राइवर → प्रिंटर की अपनी सेहत → काग़ज़/टोनर</b>। इस क्रम में चलें तो 90% समस्या दस मिनट में हल हो जाती है।</p>' },
  { type:'table', head:['लक्षण','सबसे सम्भावित कारण','पहला कदम','आगे'], rows:[
    ['कुछ नहीं होता, कतार में अटका','Spooler अटका / प्रिंटर Offline','कतार खोलकर Pause/Offline हटाएँ','spooler रोककर PRINTERS folder खाली करें'],
    ['“Printer offline” पर केबल ठीक','IP बदल गया / SNMP status ग़लत','Printer Properties → Ports → सही IP','Configure Port → SNMP Status बंद करें'],
    ['बेतुके अक्षर / पूरे पन्ने पर कचरा','ग़लत ड्राइवर भाषा (PS बनाम PCL)','सही मॉडल का ड्राइवर डालें','USB केबल/पोर्ट बदलें'],
    ['हल्की छपाई / सफ़ेद पट्टी','टोनर कम या एक तरफ़ जमा','कारतूस निकालकर हल्का हिलाएँ','EconoMode बंद; नया टोनर'],
    ['हर पन्ने पर एक ही जगह दोहरा धब्बा','ड्रम पर खरोंच/निशान','ड्रम की दूरी नापें (दोहराव की दूरी = परिधि)','ड्रम इकाई बदलें'],
    ['टोनर हाथ से मिट जाता है','फ्यूज़र ठंडा/घिसा, या ग़लत paper type','Paper type सही (Heavy/Labels) करें','fuser बदलें'],
    ['बार-बार paper jam','pickup roller घिसा, नम/मुड़ा काग़ज़','नया सूखा काग़ज़, पंखा करके रखें','roller साफ़/बदलें, separation pad'],
    ['कई शीट एक साथ','separation pad घिसा, काग़ज़ चिपका','पन्ने अलग करके कम भरें','pad बदलें'],
    ['काग़ज़ सिकुड़/मुड़कर निकला','fuser या नम काग़ज़','सूखा काग़ज़, सही type','fuser roller जाँचें'],
    ['रंग ग़लत / रेखाएँ (inkjet)','nozzle बंद, स्याही सूखी','Head Cleaning + Nozzle Check','2–3 चक्र; फिर भी न हो तो cartridge बदलें'],
    ['किनारे कटे / हाशिया ग़लत','paper size mismatch (A4 बनाम Letter)','दस्तावेज़ व प्रिंटर दोनों A4 करें','scaling/Fit to page'],
    ['नेटवर्क प्रिंटर नहीं मिलता','अलग VLAN/subnet, firewall','ping प्रिंटर-IP करें','पोर्ट 9100/631 खोलें; static IP दें'],
    ['धीमी छपाई','ऊँची dpi, बड़ी फ़ाइल, कम RAM','Draft/600 dpi करें','प्रिंटर में RAM जोड़ें; PS की जगह PCL'],
    ['“Driver unavailable” (Win 11)','पुराना/हस्ताक्षरित नहीं ड्राइवर','Windows Update से ड्राइवर','निर्माता का नया/UPD ड्राइवर'],
  ] },
  { type:'callout', kind:'tip', title:'Inkjet को ज़िंदा रखने का एक नियम', html:'<p>इंकजेट की स्याही nozzle पर सूखकर जम जाती है। <b>हफ़्ते में एक रंगीन पन्ना छापें</b> — यही सबसे सस्ता रखरखाव है। महीनों बंद रखने पर head cleaning भी काम नहीं करती और cartridge/हेड बदलना पड़ता है, जो मशीन की क़ीमत के बराबर हो सकता है। जिस दफ़्तर में छपाई कभी-कभार होती है, वहाँ इंकजेट की जगह लेज़र लें।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.9</span> 3D प्रिंटर, UPS, KVM व बाक़ी पेरिफेरल्स</h3><p><b>3D प्रिंटिंग (Additive Manufacturing)</b> में पहले 3D मॉडल (STL/3MF) बनता है, फिर <b>slicer</b> (Cura, PrusaSlicer) उसे पतली परतों के <b>G-code</b> में तोड़ता है, और प्रिंटर वही G-code चलाकर परत-दर-परत वस्तु खड़ी करता है।</p>' },
  { type:'table', head:['3D शब्द','अर्थ','असर'], rows:[
    ['STL / 3MF','सतहों का जाल (mesh) फ़ॉर्मेट','3MF में रंग/सामग्री भी; STL केवल आकार'],
    ['Slicer','मॉडल → परतों का G-code','यहीं सारी सेटिंग तय होती है'],
    ['Layer height','एक परत की मोटाई (0.1–0.3 mm)','छोटी = बढ़िया सतह, अधिक समय'],
    ['Infill','अंदर का जाल (10–30%)','मज़बूती बनाम समय/सामग्री'],
    ['Nozzle / bed temp','FDM में PLA ~200/60 °C, ABS ~240/100 °C','ग़लत तापमान = चिपकेगा नहीं या डोर जैसा'],
    ['Support','लटकते हिस्सों के नीचे सहारा','बाद में तोड़ना पड़ता है'],
    ['Brim / Raft','नीचे अतिरिक्त परत','किनारे उखड़ने (warping) से बचाव'],
    ['Retraction / stringing','बीच में तार खींचना / धागे छूटना','retraction बढ़ाकर धागे घटाएँ'],
    ['Bed leveling','पहली परत की एक-सी दूरी','90% असफलताएँ यहीं से'],
    ['Filament','PLA, PETG, ABS, TPU','PLA आसान; ABS को बंद चैंबर चाहिए'],
  ] },
  { type:'table', head:['पेरिफेरल','काम','चुनते समय देखें'], rows:[
    ['UPS (Offline/Line-interactive/Online)','बिजली जाने पर बैटरी + सुरक्षा','VA बनाम Watt, transfer time, sine wave'],
    ['KVM switch','एक कीबोर्ड-वीडियो-माउस से कई PC','पोर्ट संख्या, resolution, USB support'],
    ['Docking station / USB hub','एक केबल से सब पेरिफेरल','powered hub, DisplayLink बनाम DP-Alt mode'],
    ['External sound card / DAC','बेहतर ऑडियो','sample rate, balanced output'],
    ['Capture card','HDMI इनपुट कंप्यूटर में','1080p60/4K, latency'],
    ['Card reader','SD/microSD/CF','UHS-II गति, USB 3.0'],
    ['Document camera','दस्तावेज़ लाइव दिखाना','कक्षा/प्रशिक्षण में'],
    ['Projector','बड़ी screen पर आउटपुट','lumens, throw ratio, lamp/LED life'],
    ['Label printer','पता/बारकोड label','thermal transfer बनाम direct'],
    ['Smart card / ePass reader','पहचान-पत्र पढ़ना','PC/SC ड्राइवर, contact/contactless'],
  ] },

  { type:'labs', items:[
    { n:40, title:'सभी पेरिफेरल पहचानकर वर्गीकृत करना', aim:'लैब की हर वस्तु को input/output/both/storage में सही बाँटना।', tools:['लैब के उपकरण', 'Device Manager', 'कैमरा (सबूत के लिए)'], steps:['लैब में घूमकर कम-से-कम 15 पेरिफेरल की सूची बनाएँ।', 'हर एक के आगे श्रेणी लिखें — Input / Output / Both / Storage / Communication।', 'जोड़ का तरीक़ा लिखें — USB, HDMI, Wi-Fi, Bluetooth, 3.5 mm, Ethernet।', 'Device Manager खोलकर उनमें से 5 के ड्राइवर का नाम व निर्माता लिखें।', '“Both” वाली वस्तुओं के लिए दोनों दिशाएँ अलग-अलग समझाएँ (जैसे MFP: print आउट, scan इन)।', 'एक पन्ने की तालिका शिक्षक को दिखाएँ और दो वस्तुओं पर मौखिक प्रश्न लें।'], result:'15+ पेरिफेरल की भरी वर्गीकरण-तालिका और 5 ड्राइवर विवरण।' },
    { n:41, title:'स्कैन करके OCR से editable दस्तावेज़ बनाना', aim:'सही dpi पर स्कैन करके अक्षर पहचान से Word/PDF text निकालना।', tools:['Flatbed या MFP स्कैनर', 'OCR सॉफ़्टवेयर (OneNote/Adobe/Tesseract)', 'छपा हुआ एक पन्ना'], steps:['पन्ना सीधा काँच पर रखें; 300 dpi, Grayscale चुनें और TIFF/PDF में स्कैन करें।', 'वही पन्ना 150 dpi पर भी स्कैन करें; दोनों का file size और स्पष्टता तुलना करें।', 'OCR चलाएँ — भाषा Hindi+English चुनें; परिणाम .docx या searchable PDF में सेव करें।', 'मूल पन्ने से 20 शब्द मिलाकर त्रुटियाँ गिनें और सटीकता प्रतिशत लिखें।', 'अब skew/despeckle सुधारकर दोबारा OCR करें और देखें सटीकता बढ़ी या नहीं।', 'निष्कर्ष लिखें — OCR के लिए सबसे अच्छी सेटिंग कौन-सी रही।'], result:'दो स्कैन (150/300 dpi), एक editable दस्तावेज़, और मापी गई OCR सटीकता।' },
    { n:42, title:'लेज़र प्रिंटर के पुर्ज़े पहचानकर EP प्रक्रिया समझाना', aim:'कारतूस निकालकर ड्रम, रोलर और फ्यूज़र की जगह पहचानना।', tools:['बंद व ठंडा लेज़र प्रिंटर', 'टोनर कारतूस', 'दस्ताने, टॉर्च'], steps:['प्रिंटर बंद करके केबल निकालें; 15 मिनट ठंडा होने दें।', 'ढक्कन खोलकर टोनर कारतूस निकालें; उस पर ड्रम (हरी/नीली नली), charge roller और developing roller पहचानें।', 'काग़ज़-पथ देखें — pickup roller, separation pad, transfer roller और fuser का स्थान चित्र में अंकित करें।', 'EP के सात चरण क्रम से लिखें और हर चरण के सामने उसका पुर्ज़ा लिखें।', 'एक छपा पन्ना लें; उस पर दोहराव वाले किसी निशान की दूरी नापकर बताएँ वह ड्रम है या roller।', 'सब वापस लगाकर एक test page छापें और Configuration Page से page count नोट करें।'], result:'पुर्ज़ों का नामांकित चित्र, सात-चरण तालिका और एक सफल test page।' },
    { n:43, title:'प्रिंटर कतार अटकाकर Spooler से हल करना', aim:'जान-बूझकर बनाई समस्या को सेवा रोककर साफ़ करना।', tools:['विंडोज़ PC', 'कोई प्रिंटर (या Microsoft Print to PDF)', 'Admin अधिकार'], steps:['Microsoft Print to PDF को default रखें; उसे Pause करें (कतार रुकी हुई)।', 'तीन दस्तावेज़ Print करें — तीनों कतार में अटकेंगे; screenshot लें।', 'Get-PrintJob से कतार दिखाएँ; एक काम Remove-PrintJob से हटाएँ।', 'Admin CMD में net stop spooler → PRINTERS folder की .SHD/.SPL files गिनें → हटाएँ → net start spooler।', 'प्रिंटर Unpause करें और एक दस्तावेज़ छापकर सफलता दिखाएँ।', 'पूरी प्रक्रिया के आदेश व screenshots क्रम से रिपोर्ट में लगाएँ।'], result:'अटकी कतार के पहले/बाद के सबूत और चलाए गए आदेशों की सूची।' },
    { n:44, title:'नेटवर्क प्रिंटर को स्थिर IP देकर कई PC से जोड़ना', aim:'TCP 9100 पोर्ट पर प्रिंटर जोड़कर साझा छपाई चलाना।', tools:['नेटवर्क प्रिंटर', 'दो PC', 'राउटर/स्विच'], steps:['प्रिंटर की Configuration Page छापकर उसका वर्तमान IP व MAC लिखें।', 'प्रिंटर के वेब इंटरफ़ेस या राउटर के DHCP reservation से उसे स्थिर IP दें।', 'PC पर ping उस-IP करें; फिर Test-NetConnection -ComputerName IP -Port 9100 से पोर्ट जाँचें।', 'Settings → Printers → Add device → “The printer that I want isn’t listed” → TCP/IP address से जोड़ें।', 'सही ड्राइवर चुनें, Test Page छापें; दूसरे PC पर भी वही करें।', 'IP बदलकर दिखाएँ कि प्रिंटर Offline हो जाता है, फिर स्थिर IP लौटाकर ठीक करें — यह अंतर रिपोर्ट में लिखें।'], result:'दो PC से सफल test page, स्थिर IP का प्रमाण और Offline समस्या का दिखाया गया कारण।' },
    { n:45, title:'Inkjet nozzle जाँच, head cleaning व लागत-तुलना', aim:'इंकजेट की आम ख़राबी सुधारना और प्रति-पृष्ठ लागत निकालना।', tools:['इंकजेट प्रिंटर', 'Printer Properties → Maintenance', 'cartridge की क़ीमत व page yield'], steps:['Nozzle Check पैटर्न छापें; टूटी रेखाएँ गिनें और screenshot/फ़ोटो लें।', 'एक Head Cleaning चक्र चलाकर दोबारा Nozzle Check करें; सुधार नोट करें।', 'ज़रूरत हो तो दूसरा चक्र; फिर भी न सुधरे तो Deep Cleaning और उसके बाद विराम दें।', 'cartridge की क़ीमत ÷ page yield से प्रति-पृष्ठ लागत निकालें।', 'उसी काम के लेज़र टोनर की प्रति-पृष्ठ लागत निकालकर तुलना-तालिका बनाएँ।', 'निष्कर्ष — महीने के कितने पन्नों के बाद लेज़र सस्ता पड़ता है (break-even)।'], result:'पहले/बाद के nozzle पैटर्न, दोनों की प्रति-पृष्ठ लागत और break-even गणना।' },
  ] },

  { type:'acc', title:'पेरिफेरल व प्रिंटर — 14 आम प्रश्न', items:[
    { q:'लेज़र प्रिंटर के सात चरण क्रम से बताइए।', a:'Processing → Charging (Conditioning) → Exposing (Writing) → Developing → Transferring → Fusing → Cleaning। याद रखने का संकेत: “प्र-च-ए-दे-ट्र-फ्यू-क्ली”। Fusing ही वह चरण है जो टोनर को स्थायी बनाता है, इसीलिए पन्ना गर्म निकलता है।' },
    { q:'टोनर काग़ज़ पर है पर हाथ से मिट जाता है — क्या ख़राब है?', a:'Fuser unit — या तो पर्याप्त गर्म नहीं हो रहा या उसका roller घिस गया। पहले paper type सही करें (Heavy/Cardstock/Labels के लिए अधिक गर्मी चाहिए) और Economode/Draft बंद करें; न सुधरे तो fuser बदलें।' },
    { q:'हर पन्ने पर एक ही जगह, एक-सी दूरी पर धब्बा क्यों आता है?', a:'किसी घूमते पुर्ज़े पर निशान है। दोहराव की दूरी नापें — छोटी दूरी (~3–5 cm) roller, बड़ी (~7–9 cm) आमतौर पर ड्रम की परिधि। ड्रम पर खरोंच/उँगली का तेल हो तो ड्रम इकाई बदलनी पड़ती है।' },
    { q:'Inkjet और Laser में घर के लिए क्या चुनें?', a:'महीने के 20–50 पन्ने, mostly text → लेज़र (स्याही सूखने की चिंता नहीं, प्रति-पृष्ठ सस्ता)। रंगीन फ़ोटो और कभी-कभार → ink tank। साधारण cartridge वाला inkjet कम छपाई पर सबसे महँगा पड़ता है क्योंकि स्याही सूख जाती है।' },
    { q:'Dot-matrix प्रिंटर आज भी क्यों इस्तेमाल होता है?', a:'क्योंकि यह impact प्रिंटर है और <b>carbon copy</b> (2–3 part continuous stationery) बना सकता है — बिल, रसीद, चेक, पासबुक में इसकी ज़रूरत है। कोई non-impact प्रिंटर यह नहीं कर सकता। साथ ही इसकी छपाई-लागत बहुत कम है।' },
    { q:'Optical dpi और interpolated dpi में क्या फ़र्क़ है?', a:'Optical dpi sensor की असली क्षमता है — उतना विवरण सचमुच पढ़ा जाता है। Interpolated dpi software द्वारा बीच में अनुमानित pixels भरकर बढ़ाई गई संख्या है; नया विवरण नहीं मिलता। ख़रीदते समय हमेशा optical dpi देखें।' },
    { q:'CIS और CCD स्कैनर में क्या अंतर है?', a:'CIS पतला, सस्ता, कम बिजली वाला है पर पन्ना काँच से चिपका होना चाहिए — मुड़ी किताब की सिलवट धुँधली आएगी। CCD में लेंस/दर्पण होते हैं, गहराई-क्षेत्र अच्छा है, इसलिए मोटी किताब व त्रि-आयामी वस्तुएँ बेहतर स्कैन होती हैं।' },
    { q:'माउस का DPI बढ़ाने से गुणवत्ता बढ़ती है?', a:'नहीं। DPI/CPI केवल संवेदनशीलता है — एक इंच खिसकाने पर कितनी गिनती भेजी जाए। गुणवत्ता sensor, polling rate और सतह पर निर्भर है। बहुत ऊँचा DPI कर्सर को अनियंत्रित कर देता है; 800–1600 अधिकांश काम के लिए ठीक है।' },
    { q:'प्रिंटर “Offline” दिखता है पर केबल ठीक है?', a:'अक्सर नेटवर्क प्रिंटर का IP बदल गया होता है, या विंडोज़ का SNMP status ग़लत पढ़ रहा होता है। Printer Properties → Ports में सही IP जाँचें; Configure Port में “SNMP Status Enabled” बंद करके देखें; और राउटर में DHCP reservation देकर IP स्थायी करें।' },
    { q:'कतार में काम अटका है और मिट भी नहीं रहा?', a:'Print Spooler सेवा रोकें (net stop spooler), C:\\Windows\\System32\\spool\\PRINTERS की सब .SHD/.SPL फ़ाइलें हटाएँ, फिर सेवा चालू करें (net start spooler)। यह कतार को पूरी तरह साफ़ कर देता है — प्रिंटर या ड्राइवर बदलने की ज़रूरत नहीं।' },
    { q:'PCL और PostScript में कौन-सा ड्राइवर डालें?', a:'सामान्य दफ़्तरी छपाई (Word/Excel/PDF) के लिए PCL — तेज़ और भरोसेमंद। ग्राफ़िक्स, प्रकाशन या एक-सी रंग-सटीकता चाहिए तो PostScript (प्रिंटर में उसे सहना चाहिए)। सस्ते host-based (GDI) प्रिंटर केवल अपने ड्राइवर से चलते हैं, कोई दूसरा नहीं।' },
    { q:'3D प्रिंट की पहली परत नहीं चिपकती — क्या करूँ?', a:'Bed leveling दोबारा करें (काग़ज़-टेस्ट: nozzle और bed के बीच काग़ज़ हल्के घर्षण से खिंचे), bed साफ़ करें (isopropyl alcohol), bed तापमान बढ़ाएँ (PLA ~60 °C), पहली परत की गति घटाएँ और brim लगाएँ। 90% असफलताएँ पहली परत की ही होती हैं।' },
    { q:'UPS के VA और Watt में क्या अंतर है?', a:'VA आभासी शक्ति है, Watt वास्तविक। सामान्य UPS का power factor 0.6–0.8 होता है, इसलिए 1000 VA ≈ 600–800 W। अपनी मशीन का वास्तविक Watt जोड़कर उससे 20–30% ऊपर का UPS चुनें, और चलाव-समय (backup minutes) भी देखें।' },
    { q:'पेरिफेरल की सफ़ाई में क्या कभी न करें?', a:'ड्रम की सतह को न छुएँ या तेज़ रोशनी में न रखें; टोनर को घरेलू वैक्यूम से न झाड़ें; स्कैनर के काँच पर सीधे spray न करें (कपड़े पर लगाएँ); कीबोर्ड पर तरल न छिड़कें; चलते प्रिंटर में जाम काग़ज़ ज़ोर से न खींचें — काग़ज़-पथ की दिशा में धीरे निकालें।' },
  ] },

  { type:'quiz', store:'hw-periph', items:[
    { q:'टचस्क्रीन किस श्रेणी का उपकरण है?', o:['केवल Input','केवल Output','Input और Output दोनों','Storage'], a:2, ex:'वह चित्र दिखाता (output) और छूने पर स्थिति पढ़ता (input) — इसलिए दोनों।' },
    { q:'कौन-सा प्रिंटर carbon copy (बहु-प्रति) बना सकता है?', o:['Inkjet','Laser','Dot Matrix','Thermal'], a:2, ex:'केवल impact प्रिंटर काग़ज़ पर चोट करके नीचे की carbon परत पर निशान बना सकते हैं। Dot matrix इसीलिए आज भी बिल-रसीद में है।' },
    { q:'लेज़र प्रिंटर की EP प्रक्रिया का सही क्रम?', o:['Charging, Processing, Developing, Exposing, Fusing, Transferring, Cleaning','Processing, Charging, Exposing, Developing, Transferring, Fusing, Cleaning','Exposing, Charging, Processing, Transferring, Developing, Cleaning, Fusing','Processing, Exposing, Charging, Fusing, Developing, Transferring, Cleaning'], a:1, ex:'पहले पन्ने का नक़्शा (Processing), फिर आवेश, लेज़र से लिखना, टोनर चढ़ाना, काग़ज़ पर लाना, गर्मी से पक्का करना, सफ़ाई।' },
    { q:'टोनर को काग़ज़ पर स्थायी रूप से कौन-सा चरण बाँधता है?', o:['Developing','Transferring','Fusing','Cleaning'], a:2, ex:'Fuser की गर्मी (~180–200 °C) और दबाव टोनर के प्लास्टिक को पिघलाकर रेशों में बैठा देते हैं। इसीलिए पन्ना गर्म निकलता है।' },
    { q:'टोनर हाथ से मिट जाए तो सबसे सम्भावित ख़राबी?', o:['टोनर कम','Fuser unit','ड्रम','Pickup roller'], a:1, ex:'Fusing ठीक न हो तो चूर्ण केवल काग़ज़ पर रखा रहता है। पहले paper type/EconoMode जाँचें, फिर fuser।' },
    { q:'हर पन्ने पर एक-सी दूरी पर दोहरा धब्बा किसका संकेत है?', o:['टोनर कम','ड्रम/roller पर निशान','Spooler','ग़लत ड्राइवर'], a:1, ex:'घूमते पुर्ज़े की परिधि के बराबर दूरी पर वही निशान लौटता है। दूरी नापकर ड्रम बनाम roller पहचानें।' },
    { q:'Latent image किस चरण में बनती है?', o:['Charging','Exposing/Writing','Developing','Transferring'], a:1, ex:'लेज़र जहाँ पड़ती है वहाँ ड्रम का आवेश गिर जाता है — यह अदृश्य आवेश-चित्र ही latent image है; टोनर बाद में उसे दिखाता है।' },
    { q:'स्कैनर ख़रीदते समय कौन-सी dpi देखनी चाहिए?', o:['Interpolated','Optical','Effective marketing','Maximum software'], a:1, ex:'Optical dpi sensor की असली क्षमता है। Interpolated केवल software से भरे pixels हैं, नया विवरण नहीं।' },
    { q:'OCR का काम क्या है?', o:['तस्वीर को छोटा करना','तस्वीर के अक्षर पहचानकर editable text बनाना','स्कैनर की गति बढ़ाना','रंग बदलना'], a:1, ex:'Optical Character Recognition छपे अक्षरों को पहचानकर text में बदलता है — तभी दस्तावेज़ खोजा और संपादित हो पाता है।' },
    { q:'माउस का DPI/CPI क्या मापता है?', o:['गुणवत्ता','प्रति इंच खिसकाव पर भेजी गई गिनती','बटन की संख्या','बैटरी'], a:1, ex:'यह संवेदनशीलता है, गुणवत्ता नहीं। ऊँचा DPI = तेज़ कर्सर; sensor व polling rate गुणवत्ता तय करते हैं।' },
    { q:'NKRO का अर्थ क्या है?', o:['नया कीबोर्ड रंग','N-Key Rollover — सारी keys एक साथ पढ़ी जाएँ','No Key Repeat Option','Network Keyboard Remote'], a:1, ex:'सस्ते membrane बोर्ड 2KRO होते हैं और कुछ संयोजनों पर ghosting करते हैं; NKRO हर key एक साथ पढ़ लेता है।' },
    { q:'MICR कहाँ इस्तेमाल होता है?', o:['बारकोड label','बैंक चेक की निचली चुम्बकीय पंक्ति','फ़ोटो छपाई','3D प्रिंट'], a:1, ex:'Magnetic Ink Character Recognition — चेक के निचले अंक विशेष चुम्बकीय स्याही से छपते हैं जिन्हें मशीन भरोसे से पढ़ती है।' },
    { q:'OMR किस काम आता है?', o:['चेक पढ़ना','पेंसिल से भरे बहुविकल्पीय उत्तर-पत्रक जाँचना','फ़ोटो स्कैन','आवाज़ पहचान'], a:1, ex:'Optical Mark Recognition — भरे गोले/निशान की उपस्थिति पढ़ता है; इसीलिए OMR शीट पर पेंसिल और सही गोला भरना अनिवार्य है।' },
    { q:'Direct thermal प्रिंटर की सबसे बड़ी सीमा?', o:['बहुत शोर','छपाई समय के साथ फीकी पड़ती है और विशेष काग़ज़ चाहिए','कार्बन कॉपी नहीं','बहुत महँगी स्याही'], a:1, ex:'गर्मी से काग़ज़ की coating काली होती है; धूप/गर्मी/समय से वह फीकी पड़ जाती है। लंबे टिकाऊ label के लिए thermal transfer लें।' },
    { q:'PCL और PostScript में मुख्य फ़र्क़?', o:['PCL रंगीन, PS काला-सफ़ेद','PostScript device-independent और ग्राफ़िक्स-सटीक; PCL तेज़ व दफ़्तरी','PCL केवल Epson का','PostScript विंडोज़ पर नहीं चलता'], a:1, ex:'PS में प्रिंटर अपना interpreter चलाता है और हर उपकरण पर एक-सा परिणाम देता है; PCL दफ़्तरी काम में तेज़ और सरल है।' },
    { q:'विंडोज़ में छपाई की कतार कौन-सी सेवा सँभालती है?', o:['Windows Update','Print Spooler','Task Scheduler','BITS'], a:1, ex:'Spooler काम को .SHD/.SPL फ़ाइलों के रूप में कतार में रखकर धीरे-धीरे प्रिंटर को भेजता है, जिससे एप्लिकेशन तुरंत आज़ाद हो जाता है।' },
    { q:'अटकी print queue पूरी तरह साफ़ करने का सही क्रम?', o:['PC restart → ड्राइवर हटाना','spooler रोकना → PRINTERS folder खाली → spooler चालू','प्रिंटर बंद-चालू','केबल बदलना'], a:1, ex:'net stop spooler, C:\\Windows\\System32\\spool\\PRINTERS की फ़ाइलें हटाना, net start spooler — इससे अटका काम पूरी तरह मिट जाता है।' },
    { q:'नेटवर्क प्रिंटर का Raw/JetDirect पोर्ट कौन-सा है?', o:['21','80','631','9100'], a:3, ex:'TCP 9100 = Raw/JetDirect. LPR = 515, IPP = 631. प्रिंटर को स्थिर IP देना इसीलिए ज़रूरी है।' },
    { q:'Inkjet nozzle बंद होने से बचाने का सबसे अच्छा उपाय?', o:['महीनों बंद रखना','हफ़्ते में एक रंगीन पन्ना छापना','स्याही निकालकर रखना','resolution बढ़ाना'], a:1, ex:'नियमित छपाई स्याही को nozzle पर जमने नहीं देती। लंबे अंतराल पर head cleaning भी अक्सर बेकार होती है।' },
    { q:'3D प्रिंटर में slicer क्या करता है?', o:['मॉडल को रंगता है','STL/3MF को परतों के G-code में बदलता है','फ़िलामेंट सुखाता है','bed गरम करता है'], a:1, ex:'Slicer (Cura/PrusaSlicer) layer height, infill, support, speed तय करके मशीन के पढ़ने योग्य G-code बनाता है।' },
    { q:'3D प्रिंट की पहली परत न चिपकने का सबसे आम कारण?', o:['फ़िलामेंट का रंग','bed leveling ग़लत','slicer का ब्रांड','कमरे की रोशनी'], a:1, ex:'nozzle और bed के बीच दूरी एक-सी न हो तो पहली परत नहीं बैठती। leveling, सफ़ाई, bed तापमान और brim से ठीक होता है।' },
    { q:'1000 VA UPS लगभग कितने Watt सँभालेगा (PF 0.7)?', o:['1000 W','700 W','1400 W','300 W'], a:1, ex:'Watt = VA × power factor. 1000 × 0.7 = 700 W. मशीन का वास्तविक Watt जोड़कर उससे 20–30% ऊपर चुनें।' },
    { q:'टोनर फैल जाए तो उसे साफ़ करने का सुरक्षित तरीक़ा?', o:['घरेलू वैक्यूम से झाड़ना','टोनर-प्रमाणित/HEPA वैक्यूम या नम कपड़ा','फूँक मारकर उड़ाना','पंखे से हटाना'], a:1, ex:'टोनर इतना महीन है कि साधारण वैक्यूम के फ़िल्टर से निकलकर मोटर में जा सकता है और आग का जोखिम बनता है। फूँक मारने से वह हवा में फैलता है।' },
  ] },
  { type:'pills', items:[
    { text:'टचस्क्रीन = Input + Output', kind:'info' },
    { text:'EP: चार्ज → एक्सपोज़ → डेवलप → ट्रांसफ़र → फ़्यूज़', kind:'exam' },
    { text:'Fusing = स्थायी छपाई', kind:'ok' },
    { text:'Impact = carbon copy', kind:'info' },
    { text:'Optical dpi देखें', kind:'tip' },
    { text:'Raw पोर्ट 9100', kind:'info' },
    { text:'Spooler रोककर कतार साफ़', kind:'tip' },
    { text:'ड्रम को रोशनी/उँगली से बचाएँ', kind:'danger' },
  ] },
  ]
},
]);
