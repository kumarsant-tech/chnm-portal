/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-office3.js
   MS Office मास्टरक्लास — PowerPoint · MS Access · Outlook/Teams/OneNote
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   3. PowerPoint पूरी गहराई
   =================================================================== */
{
  id:'off-ppt', icon:'📽️', group:'MS Office मास्टरक्लास',
  title:'PowerPoint पूरी गहराई',
  sub:'मास्टर, लेआउट, एनिमेशन, मीडिया, रिकॉर्डिंग व प्रिंट',
  kicker:'Office Masterclass 3 · PowerPoint in Depth',
  hero:'यह पेज प्रस्तुति (presentation) बनाने से लेकर दिखाने और सौंपने (deliver) तक की पूरी कला सिखाता है — <b>Slide Master</b> व <b>placeholder</b>, theme व slide size, section, text/छवि/shape/SmartArt/chart, ऑडियो-वीडियो-स्क्रीन रिकॉर्डिंग, hyperlinks व Actions, <b>Animation बनाम Transition</b> (परीक्षा का सबसे पसंदीदा सवाल), Morph, trigger-क्विज़, Presenter View, narration, handout व <code>.ppsx</code>/<code>.potx</code>, plus accessibility और Hindi-फ़ॉन्ट की सलाह।',
  tags:['Slide Master व Layout','Morph व Animation','Trigger से क्विज़','Presenter View','Handout व .ppsx','Accessibility व Hindi फ़ॉन्ट'],
  blocks:[

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.1</span> प्रस्तुति-डेक (Presentation Deck) क्या है — और PowerPoint कब ग़लत टूल है</h3>
      <p>PowerPoint एक <b>visual aid (दृश्य-सहायक)</b> है — बोलने वाले के साथ, बोलने वाले की जगह नहीं। एक <b>deck</b> = स्लाइडों (slides) का क्रम, हर स्लाइड पर कम शब्द + एक विचार, और बाक़ी बातें speaker notes में।</p>
      <ul>
        <li><b>कब बिल्कुल सही:</b> लाइव टॉक, क्लास-लेक्चर, प्रोडक्ट/कॉन्सेप्ट का नक्शा, before/after तुलना, कोई संख्या/रुझान दिखाना, training module।</li>
        <li><b>कब ग़लत टूल:</b> लंबा पढ़ने-योग्य दस्तावेज़ (Word/PDF बेहतर), डेटा तालिका जिसमें गणना हो (Excel बेहतर), अकेले भेजा जाने वाला "report" जिसमें कोई बोलने वाला नहीं — ऐसा deck "slide-document" बन जाता है, सब बोर होते हैं।</li>
        <li><b>दो तरह के deck:</b> <i>presentation deck</i> (प्रोजेक्टर पर, बोलने वाले के साथ, बहुत कम टेक्स्ट) और <i>leave-behind/self-running deck</i> (ईमेल/कियोस्क, जहाँ नोट्स ज़्यादा और timings सेट होते हैं)। master, animation और timing इन दोनों में अलग ढंग से सेट होते हैं।</li>
      </ul>`},

    {type:'table', head:['View (मेन्यू)','कैसे खोलें','इसका असली उपयोग (Use Case)'],
      rows:[
        ['Normal','View ▸ Normal / डिफ़ॉल्ट','रोज़ का काम — एक स्लाइड एडिट करना (thumbnail + slide + notes)'],
        ['Outline','View ▸ Outline (या thumbnails पर right-click ▸ Outline)','पूरी स्लाइडों का <b>टेक्स्ट-मात्र</b> नक़्शा; Tab/Shift+Tab से स्लाइड बनाना-घोलना'],
        ['Notes Page','View ▸ Notes Page','हर स्लाइड के नीचे speaker notes बड़े करके लिखना/प्रिंट करना'],
        ['Slide Sorter','View ▸ Slide Sorter','स्लाइडों को क्रम से सजाना, delete/duplicate, section बनाना, transition एक-साथ लगाना'],
        ['Reading View','View ▸ Reading View','पूरी स्क्रीन न लेकर विंडो में preview — भेजी गई deck जाँचने के लिए'],
        ['Slide Show','F5 / Shift+F5 / Slide Show ▸ From Beginning','असल प्रस्तुति (full screen)'],
        ['Presenter View','Slide Show ▸ Use Presenter View (chk) / Alt+F5','प्रोजेक्टर पर audience को साफ़ slide, आपके मॉनिटर पर next slide + notes + timer']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.2</span> Ribbon, Panes और Notes Pane</h3>
      <h4 class="blk2">क) Ribbon Tabs (मुख्य पट्टी)</h4>
      <p><b>Home</b> (slides, fonts, paragraphs, drawing), <b>Insert</b> (tables, pictures, shapes, icons, 3D, header/footer, text box, media, link), <b>Draw</b>, <b>Design</b> (themes, variants, slide size, designer), <b>Transitions</b>, <b>Animations</b> (animation pane), <b>Slide Show</b> (start, set up, monitor, record, captions), <b>Format</b> (when a picture/shape/chart is selected) और <b>View</b> (master, views, show/hide rulers-gridlines-guides, window, macros)। Context-sensitive tabs (Picture Format, Shape Format, SmartArt Design/Format, Chart Design/Format, Video/Audio Tools) सिर्फ़ चुनने पर दिखते हैं।</p>
      <h4 class="blk2">ख) Panes (पैनल)</h4>
      <ul>
        <li><b>Thumbnails pane</b> (बायाँ, ऊपर) — स्लाइडों की छोटी झलक; क्रम/चुनाव के लिए।</li>
        <li><b>Outline pane</b> (बायाँ, नीचे ▸ Outline टैब) — सिर्फ़ headline/body टेक्स्ट; टाइपिंग व बाहर से paste के लिए तेज़।</li>
        <li><b>Notes pane</b> (नीचे) — speaker notes; यहाँ लिखा notes Presenter View और notes-page print में दिखता है।</li>
        <li><b>Task Panes</b> — Animation Pane, Selection Pane (objects के नाम व order — Morph की पहचान यहीं से), Format Picture, Designer, Check Accessibility। इन्हें बंद/खोल कर जगह बचाई जा सकती है।</li>
      </ul>`},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.3</span> Ruler, Gridlines, Guides, Selection व Zoom</h3>
      <ul>
        <li><b>Ruler:</b> View ▸ रूलर (chk) — इंच/सेमी/पॉइंट; <code>Alt</code> दबाकर drag करें तो सटीक position दिखता है।</li>
        <li><b>Gridlines (View ▸ chk):</b> दिखने वाली background-grille; objects ख़ुद इस पर snap होते हैं। <b>snap to grid</b> बंद करने के लिए <code>Alt</code> दबाकर drag।</li>
        <li><b>Guides:</b> View ▸ Gridlines ▸ <b>Insert Guides</b> ▸ Add Vertical/Horizontal Guide। Guides दिखती हैं पर print नहीं होतीं — हर slide पर एक जैसी margin/alignment रखने के लिए best। Guide को <code>Alt</code>+drag से snap करें; <code>Ctrl</code>+drag से एक guide copy; guides हटाने के लिए drag कर slide से बाहर छोड़ दें।</li>
        <li><b>Keep objects aligned:</b> PowerPoint अपने-आप spacing के दौरान smart guides (dashed lines) दिखाता है और objects को "snap to position" करता है — <code>Alt</code> से यह अस्थायी बंद होता है।</li>
        <li><b>Selection Pane (Home ▸ Select ▸ Selection Pane):</b> हर object का layer order व नाम — Shift/Ctrl से multiple select, <code>Tab</code> से अगला object।</li>
        <li><b>Zoom:</b> नीचे-दाएँ slider या View ▸ Zoom; <code>Ctrl</code>+<code>+</code>/<code>-</code> नहीं — Zoom slide show में नहीं बदलता, सिर्फ़ editing view। Zoom to 66%/Fit/Actual size का विकल्प।</li>
      </ul>`},

    {type:'table', head:['Layout का नाम','क्या placeholder होते हैं','कब इस्तेमाल'],
      rows:[
        ['Title Slide','Title + Subtitle','पहली स्लाइड — विषय व उप-विषय/नाम'],
        ['Title and Content','Title + Content (body/table/chart/pic)','सबसे आम — एक heading + bullet/वस्तु'],
        ['Two Content','Title + दो Content box','तुलना — शब्द बनाम चित्र, दो सूचियाँ'],
        ['Comparison','Title + दो Header + दो Content','दो पक्षों की heading सहित तुलना'],
        ['Title Only','सिर्फ़ Title','पूरी जगह चित्र/डायग्राम/टेबल के लिए'],
        ['Blank','कोई placeholder नहीं','स्वतंत्र design, logo water-mark, स्क्रीनशॉट'],
        ['Content with Caption','Content + Caption','छवि/चार्ट के नीचे कैप्शन'],
        ['Picture with Caption','Picture (placeholder) + Title + Caption','फ़ोटो-आधारित स्लाइड'],
        ['Section Header','Title + Text','अध्याय/section शुरू करने की divider slide']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.4</span> Slide Master — डिज़ाइन का असली केंद्र</h3>
      <p><b>View ▸ Slide Master</b> खोलें। सबसे ऊपर/बड़ी जो स्लाइड दिखती है वह <b>Master Slide</b> (parent) है; उसके नीचे छोटीं <b>Layouts</b> (children)। Master पर जो font, background, logo, bullet style डालें — वह सब layouts में और उन पर बनी हर slide में चला आता है।</p>
      <ul>
        <li><b>Placeholder inherits formatting:</b> slide पर placeholder (जिस पर "Click to add title" लिखा हो) master से position, font, size, colour और bullet लेता है। इसीलिए हर slide पर अलग-अलग formatting करने की ज़रूरत नहीं — master बदलें तो सारी slides बदल जाती हैं।</li>
        <li><b>Insert Layout</b> ▸ नई layout; layout का नाम बदलने right-click ▸ <b>Rename</b>; order बदलने drag करें; delete भी वहीं से।</li>
        <li><b>Remove Background Graphics / Hide Background Graphics:</b> layout पर background-chित्र छिपाएँ बिना master मिटाए।</li>
        <li><b>Restore All (Home ▸ Reset ▸ dropdown):</b> जो slides manual formatting से बिगड़ गई थीं, उन्हें दोबारा master/layout के अनुसार ला देता है।</li>
        <li><b>Master से slide बनाना:</b> Home ▸ New Slide ▸ कोई layout चुनें; layout बदलने Home ▸ <b>Layout</b> dropdown (नई layout चुनने पर text placeholders बचे रहते हैं, बाक़ी objects नहीं)।</li>
      </ul>`},

    {type:'table', head:['Inheritance (किससे मिलता है)','कहाँ से','बदलने का असर'],
      rows:[
        ['एक slide का title/body font व colour','उसकी Layout → फिर Master','Master बदलें तो सभी layouts की slides बदलें'],
        ['Background व logo','Master (या layout ने override किया हो)','layout-level change सिर्फ़ उस layout की slides पर'],
        ['Bullet styles व paragraph spacing','Master ▸ Formats ▸ Bullet Styles','सारी placeholder bullets एक जैसे'],
        ['Theme colours/fonts/effects','Design ▸ Themes (master सब slides को share करते हैं)','Theme बदलें → पूरा deck recolour'],
        ['Placeholder की position/size','Layout (master के ऊपर override)','layout edit करें → उस layout की सभी slides']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.5</span> Theme, Variants और Customize Theme (<code>.thmx</code>)</h3>
      <p><b>Design ▸ Themes</b> एक theme तीन चीज़ें देती है: <b>Colour palette</b> (12 named slots — Dark/Light 1–2, Accent 1–6, Hyperlink, Followed Hyperlink), <b>Font pair</b> (Heading + Body), <b>Effects</b> (shape outlines/shadows/gradients)। <b>Variants</b> (Design ▸ right group) उसी theme के colour/font/effects के preset रंग-संस्करण होते हैं — "Colored Text and Background" जैसे।</p>
      <ul>
        <li><b>Customize Theme:</b> Design ▸ Variants ▸ dropdown ▸ <b>Colors / Fonts / Effects / Background Styles</b> ▸ <b>Create New Theme Colors / Fonts</b>। पूरा बना theme <b>Save Theme</b> से <code>.thmx</code> में save होता है (Gallery folder में डालें तो Design ▸ Themes में स्थायी दिखे)।</li>
        <li><b>Set as Default:</b> theme/variant पर right-click ▸ Set as Default Font/Theme — आगे खुलने वाली सभी <b>blank</b> presentations पर लागू (मौजूदा files नहीं बदलतीं)।</li>
      </ul>
      <div class="callout warn"><b class="ct">Design Ideas / Designer सावधानी</b><p><b>Design ▸ Design Ideas</b> (Microsoft 365) सुझाव ऑनलाइन भेजकर AI से layout बनाता है। संवेदनशील/गोपनीय content वाले deck में इस पर भरोसा न करें — यह feature internet व cloud भेजे गए content पर निर्भर है, और सुझाव हर version में अलग होते हैं। Offline/कॉलेज लैब में इसे बंद रखें और master से खुद design करें।</p></div>`},

    {type:'table', head:['Slide Size','Ratio','कब व क्या होता है'],
      rows:[
        ['Standard (4:3)','4:3','पुराने projector/TV; 10×7.5 इंच'],
        ['Widescreen (16:9)','16:9','आधुनिक projector/monitor/laptop (default)'],
        ['Custom','जैसे 16:10, A4, postcard','Design ▸ Slide Size ▸ Custom — print/poster नाप के लिए']
      ]},
    {type:'callout', kind:'info', title:'Maximize बनाम Ensure Fit', html:'<p>Ratio बदलते PowerPoint दो विकल्प देता है: <b>Maximize</b> (content बड़ा, किनारे कट सकते हैं) बनाम <b>Ensure Fit</b> (content छोटा करके पूरा फ़िट) — दोनों के बाद text boxes दोबारा जाँच लें, क्योंकि placeholder अपने-आप perfect नहीं होते।</p>'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.6</span> Sections — लंबे deck को टुकड़ों में बाँटना</h3>
      <p>Slide Sorter में दो slides के बीच right-click ▸ <b>Add Section</b>। Section का नाम right-click ▸ <b>Rename Section</b>; title पर click ▸ <b>Collapse/Expand</b>; drag से पूरा section हिलाना; <b>Delete Section</b> (slides delete नहीं होतीं, सिर्फ़ grouping हटती है)।</p>
      <ul>
        <li><b>क्यों ज़रूरी:</b> 60–200 स्लाइड के training deck में section रखने से reordering, "यह chapter hide करना", custom show बनाना और navigation बहुत आसान — जैसे किताब के अध्याय।</li>
        <li><b>Unassigned section:</b> बिना section वाली slides सबसे ऊपर एक unnamed group में दिखती हैं।</li>
        <li>sections file structure का हिस्सा हैं; दूसरे version में भी बचे रहते हैं (presentation ही नहीं बदलती)।</li>
      </ul>`},

    {type:'table', head:['क्या','कहाँ से','विवरण/नियम'],
      rows:[
        ['Slide Number','Insert ▸ Header and Footer','Placeholder में क्रमांक; master में स्थिति तय होती है'],
        ['Date & Time','Insert ▸ Header and Footer','Automatic (system clock) या Fixed; update होते रहते हैं'],
        ['Footer text','Insert ▸ Header and Footer','हर slide पर नीचे — institute का नाम/notes'],
        ['Title slide पर सब बंद','Header/Footer dialog ▸ <b>Don’t show on title slide</b> (chk)','सिर्फ़ पहली (title) slide पर number/date/footer छिपाएँ'],
        ['Apply to All vs Apply','Footer dialog के दो बटन','Apply एक slide पर, Apply to All सारी पर'],
        ['Hidden Slide','Slide Sorter ▸ right-click ▸ <b>Hide Slide</b> या Slide Show ▸ Hide Slide','Show में नहीं दिखेगी, पर print/handout में जाएगी; numbering का नियम नीचे देखें']
      ]},
    {type:'callout', kind:'info', title:'Hidden slide व numbering', html:'<p>छिपाई गई slide show में skip होती है, पर उसका <b>slide-number क्रम में गिना जाता रहता है</b> — यानी अगली दिखने वाली slide का number hidden slide की जगह छोड़कर चलता है। Hyperlinks व custom shows hidden slide को target कर सकते हैं; वह सिर्फ़ live show में अपने-आप नहीं दिखती।</p>'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.7</span> Delete / Reorder / Duplicate / Reuse Slides</h3>
      <ul>
        <li><b>Reorder:</b> Slide Sorter/thumbnails में drag, या right-click ▸ Move Slide Forward/Backward; section drag से पूरा समूह।</li>
        <li><b>Duplicate:</b> right-click ▸ <b>Duplicate Slide</b> (या <code>Ctrl</code>+drag) — master/formatting सहित नकल।</li>
        <li><b>Delete:</b> right-click ▸ Delete Slide / <code>Del</code>; Undo (<code>Ctrl</code>+Z) से वापस।</li>
        <li><b>Reuse Slides:</b> Home ▸ New Slide ▸ <b>Reuse Slides</b> (task pane) ▸ पुरानी .pptx browse करें ▸ कोई slide click करके डालें। <b>Keep source formatting</b> (chk) करने पर उस slide का master/format बचा रहेगा; बंद करने पर आपके deck के theme में ढल जाएगा। PowerPoint 2019+/365 में यह Home ▸ New Slide ▸ <b>Reuse Slides</b> / <b>Browse for Close</b> के रूप में है; web version में सीमित।</li>
        <li>एक deck से दूसरे में slide copy करने पर <b>source का theme</b> अपने-आप "Used Themes" में आ जाता है — इसीलिए Paste Options ▸ Use Destination Theme / Keep Source Formatting से चुनिए।</li>
      </ul>`},

    {type:'steps', items:[
      {n:1, title:'Word में outline तैयार कीजिए', text:'Word.dox में हर स्लाइड का <b>title Heading 1</b>, bullet <b>Heading 2</b>, sub-bullet <b>Heading 3</b> — इतना ही। बाक़ी styling छोड़ दें। Save कर Word बंद कीजिए (खुला file import अड़ता है)।', warn:'Heading न लगा हो तो सिर्फ़ plain text import होगा, slides नहीं बनेंगी।'},
      {n:2, title:'PowerPoint में Files ▸ New ▸ Outline (या Insert ▸ Slides from Outline)', text:'नए deck में Home ▸ New Slide dropdown ▸ <b>Slides from Outline</b> ▸ अपना .docx चुनें। हर Heading 1 = एक नई slide, Heading 2 = body level 1, Heading 3 = level 2।', warn:'पुराने संस्करणों में menu थोड़ा अलग हो सकता है; काम वही है — Word file से slides बनाना।'},
      {n:3, title:'Layout सुधारिए', text:'Import अक्सर Title+Content layout देता है। Slide Sorter में select ▸ Home ▸ <b>Layout</b> ▸ Title Slide/Two Content से सही layout लगाइए; master/theme भी अभी apply करें।'},
      {n:4, title:'Outline pane से अंतिम घटाव-बढ़ाव', text:'View ▸ Outline ▸ left pane में <code>Enter</code> से नई slide, <code>Tab</code> demote (content में), <code>Shift</code>+<code>Tab</code> promote (title में) — text तेज़ी से सुधार लीजिए।'},
      {n:5, title:'Media व visuals जोड़ें, फिर rehearse', text:'छवि/चार्ट/आकार placeholder में डालें, notes लिखें, transition लगाएँ, अंत में Rehearse Timings।'}
    ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.8</span> Text Boxes व Bullets — सुसंगतता (consistency) का नियम</h3>
      <p>Placeholder vs <b>Text Box</b> (Insert ▸ Text Box): text box master से कुछ inherit नहीं करता, इसलिए इसकी font/size/colour खुद तय करनी पड़ती है — deck भर में inconsistency का सबसे आम कारण।</p>
      <ul>
        <li><b>Word wrap:</b> Format Shape ▸ Text Options ▸ Text Box ▸ <b>Wrap text in shape</b> (chk) — बंद करने पर text box से बाहर नहीं फैलता, काट दिया जाता है।</li>
        <li><b>Vertical alignment:</b> Home ▸ Arrange group या Format ▸ Align Text (Top/Middle/Bottom)।</li>
        <li><b>Text direction:</b> Format ▸ Text Direction (horizontal/vertical/rotated) — हिंदी के लिए Horizontal ही रखें।</li>
        <li><b>Bullets:</b> Home ▸ Bullets dropdown ▸ <b>Bullets and Numbering</b> ▸ <b>Customize</b> — यहाँ character बदलें (Wingdings/आइकन), <b>new-start-at</b> और sub-level (Tab/Shift+Tab)। हर bullet level का font अलग हो सकता है।</li>
      </ul>`},
    {type:'table', head:['Autofit विकल्प','क्या करता है','सुझाई गई आदत'],
      rows:[
        ['Do not autofit','text box का आकार स्थिर; बड़ा text छिप/कट सकता है','<b>सबसे सुसंगत</b> — हर slide box एक जैसा, font नहीं बदलता'],
        ['Shrink text on overflow','सिर्फ़ font छोटा करके फ़िट करता है','जल्दी ठीक, पर font size इधर-उधर हो जाता है'],
        ['Resize shape to fit text','box लंबा-चौड़ा होता है','layout shift कर सकता है — सावधान'],
      ],
      },

    {type:'table', head:['Save Options में फ़ॉन्ट','विवरण','क्यों/कब'],
      rows:[
        ['Embed fonts in the file (chk)','File ▸ Save ▸ Options ▸ <b>Embed fonts</b> — font फ़ाइल के अंदर चला जाता है','दूसरे PC पर text टूटेगा नहीं'],
        ['Embed only used characters','केवल दिखने वाले अक्षर — file छोटी, पर बाद में टाइप न हो सके','अंतिम/भेजने वाली deck, content पक्का हो'],
        ['Embed all characters','पूरे glyphs — बड़ी file, बाद में भी एडिट हो सकता है','template/jaanibari deck'],
        ['Disable embedding on shared fonts','system/licensed fonts दोबारा न डालें','file size बचाने']
      ]},
    {type:'callout', kind:'info', title:'Text दूसरे PC पर बिगड़ने का कारण व समाधान', html:'<p>वहाँ वह font इंस्टॉल नहीं होने पर PowerPoint “fallback” font डाल देता है और Hindi matras/spacing टूट जाते हैं। <b>समाधान:</b> Embed fonts in the file, या Nirmala UI/Mangal जैसा हर Windows पर मौजूद font इस्तेमाल करें, या अंतिम रूप से .pdf export कर दें।</p>'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.9</span> छवियाँ (Pictures) — डालना, सुधार, alt text व size</h3>
      <ul>
        <li><b>Insert ▸ Pictures</b> ▸ This Device / <b>Stock Images</b> / <b>Online Pictures (Bing)</b>। <b>Caution:</b> online/Bing images का licence अक्सर editorial/limited होता है; commercial class material में use से पहले licence पढ़ें — यही सुरक्षित तरीक़ा है कि self-owned या licence-confirmed image रखें।</li>
        <li><b>Crop:</b> Picture Format ▸ Crop; <b>Crop to Shape</b> (गोल/तीर आदि में काटना); <b>Aspect Ratio</b> (1:1, 4:3, 16:9) से समान नाप; <b>Fill</b> में image को box के अनुसार adjust (cropped picture को box में fit)। <b>Reset Picture</b> सारे बदलाव वापस मूल पर।</li>
        <li><b>Remove Background:</b> Picture Format ▸ Remove Background — mark areas to keep/delete; logo/product cut-out।</li>
        <li><b>Corrections / Colour / Artistic Effects / Picture Styles:</b> sharpen, brightness, recolor theme-colours में, blur/sketch आदि, frame styles।</li>
        <li><b>Alt text:</b> right-click ▸ <b>View Alt Text</b> ▸ description — accessibility व screen reader के लिए ज़रूरी (Check Accessibility भी बताता है)।</li>
        <li><b>Compression:</b> Picture Format ▸ <b>Compress Pictures</b> ▸ resolution (Email 96ppi / Web 150 / Print 220 / HD 330) ▸ <b>Delete cropped areas</b> — file आकार बहुत घटाता है (crop हुए हिस्से मिट जाते हैं, वापस नहीं आएँगे)।</li>
        <li><b>Link vs Embed:</b> Insert ▸ Pictures ▸ dropdown ▸ <b>Insert and Link</b> — image फ़ाइल के बाहर रहती है, बदलने पर slide अपडेट; पर deck दूसरे PC पर ले जाएँ तो मूल image भी साथ चाहिए नहीं टूटेगी (यही कारण है कि ज़्यादातर बार <b>Embed</b> बेहतर)।</li>
      </ul>`},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.10</span> Icons, 3D Models, Shapes, SmartArt, Charts व Tables</h3>
      <h4 class="blk2">क) Icons व 3D Models</h4>
      <ul>
        <li><b>Insert ▸ Icons</b> — सैकड़ों vector icons (theme colour से recolor, free to use)।</li>
        <li><b>Insert ▸ 3D Models</b> — .glb/.fbx/.3mf मॉडल; 3D टैब से घुमाएँ (rotate) व view save। <b>Animation ▸ 3D Models ▸ Turn</b> से show के दौरान घूमता है (2019+/365)।</li>
      </ul>
      <h4 class="blk2">ख) Shapes (आकार)</h4>
      <ul>
        <li><b>Edit Points:</b> Shape ▸ Edit Shape ▸ Edit Points — bezier जैसी curve खींचना।</li>
        <li><b>Merge Shapes:</b> several shapes select ▸ Shape Format ▸ <b>Merge Shapes</b> ▸ <b>Union</b> (जोड़ें), <b>Combine</b> (overlap घटाएँ), <b>Fragment</b> (टुकड़े), <b>Intersect</b>, <b>Subtract</b> — custom icons/flowcharts।</li>
        <li><b>Freeform:</b> एक-एक point click या drag करके मुक्त आकार।</li>
        <li><b>Arrow styles:</b> Line ▸ Arrows — दोनों सिरों का shape व नाप। <b>Action buttons</b> नीचे links/actions में।</li>
      </ul>
      <h4 class="blk2">ग) SmartArt</h4>
      <ul>
        <li><b>Convert list → SmartArt:</b> bullets select ▸ Home ▸ <b>Convert to SmartArt</b>।</li>
        <li>Layout families: <b>Process</b> (क्रम), <b>Cycle</b> (चक्र), <b>Hierarchy</b> (संगठन/वृक्ष), <b>Relationship</b> (venn/pyramid), <b>Matrix</b> (quad), <b>Pyramid</b>, <b>List</b>, <b>Picture</b>।</li>
        <li>SmartArt ▸ Design ▸ <b>Add Shape</b> (above/below/after) ▸ Text Pane ▸ <b>Change Colors</b> ▸ SmartArt Styles। Two tabs: <b>Design</b> (structure/layout) व <b>Format</b> (colour/shape)।</li>
        <li><b>SmartArt को shapes में बदलना:</b> SmartArt select ▸ Convert to Shapes (ungroup twice) — फिर हर box अलग editable; animation/trigger के लिए काम आता है।</li>
      </ul>
      <h4 class="blk2">घ) Charts</h4>
      <ul>
        <li><b>Insert ▸ Chart</b> — embedded mini-Excel workbook खुलता है; डेटा उसमें डालें (chart PowerPoint के अंदर रहता है, .xlsx खुला नहीं चाहिए)। <b>Right-click ▸ Edit Data ▸ Edit Data / Open in Excel</b> (linked workbook)।</li>
        <li><b>Chart Design</b> ▸ Change Chart Type / Colors / Layout / Switch Row-Column; <b>Format</b> ▸ elements (series/axis)।</li>
        <li><b>Animation “by series” trick:</b> chart पर एक entrance animation लगाकर <b>Effect Options ▸ Sequence ▸ By Series</b> चुनें — हर बार click पर एक series/बार उभरती है (chart-specific animation)।</li>
      </ul>
      <h4 class="blk2">ङ) Tables</h4>
      <ul>
        <li><b>Insert ▸ Table</b> या layout का Content placeholder ▸ Table icon। <b>Table Design</b> ▸ shading/banding/first column; <b>Layout</b> ▸ cell margins (Table ▸ Cell Margins ▸ Default), merge/split, row height।</li>
        <li><b>Text → Table:</b> text box में delimiter (tab/comma) से अलग कीजिए ▸ Insert ▸ Table ▸ <b>Convert Text to Table</b> (मुख्यतः Word में; PowerPoint में सीधे convert का menu संस्करण-भेदी है — सबसे भरोसेमंद रास्ता Word से convert करके copy)।</li>
        <li><b>7×7 rule:</b> एक table में ~7 rows व 7 columns से ज़्यादा मत डालिए; projector पर छोटा दिखेगा — ज़्यादा हो तो slide तोड़ें या सिर्फ़ मुख्य हाइलाइट रखें।</li>
      </ul>`},

    {type:'table', head:['Feature','Audio (Insert ▸ Audio)','Video (Insert ▸ Video)'],
      rows:[
        ['Embed vs Link','Insert ▸ Audio ▸ Audio on My PC (embed) / link; embed से file बड़ी पर साथ चलती है','mp4 embed; link रखें तो media साथ चाहिए'],
        ['Recommended format','MP3/M4A (WAV भी, पर बड़ा)','MP4 + H.264 video + AAC audio — सबसे सुरक्षित'],
        ['Start','Playback ▸ Start: Automatically / In Click Sequence / When Clicked / Previously','वही विकल्प video में'],
        ['Trim','Audio ▸ Playback ▸ <b>Trim Audio</b> (start/end + fade)','Video ▸ Playback ▸ <b>Trim Video</b>'],
        ['Fade / Loop / Hide','Fade In/Out; <b>Loop until Stopped</b>; <b>Play Across Slides</b>; <b>Hide During Show</b>','Loop; Play Across Slides; Hide During Show; Poster Frame से पहला फ़्रेम बदलें'],
        ['Record','Audio ▸ <b>Record Audio</b> (mic से narration)','—'],
        ['Online / codec','—','Insert ▸ <b>Online Videos</b> (URL) — show के समय internet चाहिए; codec न हो तो video अटका/काला']
      ]},
    {type:'callout', kind:'warn', title:'Video अटकता है — कारण', html:'<p>अधिकांश stutter/freeze का कारण <b>codec/format</b> (H.265, unusual container), <b>linked media जो साथ नहीं आई</b>, बहुत बड़ा bitrate, या पुराना GPU/PC। <b>समाधान:</b> <b>File ▸ Info ▸ Compress Media</b> से MP4/H.264 में convert + quality घटाएँ; video embed करें; भेजने से पहले उसी PC पर show करके जाँचें।</p>'},

    {type:'steps', items:[
      {n:1, title:'Insert ▸ Screen Recording', text:'Ribbon पर <b>Insert ▸ Screen Recording</b> (2013+ desktop; screen top पर एक पतली control bar आती है)।'},
      {n:2, title:'Select Area', text:'<b>Select Area</b> ▸ पूरे स्क्रीन या कोई rectangle चुनें; <b>Record Full Screen</b> भी।'},
      {n:3, title:'Audio व Cursor सेट करें', text:'bar पर <b>Record Audio</b> (mic/system) और <b>Select Cursor</b> (cursor record होगा या नहीं) — पहले तय कर लें, बाद में नहीं बदलता।'},
      {n:4, title:'Record ▸ और रोकें', text:'<b>Record</b> (3-2-1 countdown) ▸ अपना workflow दिखाएँ। रोकने के लिए <b>Win+Shift+Q</b> या <code>Esc</code> (Windows key दबाने से भी रुकता है)।'},
      {n:5, title:'Slide पर आया file ▸ Trim ▸ Compress', text:'रिकॉर्डिंग सीधे slide पर video के रूप में आती है। <b>Playback ▸ Trim Video</b> से शुरू/अंत काटें; ज़रूरत हो तो Compress Media से size घटाएँ; फिर poster frame/title लगाएँ।'}
    ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.11</span> Hyperlinks व Actions — clicking से navigation</h3>
      <p><b>Insert ▸ Link</b> (या <code>Ctrl</code>+<code>K</code>) — chat box में तीन रास्ते: <b>Existing File or Web Page</b> (URL/file), <b>Place in This Document</b> (इसी deck की कोई slide/custom show), <b>Create New Document</b>, <b>E-mail Address</b> (mailto)। <b>ScreenTip</b> button से hover पर दिखने वाला tooltip लिखें। Link हटाने right-click ▸ <b>Remove Hyperlink</b>।</p>
      <ul>
        <li><b>Insert ▸ Action (Actions Setup):</b> Action Settings dialog — <b>Hyperlink</b> tab (jump to slide/show/last/first/next/end/URL/other file) और <b>Run program</b> tab (external exe चलाना)। <code>Run program</code> security के कारण <b>Protected View</b> व आधुनिक default में block रहता है — भरोसेमंद internal use ही सोचकर रखें। <b>Mouse Click</b> बनाम <b>Mouse Over</b> trigger चुनें; <b>Play sound</b>; <b>Highlight click</b>।</li>
        <li><b>Single-click link बनाम Ctrl+click:</b> editing में link को <code>Ctrl</code>+click से खोलते हैं; show में सिर्फ़ click। Show में भी हर जगह click से navigation न चाहे तो <b>Actions Setup</b> (Insert ▸ Action) से object पर click-condition बनाइए — वह बिना Ctrl के चलता है।</li>
        <li><b>Button design & click action:</b> shape/button पर Insert ▸ Action ▸ Hyperlink: <b>End Show</b>, <b>Hide/Show pointer</b>, <b>Last/First/Next/Previous/Last Viewed</b> — menu/quit button यहीं से। <b>action buttons</b> Insert ▸ Shapes ▸ आख़िरी row (Home/Back/Forward/End/Information…)।</li>
        <li><b>Hidden link area:</b> कोई shape को fill/line = No fill, No line, action = slide jump → दिखेगा नहीं पर click काम करेगा। <b>Selection Pane</b> में नाम रखें ताकि बाद में मिल जाए।</li>
        <li><b>PDF/Excel slide से खोलना:</b> Insert ▸ Object (by file) या link ▸ Existing File ▸ path — file वही हो/absolute path हो; deck move करें तो link टूट सकता है (<b>broken link</b> दोबारा Edit Link/repair करें)।</li>
        <li><b>Highlight mouse pointer:</b> Slide Show ▸ Set Up Show ▸ <b>Highlight mouse pointer</b> (+ colour/size) — live show में pointer को रंगीन halo से दिखाता है, laser की ज़रूरत कम।</li>
      </ul>`},

    {type:'callout', kind:'exam', title:'Animation बनाम Transition (सबसे पसंदीदा सवाल)', html:'<p><b>Transition</b> = एक <b>slide से दूसरी slide</b> पर जाते समय का effect (slide-level; Transitions tab)। <b>Animation</b> = एक slide के <b>अंदर किसी object</b> (text/picture/shape) का movement (object-level; Animations tab)। याद रखने का सूत्र: <i>Transition slides के बीच, Animation slide के भीतर।</i></p>'},
    {type:'table', head:['Transition','क्या दिखता है','अक्सर उपयोग'],
      rows:[
        ['None','सीधे बदलाव','professional/teaching default'],
        ['Morph','duplicate object को नई position/size में smooth move','zoom-in, step-by-step diagram (नीचे देखें)'],
        ['Fade / Dissolve','हल्का cross-fade','सामान्य, soft'],
        ['Push / Wipe / Split','एक दिशा से धक्का/पोंछना/दो हिस्से','क्रम/गति दिखाना'],
        ['Reveal / Cover / Flash / Fall Through / Drift','विशेष motion','बचकर, topic-break पर'],
        ['Random Bars / Shape / Cut / New Slide','bars/shape curtain/cut','—'],
        ['Gallery / Window / Origami / Plus','3D/origami-style reveal (नए संस्करण)','—'],
        ['Bounce Glitter / Dynamic (365)','अतिरिक्त','version-भेदा; न मिले तो छोड़ें']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.12</span> Transition सेटिंग्स व Morph</h3>
      <ul>
        <li><b>Timing group (Transitions tab):</b> <b>Duration</b> (कितनी धीमी; 00.50–03.00 आम), <b>Sound</b> (dropdown; "Transition Sound" बंद रखें बेहतर), <b>Apply To All</b (पूरे deck पर एक जैसा)।</li>
        <li><b>Advance Slide:</b> <b>On Mouse Click</b> (manual, live talk) बनाम <b>After</b> N seconds (auto/leave-behind/kiosk) — दोनों साथ भी रख सकते हैं, जो पहले हो वही लागू। पूरे auto-advance के लिए timings पर नीचे 3.15 देखें।</li>
        <li><b>Effect Options</b> (direction/variance) हर transition के लिए।</li>
      </ul>
      <h4 class="blk2">Morph — कैसे चलता है</h4>
      <ul>
        <li>दो consecutive slides पर <b>वही object</b> (नहीं बदला, न duplicate name टकराया) अलग position/size/colour में रखें, दूसरी slide पर <b>Transitions ▸ Morph</b> लगाएँ — PowerPoint बीच का smooth motion अपने-आप बनाता है।</li>
        <li><b>Requirements:</b> PowerPoint 2019/365 (Microsoft 365); object पहचान के लिए <b>Selection Pane में नाम</b> मिलाते हैं — text boxes, shapes, pictures, SmartArt (convert-to-shape के बाद), charts/tables सीमित।</li>
        <li><b>Zoom-in effect:</b> slide 2 पर slide 1 के एक हिस्से को बड़ा/centred करके Morph लगाएँ → Ken-Burns जैसा zoom। यह best-practice है: <b>हर slide पर Morph न</b>, बस जहाँ continuity दिखानी हो।</li>
      </ul>`},
    {type:'table', head:['Animation Category','क्या','उदाहरण (Effects)','कब'],
      rows:[
        ['Entrance (Green)','object अंदर आता है','Appear, Fade, Fly In, Wipe, Zoom, Split, Float In/Up, Random Bars','पहली बार दिखाना'],
        ['Emphasis (Yellow)','','object घूमता/बढ़ता/rंग बदलता है','Grow/Shrink, Change Fill Colour, Spin, Pulse, Teeter, Rocket','महत्व highlight'],
        ['Exit (Red)','object बाहर जाता है','Fade, Fly Out, Zoom, Wipe, Disappear','हटाना/replace'],
        ['Motion Paths','object एक बिंदु से दूसरे पर','Lines, Arcs, Turns, Custom Path (draw)','flow/process movement']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.13</span> Animation सेटिंग्स व Animation Pane</h3>
      <ul>
        <li><b>Effect Options (Animations ▸ group):</b> <b>Start</b> (On Click / With Previous / After Previous), <b>Duration</b> (केवल 1 बार चलने की लंबाई; fast/slow/medium), <b>Delay</b> (कितने सेकंड बाद), <b>Repeat</b>, <b>Smooth start/end</b>, <b>By Paragraph/Word/Letter/All at Once</b>, <b>Enhancements</b> (colour after animation, bounce end, sound)। <b>Hide on click after animation</b> exit/trigger में काम आता है।</li>
        <li><b>Animation Pane</b> (Animations ▸ Animation Pane): दाईं ओर पूरी list — drag से order, ऊपर-नीचे move, effect को दूसरी slide पर ले जाना (drag कर thumbnails में slide छोड़ें), समूह (multi-select ▸ Group) बनाना, time-line view (All/Show Only Presented/Advanced Timeline)।</li>
        <li><b>Chart series animation:</b> chart पर entrance ▸ Effect Options ▸ Sequence <b>By Series</b> (3.10 ग देखें)।</li>
        <li><b>Trigger → “on click of object”:</b> effect select ▸ Animations ▸ <b>Trigger ▸ On Click of ▸ कोई object</b>। फिर वह effect सामान्य click से नहीं, सिर्फ़ उस object के click पर चलेगा।</li>
      </ul>
      <div class="callout tip"><b class="ct">5-मिनट का Trigger-क्विज़ lab</b><p>Blank slide पर 4 option shapes (A/B/C/D) + एक "सही/ग़लत" text box। सही-वाले shape को entrance (Fade) animation ▸ <b>Trigger ▸ On Click of ▸ वही shape</b> रखें, ग़लत options पर <b>Pulse/Red Fill</b> emphasis ▸ <b>Trigger ▸ On Click of</b> उन्हीं पर; हर shape का नाम Selection Pane में स्पष्ट रखें। Show में बच्चों को click करके उत्तर चुनना होगा और feedback खुद दिखेगा — बिना VBA interactive quiz।</p></div>`},
    {type:'callout', kind:'info', title:'Animation best practices (शिक्षकों के लिए)', html:'<ol><li>एक slide पर अधिकतम ~2 तरह के effects — वरना बच्चे content नहीं, movement देखते रहेंगे।</li><li><b>उद्देश्य हो:</b> क्रम दिखाना, एक-एक point reveal करना, answer छिपाना — नहीं तो कोई animation नहीं।</li><li><b>सुसंगत:</b> पूरी deck में एक ही entrance (जैसे Fade) रखें, हर slide पर अलग-अलग न।</li><li>हर line/हर bullet पर effect मत लगाओ; समूह (group) करके एक साथ लाओ।</li><li>Rehearse से पहले animation-timing एक बार practice कर लें (कितने click लगेंगे)।</li></ol>'},

    {type:'table', head:['क्या','कहाँ','विवरण/मोड'],
      rows:[
        ['From Start / From Current Slide','Slide Show ▸ From Beginning (F5) / From Current Slide (Shift+F5)','पूरी / वहीं से जहाँ cursor है'],
        ['Custom Show','Slide Show ▸ Custom Slide Show ▸ <b>Custom Shows</b> ▸ New','अलग audiences के लिए slides का subset व क्रम (जैसे A-students/B-teachers); Play ▸ Custom Show से चलाएँ'],
        ['Set Up Show','Slide Show ▸ Set Up Show','तीन modes नीचे'],
        ['Presented by a speaker (full screen)','Set Up Show ▸ Show type','normal talk; presenter view + clicker'],
        ['Browsed by an individual (window)','Set Up Show ▸ Show type','एक विंडो में, browser-style, कोई audience नहीं'],
        ['Kiosk (looping) / Browsed at a kiosk','Set Up Show ▸ Show type','<b>लूप, Esc/navigation बंद</b> — reception/booth self-running'],
        ['Show without narration / Show popup navigation / Loop until Esc / Range (slides) / Transition manually vs Using timings / Highlight mouse pointer','Set Up Show options','multiple monitors, presenter view chk, slide range, "Using timings, if present"'],
        ['Monitors / Use all monitors / Show side by side','Set Up Show ▸ Multiple monitors','extend बनाम duplicate नीचे 3.15']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.14</span> Live Show के दौरान के keys (on-slide shortcuts)</h3>
      <p>ये keys कोई भी viewer show में दबा सकता है — exam में अक्सर पूछे जाते हैं:</p>
      <ul>
        <li><code>N</code>/<code>Right</code>/<code>Space</code>/<code>Enter</code>/<code>PgDn</code> = अगली; <code>P</code>/<code>Left</code>/<code>Backspace</code>/<code>PgUp</code> = पिछली; <code>Home</code>/<code>End</code> = पहली/आख़िरी।</li>
        <li><code>Esc</code> या <code>-</code> = show ख़त्म; <code>number</code> then <code>Enter</code> = उस क्रम की slide पर jump।</li>
        <li><code>B</code> या <code>.</code> = Black स्क्रीन, <code>W</code> या <code>,</code> = White (दोबारा दबाएँ तो वापस) — audience का ध्यान हटाने/वापस लाने के लिए।</li>
        <li><code>A</code> = Arrow (normal cursor); <code>P</code> से भी arrow; <code>Ctrl+H</code> या <code>S</code> = cursor/pointer hide; फिर कोई key वापस।</li>
        <li><code>E</code> = Erase (pen marks मिटाएँ), <code>Ctrl+P</code> = Pen, <code>Ctrl+I</code> = Highlighter, <code>Ctrl+U</code> = Eraser, mouse से drawing; right-click ▸ Pointer Options में <b>Laser Pointer</b>।</li>
        <li><code>+</code>/<code>-</code> = Zoom in/out (365/2019+), <code>0</code> = zoom reset; <code>Ctrl+Shift+F</code> = slide search (go to)।</li>
      </ul>`},
    {type:'table', head:['Delivery Feature','क्या','कैसे'],
      rows:[
        ['Presenter View','आपकी screen पर next slide + notes + timer + tools; audience को साफ़ slide','Slide Show ▸ <b>Use Presenter View</b> (chk); <code>F5</code>; tools (☰) से Pen/Zoom/Black/Goto Slide; touch पर swipe; timer start/pause/reset'],
        ['Extend vs Duplicate monitor','Extend = दो अलग (presenter view), Duplicate = दोनों एक (presenter view नहीं)','<code>Win</code>+<code>P</code> ▸ Extend (preferred) / Duplicate'],
        ['Rehearse Timings','हर slide पर कितना लगा — auto-advance timing save','Slide Show ▸ <b>Rehearse Timings</b> (R) ▸ practice ▸ Esc पर save (per-slide)'],
        ['Record (narration)','आवाज़/timings/timings save; per-slide या all','Slide Show ▸ <b>Record Slide Show</b> ▸ From Beginning/Current ▸ mic levels देखें ▸ record ▸ replay; <b>Clear</b> से hटाएँ; timings के साथ save होने पर auto-advance चले'],
        ['Custom Show','subset+order, multiple audiences','ऊपर 3.13 table'],
        ['Live Captions / Translate (365)','बोलते हुए नीचे subtitles; कुछ languages में translate','Slide Show ▸ <b>Captions</b> (during show, requires M365 + online); captions on/off व edit'],
        ['Broadcast / Present Online','browser में live link','Slide Show ▸ <b>Broadcast Slide Show</b> / <b>Present Online</b> (OneDrive/365 link, audience join by URL)']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.15</span> Captions, Alt Text व Check Accessibility</h3>
      <ul>
        <li><b>File ▸ Info ▸ Check for Issues ▸ Check Accessibility</b> (या View ▸ Check Accessibility pane) — बताता है: alt text न हो, low contrast, छिपा हुआ text, tab/reading order गड़बड़, decorative image पर alt text, बिना title वाली slide, language गड़बड़, merged table cells, nested tables। हर finding पर <b>Fix/Explain</b> + <b>Reading Order</b> (Selection pane में order तय करें)।</li>
        <li><b>Reading order:</b> objects उसी क्रम में screen reader पढ़ता है जैसा Selection/Reading Order pane में ऊपर-नीचे हैं — title पहले, फिर content, फिर visuals।</li>
        <li><b>Slide Title:</b> placeholder-based title रखें (न कि सिर्फ़ text box) ताकि outline/reader में स्लाइड का नाम मिले; master में "Title Slide" का title हटाना बचें।</li>
        <li><b>Captions/subtitles file:</b> .srt import कर slide पर insert कर सकते हैं (audio/autonarrated) या show के दौरान Live Captions — दो अलग चीज़ें हैं।</li>
        <li><b>Language:</b> Review ▸ Language ▸ Set Proofing Language — Hindi text को Hindi (hi-IN) में mark करें, नहीं तो spell-check/reader गड़बड़।</li>
      </ul>`},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.16</span> Handouts, Notes Pages व Print</h3>
      <ul>
        <li><b>File ▸ Print ▸ Settings ▸ Print What:</b> Full Page Slides / <b>Handouts</b> (1, 2, 3, 4, 6, 9 slides per page; 3-slide handout में lines बने रहती हैं — handwriting notes के लिए उत्तम) / <b>Notes Pages</b> / <b>Outline Pages</b> / Comment Listings।</li>
        <li><b>Handout Master व Notes Master</b> (View ▸ Handout Master / Notes Master): header/footer, date, page number, slide की position व font तय करें — हर print में apply होगा।</li>
        <li><b>Page Setup</b> (Layout ▸ Size, Orientation Portrait/Landscape, "Scale to Paper Size" A4/Letter)।</li>
        <li><b>Print options:</b> <b>Grayscale</b> (grey shades), <b>Pure Black and White</b> (line-art, background/gradient हटे), Colour; <b>Print Background Graphics</b> (chk off करने पर master background न छपे, paper बचे); <b>Print Comments</b>; Collation; per-slide ranges; Double-sided.</li>
        <li><b>Print All Slides vs selection:</b> selection pane/Slide Sorter में specific slides चुनकर Print Selection।</li>
      </ul>`},
    {type:'table', head:['Export/Saved as (File ▸ Export / Save As)','Extension','कब व नोट'],
      rows:[
        ['PDF','— .pdf','leave-behind, print-safe, fonts fix; File ▸ Export/Create PDF ▸ Optimal/Standard, ISO 19005, accessibility tags, per-slide'],
        ['XPS Document','— .xps','Microsoft का fixed-layout; अब कम उपयोग'],
        ['Video (MPEG-4)','— .mp4','File ▸ Export ▸ Create a Video ▸ quality: <b>480p/720p/1080p</b> (Ultra HD 4K भी कुछ versions), ▸ Use Timings/Recorded Narrations ▸ seconds per slide'],
        ['Video (Windows Media)','— .wmv','पुराना Windows player; MP4 बेहतर'],
        ['Animated GIF','— .gif','छोटी auto-play loop, कोई sound नहीं'],
        ['Change File Type ▸ PowerPoint Show','— .ppsx','double-click करते ही slide show चालू (एडिट नहीं खुलेगा; Shift+double-click से एडिट)'],
        ['PowerPoint Macro-Enabled Show','— .ppsm','show + VBA macros'],
        ['Change File Type ▸ Template','— .potx','खुलती बार copy बनती है — institute master/branding के लिए'],
        ['Macro-Enabled Template','— .potm','template + macros'],
        ['Create New Drawing File ▸ each slide as','— .png/.jpg','File ▸ Save As ▸ PNG ▸ All Slides — हर slide image file (web upload)'],
        ['Add-in/Package','— .zip','File ▸ Export ▸ <b>Package Presentation for CD</b> (पुरानी Windows feature) — viewer player, linked files व embedded fonts साथ folder/ZIP में; USB पर देकर चलाएँ'],
        ['Present Online','OneDrive/365','File ▸ Share ▸ Present Online — live link, browser में चले']
      ]},
    {type:'callout', kind:'tip', title:'File size घटाने व “पुराने PowerPoint में न खुलने” का समाधान', html:'<ul><li><b>Compress Media</b> (video/audio) + <b>Compress Pictures</b> + unused images हटाएँ।</li><li>Embed fonts में <i>used characters only</i> चुनें; ज़रूरी नहीं हो तो embedding बंद।</li><li><b>View ▸ Slide Master ▸ unused layouts/masters Delete</b> (Reuse Slides से आए पुराने masters हटाएँ)।</li><li>.pptx रखें (ZIP-compressed); पुराना binary .ppt न।</li><li>Linked media → embed (वरना link टूटेगा)।</li><li><b>पुराने PowerPoint में न खुले:</b> Save As ▸ type <b>PowerPoint 97-2003 (.ppt)</b> चुनें, या File ▸ Info ▸ <b>Check for Issues ▸ Check Compatibility</b> चलाएँ — बताएगा कौन-सा feature (Morph/3D/SmartArt) पुराने version में नहीं चलेगा।</li></ul>'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.17</span> सहकारिता (Co-authoring) व सुरक्षा</h3>
      <ul>
        <li><b>Co-authoring (Microsoft 365 + OneDrive/SharePoint):</b> File ▸ Save ▸ OneDrive ▸ Share ▸ "People can edit" — कई लोग एक साथ; presence names, live autosave, <b>Version History</b> (File ▸ Info ▸ Version History) से पुराना restore, comments @mention।</li>
        <li><b>Web PowerPoint (app):</b> browser में ज़्यादातर editing, playback व animations चलते हैं, पर <b>Morph व कुछ advanced features desktop-जैसे पूर्ण नहीं</b> हैं; add-ins/VBA desktop पर निर्भर; offline editing संक्षिप्त (mobile)।</li>
        <li><b>PowerPoint में “Compare & Merge” नहीं है:</b> Word के समान document compare feature PowerPoint में <b>उपलब्ध नहीं</b> — दो versions मैन्युअल/Joint review या file diff से मिलाएँ।</li>
        <li><b>Restrict Editing / Password:</b> File ▸ Info ▸ Protect Presentation ▸ Encrypt with Password (open/edit), Mark as Final, Restrict Access (365 IRM), Add a Digital Signature।</li>
        <li><b>Macro security:</b> VBA वाला file .pptm/.ppsm/.potm; Trust Center ▸ Trust Center Settings ▸ Macro Settings (default Disable all macros with notification) — अनजान file के macros/“Enable Content” पीला bar बिना जाँचे न दबाएँ।</li>
        <li><b>वायरस/autorun:</b> पेनड्राइव पर .lnk/autorun जैसी shortcut-virus और embedded malware से बचें; Presentation Vault/CD packaging में साथ आई executable files जाँचें; antivirus ताज़ा रखें; भरोसेमंद source से ही template/animations download करें।</li>
      </ul>`},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.18</span> शिक्षकों के लिए Design नियम</h3>
      <h4 class="blk2">क) Contrast व size</h4>
      <ul>
        <li><b>Body ≥ 24 pt, headings 32–44 pt</b> (छोटे PC/classroom projector पर 18 pt से नीचे पिछलें बेंच को नहीं दिखेगा)।</li>
        <li><b>6×6 rule:</b> एक slide पर अधिकतम ~6 bullets, हर bullet ~6 words — बाक़ी बात notes में।</li>
        <li>गहरा background + हल्का text या उलटा; WCAG-like ~4.5:1 contrast; yellow-on-white व light-on-light से बचें; projector room में dark text on light background सबसे सुरक्षित।</li>
      </ul>
      <h4 class="blk2">ख) Colour-blind-safe palette</h4>
      <p>सिर्फ़ <b>लाल-हरा (red/green)</b> से फ़र्क़ मत बताइए (लगभग 8% पुरुषों में colour blindness)। साथ में आकार/label/पैटर्न रखें; safe combos — blue+orange, dark blue+grey; themes के Accent रंगों को test करें।</p>
      <h4 class="blk2">ग) एक विचार, एक स्लाइड; सुसंगत master</h4>
      <p>हर slide = एक idea; institutes का logo व title/section slide एक <code>.potx</code> template/master में रखें ताकि हर teacher का deck एक जैसा दिखे।</p>
      <h4 class="blk2">घ) Hindi text सही दिखे</h4>
      <ul>
        <li><b>Devanagari फ़ॉन्ट चुनें:</b> <b>Nirmala UI</b> (हर Windows में, matras सुंदर), <b>Mangal</b>, <b>Akshar</b>, <b>Noto Sans Devanagari</b> — जो Windows/Google पर मिलते हैं। <i>जिस font में Hindi glyphs न हों उसमें text डिब्बे/टूटा दिखेगा</i>।</li>
        <li><b>Matras व line spacing:</b> हिंदी में ऊपर-नीचे matra की जगह चाहिए — line spacing <b>1.15–1.3</b> रखें, tight spacing में शीर्ष कटते हैं।</li>
        <li><b>Justification:</b> Hindi को full justify न करें (अक्षरों के बीच odd gaps); <b>Left-align</b> best। PowerPoint में auto-hyphenation का विकल्प Word-जैसा सीधा नहीं, इसलिए justify की लालसा छोड़ें।</li>
        <li><b>Hindi+English mix:</b> English शब्द Latin font (जैसे Segoe UI) और Hindi Devanagari font — एक ही paragraph में दोनों fonts लगाने पड़ सकते हैं; या पूरा Nirmala UI रखें जो दोनों संभालता है।</li>
      </ul>
      <h4 class="blk2">ङ) PDF → deck & exam-revision decks</h4>
      <ul>
        <li><b>Lesson PDF → deck:</b> PDF के headings को Word outline में लाएँ (Heading 1/2) → Insert ▸ Slides from Outline (3.7 steps); फिर images/quiz जोड़ें। स्कैन-किए PDF से सीधा import नहीं होता — पहले text निकालें।</li>
        <li><b>Exam-revision quiz deck:</b> हर प्रश्न slide पर option + trigger-based reveal (3.13 lab); section से subject-wise अलग; hidden slides में answers; end पर "Review" custom show।</li>
      </ul>`},
    {type:'steps', items:[
      {n:1, title:'Master ढ़ालिए (Design foundation)', text:'नया blank deck ▸ View ▸ Slide Master ▸ theme/variants चुनें ▸ master पर institute logo, footer, slide number, title+content fonts (Hindi Nirmala UI, ≥24pt) सेट ▸ layouts (Title, Section, Content, Two Content, Blank) साफ़ ▸ master से निकलें ▸ <code>.potx</code> के रूप में Save (आगे हर deck इसी से)।'},
      {n:2, title:'Outline बनाइए (Content-first)', text:'20 slides का ढाँचा: 1 title, 2–3 objectives, 12–14 content, 1–2 diagram, 1 recap, 1 thank-you/Q&A। पहले Outline pane/Word से text डालिए, design बाद में।' , warn:'content से पहले visuals मत इकट्ठा कीजिए — deck बिखरता है।'},
      {n:3, title:'Sections व layout लगाइए', text:'Slide Sorter ▸ chapters के बीच sections ▸ हर slide पर सही layout ▸ placeholder में images/charts/SmartArt ▸ 7×7 व एक-विचार नियम जाँचिए।' },
      {n:4, title:'Animation व Morph', text:'entrance = एक ही तरह (Fade) ▸ सिर्फ़ ज़रूरी bullets पर ▸ diagrams पर Morph ▸ क्विज़ slides पर trigger ▸ animation best-practice 2-per-slide याद।' },
      {n:5, title:'Notes व Accessibility', text:'हर slide पर speaker notes ▸ हर image पर alt text ▸ File ▸ Check Accessibility ▸ reading order ठीक ▸ contrast/size दोबारा जाँच।' },
      {n:6, title:'Rehearse व timings', text:'Slide Show ▸ Rehearse Timings ▸ 2–3 बार practice ▸ leave-behind के लिए auto-advance, live के लिए On Mouse Click ▸ narration चाहिए तो Record ▸ Presenter View test (Win+P ▸ Extend)।' },
      {n:7, title:'Export व handout', text:'File ▸ Export ▸ PDF (2-slides handout/notes) ▸ video/गिफ़ जहाँ ज़रूरत ▸ Compress Media/Pictures ▸ Embed fonts (used only) ▸ Save both .pptx (master) व भेजने-योग्य PDF ▸ compatibility check चलाएँ।' }
    ]},
    {type:'table', head:['Shortcut','क्या','Shortcut','क्या'],
      rows:[
        ['F5','show: से आरंभ','Shift+F5','current slide से show'],
        ['Esc','show/selection बंद','Ctrl+N','नई presentation'],
        ['Ctrl+M','नई slide (master का default layout)','Ctrl+Shift+M','नई section (Slide Sorter/thumbnail)'],
        ['Enter (outline, top level)','नई slide','Tab (outline)','bullet demote (content में)'],
        ['Shift+Tab (outline)','bullet promote (title/slide)','Del','slide/object delete'],
        ['Ctrl+D','duplicate slide/object','Ctrl+Z / Ctrl+Y','undo / redo'],
        ['Ctrl+A','सब select','Ctrl+G / Ctrl+Shift+G','group / ungroup'],
        ['Ctrl+C / X / V','copy/cut/paste','Ctrl+Shift+V','paste options/keep text'],
        ['Ctrl+K','hyperlink','Ctrl+S','save'],
        ['Ctrl+P','print','Ctrl+O','open'],
        ['Ctrl+1 / 2 / 3','font size बढ़ाएँ/घटाएँ व formatting (2=+,1=−)','Ctrl+Shift+F','font dialog'],
        ['Ctrl+L / E / R','left/center/right align','Ctrl+J / T','justify / top... (context)'],
        ['Ctrl+B / I / U','bold/italic/underline','Ctrl+Shift+< / >','text size कम/ज़्यादा'],
        ['Alt+F4','PowerPoint बंद','Ctrl+W','file window बंद'],
        ['Ctrl+Shift+N','Normal view','Ctrl+Alt+F5 / Alt+F5','Presenter View/notes'],
        ['Slide show keys: N/P, Space','next/prev','B / W / . / ,','black/white screen'],
        ['number+Enter','goto slide','Ctrl+H (show)','cursor hide'],
        ['Ctrl+P / Ctrl+E (show)','pen / erase','Ctrl+Shift+F12 या print handouts','—'],
        ['Alt (Ribbon) + key','menu access (e.g. Alt,N,S)','Ctrl+drag','object duplicate']
      ]},
    {type:'acc', title:'PowerPoint — अक्सर पूछे प्रश्न', items:[
      {q:'Placeholder क्या होता है?', a:'master/layout से जुड़ा हुआ boxed क्षेत्र ("Click to add…") जो formatting inherit करता है; text box ऐसा नहीं करता'},
      {q:'Master कहाँ रहता है?', a:'View ▸ Slide Master की सबसे बड़ी/ऊपर वाली slide; उसकी बदलाहट सभी layouts व slides पर चढ़ती है'},
      {q:'.ppsx का मतलब?', a:'PowerPoint Show — double-click पर सीधे slide show खुलती है, edit नहीं'},
      {q:'Custom Show क्या?', a:'एक ही deck से slides का चुना हुआ subset+क्रम, अलग audiences के लिए (Slide Show ▸ Custom Shows)'},
      {q:'Presenter View क्या देता है?', a:'आपकी screen पर next slide+notes+timer+tools, audience को साफ़ slide (Extend monitor + Use Presenter View)'},
      {q:'Section क्यों बनाएँ?', a:'लंबे deck को chapters में बाँटना — reorder/hide/collapse/custom-show आसान'},
      {q:'Trigger क्या है?', a:'animation जो आम click पर नहीं, किसी खास object के click पर चलती है — interactive quiz'},
      {q:'Morph कैसे चलता है?', a:'दो slides पर वही object अलग position/size में ▸ Transitions ▸ Morph; 2019/365'},
      {q:'Text दूसरे PC पर बिगड़ गया — क्यों?', a:'font वहाँ इंस्टॉल नहीं → fallback; Embed fonts या Nirmala UI/ Mangal इस्तेमाल करें या PDF बनाएँ'},
      {q:'Hidden slide numbering को क्या करती है?', a:'show में skip पर number गिना जाता रहता है; print/handout में वह slide आती है'},
      {q:'SmartArt को shapes में कैसे बदलें?', a:'SmartArt select ▸ Convert to Shapes (फिर ungroup) — individual editable आकार'},
      {q:'Handout 3-per-page क्या खास है?', a:'हर slide के बगल में notes-के लिए रेखाएँ — classroom handout का सबसे उपयोगी format'}
    ]},
    {type:'callout', kind:'exam', title:'परीक्षा के पक्के सवाल-जवाब', html:'<ul><li><b>Animation vs Transition?</b> Animation = slide के अंदर object; Transition = एक slide से दूसरी slide।</li><li><b>Placeholder?</b> master से formatting inherit करने वाला box।</li><li><b>Master कहाँ?</b> View ▸ Slide Master की सबसे बड़ी slide (parent)।</li><li><b>.ppsx?</b> auto-play show file।</li><li><b>Custom Show?</b> slides का चुना subset, अलग audience।</li><li><b>Presenter View?</b> speaker को next+notes+timer।</li><li><b>Section?</b> deck का अध्याय-group।</li><li><b>Trigger?</b> किसी object पर click से चलने वाला animation।</li><li><b>7×7 rule?</b> table में अधिकतम ~7 rows/columns।</li></ul>'},

    /*T1*/
  ]
},

/* ===================================================================
   4. MS Access डेटाबेस
   =================================================================== */
{
  id:'off-access', icon:'🗃️', group:'MS Office मास्टरक्लास',
  title:'MS Access डेटाबेस',
  sub:'टेबल, रिश्ते, क्वेरी, फ़ॉर्म, रिपोर्ट व नॉर्मलाइज़ेशन',
  kicker:'Office Masterclass 4 · Database with MS Access',
  hero:'Access = <b>डेस्कटॉप रिलेशनल डेटाबेस (file-based DBMS)</b> — दुकान/छोटे कॉलेज विभाग के छोटे रिकॉर्ड-कीपिंग के लिए, जहाँ 5–15 यूज़र और एक फ़ोल्डर काफ़ी हो। यह पेज table व field, primary/foreign key, relationships व referential integrity, queries (select/totals/crosstab/parameter/action), forms, reports, macros व <b>normalization (1NF–3NF/BCNF)</b> — सब एक ही कॉलेज-ERP उदाहरण से सिखाता है। <b>याद रखें:</b> Access multi-user web-scale के लिए नहीं है; वहाँ SQL Server/PostgreSQL।',
  tags:['.accdb व Objects','PK/FK व Relationships','Query व Crosstab','Form व Subform','Report व Macro','Normalization व Security'],
  blocks:[
    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.1</span> File DBMS क्या है — और Access कब सही / ग़लत</h3>
      <p><b>DBMS (Database Management System)</b> डेटा को तालिकाओं (tables) में रखता है और रिश्तों (relations) से जोड़ता है ताकि डुप्लीकेट (duplicate) कम और सटीकता ज़्यादा हो। Access एक <b>desktop, file-based DBMS</b> है — पूरा database एक ही फ़ाइल <code>.accdb</code> में (2007 से पहले <code>.mdb</code>) रहता है, कोई अलग server service नहीं चलती।</p>
      <ul>
        <li><b>Access कब सही:</b> छोटी दुकान/कोचिंग/कॉलेज विभाग का record-keeping, 5–15 यूज़र एक LAN folder, reports+forms खुद बनाने हैं, Excel data structured करना है।</li>
        <li><b>Access कब ग़लत:</b> internet/multi-user web scale, एक साथ सैकड़ों लिखने वाले, बहुत बड़ा डेटा, mobile app backend — वहाँ SQL Server/PostgreSQL/MySQL + web app।</li>
        <li><b>.accdb vs .mdb:</b> <code>.accdb</code> (Access 2007+) ने <code>.mdb</code> (Jet engine, 2003) की जगह ली; नई engine <b>ACE</b>, new data types (Attachment/Calculated/Long Text), per-column encryption, no database-level user security (2007 में हटाई गई)।</li>
        <li><b>गठन (hierarchy):</b> Database ▸ Table ▸ Record(row) ▸ Field(column) ▸ Value। एक field का वैध मानों का सेट = <b>Domain</b>। टेबल का structure (fields+types) = <b>record type</b>; भीतर की एक पंक्ति = <b>record value</b>।</li>
      </ul>`},

    {type:'table', head:['Object','उद्देश्य (Purpose)','कॉलेज ERP उदाहरण'],
      rows:[
        ['Table','डेटा असली रूप में रखता है (rows/columns)','Students, Courses, Enrolments, Marks'],
        ['Query','data छानना/जोड़ना/हिसाब; view बनाना','“10th के सभी छात्र जिनके 70%+”'],
        ['Form','data entry/display का screen','Admission form, Marks entry form'],
        ['Report','print/export हेतु सुंदर layout','Marksheet, Fees receipt, Class list'],
        ['Macro','बिना कोड छोटा automation (actions)','Button से OpenForm, AutoExec पर login screen'],
        ['Module','VBA (code) से बड़ा logic','complex validation, file handle, loops'],
        ['Relationships','टेबल जोड़ (keys) परिभाषित','Students PK ↔ Enrolments FK'],
        ['Index','खोज/sort तेज़; uniqueness','Roll number पर unique index']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.2</span> रिश्तेदार शब्द — PK, FK व Keys</h3>
      <ul>
        <li><b>Primary Key (PK):</b> एक field या field-group जो हर record को अद्वितीय (unique) व non-null पहचाने। एक table में सिर्फ़ एक PK, पर composite (multi-field) हो सकता है।</li>
        <li><b>Foreign Key (FK):</b> दूसरी table के PK को reference करने वाला field — रिश्ता (relationship) यहीं से बनता है।</li>
        <li><b>Candidate Key:</b> PK बनने लायक हर unique field (हर candidate में से एक चुनकर PK बनता है)। <b>Alternate Key:</b> बचे हुए candidate keys।</li>
        <li><b>Composite Key:</b> दो+ fields मिलकर unique पहचान (जैसे Enrolment = RollNo + CourseID)।</li>
        <li><b>Index:</b> खोज/क्रम तेज़ करने वाली structure; unique/duplicate/No Duplicates विकल्प।</li>
      </ul>`},

    {type:'table', head:['Data Type','आकार (Size)','कब व default'],
      rows:[
        ['Short Text (पहले Text)','≤ 255 chars (index 255)','नाम, code; default 255'],
        ['Long Text / Memo (अब Long Text)','≈1 GB (2,300 screen पर)','टिप्पणी, address, description'],
        ['Number','Byte 1B, Integer 2B, Long 4B, Single/Double 8B, Decimal 12B','उमर/अंक; default Long Integer'],
        ['Date/Time','8 bytes','tारीख-समय; Format Short Date'],
        ['Currency','8 bytes (fixed 4 decimal)','pैसा; default 2 decimals show'],
        ['AutoNumber','Long (Counter) या Replication ID','har record नंबर; default Increment (Counter), option Random'],
        ['Yes/No','1 bit','checkbox; True/False'],
        ['OLE Object','≈1 GB (linked/embedded)','Word/Excel object (पुराना तरीक़ा)'],
        ['Hyperlink','≈640 chars','URL/email दिखाने'],
        ['Attachment','≈10 MB प्रति file, 307 file/record','photo/PDF साथ जोड़ना'],
        ['Calculated','expression result','table में formula field'],
        ['Lookup Wizard','दूसरी table/वैल्यू list से dropdown','State/Class चुनना — भंडारण number भी हो सकता']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.3</span> Design View बनाम Datasheet View</h3>
      <p><b>Datasheet View</b> = Excel-जैसा grid — डेटा देखने/डालने के लिए; यहाँ field add भी हो सकता है पर properties सीमित। <b>Design View</b> (Create ▸ Design View) = structure बनाना — हर field का नाम, Data Type, Description और <b>Field Properties</b> नीचे। PK, Input Mask, Validation, Index यहीं से। Create ▸ Table Design नई table के लिए; Table Tools ▸ Fields/Properties tabs मौजूदा table पर।</p>`},

    {type:'table', head:['Field Property','क्या तय करता है','उदाहरण'],
      rows:[
        ['Field Size','Short Text का max chars; Number का subtype','Text 20; Number = Long Integer'],
        ['Format','दिखने का ढंग (डेटा नहीं बदलता)','Date: Short Date; Number: 0.00; Text: @'],
        ['Decimal Places','कितने digits दशमलव बाद','Auto / 2 for marks'],
        ['Input Mask','बाध्य format (template)','phone, roll no (नीचे 4.5)'],
        ['Caption','datasheet/form पर दिखने वाला label','“Roll Number” (field का नाम RollNo रहे)'],
        ['Default Value','नई record में पहले से','Date() ; 0 ; “Delhi”'],
        ['Validation Rule','मान्य होने की शर्त (expression)','>=0 And <=100'],
        ['Validation Text','शर्त टूटे दिखने वाला संदेश','“0 से 100 के बीच दर्ज करें”'],
        ['Required','खाली (Null) न छूटे (Yes/No)','Yes for RollNo'],
        ['Allow Zero Length','“” (empty string) मंज़ूर','Yes for optional Text'],
        ['Indexed','No Duplicates / Yes (Duplicates OK)','PK auto = Yes (No Duplicates)'],
        ['Text Align / Show Date Picker / IME Mode','alignment / calendar popup','—']
      ]},

    {type:'table', head:['Mask चिह्न','मतलब','उदाहरण चिह्न'],
      rows:[
        ['0','अंक अनिवार्य (0–9)','5'],
        ['9','अंक वैकल्पिक (0–9 या खाली)','—'],
        ['#','अंक या space वैकल्पिक, +/− चिह्न','—'],
        ['L','अक्षर अनिवार्य (A–Z)','V'],
        ['?','अक्षर वैकल्पिक','—'],
        ['A','अक्षर या अंक अनिवार्य','7'],
        ['a','अक्षर या अंक वैकल्पिक','—'],
        ['&','कोई भी चिह्न अनिवार्य; space वैकल्पिक','X'],
        ['C','कोई भी चिह्न वैकल्पिक','—'],
        ['>','आगे सब UPPERCASE (जब तक < या | न आए)','AB...'],
        ['<','आगे सब lowercase','ab...'],
        ['^','अक्षर uppercase पर अन्य जैसा-है','A1!'],
        ['\\, <>, "" , . ,- /','literal चिह्न जैसके-तैसे','(0) 98765-43210']
      ]},
    {type:'callout', kind:'tip', title:'Input Mask के असली उदाहरण', html:'<p><b>Mobile:</b> <code>(000) 000-0000</code> — यहाँ हर जगह 0 = अनिवार्य अंक (10 अंक)। <b>Roll number (2-वर्ष-3 सीरियल):</b> <code>00-00000</code> जैसा pattern, या सीधे <code>00000</code> (5 अंक) + Field Size 5। <b>Zip/pin (6 digits):</b> <code>000000</code>। Mask code में literal चिह्न लगाने के लिए उन्हें उद्धरण/escape करें। Mask = data entry सुधारता है, डेटा को वास्तव में store होते रूप में नहीं बदलता (डिस्प्ले format है)।</p>'},

    {type:'callout', kind:'exam', title:'Primary Key के नियम — और Roll Number क्यों नहीं?', html:'<p><b>PK नियम:</b> unique + non-null + स्थिर (कभी नहीं बदलना चाहिए) + छोटा व सरल; AutoNumber सबसे भरोसेमंद artificial PK। <b>Roll Number पर चेतावनी:</b> अगर कोई roll दोबारा use हो (student drop/repeat, year reset) या format बदले, तो पुराने enrolment गड़बड़ हो जाएँगे — इसलिए असली PK <b>AutoNumber StudentID</b> रखें, Roll Number को <b>alternate key / unique index</b> बनाएँ। Required + AutoNumber: AutoNumber field अपने-आप अनिवार्य (required) नहीं रहता (value खुद बनती है); Short Text पर Required=Yes से Null रुकेगा पर “” (empty) Allow Zero Length से छू सकता है।</p>'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.4</span> Import / Link (Excel, CSV, Text) और Export</h3>
      <ul>
        <li><b>Import</b> (External Data ▸ New ▸ Excel/Text/CSV) तीन चरण: <b>(1)</b> file चुनें व विकल्प — “First Row Contains Column Headings” (chk) से header सही; <b>(2)</b> field का <b>Data Type</b> व <b>Skip</b> तय करें (type detection), primary key चुनें (AutoNumber/मेरा field/नहीं); <b>(3)</b> table का नाम व <b>Import (एक नई table बनाकर डाले) / Append (मौजूदा table में जोड़े) / Link (linked table)</b>।</li>
        <li><b>Imported vs Linked table:</b> imported की copy आपकी .accdb में आ जाती है (offline रहेगी, source से sync नहीं); linked में बाहरी file/ODBC/SharePoint डेटा दिखता पर वास्तव में वहीँ रहता है — Access खुद न लिख सके ऐसी table।</li>
        <li><b>ODBC linked table caution:</b> server-side डेटा पर query धीमा, कुछ fields/type map न हों, connection टूटे तो table अचल; credentials/DSN रखें व बंद होते पर connection दोबारा जाँचें।</li>
        <li><b>Export:</b> External Data ▸ Export ▸ Excel/Text/PDF/XPS/Word RTF/HTML। table/query/form/report export; PDF/RTF में layout+grouping बचे। <b>Snapshot <code>.snx</code></b> (Access Analysis Tool/add-in) — read-only बर्फ़-जैसा दृश्य (real data नहीं, viewer चाहिए)।</li>
        <li>import से पहले destination table में <b>back-up/compact</b> और field type मिलान जाँचें; Append में data type mismatch पर “type conversion failed” records skip हो सकते हैं।</li>
      </ul>`},

    {type:'table', head:['Access सीमा (Limit)','मान','नोट'],
      rows:[
        ['Database file size','1 GB (system database अलग)','linked/excluded media से कम असर'],
        ['Fields per table','255','—'],
        ['Table/Query/Field नाम लंबाई','64 / 64 / 64 chars','spaced names चलते पर avoid'],
        ['Record size','≈ 8 KB (Long Text/Attachment अलग)','memo/attachment record limit में नहीं'],
        ['Concurrent users (file-sharing)','≈ 255 open connections, पर practical ~10–20','heavy writes → SQL Server'],
        ['Short Text field','255 chars','indexable; query criteria 255'],
        ['Attachments','≈ 2 GB तक DB तक, ~10 MB/file, 307/record','—']
      ]},

    {type:'table', head:['Query Type','क्या करती है','कॉलेज उदाहरण'],
      rows:[
        ['Simple Select','पूरी table/view बिना शर्त','Select * from Students'],
        ['Select with Criteria','शर्त से filtering','Class = 10 And Marks > 70'],
        ['Totals / Aggregate','Group By + Sum/Count/Avg/Min/Max; Where (row filter) + Having (group filter)','हर class का avg marks'],
        ['Crosstab','Row × Column × Value का grid (spreadsheet-style)','Class × Subject average matrix'],
        ['Make-Table','नतीजे से नई table बनती है','Archive table “OldStudents”'],
        ['Update','मौजूदा records के field बदलती है','सभी fees 10% बढ़ाएँ'],
        ['Append','दूसरी table में records जोड़ती है','History में copy'],
        ['Delete','records हटाती है','drop-out हटाएँ'],
        ['Pass-through (ODBC)','सिर्फ़ SQL server पर भेजती (Access syntax नहीं)','SQL Server query'],
        ['Data-definition (DDL)','table/field बनाती-बदलती (SQL DDL)','CREATE TABLE'],
        ['Parameter','चलाते समय prompt माँगती (PARAMETERS)','“कौन-सा Class?” पूछकर filter'],
        ['Find Duplicates / Unmatched','wizard — डुप्लीकेट या orphan ढूँढती','Enrolment-रहित students']
      ]},

    {type:'table', head:['QBE Grid Column','मतलब','नोट'],
      rows:[
        ['Field','field/expression/func; blank row से Criteria-only या IN पंक्ति','`Expr: FieldName` से named calc'],
        ['Table','source table/query','joined tables दिखाई दें'],
        ['Sort','Ascending/Descending','report sort यहीं'],
        ['Show','display column Yes/No','criteria field छिपा सकते हैं'],
        ['Criteria','शर्त (एक ही field की OR नीचे की पंक्ति)','AND एक ही row पर'],
        ['Or','वैकल्पिक शर्त (नीचे की OR row)','—'],
        ['Total','Group By/Sum/Count/Avg/Min/Max/Where/Having/Expression','Totals (Σ) बटन से row खोलें']
      ]},
    {type:'callout', kind:'info', title:'Criteria की भाषा (Operators)', html:'<ul><li><b>Wildcards</b> (Like में): <code>*</code> कोई भी chars, <code>?</code> एक अक्षर, <code>#</code> एक अंक, <code>[ ]</code> सेट/range, <code>!</code>/<code>-</code> except, <code>&amp;</code> सभी। <code>Like "K*h"</code>, <code>Like "R?j"</code>।</li><li><b>AND / OR:</b> एक row = AND, नीचे की row = OR।</li><li><b>In:</b> <code>In (10,11,12)</code>। <b>Between:</b> <code>Between 50 And 90</code> (inclusive)।</li><li><b>Text field पर wildcard</b> के लिए criteria में <code>Like</code> लिखें; Date/Number पर सीधा operator (<code>&gt;#1/1/2026#</code>)। <b>Dates</b> <code>#...#</code> में, regional format (आम तौर पर <code>#mm/dd/yyyy#</code>)।</li><li><b>Is Null / Is Not Null</b> — missing values; <b>Not</b>, <b>&lt;&gt;</b>, <b>&gt;=</b> आम। <code>""</code> बनाम <code>Null</code> फ़र्क़ रखें।</li></ul>'},

    {type:'code', lang:'sql', code:`-- SELECT ... FROM ... WHERE ... ORDER BY  (design grid का SQL view)
SELECT Students.Name, Enrols.Marks
FROM Students INNER JOIN Enrols ON Students.StudentID = Enrols.StudentID
WHERE Enrols.Marks >= 70
ORDER BY Enrols.Marks DESC;

-- GROUP BY + HAVING (aggregate): class-wise औसत, 60 से ज़्यादा वाले ही
SELECT Class, Avg(Marks) AS AvgMarks
FROM MarksTbl
GROUP BY Class
HAVING Avg(Marks) > 60;

-- LEFT JOIN: जिस student की कोई enrolment नहीं वो भी दिखें
SELECT s.Name, e.Marks
FROM Students AS s LEFT JOIN Enrols AS e ON s.StudentID = e.StudentID
WHERE e.Marks IS NULL;                -- unmatched = orphan खोज

-- Subquery (IN): उन छात्रों के नाम जिनके marks 90+ हैं
SELECT Name FROM Students
WHERE StudentID IN (SELECT StudentID FROM Enrols WHERE Marks > 90);

-- Parameter query: चलते समय prompt
PARAMETERS [ClassNo] Long;
SELECT * FROM Students WHERE Class = [ClassNo];

-- UPDATE / DELETE — WHERE के साथ ही चलाएँ, पहले Select से जाँचें
UPDATE Enrols SET Marks = Marks + 5 WHERE Marks BETWEEN 65 AND 69;
DELETE FROM Enrols WHERE Enrols.StudentID = 1042;`},
    {type:'html', html:`<h4 class="blk2">SQL View</h4>
      <p>किसी भी saved query पर right-click ▸ <b>SQL View</b> इसी syntax दिखाता है। CRUD: <code>SELECT/FROM/WHERE/GROUP BY/HAVING/ORDER BY</code>; joins <code>INNER / LEFT / RIGHT JOIN ... ON</code>। Datasheet में <b>Totals (Σ)</b> बटन से aggregate row खुलती है; <b>Expression</b> total से computed column naming (<code>Expr:</code>) आसान।</p>`},

    {type:'table', head:['Operator/Function','काम','उदाहरण'],
      rows:[
        ['& (ampersand)','text जोड़ना (concat)','[First] & " " & [Last]'],
        ['Like / In / Between','pattern/set/range','Like "*ra*"; In("A","B"); Between 1 And 10'],
        ['IIf(cond, true, false)','inline if','IIf(Marks>=40,"Pass","Fail")'],
        ['Nz(expr, val)','Null को मान से बदलें (type mismatch रोक)','Nz([Bonus],0)'],
        ['Date() / Now()','आज / आज+समय','criteria: >= Date()-30'],
        ['DateDiff(part,a,b)','दो तारीख़ का अंतर','DateDiff("yyyy",DOB,Date())'],
        ['DatePart / Format','भाग / दिखने का ढंग','Format(HireDate,"yyyy-mm")'],
        ['Left / Mid / Right','substring','Left(Code,2)'],
        ['+ - * / \\ ^','arithmetic (Integer ÷ \\, mod)','Marks/2 ; 7 \\ 2 = 3'],
        ['Count(*) / DCount','गिनती (query/aggregate)','Count(*) AS Total']
      ]},
    {type:'callout', kind:'warn', title:'#Name? व Expression की सीमा', html:'<p><code>#Name?</code> का मतलब — function/field का नाम ग़लत, फ़ंक्शन अनुपलब्ध, या linked table के field पर unsupported expression। <b>नियम:</b> expression तभी चलता है जब field <b>आपकी own Access table</b> से हो; linked/ODBC table पर Access-side expressions सीमित — server पर SQL भेजें या पहले import करें। field का नाम square brackets <code>[ ]</code> में रखें जिनमें space/चिह्न हैं।</p>'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.6</span> Crosstab, Parameter व Action Query — काम का तरीक़ा</h3>
      <ul>
        <li><b>Crosstab worked example (Class × Subject औसत):</b> Create ▸ Query Design ▸ Crosstab (design tab ▸ ▤ icon) ▸ <b>Row Heading = Class</b>, <b>Column Heading = Subject</b>, <b>Value = Marks</b>, Value ▸ <b>Total = Avg</b> ▸ <b>Where</b> row पर Subject-level filter ▸ चलाएँ तो grid मिलेगा (हर class की पंक्ति, subject के स्तंभ)। Crosstab में एक value field Total/Group नहीं हो सकता — या aggregate या Group By चुनें।</li>
        <li><b>Parameter query:</b> design grid के Criteria में <code>[कौन-सा Class दर्ज करें?]</code> लिखें — चलते समय box खुलेगा; query ▸ Properties ▸ <b>Parameter Lists</b> से type (Long/Text/Date) तय करें (SQL में <code>PARAMETERS</code>)। name-search screen व month filter इसी से (<code>Format([Date],"yyyy-mm") = [yyyy-mm?]</code>)।</li>
        <li><b>Find Duplicates / Find Unmatched wizards</b> (Create ▸ Query Wizard ▸…) — Roll/Lock duplicate और बिना-enrolment student बिना SQL के।</li>
        <li><b>Action queries (Make-Table/Update/Append/Delete)</b> चलते ही <b>confirm</b> माँगती हैं और records बदल देती हैं — undo नहीं। इसलिए <b>पहले हमेशा Select query से वही criteria चलाकर नतीजा देखें, फिर backup व फिर Action</b>।</li>
        <li><b>Query as source:</b> saved query को form/report का <b>Record Source</b> बनाइए — filter/join की गणना एक जगह, screen/print दोनों को मिलता है।</li>
      </ul>`},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.7</span> Relationships Window — 1:1, 1:M, M:M</h3>
      <p><b>Database Tools ▸ Relationships</b> ▸ tables add करें ▸ एक PK को drag कर दूसरी table के FK पर छोड़ें। रेखा के सिरों पर <code>1</code> और <code>∞</code> (many) चिह्न।</p>
      <ul>
        <li><b>One-to-one (1:1):</b> दोनों छोर unique — बहुत कम; अक्सर एक ही table में रखना बेहतर (जैसे Students↔StudentBio)।</li>
        <li><b>One-to-many (1:M):</b> सबसे आम — एक Student के कई Enrolments/Marks। PK side पर 1, FK side पर ∞।</li>
        <li><b>Many-to-many (M:M):</b> एक Student कई Courses, एक Course कई Students → सीधा रिश्ता नहीं बनता; <b>Junction table</b> बीच में (Enrolments: StudentID + CourseID, दोनों FK, composite PK)।</li>
        <li><b>College schema:</b> Students (StudentID PK) 1─∞ Enrolments (EnrolID PK, StudentID FK, CourseID FK) ∞─1 Courses (CourseID PK) ; Marks (MarkID PK, EnrolID FK) ∞─1 Enrolments।</li>
      </ul>`},
    {type:'table', head:['Join Type','क्या rows दिखती हैं','Access में'],
      rows:[
        ['Inner (1)','दोनों tables में मिलान (match) वाले ही','default join, तीर सिर्फ़ matched पर'],
        ['Left outer (2)','बाईं table की सब + दाईं के मिलान (न मिले तो Null)','Join Properties ▸ option 2'],
        ['Right outer (3)','दाईं table की सब + बाईं के मिलान','Join Properties ▸ option 3'],
        ['Full (no direct)','दोनों की सब (Access में दो outer queries + UNION)','Access UI में one-direction join'],
        ['Cross (no ON)','हर row × हर row (Cartesian) — rarely, criteria से कसें','ON हटाएँ']
      ]},
    {type:'callout', kind:'exam', title:'Referential Integrity (RI) + Cascade + Orphans', html:'<p>double-click relationship ▸ Edit ▸ <b>Enforce Referential Integrity</b> (chk) — तब ही 1:M रिश्ता “सच्चा” होता है। नियम: <b>(1)</b> child table में वह FK value नहीं आ सकती जो parent PK में न हो, <b>(2)</b> parent record तब तक delete नहीं होगा जब तक उसके child बचे हैं, <b>(3)</b> <b>Cascade Update</b> = parent PK बदले तो child FK अपने-आप बदलें; <b>Cascade Delete</b> = parent delete पर child भी delete। दोनों checkbox RI के नीचे आते हैं। <b>Orphan record</b> = child जिसका parent नहीं — RI से बचते हैं, और Find Unmatched query से मिलते हैं। Field का <b>Allow Blank</b> (Null) का नियम: FK column पर Required=Yes से orphan-ish entry रुकती है पर RI ही असली गारंटी है।</p>'},
    {type:'table', head:['Topic','क्या/कब','नोट'],
      rows:[
        ['Index (single)','खोज/sort तेज़; No Duplicates से unique','PK अपने-आप unique index'],
        ['Multi-field index','दो fields मिलकर ढूँढने पर (Roll+Course)','query speed-up'],
        ['Compact & Repair','Database Tools ▸ Compact & Repair','हर हफ़्ते/बड़े delete के बाद — space वापस, cache सुधार, corruption रोक'],
        ['AutoExec / startup','DB खोलते-खोलते form/macro','switchboard यहीं'],
        ['Performance','linked tables/queries बंद रखें, unused relationships, big memo अलग','1 GB से नीचे रखें, split करें']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.8</span> Split DB, .accde व Backup/सुरक्षा</h3>
      <ul>
        <li><b>Front End / Back End split:</b> <b>BE (.accdb सिर्फ़ tables)</b> shared LAN folder पर, <b>FE</b> हर यूज़र के पास (forms/queries/reports/macros) + <b>Linked Table Manager</b> से BE link। इससे design edits टकराते नहीं, backup आसान।</li>
        <li><b>.accde:</b> FE को compile करके <b>design बदलना बंद</b> बनाता है (source code view नहीं) — multi-user में हर कोई वही FE खोलता है, कोई form तोड़ता नहीं; data BE में रहता है। नई Access बनाने पर .accde दोबारा बनाएँ (compile access engine पर निर्भर)।</li>
        <li><b>Shared folder बनाम SQL Server:</b> छोटा-मोटा traffic = file-share (ACE engine) काफ़ी; hundreds users/heavy writes = BE → <b>SQL Server/Express + ODBC linked tables</b> (server engine, Access सिर्फ़ UI)।</li>
        <li><b>Backup:</b> Compact के बाद .accdb की copy (प्रतिदिन); BE+FE अलग बैकअप; Access में built-in scheduling नहीं — Windows Task Scheduler/मैनुअल copy।</li>
        <li><b>Password (Encode):</b> Database ▸ open exclusive ▸ <b>Encrypt/Decrypt Database</b> या open dialog ▸ Advanced ▸ password — यह DB file खोलने से रोकता है (per-user permission नहीं)। <b>User-level security (.mdw workgroup)</b> 2007 से <b>हटा दिया गया</b> — अब Windows permissions/trusted file share या SQL Server logins से ही access control।</li>
        <li><b>Trusted location / Content:</b> yellow bar ▸ Enable Content = macros चालू; Trust Center ▸ Trusted Locations में अपना folder डालें तो हर बार पूछता नहीं (सिर्फ़ भरोसेमंद file)।</li>
      </ul>`},

    {type:'table', head:['Form Type/View','क्या','कब'],
      rows:[
        ['Columnar','एक record पर एक screen, fields ऊपर-नीचे','admission/entry (सबसे आम)'],
        ['Continuous','एक ही layout दोहराकर कई records (stack)','list/datasheet जैसा form'],
        ['Tabular','columns/rows का grid, header एक बार','compact data list'],
        ['Datasheet','Excel-जैसा editable grid','तेज़ bulk entry'],
        ['Split form','ऊपर columnar + नीचे list, sync','browse + edit दोनों साथ'],
        ['Main / Sub-form','parent form + child form (master-child)','Students + उनका Marks/Enrolments'],
        ['Modal / Dialog','Modal = बाकी screen block (focus forced); Dialog = popup window','popup entry/prompt'],
        ['Navigation form','tabs/buttons से दूसरे forms खोलना','switchboard/home screen'],
        ['Pop-up','float करती window','tool-like helper']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.9</span> Form Design व Controls</h3>
      <p>Create ▸ <b>Form Design</b> ▸ Property Sheet ▸ Format ▸ <b>Use Form Design Grid</b> (snap)। Ribbon ▸ <b>Designer ▸ Add Existing Fields</b> से field डालें; Control Wizards पहले ON रखकर सीखें।</p>
      <ul>
        <li><b>Text box:</b> <b>bound</b> (Control Source = field; DB से जुड़ा) बनाम <b>unbound</b> (calc/prompt; Control Source खाली) बनाम <b>calculated</b> (Control Source = <code>=[Marks]/[Total]*100</code>)।</li>
        <li><b>Label</b> (heading), <b>Combo box</b> व <b>List box</b> (lookup), <b>Check box</b> (Yes/No), <b>Option group</b> (radio set), <b>Command button</b> (macro), <b>Image / Attachment</b>, <b>Tab control</b> (multiple pages), <b>Subform</b> control।</li>
        <li><b>Combo box wizard:</b> Row Source = table/query या <b>Value List</b> (manual items); <b>Column Count</b> व <b>Column Widths</b>; <b>Column Heads</b>; चुनें कि value store करना है — यही bound-column trick।</li>
        <li>Navigation buttons (first/prev/next/last) Form ▸ Property ▸ <b>Navigation Buttons</b> / <b>Scroll Bars</b>।</li>
      </ul>`},
    {type:'table', head:['Combo Property','मान','क्या होता है'],
      rows:[
        ['Row Source','SELECT StudentID, Name FROM Students','list के columns का स्रोत'],
        ['Column Count','2','कितने columns'],
        ['Column Widths','0cm;5cm','पहला (hidden ID) चौड़ाई 0 — दिखेगा नहीं'],
        ['Bound Column','1','Control Source में कौन-सा column value जाये (यहाँ StudentID)'],
        ['Column Count/ List Widths','—','visible सिर्फ़ Name; value StudentID'],
        ['Control Source','StudentID','यही field update होता है (नाम नहीं)']
      ]},
    {type:'callout', kind:'tip', title:'Bound Column का मूल मंत्र', html:'<p>Combo में छात्रों के <b>नाम दिखाएँ (Name column)</b> पर <b>RollNo/StudentID store करें (Bound Column)</b> — user को भाषा, DB को key। <b>Column Count=2, Column Widths=“0cm;5cm”</b> (पहला hidden), <b>Bound Column=1</b> और Control Source = FK field। Row Source table हो तो foreign key अपने-आप सही type का मिलेगा।</p>'},
    {type:'table', head:['Property (tab)','क्या','उदाहरण'],
      rows:[
        ['Format (Data)','दिखने का ढंग','Date: Short Date; Text: @'],
        ['Default Value (Data)','नई record में पहले','Date() ; 0'],
        ['Control Source (Data)','bound field/expression','[Marks] ; =[Total]*1'],
        ['Row Source (Data)','combo/list का source','SELECT ID, Name FROM …'],
        ['Record Source (Data)','पूरे form का table/query','StudentsQuery'],
        ['Visible (Format)','control छिपाएँ','ID box Visible=No'],
        ['Enabled / Locked','बदलने योग्य?','Enabled=No grid grey; Locked=No typing block'],
        ['Tab Stop / Tab Order','<code>Tab</code> क्रम में आएगा?','unwanted boxes Tab Stop=No'],
        ['Validation Rule / Text','control-level जाँच','>=0 ; msg'],
        ['Required (Others)','Null न छूटे','Yes'],
        ['On Click / After Update / Before Update (Event)','macro/code यहाँ','Button ▸ On Click ▸ macro']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.10</span> Form व्यवहार — formatting, events, sub-form, navigation</h3>
      <ul>
        <li><b>Conditional Formatting</b> (Home ▸ ▤ Format ▸ Conditional): शर्त पर रंग (Fail<40 लाल) — expression पर आधारित, code नहीं।</li>
        <li><b>Events बिना VBA (macro से):</b> <b>Before Update</b> पर <code>CancelEvent</code> + MsgBox (रोकने के लिए — यहीं validation), <b>After Update</b> ▸ <code>Requery</code>/<code>GoToRecord</code>/<code>OpenForm</code> (जोड़ने के बाद)। Button ▸ <b>On Click</b> ▸ macro।</li>
        <li><b>Master/Child fields:</b> sub-form control की property <b>Link Master Fields / Link Child Fields</b> (जैसे StudentID↔StudentID) — parent बदलते बच्चे अपने-आप filter। Form Wizard इसे अपने-आप लगा देता है।</li>
        <li><b>Navigation/switchboard:</b> main form पर command buttons ▸ macro <code>OpenForm</code> ▸ form खोलें; <code>NavPrevRec/NavNextRec</code> records घुमाएँ; navigation form ▸ tabs से forms।</li>
        <li><b>Data entry best practices:</b> <b>tab order</b> तय (Form Design ▸ Tab Order) ; free-text कम, <b>lookup lists (combo)</b> ज़्यादा ; Required + Input Mask ; AutoNumber PK छिपाएँ। <b>Find</b> (<code>Ctrl</code>+<code>F</code>) ; <b>Filter by Selection</b> (right-click ▸ Text Filters) ; <b>Advanced Filter/Sort</b> ; sort ▸ Home ▸ Asc/Desc ; form को print ▸ File ▸ Print ▸ Form Views।</li>
        <li><b>Form Template:</b> <code>.accdt</code> — DB का खाली shape; दोबारा खुलने पर नई copy।</li>
      </ul>`},
    {type:'steps', items:[
      {n:1, title:'Tables व Relationship पक्का कीजिए', text:'Students (StudentID PK, Name, Class, …) और Marks (MarkID PK, StudentID FK, Subject, Marks) बनाइए; Relationships में Students 1─∞ Marks, <b>Enforce Referential Integrity + Cascade Update</b> (Delete सिर्फ़ तब जब ज़रूरी)।', warn:'relationship न हो तो sub-form ठीक नहीं जुड़ेगा।'},
      {n:2, title:'Create ▸ Form Wizard', text:'Students table से columnar form; “Available Fields” सब डालें; Wizard ▸ Form ▸ finish — basic admission form।'},
      {n:3, title:'Marks का Sub-form चिपकाइए', text:'Form Design ▸ Controls ▸ <b>SubForm</b> ▸ draw करें ▸ Wizard ▸ existing table <b>Marks</b> ▸ “Form Based on Existing Table/Query” ▸ Link = StudentID↔StudentID (Master/Child)। अब हर student के नीचे उसकी marks की grid।'},
      {n:4, title:'Roll no को Name-combo बनाइए', text:'StudentID text box ▸ बदलें combo में ▸ Row Source <code>SELECT StudentID, Name FROM Students</code>, Column Count 2, Column Widths <code>0cm;5cm</code>, Bound Column 1, Control Source StudentID — नाम दिखे, ID store हो।'},
      {n:5, title:'Command buttons व validation लगाइए', text:'New Record (<code>GoToRecord ▸ New</code>), Save (<code>DoMenuItem/SaveRecord</code>), Close (<code>CloseWindow ▸ Form</code>)। Field पर Validation Rule (Marks 0–100) + Required; Before Update macro पर CancelEvent से जाँच।'},
      {n:6, title:'Format ▸ save ▸ test', text:'logo/heading, tab order, colours ▸ Save as <code>AdmissionForm</code> ▸ add/edit/delete करके Ri rules व sub-form sync जाँच लें।'}
    ]},

    {type:'table', head:['Report Section','क्या रखें','कब दोहराता'],
      rows:[
        ['Report Header','title, logo, date','report पूरे पर एक बार'],
        ['Page Header','column labels (Subject/Marks)','हर पृष्ठ'],
        ['Group Header','“Class 10 —” समूह का शीर्ष','हर group शुरू'],
        ['Detail','हर record की line','हर row'],
        ['Group Footer','group subtotal/avg/count','हर group अंत'],
        ['Page Footer','page no, footnotes','हर पृष्ठ'],
        ['Report Footer','grand total / summary','पूरे report अंत']
      ]},
    {type:'table', head:['विषय','Form','Report'],
      rows:[
        ['मुख्य काम','data entry/edit (input)','present/print/export (output)'],
        ['डेटा बदलना','हां (editable)','नहीं (read-only snapshot)'],
        ['Records','एक या few पर focus','बहुत सारे, grouping के साथ'],
        ['Totals','कम','Group/Footer totals का राजा'],
        ['Sort/Group','आम (view)','बुनियादी (design ▸ Group/Sort)'],
        ['Print/Page setup','कम','पूरा control (margins, fit, orientation)']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.11</span> Report Wizard, Marksheet व Group Totals</h3>
      <ul>
        <li><b>Create ▸ Report ▸ Report/Blank/Quick Wizard</b>; Layout ▸ <b>Group & Sort</b> ▸ Class (1st) → Student (2nd) → Subject; हर group पर <b>Group Footer ▸ Aggregate</b> (Sum/Avg/Count) जोड़ें। <b>Sum</b> box का Control Source <code>=Sum([Marks])</code>, Running sums के लिए <code>=RunningSum</code> नहीं — cumulative के लिए subquery/DSum (<code>=DSum("Marks","MarksQ","StudentID=" & [StudentID])</code>)।</li>
        <li><b>Professional marksheet:</b> Group by Class; detail में Subject/Marks; <b>%</b> text box <code>=([Obtained]/[Max])*100</code>; <b>Grade</b> text box <code>=IIf([Pct]>=75,"A",IIf([Pct]>=60,"B",IIf([Pct]>=45,"C",IIf([Pct]>=33,"D","Fail"))))</code>; student के नीचे <b>Count of students</b> (group footer ▸ Count); Class के बाद <b>Page Break After Group</b> ▸ Layout ▸ Page Setup (fit columns)।</li>
        <li><b>Layout tools:</b> Label/Line/Rectangle, image, <b>chart (Chart control)</b>, subreport, और Page Footer में text box <code>="Page " &amp; [Page] &amp; " of " &amp; [Pages]</code> से page numbering। <b>Print Preview ▸ Data/Print Preview ▸ Fit ▸ Landscape ▸ Margins ▸ Export PDF/Excel ▸ Print/Save As Report snapshot</b>।</li>
        <li><b>Summary report</b> Totals-query से (class-wise aggregate पहले query में) ; <b>Fail पर conditional formatting</b> (red) ; <b>Mailing-label report</b> wizard ▸ Label Wizard ▸ source query ▸ barcode-font/labels-per-row।</li>
      </ul>`},
    {type:'table', head:['Macro Action','क्या करती है','आम साथ/नोट'],
      rows:[
        ['OpenForm','form खोलती (view/filter)','switchboard buttons'],
        ['OpenReport','report खोलती (preview/print)','WhereCondition से filter'],
        ['OpenQuery','query चलाती','result दिखाना'],
        ['OpenTable','table खोलती','—'],
        ['MsgBox','संदेश box','Validation/Before Update में'],
        ['SetValue','field/control/form का value रखती','After Update automation'],
        ['GoToRecord','record move (First/Last/Next/New)','nav buttons'],
        ['GoToPage','report page jump','—'],
        ['FindRecord','record खोजती','search box'],
        ['ApplyFilter/WhereCondition','filter लागू (form/query/report)','query-condition से dynamic filter'],
        ['Close','window बंद (Form/Report/…)','Close button'],
        ['PrintOut','seedी print (printer/copies)','receipt print'],
        ['SaveRecord','record save','—'],
        ['AddMenu','menu bar जोड़ती','पुराना UI'],
        ['CancelEvent','current event रोकती','Before Update validation'],
        ['Beep','बीप','गड़बड़ी सूचना'],
        ['RunApp / Shell','बाहरी प्रोग्राम खोलती','सुरक्षा से block (नीचे देखें)'],
        ['Quit / RunMacro / SetWarnings','app बंद / macro बुलाएँ / warnings','—']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.12</span> Macros — embedded बनाम saved, AutoExec व सुरक्षा</h3>
      <ul>
        <li><b>Embedded macro:</b> किसी form/report के Button ▸ Property ▸ On Click ▸ <code>[Event Procedure]</code> ▸ Build ▸ macro designer (table-जैसा grid) — action उसी object के अंदर रहती, अलग nav pane में नहीं दिखती। <b>Saved (stand-alone) macro:</b> Create ▸ Macro ▸ Save ▸ nav pane में नाम।</li>
        <li><b>Design grid:</b> हर row = एक Action; <b>Condition</b> column (जैसे <code>=IsNull([txt])</code> या expression) ▸ If/Else block (Design tab ▸ If/Else) से शर्ती धाराएँ; <b>Comment</b> column। <b>Single-step</b> (Design ▸ ▸) से चलाकर हर action रोक-रोक जाँचें (debug)।</li>
        <li><b>AutoExec:</b> बिल्कुल इसी नाम का macro — DB खुलते ही अपने-आप चलता (startup form, “Enable/edit” checks)।</li>
        <li><b>सुरक्षा — embedded vs saved:</b> कुछ “dangerous” actions (<code>Shell</code>/<code>RunApp</code>, <code>SetWarnings False</code>, <code>OutputTo/TransferDatabase</code>, <code>SendMessage</code> जैसी external-impact वाली) <b>embedded macros में disable</b> होती हैं; उन्हें चलाने के लिए <b>saved macro</b> में रखें और file को <b>Trusted Location</b> में डालें या <b>Enable Content</b> दें। Trust Center (File ▸ Options ▸ Trust Center) — yellow bar ▸ Enable Content; macro settings (Disable all with notification)।</li>
        <li><b>कब Macro, कब VBA:</b> नीचे तुलना — और <b>याद रखें:</b> बहुत-सा काम <b>query (filter/criteria) + form properties</b> से हो जाता है, macro की ज़रूरत ही नहीं पड़ती (जैसे combo-list, sub-form filter, sort)।</li>
      </ul>`},
    {type:'table', head:['काम','Macro','VBA Module'],
      rows:[
        ['button से form/report खोलना','आसान','ज़्यादा कोड'],
        ['simple filter/value set','<code>ApplyFilter/SetValue</code>','IIf/loops'],
        ['multi-step + loops/conditions','If/Else grid (सीमित)','For/Do/If पूर्ण'],
        ['error handling','नहीं','<code>On Error</code>'],
        ['user-defined functions','नहीं','हाँ (<code>Function</code>)'],
        ['सुरक्षा (dangerous actions)','saved+trusted','saved+trusted']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.13</span> Normalization — “एक टेबल, एक विषय”</h3>
      <p>छोटी-गंदी table के बजाय कई साफ़ tables + relationships। उदाहरण एक <b>अनorm table</b> से: <code>StudentCourse( RollNo, Name, Class, Course1, Course2, Marks1, Marks2, TeacherName, TeacherPhone )</code>।</p>
      <ul>
        <li><b>1NF:</b> हर cell एक-एक (atomic) value, repeating groups नहीं, हर row unique PK। <code>Course1, Course2, Marks1, Marks2</code> = repeating group → तोड़कर <b>Enrolments(RollNo, CourseID, Marks)</b> में, हर row एक subject।</li>
        <li><b>2NF:</b> 1NF + कोई field composite PK के <b>एक हिस्से पर</b> निर्भर (partial dependency) नहीं। <code>Name/Class</code> सिर्फ़ RollNo पर निर्भर (CourseID पर नहीं) → Students table में अलग; Enrolments में सिर्फ़ वही जो पूरे PK से जुड़े।</li>
        <li><b>3NF:</b> 2NF + कोई <b>non-key field दूसरे non-key पर</b> निर्भर (transitive) नहीं। <code>TeacherPhone</code> सीधे RollNo से नहीं, <b>Course→Teacher</b> से जुड़ा → Courses/Teachers table में अलग।</li>
        <li><b>BCNF (3.5NF):</b> हर determinant (जिस पर कुछ निर्भर हो) candidate key हो — 3NF से कड़ा; जब एक field दूसरे को तय करे और वह key न हो, फिर तोड़ें।</li>
        <li><b>4NF/5NF:</b> multi-valued dependencies (4NF) व join dependencies (5NF) हटाना — बहुत raro; सामान्यतः 3NF/BCNF तक आना ही ITI/CCC स्तर का लक्ष्य है।</li>
        <li><b>फ़ायदा:</b> डुप्लीकेट कम, update anomaly नहीं, space बचता, RI सख़्त; <b>नुकसान:</b> ज़्यादा joins (query थोड़ा धीमा), design सोच-समझकर करना पड़ता है।</li>
      </ul>`},
    {type:'table', head:['संदर्भ','MS Access','Excel','SQL Server'],
      rows:[
        ['मॉडल','file DBMS (tables+relations)','flat worksheet','client-server RDBMS'],
        ['सबसे अच्छा','छोटा-मोटा record system, forms/reports','one-off analysis, charts, quick calc','multi-user/web scale, big data'],
        ['रिलेशनशिप/RI','हाँ (built-in)','नहीं (VLOOKUP/PowerQuery से मिलाएँ)','हाँ, मज़बूत'],
        ['Concurrency','≈ 10–20 (file share)','≈ 1 editor/real-time co-edit सीमित','सैकड़ों'],
        ['Size','1 GB file','worksheet limit; CSV/Big via tools','TB+'],
        ['Reports/Forms','बलवान (in-app)','छोटी (via mail merge/other)','SSRS/BI/external'],
        ['सीखने/पैसे','Office में; तेज़ prototype','सबसे सरल, सबसे आम','server setup/DBA चाहिए']
      ]},
    {type:'labs', items:[
      {n:120, title:'छात्र DB — 3 related tables', aim:'Students, Courses, Enrolments टेबल Design view में बनाना (PK/FK/data types)।', tools:['Access','Design view','field properties'], steps:['हर table के fields व types तय करें','RollNo/StudentID पर PK (AutoNumber)','Enrolment में StudentID+CourseID FK','Indexed=Yes(No Duplicates) जाँचें'], result:'तीनों tables + keys सही, 5 records डालकर देखें।'},
      {n:121, title:'Relationships व RI enforce', aim:'1:M व M:M (junction) रिश्ता बनाकर referential integrity चालू करना।', tools:['Database Tools ▸ Relationships'], steps:['tables जोड़ें','PK→FK drag','Enforce RI + Cascade Update chk','एक orphan/गलत FK डालकर error देखें'], result:'RI error आया = रिश्ता लागू।'},
      {n:122, title:'चार queries (select/totals/crosstab/parameter)', aim:'query types हाथ से बनाना।', tools:['Query Design'], steps:['Class=10 select','Totals: Avg per Class','Crosstab: Class×Subject avg','Parameter: [ClassNo] prompt'], result:'चारों query सही output दें।'},
      {n:123, title:'Update query + backup', aim:'action query सुरक्षित चलाना।', tools:['Make-Table/Compact, Update query'], steps:[' पहले Select से देखें','BE का copy/Make-Table archive','Update Marks+5 WHERE 65-69','affected count नोट करें'], result:'पहले select, फिर update, कोई गड़बड़ी नहीं।'},
      {n:124, title:'Admission form + Marks sub-form', aim:'master-child form बनाना।', tools:['Form Design ▸ SubForm control'], steps:['Students columnar','Marks sub-form link StudentID','combo नाम दिखाए ID store','validation व buttons'], result:'एक student के नीचे उसकी marks live जुड़ें।'},
      {n:125, title:'Marksheet report (group totals)', aim:'class-wise grouping, % , grade, count।', tools:['Report Design ▸ Group & Sort'], steps:['Group by Class','Sum/Count footer','IIf grade box','page break after group'], result:'clean printable marksheet।'},
      {n:126, title:'Switchboard + macros', aim:'navigation form पर OpenForm macros।', tools:['Macro designer, Command button'], steps:['blank form पर 3 buttons','On Click ▸ macro OpenForm','AutoExec से startup','single-step debug'], result:'button से form खुलें, कोई code नहीं।'},
      {n:127, title:'Compact/Repair + Split + BE link', aim:'multi-user सज्जा।', tools:['Compact & Repair, Database Splitter'], steps:['Compact Repair','BE/FE split','Linked Table Manager','shared folder पर BE copy'], result:'FE पर design, BE पर data, दोनों जुड़े।'},
      {n:128, title:'Import Excel + Export PDF', aim:'external data आना-जाना।', tools:['External Data ▸ Import/Export'], steps:['Excel import (first row headings)','type detection','Append vs new','Export query → PDF'], result:'data DB में, report PDF में।'},
      {n:129, title:'Find Duplicates/Unmatched व backup schedule', aim:'डेटा-स्वच्छता व बैकअप आदत।', tools:['Query Wizards, Task Scheduler'], steps:['Find Duplicates (Roll)','Find Unmatched (no enrolment)','Fix/Delete','daily copy schedule'], result:'orphan/dup हटे, बैकअप time-bound।'}
    ]},
    {type:'acc', title:'MS Access — अक्सर पूछे प्रश्न', items:[
      {q:'.accde का मतलब?', a:'compiled FE जिसमें design (forms/reports/modules) बदल नहीं सकते; data BE में रहता है, multi-user सुरक्षा के लिए'},
      {q:'PK बनाम FK?', a:'PK अपनी row को unique पहचाने; FK दूसरी table का PK reference करे — रिश्ता FK से बनता है'},
      {q:'Referential Integrity क्यों?', a:'ताकि child में nonexistent FK न जाए, parent तब तक delete न हो जब तक child बाकी, orphan रिकॉर्ड न बनें'},
      {q:'Crosstab क्या?', a:'Row×Column×Value grid (spreadsheet-जैसी) — जैसे Class की पंक्तियाँ, Subject के स्तंभ, Cell में avg marks'},
      {q:'कौन-सी query डेटा मिटाती है?', a:'Delete (records), Update (field values), Make-Table (पुरानी की जगह नई) — action queries, पहले Select व backup ज़रूरी'},
      {q:'Combo की Bound Column?', a:'कौन-सा list-column असल में field में store हो; नाम दिखाएँ, ID store करें (Column Widths से hidden)'},
      {q:'Form बनाम Report?', a:'Form = input/edit (बदल सकते हैं); Report = output/print (read-only, grouping/totals)'},
      {q:'1NF/2NF/3NF छोटे में?', a:'1NF atomic values; 2NF कोई partial dependency नहीं; 3NF कोई transitive (non-key→non-key) नहीं'},
      {q:'Access का साइज़ limit?', a:'1 GB प्रति .accdb (system DB अलग); 255 fields/table; ~10–20 concurrent practical users'},
      {q:'Input Mask का काम?', a:'entry का format बाध्य (phone/roll); display सुधारता है, store होते value का type नहीं बदलता'},
      {q:'Linked vs Imported table?', a:'linked का डेटा बाहर ही रहता है (source से live, ODBC/SharePoint); imported की copy आपके .accdb में, source से sync नहीं'},
      {q:'AutoExec कब चलता?', a:'database खुलते ही अपने-आप (startup logic); name बिल्कुल AutoExec होना चाहिए'}
    ]},
    {type:'callout', kind:'exam', title:'परीक्षा के पक्के सवाल-जवाब', html:'<ul><li><b>PK vs FK?</b> PK = own row unique; FK = reference to other PK।</li><li><b>.accde?</b> compiled front-end, design locked।</li><li><b>Enforce RI क्यों?</b> orphan/nonexistent FK रोकने।</li><li><b>Crosstab?</b> Row×Col×Value grid।</li><li><b>Which query deletes data?</b> Delete/Update/Make-Table (action queries)।</li><li><b>Combo Bound Column?</b> which column is stored।</li><li><b>Form vs Report?</b> input vs output।</li><li><b>1NF/2NF/3NF?</b> atomic / no partial / no transitive।</li><li><b>Access size limit?</b> 1 GB, 255 fields।</li><li><b>.accdb vs .mdb?</b> 2007+ ACE vs 2003 Jet।</li></ul>'},

    /*T2*/
  ]
},

/* ===================================================================
   5. Outlook, Teams व OneNote
   =================================================================== */
{
  id:'off-outlook', icon:'📧', group:'MS Office मास्टरक्लास',
  title:'Outlook, Teams व OneNote',
  sub:'मेल, कैलेंडर, नियम, PST बैकअप, ऑनलाइन मीटिंग व नोट्स',
  kicker:'Office Masterclass 5 · Mail, Calendar & Collaboration',
  hero:'यह पेज तीन collaboration टूल एक साथ सिखाता है — <b>Outlook</b> (mail, calendar, contacts, tasks, rules, PST/OST backup व email security), <b>Teams</b> (chat, channels, online meetings व files) और <b>OneNote</b> (class notes, tags, sync)। साथ में IMAP/POP/Exchange ports, Bcc Etiquette, recall की असली शर्तें, phishing संकेत, SPF/DKIM/DMARC सरल हिंदी में, और Indian cyber-crime नंबर तक — सब परीक्षा व रोज़-मर्रा दोनों के लिए।',
  tags:['Mail व Account Setup','Rules व Quick Steps','Calendar व Scheduling','PST/OST Backup','Phishing व SPF/DKIM','Teams व OneNote'],
  blocks:[
    {type:'html', html:`<h3 class="blk"><span class="blk-n">5.1</span> Outlook क्या है — क्लाएंट, खाते व “नया Outlook”</h3>
      <p>Outlook एक <b>mail/calendar client</b> है; डेटा सर्वर पर रहता है, Outlook बस खोलता-भेजता है। यह कई तरह के खाते संभालता है — <b>Microsoft 365/Exchange</b> (organization), <b>Outlook.com</b> (personal), <b>Gmail/Yahoo</b> (IMAP), और कोई भी <b>POP3/IMAP</b> खाता।</p>
      <ul>
        <li><b>Classic Outlook (desktop, Win32):</b> पूरी ताक़त — <code>.pst</code> खोलना, COM add-ins, rules/VBA, offline OST, mailbox export।</li>
        <li><b>New Outlook for Windows:</b> <b>web-based (OneCore)</b> client — Outlook.com/365/Gmail/IMAP चलाता है, पर <code>.pst</code> फ़ाइलें खोल नहीं सकता और desktop COM add-ins/advanced rules सीमित हैं; interface Outlook web app जैसा। <i>(संस्करण बदलते रहते हैं — features Microsoft की announcement से जाँचें।)</i></li>
        <li><b>Exchange vs Exchange Online vs Outlook.com:</b> Exchange = on-prem server, Exchange Online = 365 में hosted, Outlook.com = free/consumer mailbox (Windows Live/Hotmail का उत्तराधिकारी)।</li>
      </ul>`},
    {type:'table', head:['प्रोटोकॉल/खाता','Incoming','Outgoing','कब'],
      rows:[
        ['Microsoft 365/Exchange','AutoDiscover (MAPI/Exchange)','auto','office365 — <code>outlook.office365.com</code> (IMAP/POP/SMTP endpoint); modern auth'],
        ['IMAP (generic)','imap.<domain> · <b>993</b> SSL/TLS','smtp.<domain> · <b>587</b> STARTTLS (या 465 SSL)','server पर mail रहे, कई device'],
        ['POP3 (generic)','pop.<domain> · <b>995</b> SSL','smtp.<domain> · <b>587</b>/<b>465</b>','mail download कर local रखना'],
        ['Gmail','imap.gmail.com · <b>993</b>','smtp.gmail.com · <b>465</b>/<b>587</b>','2-Step पर <b>App Password</b> चाहिए (basic auth बंद)'],
        ['Outlook.com/Hotmail','auto','auto','free account, Microsoft खाता']
      ]},
    {type:'callout', kind:'info', title:'POP3 बनाम IMAP — याद रखने का फ़र्क़', html:'<p><b>POP3</b> mail server से नीचे खींचकर device पर रखता है (default server से हटा सकता है); एक device पर अच्छा, sync नहीं। <b>IMAP</b> server पर ही folders/flags/ padhe-अनपढ़े रखता है, हर device वही स्थिति देखता है; server space चाहिए। <b>Exchange/MAPI</b> IMAP से भी आगे — mail+<b>calendar+contacts+tasks</b> सब sync।</p>'},
    {type:'callout', kind:'warn', title:'“Cannot send test message” / mail नहीं जा रहा — क्रम', html:'<ol><li><b>Port/encryption ग़लत</b> — SMTP 587 (STARTTLS) या 465 (SSL), IMAP 993, POP 995।</li><li><b>Password/2FA</b> — Gmail/365 में App Password या modern auth; साधारण पासवर्ड अब काम नहीं करता।</li><li><b>Antivirus/Firewall</b> SMTP रोक रहा हो — temporarily बंद कर test.</li><li><b>Server address</b> misspelled (smtp./imap. prefix)।</li><li>Send/Receive groups, offline work, या mailbox full (5.12)।</li><li>Test: Outlook ▸ Account Settings ▸ Test Account Settings (port व auth जाँचता है)।</li></ol>'},
    {type:'table', head:['Folder','क्या','नियम'],
      rows:[
        ['Inbox','आने वाला primary mail','Focus Inbox ▸ पढ़ने-योग्य (Unread/Important) vs Other'],
        ['Junk Email','spam संदेह वाले','auto-filter + blocked/safe lists (5.10)'],
        ['Deleted Items','hटाया गया','खाली करने पर server से भी हट सकता; retention/undelemate'],
        ['Archive','पुराना mail यहाँ भेजते (online archive या folder)','AutoArchive से भी भरता'],
        ['Sent Items','भेजा हुआ','draft भेजने पर यहाँ'],
        ['Drafts','अधूरा','auto-save'],
        ['Subfolders','inbox के नीचे अपने folders','drag/right-click ▸ New; folder size ▸ Right-click ▸ Properties']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">5.2</span> Organize, View Settings, Search</h3>
      <ul>
        <li><b>Drag & drop</b> mail folder में; <b>grouping</b> ▸ View ▸ Arrange ▸ <b>This Week</b>/<b>From</b>/<b>Date</b>; <b>conversation view</b> (View ▸ Show as Conversations) reply-thread एक साथ; <b>Preview pane</b> position (Right/Bottom/Off, View ▸ Layout); <b>density</b> (Compact/Readable); filter chips ▸ <b>Unread · Has attachments · Sort</b>।</li>
        <li><b>View Settings</b> ▸ Reset View (बिगड़ा view ठीक); <b>Current View ▸ Message Preview</b> (1/2/3 lines)।</li>
        <li><b>Search (search box ▸ Search tab):</b> operators — <code>from:</code>, <code>subject:</code>, <code>received:</code> (<code>received:last week</code>), <code>hasattachment:yes</code>, <code>isflagged:yes</code>, <code>category:</code>, <code>older_than/after/before:</code>। Search ▸ <b>Refiners</b> dropdown व <b>Search Tools ▸ Broaden/Current Folder ▸ Saved Searches</b> (dopbara चलने वाली खोज, जैसे “last week invoices”)।</li>
      </ul>`},

    {type:'table', head:['Field','क्या','Etiquette/Privacy'],
      rows:[
        ['To','सीधे कार्यवाही के लिए','main recipient(s); from them expected action'],
        ['Cc','सूचना हेतु (carbon copy)','सब दिखते हैं; “FYI” लोग'],
        ['Bcc','गोपनीय copy (blind cc)',' recipients को पता नहीं चलता — mass mail में <b>privacy के लिए Bcc</b>; reply-all Bcc को नहीं जाता'],
        ['From (shared mailbox)','एक खाते से कई लोग','delegate/shared mailbox; Send As / Send on behalf permission']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">5.3</span> अच्छा mail भेजना</h3>
      <ul>
        <li><b>Subject</b> छोटा-स्पष्ट (काम + विषय): “Fee reminder – COPA Class-A – 5 Nov”। खाली subject भेजना गलत।</li>
        <li><b>Importance:</b> Message ▸ Tags ▸ <b>High / Normal / Low</b> (! icon) — कम-से-कम High; <b>High sensitivity</b> (365/IRM) privacy label।</li>
        <li><b>Receipts:</b> Options ▸ <b>Read receipt</b> (पढ़ा?) / <b>Do not deliver after…/Request a delivery receipt</b> — पर <b>recipients अक्सर block/ignore</b> करते हैं; भरोसा मत कीजिए, follow-up कीजिए।</li>
        <li><b>Reply / Reply All / Forward:</b> reply-all से हर recipient को जाता — ज़रूरत हो तो ही। <b>Forward</b> में नीचे history; <b>Inline Forward</b> (Message ▸ ▸ Forward inline) original text body में।</li>
        <li><b>Delay delivery:</b> Options ▸ <b>Delay Delivery ▸ Do not deliver before</b> date/time (Outlook खला/365 inbox rule दोनों में काम करे)। <b>Follow up</b> flag ▸ custom date ▸ “Assign category”।</li>
        <li><b>Undo Send:</b> (New Outlook/Outlook.com/365) File ▸ Options ▸ Mail ▸ <b>Undo Send ▸ slider</b> — default <b>10 s</b>, range <b>0–120 s</b>; भेजने के तुरंत बाद “Undo” दबाएँ।</li>
        <li><b>AutoFormat/HTML बनाम Plain:</b> exam-notices/official circular <b>Plain</b> में भेजें तो formatting सरल व हर client में दिखे; HTML में styling/rich text।</li>
      </ul>`},
    {type:'table', head:['Format','क्या','कब'],
      rows:[
        ['HTML','rich text, रंग, image, formatting','default; marketing/design mail'],
        ['Plain Text','बिना formatting, हर client में दिखे','official notice, lists, low-bandwidth'],
        ['RTF (Rich Text)','Microsoft middle-ground','छोटे bold/bullets; recipient को RTF पसंद हो']
      ]},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">5.4</span> Signatures व Stationery</h3>
      <p>File ▸ Options ▸ Mail ▸ <b>Signatures…</b> (classic) या Settings ▸ Mail ▸ Compose — नई signature बनाकर <b>New messages</b> व <b>Replies/forwards</b> के लिए अलग default चुनें (name, designation, phone, logo)। <b>Stationery and Themes</b> (Insert ▸ Themes) background/fonts का preset; पर <b>formatting caution:</b> बहुत CSS/inline styling कुछ client (Gmail/Outlook mobile) में टूटता है — signature सरल रखें, image hotlink न करें, वCard contact card साथ रखें।</p>`},
    {type:'callout', kind:'exam', title:'Recall — कब काम करता है (पक्के conditions)', html:'<p>Message ▸ Actions ▸ <b>Recall This Message</b> (read copy हटाएँ / replace) — ये सब <b>एक साथ</b> हों तभी चलता है: <b>(1)</b> भेजने व पाने वाला <b>एक ही Microsoft 365/Exchange organization</b> में, <b>(2)</b> recipient ने message <b>अभी खोला/pढ़ा नहीं</b> Outlook desktop में, <b>(3)</b> mail <b>organisation के अंदर</b> का हो — <b>Gmail/बाहरी domain/Outlook.com पर recall काम नहीं करता</b>। Status (read/unread) का delivery report मिलता है। इसलिए असल नियम: <b>भेजने से पहले दोबारा पढ़ें</b>, recall पर भरोसा न रखें।</p>'},
    {type:'html', html:`<h3 class="blk"><span class="blk-n">5.5</span> Rules, Quick Steps, Categories व Flags</h3>
      <ul>
        <li><b>Rules</b> (Home ▸ Rules ▸ Manage Rules & Alerts / Create Rule): <b>Conditions → Actions → Exceptions</b>। <b>Template rule</b> से तेज़। Client-side rule (माइक्रोसॉफ़्ट-आधारित “run on this machine”) बनाम <b>server-side rule</b> (365/Exchange — Outlook बंद हो तभी चलती)। <b>Run Rules Now</b> से पुराने mail पर apply; Alerts (Play sound/display in New Items)।</li>
        <li><b>Quick Steps</b> (Home ▸ Quick Steps ▸ Create New): एक click में कई काम — <b>“Mark read + move to folder”</b> एक क्लासिक 1-click lab; <b>1-click lab tasks</b>: “COPA reply-all” “Archive + categorize”।</li>
        <li><b>Categories</b> (right-click ▸ Categorize ▸ All Categories ▸ New): रंग-टैग; legend ▸ View ▸ By Category; filter ▸ ▸ <b>Categorised</b>।</li>
        <li><b>Flags & Tasks:</b> flag ▸ Add to Tasks ▸ follow-up date (Today/Tomorrow/This week/custom) ▸ Complete/Undo; flagged mail <b>To Do bar</b> में task बन जाता है (नीचे 5.7)।</li>
      </ul>`},
    {type:'table', head:['Junk चीज़','क्या','क्यों/क्या करें'],
      rows:[
        ['Blocked Senders','भेजने वाला block → Junk','Junk ▸ ▸ Junk Options ▸ list edit'],
        ['Safe Senders / Domain','whitelist → Inbox','valid mail junk से बचाने'],
        ['Valid mail junk में','rules/filter aggressive, sender नया, SPF fail, bulk','Mark ▸ <b>Not Junk</b> + safe sender जोड़ें'],
        ['Report Junk / Phishing','Microsoft/IT को भेजें','consumer Outlook.com ▸ Report; 365 ▸ <b>Report Phishing add-in</b>'],
        ['Sender unlock','गलती से block हटाएँ','Blocked Senders में से हटाकर Do Not Block']
      ]},

    /*T3*/

      { type: 'html', html: '<h3>5.6 Calendar — Appointment, Meeting व Event का फ़र्क़</h3><p>Outlook का Calendar केवल तारीख़ लिखने की जगह नहीं है — यह आपके समय का हिसाब रखने वाला database है। नीचे चार प्रकार समझ लें, क्योंकि परीक्षा में इन्हीं पर प्रश्न आते हैं।</p><p><b>Appointment</b> = केवल आपका समय block करना (किसी को बुलाया नहीं)। <b>Meeting</b> = appointment + लोगों को invite (Attendees जोड़ते ही Outlook खुद इसे meeting बना देता है)। <b>All-day Event</b> = पूरे दिन की घटना, समय busy नहीं दिखाती। <b>Live Event / Town Hall</b> = एक-तरफ़ा बड़ा प्रसारण (Teams से)।</p>' },
      { type: 'table', head: ['Calendar item', 'किसमें बनता है', 'दूसरे लोग जुड़ते हैं?', 'Free/Busy असर'], rows: [
        ['Appointment', 'Outlook Calendar', 'नहीं', 'Busy दिखाता है'],
        ['Meeting', 'Outlook + Attendees', 'हाँ — Accept/Decline/Tentative', 'Busy'],
        ['All-day Event', 'Outlook (All day tick)', 'नहीं (चाहें तो invite)', 'Free (default)'],
        ['Teams Meeting', 'Outlook में Teams add-in या Teams Calendar', 'हाँ', 'Busy'],
        ['Recurring series', 'Recurrence button', 'हर occurrence पर वही लोग', 'हर occurrence Busy'],
        ['Shared Calendar', 'Calendar Permissions देकर', 'देखने/लिखने की अनुमति अनुसार', 'मालिक का असर'],
        ['Out of Office', 'Automatic Replies + Event', 'सूचना सबको', 'Out of Office दिखता है'],
      ] },
      { type: 'steps', items: [
        { n: 1, title: 'New Meeting खोलें', text: 'Calendar में Ctrl+Shift+Q या Home → New Meeting। यह सीधे Meeting window खोलता है (Appointment नहीं)।' },
        { n: 2, title: 'Required व Optional भरें', text: 'ज़रूरी लोगों को Required में, सूचना-only लोगों को Optional में डालें। Resources में conference room या projector जोड़ें।' },
        { n: 3, title: 'Scheduling Assistant देखें', text: 'Scheduling Assistant टैब सबकी free/busy पट्टी दिखाता है। हरा = खाली, बैंगनी = busy। ऐसा slot चुनें जहाँ सब Required लोग हरे हों।' },
        { n: 4, title: 'समय व Time Zone पक्का करें', text: 'Start/End ठीक करें। दूसरे शहर के लोग हों तो Time Zones बटन से दोनों zone दिखाएँ — 30 मिनट की ग़लती यहीं होती है।' },
        { n: 5, title: 'Teams link जोड़ें', text: 'Teams Meeting टॉगल ON करें — join link अपने आप body में आ जाता है। हाथ से link न लिखें।' },
        { n: 6, title: 'Recurrence व Reminder', text: 'रोज़/हफ़्ते की meeting हो तो Recurrence → Weekly → दिन चुनें → End after N occurrences। Reminder 15 मिनट रखें।' },
        { n: 7, title: 'Agenda लिखकर Send करें', text: 'Body में 3–5 bullet agenda + कौन क्या लाएगा। Send दबाते ही सबको .ics invite mail जाता है और आपका Calendar Busy हो जाता है।', tips: ['Response options → Request Responses ON रखें ताकि Accept/Decline tracking मिले।'] },
      ] },
      { type: 'callout', kind: 'tip', title: 'Calendar Permissions — कितना दिखाना है', html: '<p>Calendar पर right-click → Sharing Permissions। स्तर हैं — <b>Can view when I’m busy</b> (केवल Free/Busy), <b>Can view titles and locations</b>, <b>Can view all details</b>, <b>Can edit</b>, <b>Delegate</b> (आपकी ओर से meeting भेज सकता है)। सहकर्मी को आमतौर पर “titles and locations” दें; Delegate केवल अपने assistant को।</p>' },

      { type: 'html', html: '<h3>5.7 Contacts, Groups व Address Book</h3><p>Outlook में तीन अलग-अलग पता-सूचियाँ होती हैं और छात्र इनमें उलझ जाते हैं। <b>Contacts</b> आपके निजी people हैं। <b>GAL (Global Address List)</b> पूरे संगठन की server-side सूची है — आप उसे बदल नहीं सकते, केवल admin बदलता है। <b>Offline Address Book (OAB)</b> उसी GAL की local copy है जो हर 24 घंटे में download होती है — इसीलिए नया कर्मचारी GAL में दिखने के बाद भी आपके पुराने Outlook में एक दिन बाद दिखता है।</p>' },
      { type: 'table', head: ['वस्तु', 'कहाँ रहती है', 'कौन बनाता है', 'कब इस्तेमाल'], rows: [
        ['Contact (Person)', 'आपके mailbox में Contacts folder', 'आप', 'एक व्यक्ति का पूरा विवरण — फ़ोन, पता, नोट'],
        ['Contact Group / Distribution List', 'आपके Contacts folder', 'आप', 'एक नाम से 20 लोगों को mail — membership आपकी निजी'],
        ['GAL entry', 'Exchange / Microsoft 365 server', 'Admin', 'संगठन के सब लोग; To में नाम टाइप करते ही auto-complete'],
        ['Microsoft 365 Group', 'Server + Teams + SharePoint + Planner', 'Owner', 'पूरी टीम — mail, files, chat, calendar एक साथ'],
        ['Shared Mailbox', 'Server (अलग mailbox)', 'Admin', 'info@ / support@ — कई लोग Full Access या Send As से चलाते हैं'],
        ['Room / Equipment Mailbox', 'Server', 'Admin', 'Meeting में Resource की तरह booking के लिए'],
      ] },
      { type: 'html', html: '<p><b>Contact Group बनाम Microsoft 365 Group</b> — Contact Group केवल एक shortcut नाम है; उसमें mail भेजने पर हर सदस्य के Inbox में अलग copy जाती है और कोई पुराना mail इतिहास नहीं दिखता। Microsoft 365 Group का अपना mailbox, SharePoint site, Teams team और Planner board होता है; नया सदस्य जुड़ने पर पुरानी बातचीत भी देख सकता है। कक्षा का स्थायी समूह बनाना हो तो M365 Group, अस्थायी mail सूची हो तो Contact Group।</p><p>Contacts को <b>.csv</b> में export/import करना सीखें — File → Open &amp; Export → Import/Export → Export to a file → Comma Separated Values। फ़ोन बदलने पर यही file काम आती है।</p>' },

      { type: 'html', html: '<h3>5.8 Tasks, Flags व Microsoft To Do</h3><p>Outlook में mail पर <b>Follow Up flag</b> लगाने से वह काम अपने आप <b>Tasks/To Do</b> सूची में आ जाता है। Flag के स्तर हैं — Today, Tomorrow, This Week, Next Week, No Date, Custom। mail हटाने पर भी flagged task बचा रहता है, यह याद रखें।</p><p><b>Microsoft To Do</b> अब Outlook Tasks का नया रूप है। इसमें <b>My Day</b> रोज़ सुबह खाली होता है — आप उसमें आज के 3–5 काम चुनते हैं, जिससे लंबी सूची का डर ख़त्म होता है। <b>Steps</b> से एक काम को छोटे टुकड़ों में तोड़ें, <b>Important</b> स्टार से priority, और <b>Due date + Remind me</b> से समय-चेतावनी।</p>' },
      { type: 'kv', items: [
        { label: 'Quick Steps', value: 'Ctrl+Shift+1…9', desc: 'एक क्लिक में कई काम — Move to folder + Mark read + Categorize + Forward। Home → Quick Steps → Create New।' },
        { label: 'Categories', value: 'रंग के label', desc: 'Ribbon → Categorize → All Categories में नाम व रंग बदलें। एक item पर कई category लग सकती हैं।' },
        { label: 'Search Folder', value: 'Virtual folder', desc: 'Unread Mail, Categorized Mail, Large Mail — असली copy नहीं, केवल filter का live view।' },
        { label: '@Mention', value: '@नाम', desc: 'mail या Teams chat में @ लगाकर नाम लिखें — उस व्यक्ति के Inbox में mail highlight होकर जाता है और To में अपने आप जुड़ जाता है।' },
      ] },

      { type: 'html', html: '<h3>5.9 PST बनाम OST — Backup की असली समझ</h3><p>यह भाग सर्विसिंग व ऑफ़िस दोनों काम में सबसे ज़्यादा पूछा जाता है। <b>OST (Offline Storage Table)</b> Exchange/IMAP खाते की <i>cache</i> है — असली डाक server पर है, OST केवल उसकी नक़ल। कंप्यूटर बदलने पर नया Outlook खुद नई OST बना लेता है, इसलिए <b>OST backup नहीं है</b>। <b>PST (Personal Storage Table)</b> आपके हाथ की स्वतंत्र file है — POP3 खाता, Archive, या Export की हुई डाक इसी में रहती है। इसे copy करके दूसरे कंप्यूटर में खोला जा सकता है।</p>' },
      { type: 'table', head: ['पहलू', 'OST', 'PST'], rows: [
        ['पूरा नाम', 'Offline Storage Table', 'Personal Storage Table'],
        ['किस खाते में', 'Exchange, Microsoft 365, Outlook.com, IMAP', 'POP3, Archive, manual export'],
        ['असली डाटा कहाँ', 'Server पर (यह केवल cache)', 'इसी file में — यही मूल है'],
        ['दूसरे PC में खुलेगी?', 'नहीं — उसी profile/mailbox से बँधी है', 'हाँ — File → Open → Outlook Data File'],
        ['File कहाँ मिलती है', '%localappdata%\\Microsoft\\Outlook', 'Documents\\Outlook Files (default)'],
        ['Size सीमा (Unicode)', '50 GB default (registry से बदल सकती)', '50 GB default'],
        ['भ्रष्ट होने पर', 'हटाएँ — server से दोबारा बन जाएगी', 'SCANPST.EXE (Inbox Repair Tool) चलाएँ'],
        ['Backup में शामिल करें?', 'नहीं (व्यर्थ जगह)', 'हाँ — यही असली backup है'],
      ] },
      { type: 'steps', items: [
        { n: 1, title: 'Outlook बंद करें', text: 'PST copy करते समय Outlook खुला हो तो file lock रहती है और copy अधूरी आती है। पहले File → Exit करें, Task Manager में OUTLOOK.EXE न बचा हो यह देखें।' },
        { n: 2, title: 'Export करें (सबसे सुरक्षित तरीक़ा)', text: 'File → Open & Export → Import/Export → Export to a file → Outlook Data File (.pst) → mailbox का सबसे ऊपर वाला नाम चुनें → Include subfolders tick → स्थान चुनें → Finish।' },
        { n: 3, title: 'Password (optional) न लगाएँ', text: 'Export में password का विकल्प आता है, पर भूलने पर डाटा हमेशा के लिए चला जाता है। कक्षा/दफ़्तर में खाली छोड़ें।' },
        { n: 4, title: 'दूसरी जगह रखें', text: 'PST को उसी laptop की दूसरी folder में रखना backup नहीं है। Pen drive, external disk या OneDrive में रखें — 3-2-1 नियम (3 copy, 2 माध्यम, 1 बाहर)।' },
        { n: 5, title: 'खोलकर जाँचें', text: 'नए PC में File → Open & Export → Open Outlook Data File → वही PST चुनें। बाईं ओर अलग folder tree दिखे तो backup सही है।' },
        { n: 6, title: 'AutoArchive से हल्का करें', text: 'File → Options → Advanced → AutoArchive Settings → हर 14 दिन → पुरानी डाक archive.pst में भेजें। इससे मुख्य mailbox 50 GB सीमा से दूर रहता है।' },
      ] },
      { type: 'callout', kind: 'danger', title: 'PST/OST की 5 ख़तरनाक ग़लतियाँ', html: '<p>1) OST को backup समझकर रख लेना — profile हटते ही सब गया। 2) PST को network share पर खोलकर चलाना — Microsoft इसका समर्थन नहीं करता, file भ्रष्ट होती है। 3) चलते Outlook में PST copy करना। 4) 50 GB पार करना — फिर mail आना बंद। 5) SCANPST को बार-बार चलाना बिना copy लिए — पहले backup, फिर repair।</p>' },

      { type: 'html', html: '<h3>5.10 Email Security — SPF, DKIM, DMARC व Phishing</h3><p>mail का <b>From</b> पता झूठ लिखा जा सकता है, इसलिए तीन DNS-आधारित जाँच बनीं। <b>SPF</b> बताता है कि इस domain की ओर से कौन-से server mail भेज सकते हैं (TXT record में IP सूची)। <b>DKIM</b> mail पर एक digital signature लगाता है जिसे भेजने वाले domain की public key (DNS में) से जाँचा जाता है — रास्ते में सामग्री बदली तो signature टूट जाएगा। <b>DMARC</b> मालिक की नीति है: SPF/DKIM fail हो तो mail को <code>none</code> (केवल report), <code>quarantine</code> (Junk) या <code>reject</code> (मना) करो, और report कहाँ भेजें।</p>' },
      { type: 'table', head: ['जाँच', 'DNS record', 'क्या पक्का करती है', 'Fail होने पर'], rows: [
        ['SPF', 'TXT: v=spf1 ip4:… include:… -all', 'भेजने वाला server अधिकृत है', 'X-Spam score बढ़ता / reject'],
        ['DKIM', 'TXT: selector._domainkey.domain', 'signature मेल से मेल खाता, बदला नहीं गया', 'Authentication-Results में dkim=fail'],
        ['DMARC', 'TXT: _dmarc.domain v=DMARC1; p=reject', 'मालिक की policy + alignment', 'policy अनुसार junk/reject'],
        ['MX', 'MX: 10 mail.domain.tld', 'इस domain की डाक किस server पर आए', 'mail bounce — host not found'],
        ['TLS / STARTTLS', '(DNS नहीं, handshake)', 'रास्ते में encryption', 'सादा-पाठ में जाता — जोखिम'],
      ] },
      { type: 'table', head: ['Phishing का संकेत', 'असली उदाहरण', 'क्या करें'], rows: [
        ['मिलता-जुलता domain', 'sbi-secure-alert.com बनाम sbi.co.in', 'domain का आख़िरी दो हिस्से पढ़ें, बीच का hyphen देखें'],
        ['जल्दबाज़ी का डर', '“24 घंटे में खाता बंद हो जाएगा”', 'रुकें; आधिकारिक number पर ख़ुद call करें'],
        ['Display name का धोखा', 'From: “Principal Sir” &lt;fees@random.xyz&gt;', 'नाम नहीं, कोष्ठक वाला असली पता देखें'],
        ['Link का छिपा पता', 'लिखा banksite.com, hover पर bit.ly/xyz', 'hover करें; कभी short link न खोलें'],
        ['अटैचमेंट', 'Invoice.html, Form.docm, .exe, .iso, password-protected .zip', 'न खोलें; .docm/.xlsm में macro होता है'],
        ['OTP / password माँगना', '“सत्यापन के लिए OTP बताएँ”', 'कोई बैंक/दफ़्तर OTP नहीं माँगता — कभी न दें'],
        ['भाषा व spelling की ग़लती', 'अटपटा अनुवाद, बेमेल font', 'संदेह बढ़ाएँ, अकेला सबूत न मानें'],
        ['Reply-to अलग', 'From bank.in पर Reply-to gmail.com', 'Header → Internet headers में Reply-To देखें'],
      ] },
      { type: 'callout', kind: 'warn', title: 'संदेह हो तो 4 कदम', html: '<p>1) link/अटैचमेंट न छुएँ। 2) <b>Report → Report Phishing</b> (या Junk → Phishing) से IT को भेजें — Delete करने से अगला सहकर्मी बच नहीं पाता। 3) उसी mail में दिए number पर call न करें, वेबसाइट ख़ुद टाइप करें। 4) ग़लती से password दे दिया हो तो तुरंत बदलें, MFA चालू करें और active sessions sign-out करें।</p>' },
      { type: 'table', head: ['Encryption', 'किसमें', 'पाने वाले को क्या चाहिए', 'कब'], rows: [
        ['S/MIME', 'Classic Outlook', 'उसका भी certificate + आपका public key', 'संस्थागत, लंबे समय के हस्ताक्षरित mail'],
        ['Microsoft 365 OME (Encrypt button)', 'Outlook/OWA', 'कुछ नहीं — OTP या sign-in से पढ़ता है', 'बाहर के किसी भी व्यक्ति को संवेदनशील mail'],
        ['Do Not Forward', 'OME का विकल्प', 'sign-in', 'copy/print/forward रोकना हो'],
        ['TLS (transport)', 'server-to-server', 'कुछ नहीं', 'रास्ते की सुरक्षा — आराम से पढ़ने पर रोक नहीं'],
        ['Sensitivity label', 'M365 Purview', 'policy अनुसार', 'Public/General/Confidential/Highly Confidential वर्गीकरण'],
      ] },

      { type: 'html', html: '<h3>5.11 Microsoft Teams — Chat, Channel व Meeting</h3><p>Teams के तीन स्तंभ हैं। <b>Chat</b> = 1:1 या छोटे group की निजी बातचीत (बाहर के व्यक्ति से भी हो सकती है — federated)। <b>Channel</b> = किसी Team के अंदर विषय-आधारित खुली जगह; पूरी team पढ़ सकती है और इतिहास बना रहता है। <b>Meeting</b> = scheduled या ad-hoc audio/video सत्र। नियम याद रखें — <b>“काम की बात channel में, निजी बात chat में”</b>, वरना ज़रूरी फ़ैसला किसी की निजी chat में दब जाता है।</p>' },
      { type: 'table', head: ['पहलू', 'Chat', 'Channel post', 'Channel meeting'], rows: [
        ['कौन देख सकता है', 'केवल जुड़े लोग', 'पूरी Team (private channel हो तो चुने सदस्य)', 'Invite किए लोग + channel में recording'],
        ['इतिहास', 'निजी, नए सदस्य को चुनिंदा', 'नया सदस्य भी पुराना पढ़ सकता है', 'Recording/Transcript में'],
        ['Files कहाँ जाती हैं', 'भेजने वाले के OneDrive में', 'Team के SharePoint library में', 'Meeting chat/Channel files'],
        ['Thread', 'एक धारा; Reply से जुड़ती', 'हर post का अलग thread — Reply दबाकर जवाब दें', 'Chat अलग चलता है'],
        ['@mention', '@नाम / @group', '@व्यक्ति / @channel / @team', '@नाम'],
        ['कब चुनें', 'तुरंत, निजी, अस्थायी', 'नीति/फ़ैसला/काम — जो सबको चाहिए', 'लाइव चर्चा + रिकॉर्ड'],
      ] },
      { type: 'table', head: ['Meeting control', 'काम', 'कौन कर सकता है'], rows: [
        ['Mute all', 'सबकी आवाज़ बंद', 'Organizer / Presenter'],
        ['Share screen / window', 'पूरी screen या एक window दिखाना', 'Presenter (default)'],
        ['Include computer sound', 'वीडियो की आवाज़ भी जाना', 'Share करते समय toggle'],
        ['Whiteboard', 'साझा कैनवास पर लिखना', 'सब (नीति अनुसार)'],
        ['Breakout rooms', 'छोटे समूहों में बाँटना', 'Organizer'],
        ['Record + Transcribe', 'recording Stream/OneDrive में, transcript text', 'Organizer / नीति-अनुमत'],
        ['Raise hand', 'बोलने की अनुमति माँगना', 'Attendee'],
        ['Lobby / Who can bypass', 'कौन सीधे अंदर आए', 'Organizer — Meeting options'],
        ['Roles', 'Organizer > Presenter > Attendee', 'Meeting options में बदलें'],
        ['Live captions', 'बोले शब्दों का text', 'हर viewer अपने लिए ON करे'],
      ] },
      { type: 'callout', kind: 'tip', title: 'कक्षा की Teams meeting — 8 तैयारी', html: '<p>1) Meeting options में “Who can present? = Only me” रखें ताकि छात्र screen न छीन लें। 2) “Allow mic for attendees” बंद करके ज़रूरत पर खोलें। 3) Lobby ON रखें। 4) 5 मिनट पहले join करके audio/video जाँचें (Ctrl+Shift+M mute, Ctrl+Shift+O camera)। 5) पृष्ठभूमि blur करें। 6) Wired/net stable रखें, camera बंद करके bandwidth बचाएँ। 7) Recording शुरू करने से पहले सबको बताएँ। 8) बाद में Recording + Transcript + chat का link channel में डालें ताकि अनुपस्थित छात्र पढ़ सकें।</p>' },

      { type: 'html', html: '<h3>5.12 OneNote — Notebook, Section, Page</h3><p>OneNote की संरचना एक कॉपी जैसी है — <b>Notebook</b> (पूरी कॉपी) → <b>Section Group</b> (वैकल्पिक) → <b>Section</b> (विषय के टैब) → <b>Page</b> → <b>Subpage</b>। सबसे बड़ी ख़ूबी: कैनवास मुक्त है — कहीं भी क्लिक करके टाइप करें, चित्र खींचकर छोड़ें, हाथ से लिखें। <b>Ctrl+F</b> पूरे notebook में खोजता है और चित्र के अंदर छपे शब्द (OCR) भी ढूँढ़ता है।</p>' },
      { type: 'table', head: ['OneNote चीज़', 'क्या है', 'शॉर्टकट / तरीक़ा'], rows: [
        ['Notebook', 'सबसे ऊपरी इकाई — OneDrive/SharePoint पर file', 'File → New'],
        ['Section', 'रंग का टैब — एक विषय', 'Ctrl+T'],
        ['Page', 'एक पन्ना', 'Ctrl+N'],
        ['Subpage', 'पिछले पन्ने के अंदर एक स्तर', 'Ctrl+Alt+]'],
        ['Tag — To Do', 'खाली checkbox', 'Ctrl+1'],
        ['Tag — Important', 'तारा', 'Ctrl+2'],
        ['Tag — Question', 'प्रश्न-चिह्न', 'Ctrl+3'],
        ['Find Tags', 'सब टैग एक जगह — Summary page बनाएँ', 'Home → Find Tags'],
        ['Dock to Desktop', 'किनारे में चिपकाकर दूसरी window पढ़ते हुए नोट', 'Ctrl+Alt+D'],
        ['Screen Clipping', 'screen का हिस्सा सीधे page पर', 'Win+Shift+S फिर paste'],
        ['Audio note + typed sync', 'रिकॉर्ड करते समय टाइप किया text उसी क्षण से जुड़ता', 'Insert → Record Audio'],
        ['Math / Ink to Text', 'हाथ की लिखाई को text, समीकरण को हल', 'Draw → Lasso → Ink to Text'],
        ['Version History', 'पन्ने के पुराने रूप', 'History → Page Versions'],
        ['Password protect section', 'section को encrypt', 'right-click → Password Protect'],
      ] },
      { type: 'callout', kind: 'info', title: 'OneNote बनाम Word — कब कौन', html: '<p><b>OneNote</b> कच्चे, बिखरे, रोज़ बढ़ने वाले नोट के लिए है — कक्षा के दौरान लिखना, स्क्रीनशॉट चिपकाना, बाद में खोजना। <b>Word</b> तैयार, छपने वाले दस्तावेज़ के लिए है — शीर्षक-शैली, page number, विषय-सूची, references, PDF। नोट OneNote में लें, फिर अंतिम रिपोर्ट Word में साफ़ करें।</p>' },

      { type: 'labs', items: [
        { n: 160, title: 'Outlook में खाता जोड़ना व signature बनाना', aim: 'IMAP/Exchange खाता configure करके पहला test mail भेजना और हस्ताक्षर सेट करना।', tools: ['Outlook (classic या new)', 'mail खाता व app password', 'शिक्षक का पता'], steps: ['File → Add Account → ई-मेल दर्ज करें → Connect।', 'प्रकार चुनें — IMAP (आए 993 SSL, गए 587 STARTTLS) या Exchange (auto-discover)।', 'App password माँगे तो वेबसाइट से बनाकर डालें (सादा password अक्सर मना होता है)।', 'Test mail शिक्षक को भेजें — subject में अपना नाम व रोल नंबर।', 'File → Options → Mail → Signatures → New → नाम, पद, फ़ोन टाइप करें; New messages व Replies दोनों पर लगाएँ।', 'एक और mail भेजकर signature की जाँच करें; Inbox में जवाब आया तो Screenshot लें।'], result: 'खाता Connected, दो mail भेजे गए (एक signature सहित), Inbox में शिक्षक का जवाब।' },
        { n: 161, title: 'Rules, Quick Steps व Categories से Inbox साफ़ करना', aim: 'आने वाली डाक को अपने आप folder में बाँटना सीखना।', tools: ['Outlook', 'कम-से-कम 20 mail वाला Inbox'], steps: ['एक नियमित भेजने वाले का mail चुनें → Home → Rules → Create Rule।', '“From …” tick करें → “Move the item to folder” → New folder “Notices”।', 'OK → “Run this rule now on messages already in the current folder” tick → OK।', 'Quick Steps → Create New → नाम “Read+File” → Action 1 Mark as read, Action 2 Move to folder “Archive”, Shortcut key Ctrl+Shift+1।', 'तीन mail पर category “Pending” (लाल) व दो पर “Done” (हरा) लगाएँ।', 'Search Folder → New → Unread Mail बनाएँ; screenshot में rule, quick step व categories तीनों दिखें।'], result: 'एक Rule चलती हुई, एक Quick Step shortcut से, दो रंग की categories व एक Search Folder।' },
        { n: 162, title: 'Scheduling Assistant से meeting तय करना', aim: 'तीन लोगों का साझा खाली समय ढूँढ़कर Teams meeting भेजना।', tools: ['Outlook Calendar', 'दो सहपाठी के खाते', 'Teams add-in'], steps: ['Calendar → New Meeting → Required में दो सहपाठी जोड़ें।', 'Scheduling Assistant खोलें → 30 मिनट का ऐसा slot चुनें जहाँ तीनों पट्टियाँ खाली हों।', 'Teams Meeting ON करें; subject व 4-bullet agenda लिखें।', 'Recurrence → Weekly → अगले 4 सप्ताह; Reminder 15 मिनट।', 'Send करें; दोनों से Accept/Decline मँगवाएँ और Tracking टैब खोलकर दिखाएँ।', 'एक meeting को Update करके समय 30 मिनट बदलें → Send Update; अंतर नोट करें।'], result: 'एक recurring Teams meeting, Tracking में दो Accept, और एक Update भेजा हुआ।' },
        { n: 163, title: 'PST Export, Open व SCANPST', aim: 'असली backup बनाना, दूसरी जगह खोलना और भ्रष्ट file की मरम्मत समझना।', tools: ['Outlook classic', 'Pen drive / अलग folder', 'SCANPST.EXE'], steps: ['File → Open & Export → Import/Export → Export to a file → Outlook Data File (.pst)।', 'mailbox का मूल नाम चुनें → Include subfolders → pen drive पर path → Finish (password खाली)।', 'File → Exit करें; pen drive की PST का size नोट करें (> 0 KB)।', 'File → Open & Export → Open Outlook Data File → वही PST खोलें; अलग tree दिखनी चाहिए।', 'उसमें एक folder बनाकर एक mail खींचकर डालें — copy हुई, यह जाँचें।', 'SCANPST.EXE का स्थान ढूँढ़ें (Office के अंदर) और एक नक़ल PST पर चलाकर आठ चरणों का log लिखें।'], result: 'खुलने योग्य PST backup, उसमें एक mail, और SCANPST का लिखित अनुभव।' },
        { n: 164, title: 'Phishing mail की पहचान व header पढ़ना', aim: 'नक़ली mail के संकेत पकड़कर SPF/DKIM/DMARC परिणाम पढ़ना।', tools: ['शिक्षक द्वारा भेजा नमूना phishing mail', 'Outlook / वेबमेल', 'इंटरनेट'], steps: ['नमूना mail खोलें — link पर hover करके असली पता लिखें (क्लिक न करें)।', 'From का display name और कोष्ठक वाला पता अलग-अलग लिखें।', 'File → Properties → Internet headers खोलें; Received-SPF, dkim=, dmarc= की पंक्तियाँ ढूँढ़ें।', 'Reply-To और Return-Path अलग हों तो नोट करें।', 'Report → Report Phishing (या शिक्षक को forward as attachment)।', '8-संकेतों की जाँच-सूची भरें — कितने संकेत मिले, कौन-सा निर्णायक था।'], result: 'भरी हुई phishing जाँच-सूची + तीन authentication पंक्तियों की नक़ल + report किया हुआ mail।' },
        { n: 165, title: 'Teams meeting चलाकर OneNote में नोट व कार्रवाई', aim: 'एक छोटी meeting आयोजित करके नोट, tags व कार्य-सूची बनाना।', tools: ['Teams', 'OneNote', 'दो सहपाठी', 'हेडफ़ोन'], steps: ['Teams → Calendar → New meeting → दो सहपाठी → Meeting options में “Who can present? = Only me”, Lobby ON।', 'OneNote में नया Notebook “कक्षा”, Section “Meetings”, Page आज की तारीख़ से बनाएँ।', 'meeting में 5 मिनट चर्चा करें; OneNote में Dock to Desktop (Ctrl+Alt+D) खोलकर लाइव नोट लें।', 'जो काम तय हों उन पर Ctrl+1 (To Do) और अहम बिंदु पर Ctrl+2 लगाएँ; मालिक का @नाम लिखें।', 'screen share करके एक स्लाइड दिखाएँ और उसका Screen Clipping page पर चिपकाएँ।', 'meeting समाप्त → Find Tags → Create Summary Page; वह link channel post में डालें।'], result: 'एक आयोजित meeting, OneNote का भरा पन्ना, To Do tags और एक Summary page का link।' },
      ] },

      { type: 'acc', title: 'Outlook / Teams / OneNote — बार-बार पूछे जाने वाले 14 प्रश्न', items: [
        { q: 'mail आ रहा है पर जा नहीं रहा — कहाँ देखें?', a: 'Outgoing (SMTP) सेटिंग देखें — server नाम, port 587 + STARTTLS (या 465 SSL), और “My outgoing server requires authentication” ON हो। Antivirus का mail-scanning और firewall भी 587 रोक सकते हैं। Outbox में अटका बड़ा अटैचमेंट हो तो उसे हटाकर Send/Receive करें।' },
        { q: 'IMAP और POP3 में क्या चुनें?', a: 'कई डिवाइस (फ़ोन + laptop) से वही mailbox पढ़ना हो तो IMAP — डाक server पर रहती है, सब जगह वही स्थिति। केवल एक PC पर रखकर server खाली करना हो तो POP3। आज लगभग हमेशा IMAP या Exchange ही सही है।' },
        { q: 'Recall अक्सर fail होता है?', a: 'Recall केवल तब चलता है जब both sender व recipient एक ही Exchange/Microsoft 365 संगठन में हों, recipient ने mail पढ़ा न हो, mail Outlook में ही हो (फ़ोन/वेबमेल पर नहीं), और कोई rule/folder उसे हटा न चुका हो। बाहर के domain (Gmail आदि) पर recall कभी काम नहीं करता — वहाँ “Send Undo” (10–30 सेकंड) ही भरोसेमंद है।' },
        { q: 'Bcc का सही उपयोग क्या है?', a: 'जब 100 लोगों को सूचना भेजनी हो और किसी को दूसरों के पते न दिखाने हों — तब To में अपना पता, बाकी सब Bcc में। Reply All करने पर Bcc वालों के पते उजागर नहीं होते, पर उनका reply आपको आता है। किसी को छिपकर superior को भेजना शिष्टाचार के विरुद्ध माना जाता है।' },
        { q: 'Outlook “Not Responding” या बहुत धीमा है?', a: 'पहले Add-ins जाँचें — File → Options → Add-ins → COM Add-ins → Go → ग़ैर-ज़रूरी बंद। फिर mailbox size देखें (50 GB सीमा), OST का size, और Cached Exchange Mode में “Mail to keep offline” 1 वर्ष करें। अंत में नया Outlook profile (Control Panel → Mail → Show Profiles → Add) बनाकर जाँचें।' },
        { q: 'Automatic Replies (Out of Office) कैसे लगाएँ?', a: 'File → Automatic Replies → Send automatic replies → समय सीमा tick → Inside My Organization व Outside के लिए अलग text। Exchange न हो (POP/IMAP) तो यह विकल्प नहीं आता — तब Rule + Template से जवाब बनाना पड़ता है और Outlook खुला रखना पड़ता है।' },
        { q: 'Teams chat और channel post में फ़र्क़ क्यों ज़रूरी है?', a: 'Chat निजी है और नए सदस्य को पुरानी बात नहीं दिखती; channel post पूरी team का स्थायी रिकॉर्ड है। नीति-निर्णय, फ़ाइल का अंतिम रूप और काम सौंपना channel में करें ताकि कोई छूटे नहीं और बाद में खोजा जा सके।' },
        { q: 'Teams meeting में आवाज़ नहीं आ रही?', a: 'Device settings में सही speaker/mic चुनें; Windows → Sound → Volume mixer में Teams mute न हो; Bluetooth headset हो तो “Hands-Free” बनाम “Stereo” profile जाँचें; browser वाले रूप में site को mic permission दें; और Make a test call से जाँचें।' },
        { q: 'Teams में फ़ाइल गई कहाँ?', a: 'Chat की फ़ाइल भेजने वाले के OneDrive में “Microsoft Teams Chat Files” folder में; channel की फ़ाइल उस Team की SharePoint document library में उसी channel नाम के folder में। इसीलिए channel का सदस्य बाद में भी फ़ाइल पा लेता है।' },
        { q: 'OneNote sync नहीं हो रहा?', a: 'Notebook कहाँ है देखें — OneDrive/SharePoint पर होना चाहिए। Notebook पर right-click → Notebook Sync Status → Sync Now; error code नोट करें। स्थान-भराव (OneDrive quota), sign-in टूटना, या password-protected section आम कारण हैं। हटाने से पहले हमेशा backup/export लें।' },
        { q: 'OneNote में ढूँढ़ना है पर शब्द चित्र के अंदर है?', a: 'OneNote का OCR चित्र व स्क्रीनशॉट के अंदर छपा text भी index करता है। Ctrl+F या Ctrl+E (सब notebooks) से खोजें; नया चित्र हो तो कुछ मिनट indexing का समय दें। हाथ की लिखाई में भी खोज काम करती है, पर साफ़ लिखावट पर बेहतर।' },
        { q: 'SPF/DKIM/DMARC में से एक भी न हो तो?', a: 'आपका भेजा mail recipient के Junk में जाने या reject होने की सम्भावना बढ़ती है, और कोई आपके domain का नाम लेकर नक़ली mail भेज सकता है। तीनों TXT records domain के DNS में लगवाएँ — पहले SPF, फिर DKIM, अंत में DMARC p=none से शुरू करके report देखते हुए quarantine/reject तक जाएँ।' },
        { q: 'Signature में चित्र लगाना ठीक है?', a: 'हल्का logo (≤ 20 KB) ठीक है, पर बड़ा चित्र हर mail के साथ जाता है, डाटा खाता है और कई क्लाएंट उसे अटैचमेंट दिखाते हैं। फ़ोन/पद सादे text में रखें; vCard या social icon की भीड़ न करें। क़ानूनी disclaimer संस्था तय करे तो ही जोड़ें।' },
        { q: 'Deleted Items से mail हमेशा के लिए चला गया — वापसी?', a: 'Exchange/M365 में Deleted Items के ऊपर “Recover items deleted from this folder” होता है (default 14–30 दिन)। उसके बाद भी admin eDiscovery/Recoverable Items से ढूँढ़ सकता है। POP3/PST में यह सुविधा नहीं — वहाँ केवल आपका backup बचाता है।' },
      ] },

      { type: 'quiz', store: 'off-outlook', items: [
        { q: 'IMAP का incoming port (SSL/TLS सहित) कौन-सा है?', o: ['110', '143', '993', '995'], a: 2, ex: '993 = IMAP over SSL. 143 सादा IMAP, 110 सादा POP3, 995 POP3 over SSL.' },
        { q: 'Submission (mail भेजने) का आधुनिक अनुशंसित port?', o: ['25', '587 with STARTTLS', '110', '143'], a: 1, ex: 'Port 25 server-to-server relay के लिए है और अक्सर ISP रोकता है; क्लाएंट 587 + STARTTLS (या 465 implicit TLS) use करता है।' },
        { q: 'कौन-सी file को असली backup माना जाता है?', o: ['OST', 'PST', 'OAB', 'NK2/Autocomplete cache'], a: 1, ex: 'PST स्वतंत्र होती है और कहीं भी खुलती है। OST केवल server की cache है — profile हटने पर दोबारा बन जाती है, backup नहीं।' },
        { q: 'भ्रष्ट PST की मरम्मत का Microsoft tool?', o: ['CHKDSK', 'SCANPST.EXE', 'SFC /scannow', 'Eseutil'], a: 1, ex: 'SCANPST.EXE = Inbox Repair Tool, Office folder में मिलता है। चलाने से पहले file की copy अवश्य लें।' },
        { q: 'Unicode PST/OST की default size सीमा?', o: ['2 GB', '10 GB', '50 GB', 'कोई सीमा नहीं'], a: 2, ex: 'Outlook 2010 के बाद default 50 GB; पुरानी ANSI PST 2 GB थी। registry से बदली जा सकती है पर बढ़ाना जोखिम है।' },
        { q: 'Appointment और Meeting में मुख्य फ़र्क़?', o: ['Meeting में reminder नहीं होता', 'Meeting में Attendees जुड़े होते हैं', 'Appointment पूरे दिन का होता है', 'Meeting केवल Teams में बनती है'], a: 1, ex: 'लोगों को invite करते ही Outlook appointment को meeting बना देता है और Accept/Decline tracking चालू हो जाती है।' },
        { q: 'Scheduling Assistant क्या दिखाता है?', o: ['सबकी free/busy पट्टी', 'mail के headers', 'mailbox का size', 'spam score'], a: 0, ex: 'यह Required/Optional लोगों और Resources की व्यस्तता दिखाता है ताकि साझा खाली slot चुना जा सके।' },
        { q: 'GAL (Global Address List) कौन बदल सकता है?', o: ['हर user', 'केवल Admin / संगठन', 'Outlook अपने आप', 'कोई नहीं'], a: 1, ex: 'GAL server-side संगठन-सूची है। उसकी local copy OAB हर ~24 घंटे में download होती है, इसीलिए नया नाम देर से दिखता है।' },
        { q: 'Bcc का सबसे उचित उपयोग?', o: ['superior को छिपकर भेजना', 'बड़ी सूची को भेजते समय पते छिपाना', 'mail को encrypt करना', 'reply रोकना'], a: 1, ex: 'Bcc के पते दूसरे प्राप्तकर्ताओं को नहीं दिखते — गोपनीयता व शिष्टाचार दोनों। छिपकर वरिष्ठ को भेजना अनुचित माना जाता है।' },
        { q: 'Mail Recall कब काम कर सकता है?', o: ['किसी भी Gmail पते पर', 'एक ही Exchange/M365 संगठन में, mail अपठित हो', 'हमेशा', 'केवल POP3 में'], a: 1, ex: 'same organization + unread + Outlook client + कोई rule न हटाया हो — ये सब शर्तें चाहिए। बाहर के domain पर recall कभी नहीं चलता।' },
        { q: 'SPF किस चीज़ की जाँच करता है?', o: ['mail की सामग्री की', 'भेजने वाला server अधिकृत है या नहीं', 'attachment में virus', 'recipient का पासवर्ड'], a: 1, ex: 'SPF एक DNS TXT record है जिसमें अधिकृत भेजने वाले server/IP लिखे होते हैं। सामग्री की अखंडता DKIM देखता है।' },
        { q: 'DKIM क्या पक्का करता है?', o: ['डाक encryption', 'digital signature से भेजने वाले domain व अखंडता', 'mail का समय', 'folder का नाम'], a: 1, ex: 'DKIM header में signature होता है; public key DNS के selector._domainkey में रहती है। रास्ते में बदलाव से signature fail हो जाता है।' },
        { q: 'DMARC policy p=reject का अर्थ?', o: ['केवल report भेजो', 'fail mail को Junk में डालो', 'fail mail को स्वीकार ही न करो', 'सब mail reject करो'], a: 2, ex: 'none = केवल निगरानी, quarantine = Junk, reject = SMTP स्तर पर मना। शुरुआत none से करके report देखते हुए सख़्त करें।' },
        { q: 'Phishing mail का सबसे भरोसेमंद संकेत?', o: ['spelling की एक ग़लती', 'link के hover पर असली domain मेल न खाना', 'mail लंबा है', 'अटैचमेंट PDF है'], a: 1, ex: 'भाषा की ग़लती अकेला सबूत नहीं। displayed link और असली लक्ष्य का अंतर, तथा display-name बनाम असली पता — ये निर्णायक हैं।' },
        { q: 'Teams channel की फ़ाइल कहाँ संग्रहीत होती है?', o: ['भेजने वाले के OneDrive में', 'Team की SharePoint library में', 'लोकल Desktop पर', 'Exchange mailbox में'], a: 1, ex: 'Channel files → SharePoint document library के उसी channel folder में। Chat files → भेजने वाले के OneDrive में “Microsoft Teams Chat Files”.' },
        { q: 'नया सदस्य पुरानी बातचीत कहाँ पढ़ सकता है?', o: ['निजी Chat में', 'Channel posts में', 'कहीं नहीं', 'केवल meeting recording में'], a: 1, ex: 'Channel का इतिहास पूरी Team के लिए स्थायी रहता है — इसीलिए फ़ैसले channel में लेने चाहिए।' },
        { q: 'कक्षा meeting में छात्रों को screen share से रोकने का उपाय?', o: ['सबको Attendee कर दें / Who can present = Only me', 'Lobby बंद करें', 'Mute all', 'Recording बंद'], a: 0, ex: 'Meeting options में roles तय होते हैं — Organizer > Presenter > Attendee. केवल Presenter share कर सकता है।' },
        { q: 'OneNote में To Do tag का शॉर्टकट?', o: ['Ctrl+1', 'Ctrl+2', 'Ctrl+3', 'Ctrl+T'], a: 0, ex: 'Ctrl+1 = To Do checkbox, Ctrl+2 = Important (तारा), Ctrl+3 = Question, Ctrl+T = नया Section.' },
        { q: 'OneNote की सही संरचना ऊपर से नीचे?', o: ['Page → Section → Notebook', 'Notebook → Section → Page → Subpage', 'Section → Notebook → Page', 'Notebook → Page → Section'], a: 1, ex: 'Notebook सबसे बड़ी इकाई, उसके अंदर Section (टैब), फिर Page और Subpage.' },
        { q: 'OneNote चित्र के अंदर छपा text भी खोज सकता है — यह क्षमता क्या कहलाती है?', o: ['OCR', 'DKIM', 'OST caching', 'AutoArchive'], a: 0, ex: 'OneNote का OCR चित्र/स्क्रीनशॉट और साफ़ हाथ की लिखाई को index करता है, इसलिए Ctrl+F वहाँ भी काम करता है।' },
        { q: 'Outlook बहुत धीमा है — पहला जाँचने योग्य कारण?', o: ['ग़ैर-ज़रूरी COM Add-ins और बड़ा mailbox/OST', 'keyboard layout', 'screen resolution', 'printer driver'], a: 0, ex: 'Add-ins, 50 GB के पास mailbox, बहुत बड़ी OST और “Mail to keep offline = All” — ये सबसे आम कारण हैं। अंत में नया profile बनाकर जाँचें।' },
        { q: 'बाहर के किसी व्यक्ति को संवेदनशील mail भेजना है और उसके पास certificate नहीं — क्या लगाएँ?', o: ['S/MIME', 'Microsoft 365 Message Encryption (Encrypt)', 'केवल TLS', 'Bcc'], a: 1, ex: 'OME में पाने वाले को OTP या sign-in से पढ़ने की सुविधा मिलती है; certificate की ज़रूरत नहीं। S/MIME के लिए दोनों तरफ़ certificate चाहिए।' },
      ] },
      { type: 'callout', kind: 'exam', title: 'परीक्षा में यहाँ से क्या पूछा जाता है', html: '<p>Port जोड़े (993/995/587/465/143/110/25), POP3 बनाम IMAP, PST बनाम OST व SCANPST, Recall की शर्तें, Bcc शिष्टाचार, Appointment बनाम Meeting, Scheduling Assistant, SPF/DKIM/DMARC का काम, Teams chat बनाम channel व files का स्थान, OneNote की संरचना व Ctrl+1/2/3 — इन पर छोटे वस्तुनिष्ठ प्रश्न लगभग निश्चित हैं। प्रैक्टिकल में rule बनवाना, PST export करवाना और meeting भेजवाना सबसे आम कार्य हैं।</p>' },
      { type: 'pills', items: [
        { text: 'IMAP 993 · POP3 995', kind: 'info' },
        { text: 'SMTP 587 STARTTLS', kind: 'info' },
        { text: 'PST = backup, OST = cache', kind: 'ok' },
        { text: 'SCANPST.EXE', kind: 'tip' },
        { text: 'Recall केवल same-org अपठित', kind: 'warn' },
        { text: 'SPF → DKIM → DMARC', kind: 'info' },
        { text: 'Channel = स्थायी रिकॉर्ड', kind: 'ok' },
        { text: 'OneNote Ctrl+1 = To Do', kind: 'tip' },
      ] },
  ]
}

]);
