
/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-office2.js   (MS Excel मास्टरक्लास — भाग 1 व 2)
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

{
  id: 'off-excel-1', icon: '🧮', group: 'MS Office मास्टरक्लास',
  title: 'MS Excel भाग 1 — बेसिक, फ़ॉर्मैटिंग व बेसिक फंक्शन',
  sub: 'वर्कबुक, सेल रेफरेंस, फ़ॉर्मैट, IF/SUM/COUNT, डेटा शुद्धता व प्रिंट',
  kicker: 'Excel Part 1 · Interface, References & Core Functions',
  hero: 'यह भाग आपको <b>खाली शीट से भरे, सुंदर, सही और छापा-जाने-योग्य अकाउंट शीट</b> तक ले जाता है — UI, सेल रेफरेंस ($), फ़ॉर्म्युला की बनावट, फ़ॉर्मैट कोड और IF/SUM/COUNT/VLOOKUP जैसी ज़रूरी फंक्शन की पूरी लाइब्रेरी, साथ में परीक्षा के सबसे ज़्यादा पूछे जाने वाले बिंदु।',
  tags: ['सेल रेफरेंस व $', 'फंक्शन लाइब्रेरी', 'कस्टम फ़ॉर्मैट कोड', 'IF व IFERROR', 'डेटा वैलिडेशन', 'प्रिंट सेटअप'],
  blocks: [

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.1</span> MS Excel क्या है — और क्यों सीखें</h3>
      <p><b>MS Excel</b> एक <b>स्प्रेडशीट (Spreadsheet)</b> प्रोग्राम है जो डेटा को <b>पंक्तियों (Rows) और कॉलम (Columns)</b> की ग्रिड में रखता है, हर टुकड़े को <b>सेल (Cell)</b> में, और सेल में लिखे <b>फ़ॉर्म्युले (Formula)</b> से गणना अपने आप करता है। डेटा बदलिए — उत्तर तुरंत बदल जाता है; यही Excel की असली ताक़त है।</p>
      <p>इसका उपयोग: <b>रजिस्टर/बहीखाता</b> (हिसाब), <b>मार्कशीट व रिज़ल्ट</b>, <b>पेरोली/सैलरी</b>, <b>बिलिंग व इनवॉइस</b>, <b>इन्वेंटरी/स्टॉक</b>, <b>अटेंडेंस</b>, <b>बजट</b>, <b>रिपोर्ट व डैशबोर्ड</b>, और <b>ग्राफ़/चार्ट</b> बनाने में होता है।</p>
      <ul>
        <li><b>स्प्रेडशीट क्या देती है:</b> बार-बार उतनी-उतनी गणना नहीं करनी पड़ती — एक बार फ़ॉर्म्युला, फिर भरोसा।</li>
        <li><b>ITI/CCC/DCA में:</b> Excel सबसे ज़्यादा पूछा जाने वाला सॉफ़्टवेयर है — <code>सेल, रेंज, $A$1, फंक्शन बनाम फ़ॉर्म्युला, VLOOKUP</code> लगभग हर परीक्षा में आते हैं।</li>
        <li><b>नौकरी में:</b> "MS Excel (Intermediate/Advanced)" — लगभग हर ऑफ़िस/बैक-ऑफ़िस नौकरी विज्ञापन में माँगा जाने वाला कौशल।</li>
      </ul>`},

    {type:'table', head:['वर्ज़न (संस्करण)','बनाम/ वर्ष','मुख्य बदलाव (जो परीक्षा/इंटरव्यू में पूछा जाए)'],
      rows:[
        ['<b>Excel 5.0 / 95</b>','1993 / 1995','Excel 5.0 में पहला <b>VBA (Visual Basic for Applications)</b>; Excel 95 = संस्करण 7.0, 32-बिट'],
        ['<b>Excel 97 (8.0)</b>','1997','<b>Command bar</b> व मेन्यू, Chart Wizard, Add-in Manager; <b>PivotTable</b> की शुरुआत Excel 5.0 (1993) में ही हो चुकी थी'],
        ['<b>Excel 2000 (9.0)</b>','1999','Office Clipboard (12 items), AutoComplete टाइपिंग, Conditional formatting के नए रूप'],
        ['<b>Excel 2002/XP (10.0)</b>','2001','<b>Task Pane</b> की शुरुआत, XML फ़ाइल समर्थन, Protection सुधार'],
        ['<b>Excel 2003 (11.0)</b>','2003','अंतिम <b>क्लासिक मेन्यू</b> वाला वर्ज़न; <b>List</b> (Table का पहले रूप), AutoFilter/Rank सुविधाएँ; <b>3 शीट डिफ़ॉल्ट</b>'],
        ['<b>Excel 2007 (12.0)</b>','2007','<b>Ribbon</b>, <b>File (Backstage) स्क्रीन</b>, नई फ़ाइल <code>.xlsx</code> (OOXML/zip), <b>1,048,576 पंक्तियाँ × 16,384 कॉलम (A–XFD)</b>, <code>SUMIFS/COUNTIFS/AVERAGEIFS/IFERROR</code>, बड़ी Conditional formatting, 64 रंग/थीम'],
        ['<b>Excel 2010 (14.0)</b>','2010','<b>Sparklines</b> व Slicers, अंदरूनी <b>Save as PDF/XPS</b>, Protected View, Paste Preview'],
        ['<b>Excel 2013 (15.0)</b>','2013','<b>Flash Fill (Ctrl+E)</b>, Recommended Charts, Pivot <b>Timeline</b>, Win/Loss sparkline, <code>WEBSERVICE/FILTERXML</code>'],
        ['<b>Excel 2016 (16.0)</b>','2015/2016','सह-लेखन (Co-authoring) SharePoint/OneDrive पर, <b>Tell Me</b> बॉक्स, <b>Histogram, Box &amp; Whisker, Waterfall, Funnel, Sunburst, TreeMap, Map</b> चार्ट'],
        ['<b>Excel 2019</b>','2018','नए फंक्शन: <b>IFS, SWITCH, MAXIFS, MINIFS, CONCAT, TEXTJOIN</b> — <b>XLOOKUP इसमें नहीं</b>'],
        ['<b>Excel 2021</b>','2021','<b>XLOOKUP, XMATCH</b> और <b>dynamic arrays</b> (FILTER, SORT, SORTBY, UNIQUE, SEQUENCE, RANDARRAY, spill) — <code>LET/LAMBDA</code> नहीं'],
        ['<b>Excel 2024 (perpetual)</b>','2024','<code>LET</code> व <code>LAMBDA</code>, <code>TEXTSPLIT, VSTACK, HSTACK, TAKE, DROP, WRAPROWS, CHOOSEROWS</code>, नई डिफ़ॉल्ट थीम व चार्ट स्टाइल'],
        ['<b>Microsoft 365</b>','सदस्यता — हर महीने अपडेट','सब कुछ हमेशा नया + <b>Real-time Co-authoring, AutoSave, Version History, Linked Data Types (Stocks/Geography), Analyze Data (AI), Python in Excel</b> (क्लाउड फ़ीचर)']
      ]},
    {type:'callout', kind:'warn', title:'वर्ज़न की सीमा — परीक्षा व ऑफ़िस दोनों में काम की बात',
      html:'<b>XLOOKUP, XMATCH, FILTER, SORT, UNIQUE, SEQUENCE</b> (dynamic arrays + spill) = <b>Microsoft 365 और Excel 2021/2024</b> में — <b>Excel 2019/2016 में नहीं</b>। <b>LET, LAMBDA</b> = Microsoft 365 (2021–22) व <b>Excel 2024</b> में। <b>IFS, SWITCH, MAXIFS, MINIFS, CONCAT, TEXTJOIN</b> = Excel 2019+।<p>नतीजा: नए फंक्शन वाली फ़ाइल पुराने Excel में खोलने पर <code>#NAME?</code> दिखता है। इसलिए साझा/सरकारी फ़ाइल में <b>VLOOKUP + INDEX/MATCH</b> सुरक्षित माना जाता है, और लैब में वर्ज़न देखकर फंक्शन चुनिए।</p>'},

    {type:'table', head:['विकल्प (Alternative) सॉफ़्टवेयर','कंपनी/लाइसेंस','Excel से मेल/फ़र्क़'],
      rows:[
        ['<b>LibreOffice Calc</b>','The Document Foundation — मुफ़्त, ओपन-सोर्स','<code>.ods</code> डिफ़ॉल्ट; ज़्यादातर Excel फंक्शन चलते हैं; <code>XLOOKUP</code> 24.2+ में आया; Ribbon जैसा "NotebookBar" मोड'],
        ['<b>Apache OpenOffice Calc</b>','Apache — मुफ़्त, ओपन-सोर्स','पुराना आधार; अब विकास बहुत कम — आज के समय में LibreOffice Calc ही सुझाया जाता है'],
        ['<b>Google Sheets</b>','Google — ब्राउज़र/मुफ़्त (Workspace भुगतान)','असली-समय सह-लेखन सबसे अच्छा; <code>IMPORTRANGE, QUERY, ARRAYFORMULA</code> अपने ढंग; फ़ाइल <code>.xlsx</code> में निर्यात होती है; ऑफ़लाइन सीमित'],
        ['<b>WPS Office Spreadsheets</b>','Kingsoft — मुफ़्त/भुगतान','Excel जैसा UI, .xlsx खोलता है; भाषा/फ़ॉर्मैट में छोटे फ़र्क़'],
        ['<b>Zoho Sheet</b>','Zoho — क्लाउड (भारत में स्थापित कंपनी)','टीम-सहयोग व फ़ॉर्म अच्छे; Excel फंक्शन का बड़ा समर्थन; <code>.xlsx</code> आयात-निर्यात'],
        ['<b>Apple Numbers</b>','Apple — Mac/iPad/iPhone','मुक्त-संरचना पेज (free-form layout); Excel फंक्शन का छोटा सेट; <code>.xlsx</code> खोल-बंद चलता है'],
        ['<b>ONLYOFFICE Sheets</b>','Ascensio — ओपन-सोर्स/क्लाउड','<code>.xlsx</code> पर अच्छी पकड़; सह-संपादन; .docx/.pptx संगतता']
      ]},
    {type:'callout', kind:'tip', title:'परीक्षा में "Excel का जनक/विकल्प"',
      html:'Excel को <b>Microsoft</b> ने बनाया (पहला Mac संस्करण 1985, Windows 1987)। <b>स्प्रेडशीट का जनक</b> माना जाता है <b>VisiCalc (1979)</b> — परीक्षा में यह अक्सर पूछा जाता है। खुला/मुफ़्त विकल्प = <b>LibreOffice Calc</b>, ऑनलाइन विकल्प = <b>Google Sheets</b>।'},

    {type:'table', head:['शब्द (Term)','अर्थ','उदाहरण/माप'],
      rows:[
        ['<b>Work</b>book (वर्कबुक)','Excel की पूरी फ़ाइल — कई शीटों का डिब्बा','<code>sales.xlsx</code>; शीर्षक बार में दिखता है'],
        ['<b>Work</b>sheet / Sheet (वर्कशीट)','वर्कबुक का एक पन्ना (ग्रिड)','नीचे के Tab; डिफ़ॉल्ट नाम Sheet1'],
        ['<b>Cell</b> (सेल)','ग्रिड का सबसे छोटा खाना — एक मान यहीं रहता है','<code>B5</code> (कॉलम B, पंक्ति 5)'],
        ['<b>Active cell</b>','जिस पर काम हो रहा है (मोटी सीमा)','Name Box में पता दिखता है'],
        ['<b>Range</b> (रेंज)','सेलों का समूह, <code>:</code> से जोड़ा','<code>A1:A10</code>, <code>A1:C20</code>; पूरा कॉलम <code>A:A</code>'],
        ['<b>Multi-area / Union</b>','अलग-अलग रेंज एक साथ, <code>,</code> से','<code>=SUM(A1:A5,C1:C5)</code>'],
        ['<b>Intersection</b>','दो रेंज का common सेल, <code>space</code> से','<code>=A1:C5 B2:B4</code> → B2:B4'],
        ['<b>Used range</b>','जितना हिस्सा असल में भरा है (सबसे दायीं/नीचे के सेल तक)','<code>Ctrl+End</code> से अंत दिखता है'],
        ['<b>Name / Named range</b>','रेंज का उपनाम — <code>Salary</code> लिखकर जोड़ें','<code>=SUM(Salary)</code>; Name Manager <code>Ctrl+F3</code>'],
        ['<b>Table</b> (ListObject)','डेटा का "नामेदार" हिस्सा — फ़िल्टर+संरचित रेफरेंस','<code>Ctrl+T</code>; <code>Table1[Salary]</code>'],
        ['<b>Row / Column / Header</b>','1 से 1,048,576 / A से XFD (16,384) / पहली पंक्ति अक्सर शीर्षक','2007+ की गिनती — <b>याद रखें</b>'],
        ['<b>Formula / Function</b>','गणना का क़ानून / पहले से बनी गणना','<code>=A1+A2</code> / <code>=SUM(A1:A2)</code>'],
        ['<b>Ribbon / QAT / Backstage</b>','ऊपर की टूलपट्टी / त्वरित पहुँच पट्टी / File स्क्रीन','<code>Alt</code> दबाकर अक्षर दिखते हैं'],
        ['<b>Cell reference A1 vs R1C1</b>','कॉलम-अक्षर मोड / संख्या मोड','<code>R2C3</code> = तीसरा कॉलम, दूसरी पंक्ति (C3R2 नहीं — <b>RpCg</b> क्रम)']
      ]},

    {type:'table', head:['फ़ाइल एक्सटेंशन','पूरा नाम / क्या रखता है','कब इस्तेमाल करें'],
      rows:[
        ['<b>.xlsx</b>','Excel Workbook (OOXML — zip में दबी XML) — <b>डिफ़ॉल्ट</b>','बिना मैक्रो वाली सादे वर्कबुक; साझा करने/परीक्षा के लिए'],
        ['<b>.xlsm</b>','Excel Macro-Enabled Workbook — <b>मैक्रो/VBA रख सकता है</b>','जब मैक्रो रिकॉर्ड/लिखी हों (भाग 2)'],
        ['<b>.xlsb</b>','Excel Binary Workbook — बाइनरूप में, छोटी-तेज़','बहुत बड़ा डेटा/पivot; फंक्शन व चार्ट वही'],
        ['<b>.xls</b>','पुराना बाइनरी फ़ॉर्मैट (97–2003)','सिर्फ़ पुराने Excel/मशीन के लिए; आज न बनाएँ'],
        ['<b>.csv / .csv (Comma delimited)</b>','केवल <b>एक शीट का सादा टेक्स्ट</b>, कोई फ़ॉर्मैट/सूत्र नहीं (मूल्य लिखे जाते हैं)','डेटा आदान-प्रदान, सॉफ़्टवेयर इम्पोर्ट, Power Query'],
        ['<b>.txt / .prn</b>','टेक्स्ट (fixed-width/delimited)','पुराने सिस्टम, बैंक फ़ाइल'],
        ['<b>.pdf / .XPS</b>','छपाई-नकल (स्थैतिक)','बिना Excel वाले को भेजने के लिए; File → Export/Save as PDF'],
        ['<b>.xltx / .xltm</b>','Excel Template — डिफ़ॉल्ट <code>.xltx</code>, मैक्रो वाला <code>.xltm</code>','बार-बार एक जैसी शीट बनानी हो (मार्कशीट/बिल/रजिस्टर फ़ॉर्म); Double-click से नई वर्कबुक बनती है'],
        ['<b>.ods</b>','OpenDocument Spreadsheet (LibreOffice)','सरकारी/मुफ़्त कार्यालय में'],
        ['<b>.htm/.html/.xml/.mlc</b>','वर्कबुक को वेब पेज या XML के रूप में सहेजना','पुराना विकल्प; आज PDF/CSV पर्याप्त — "Web Page, Complete" फ़ोल्डर भी बनाता है'],
        ['<b>.wbk / .xlk (AutoRecover)</b>','बैकअप/पहले की नकल — <code>Always create backup copy</b> लागू करने पर .wbk बनता है','मूल फ़ाइल बिगड़ने पर काम आती है; Options → Save में सेटिंग']
      ]},
    {type:'callout', kind:'info', title:'सहेजते समय ध्यान रखें',
      html:'<b>File → Save As</b> (या <code>F12</code>) में फ़ॉर्मैट बदलें। <b>.csv में सहेजते समय</b> केवल <b>सक्रिय शीट</b> ही सहेजी जाती है और फ़ॉर्मैट/सूत्र/चार्ट/शीट-टैब सब मिट जाते हैं — इसलिए .xlsx की नकल हमेशा अलग रखें। <b>.xlsm</b> में मैक्रो है तो सुरक्षा चेतावनी आती है; संचय/ईमेल में .xlsx भेजना सुरक्षित आदत है।'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.2</span> .xlsx के अंदर क्या है, AutoRecover/AutoSave व नई वर्कबुक</h3>
      <p><b>.xlsx असल में एक zip फ़ोल्डर है</b> (OOXML = Office Open XML)। इसे ज़िप-आर्क खोलने वाले टूल से खोलकर देखिए — इन फ़ाइलें मिलती हैं:</p>
      <ul>
        <li><code>xl/workbook.xml</code> — शीटों के नाम व क्रम; <code>xl/worksheets/sheet1.xml, sheet2.xml…</code> — हर शीट का सेल डेटा व सूत्र</li>
        <li><code>xl/sharedStrings.xml</code> — बार-बार लिखे गए शब्द एक जगह (इसलिए .xlsx छोटी बनती है)</li>
        <li><code>xl/styles.xml</code> — फ़ॉर्मैट; <code>xl/docProps/core.xml + app.xml</code> — लेखक/समय जैसी संपत्ति; <code>xl/media/*</code> — चित्र; <code>[Content_Types].xml</code> व <code>_rels/</code> — सूची व रिश्ते</li>
        <li><code>xl/vbaProject.bin</code> — <b>केवल .xlsm</b> में (मैक्रो का कोड)</li>
      </ul>
      <p><b>AutoRecover (स्वतः पुनर्प्राप्ति):</b> File → Options → Save में डिफ़ॉल्ट <b>हर 10 मिनट</b> पर जानकारी सहेजता है। क्रैश/बंद-पड़ने पर Excel खुलते समय बाईं ओर <b>Document Recovery</b> पैनल देता है। यह "बैकअप" नहीं — सिर्फ़ बचे-खुचे काम की नकल, अस्थायी फ़ोल्डर में।</p>
      <p><b>AutoSave (स्वतः संचय) — और इससे फ़र्क़:</b> यह टॉगल (ऊपर बाएँ) केवल तभी चालू होता है जब फ़ाइल <b>OneDrive/SharePoint पर</b> और <b>Microsoft 365</b> से खुली हो; यह हर बदलाव तुरंत सहेजता है और <b>Version History</b> भी रखता है। offline/.xlsx लोकल फ़ाइल पर AutoSave ग्रेहाट/बंद दिखता है — यह अक्सर छात्रों की उलझन है।</p>
      <p><b>डिफ़ॉल्ट शीट:</b> Excel 2013 से नई वर्कबुक में <b>1 शीट</b> (Sheet1) बनती है; Excel 2003 और पुराने में <b>3</b> बनती थीं। बदलने का तरीक़ा: File → Options → General → <b>"Include this many sheets"</b>।</p>`},

    {type:'steps', items:[
      {n:1, title:'नई वर्कबुक खोलना', text:'<code>Ctrl+N</code> — खाली वर्कबुक (Book1)। शुरू करने के 3 रास्ते: Desktop/Start से Excel आइकन, मौजूदा फ़ाइल पर राइट-क्लिक → Open, या <code>Win+R</code> में <b>excel</b> लिखकर Enter।'},
      {n:2, title:'पहला नाम से सहेजना', text:'<code>Ctrl+S</code> (पहली बार = Save As) या <code>F12</code>। <b>File name</b> लिखें, <b>Save as type</b> में <b>Excel Workbook (*.xlsx)</b> चुनें, स्थान चुनकर Save। ऊपर शीर्षक-बार में नाम दिखने लगा = सहेज हो गया।',
        tips:'नाम में <code>/ \\ : * ? " &lt; &gt; |</code> नहीं चलेगा; लंबा/बिंदु-भरा नाम न रखें।'},
      {n:3, title:'विभिन्न फ़ॉर्मैट में सहेजना/निर्यात', text:'File → Save a Copy (या Save As) → type बदलें: <b>.xlsm</b> (मैक्रो सहित), <b>.csv UTF-8</b> (हिंदी टेक्स्ट सही रहने के लिए), <b>.pdf/XPS</b> (छपाई नकल)। CSV में केवल सक्रिय शीट जाएगी — चेतावनी आती है, OK दबाएँ।',
        warn:'CSV में फ़ॉर्मैट, रंग, सूत्र, चार्ट व अतिरिक्त शीटें <b>नष्ट</b> — मूल .xlsx बनाए रखें।'},
      {n:4, title:'फ़ाइल गुण (Properties) भरना', text:'File → Info → Properties के दाईं ओर <b>Title, Author, Subject, Tags, Comments</b> लिखें। <b>Show All Properties → Advanced Properties</b> में Summary/Statistics (रचना/संपादन समय/शब्द) और Contents/Custom टैब देखें।'},
      {n:5, title:'वर्कबुक स्तर की सुरक्षा', text:'Review → <b>Protect Workbook</b> (Structure व/या Windows) — संरचना चुनने पर कोई शीट डिलीट/नाम-बदल/हिलाने-मिलाने नहीं कर सकता; पासवर्ड माँगेगा। फ़ाइल-खोलने की सुरक्षा अलग है: Save As → Tools → <b>General Options</b> (Password to open / to modify)।',
        warn:'ये पासवर्ड <b>फ़ाइल खोलने/बदलने</b> के लिए हैं — सेल-सुरक्षा (Review → Protect Sheet) अलग चीज़ है।'},
      {n:6, title:'छात्रों/कर्मचारियों के लिए आदत', text:'हर 15–20 मिनट में <code>Ctrl+S</code>, काम खत्म होते ही <b>दो जगह</b> (PC + OneDrive/पेनड्राइव) नकल, और रोज़ के काम को <code>नाम_तारीख़.xlsx</code> जैसे क्रम से रखें — "final final 2.xlsx" से बचें।'}
    ]},

    {type:'table', head:['UI का हिस्सा','कहाँ / क्या दिखता है','काम व शॉर्टकट'],
      rows:[
        ['<b>Name Box</b>','Formula bar के बाईं ओर','सक्रिय सेल/रेंज का नाम-पता; यहाँ <code>A1:C9</code> या named range लिखकर Enter से रेंज चुनें; नाम बनाने के लिए यहीं लिखें'],
        ['<b>Formula Bar</b>','नाम-बॉक्स के दाईं ओर लंबी पट्टी','सेल का <b>असली फ़ॉर्म्युला/मान</b> दिखाता है (सेल में नतीजा दिखता है); <code>=</code> यहीं से शुरू; <b>fx</b> = Insert Function संवाद; <code>Ctrl+Shift+U</code> से बड़ा/छोटा'],
        ['<b>Column headers</b>','ऊपर A, B, C… XFD','क्लिक = पूरा कॉलम चुना; राइट-क्लिक = Insert/Delete/Width/Hide; किनारे खींचकर चौड़ाई, डबल-क्लिक = AutoFit'],
        ['<b>Row headers</b>','बाएँ 1, 2, 3… 1048576','height/Hide/Insert; + निशान = outline group का toggle'],
        ['<b>Sheet tabs</b>','नीचे Sheet1…','क्लिक से शीट बदलें; डबल-क्लिक = नाम बदलें; राइट-क्लिक = रंग/Protect/Move/Copy; <code>Ctrl+PgDn</code>/<code>Ctrl+PgUp</code> = अगली/पिछली शीट; <code>+</code> बटन = नई शीट'],
        ['<b>Status bar</b>','नीचे की पट्टी','<b>चुने सेलों का Sum/Average/Count</b> तुरंत; राइट-क्लिक से Max/Min/Count Numbers/Weighted Average जोड़ें; NUM LOCK/CAPS/SEL/PAGE STYLE संकेत; Zoom स्लाइडर'],
        ['<b>Ribbon tabs</b>','Home/Insert/Page Layout/Formulas/Data/Review/View','<code>Alt</code> दबाएँ → हर टैब/बटन पर अक्षर; <code>Alt, H, O, I, A</code> जैसे क्रम से कमांड'],
        ['<b>Quick Access Toolbar (QAT)</b>','शीर्षक-बार के ऊपर/नीचे छोटे आइकन','Save/Undo/Redo + जोड़ें-घटाएँ; <code>Alt+1…9</code> से कमांड चलते हैं; <code>Ctrl+Q</code> से Focus'],
        ['<b>Backstage (File)</b>','File टैब की पूरी-स्क्रीन','Info/Save/Export/Print/Options/Account — सहेजना-निर्यात-प्रिंट-सेटिंग्स का एक ही घर'],
        ['<b>Gridlines vs Smart Guides</b>','ग्रिड की हल्की रेखाएँ / चित्र-खींचते समय दिखने वाली संरेधन-रेखा','View → Gridlines से चालू/बंद (छपाई में Print gridlines अलग); Smart Guides Drawing Tools में'],
        ['<b>Freeze Panes</b>','View → Freeze Panes','शीर्षक पंक्ति/कॉलम स्क्रॉल पर भी दिखते रहें — <code>Alt, W, F, F</code> (जहाँ से फ़्रीज़), <code>Alt, W, F, R</code> (Top Row), <code>Alt, W, F, C</code> (First Column)? — <b>मेन्यू में अक्षर देखकर</b> चुनें; हटाने = Unfreeze Panes'],
        ['<b>Split</b>','View → Split','एक ही शीट के 2–4 स्वतंत्र स्क्रॉल हिस्से; फ़्रीज़ से फ़र्क़ — यहाँ हिस्से अपनी-अपनी जगह दिखा सकते हैं'],
        ['<b>Outline / Group</b>','Data → Group (<code>Alt, Shift, →</code>)','पंक्तियों/कॉलमों का समूह बनाकर +/- से समेटें; Summary row ऊपर/नीचे चुन सकते हैं; <code>Ctrl+Shift+K</code> hide row नहीं — Ungroup के लिए Data → Ungroup'],
        ['<b>Go To (F5/Ctrl+G)</b>','Special… बटन','<b>Blanks</b> (खाली सेल भरने), <b>Constants</b> (सिर्फ़ टाइप किए मान), <b>Formulas</b> (गणना वाले), <b>Visible cells only</b> (छिपे हुए को छोड़कर कॉपी), Row differences, Current region/array — बड़े काम का ज़रिया'],
        ['<b>Selection Mode</b>','Review tab / Status bar','Shift = लगातार जोड़ें, Ctrl = अलग-अलग जोड़ें, Alt = फ़ॉर्म/चित्र चुनें']
      ]},

    {type:'table', head:['काम','शॉर्टकट','नतीजा'],
      rows:[
        ['अगला/पिछला सेल (सीमा तक)','<code>Ctrl + Arrow</code>','खाली/भरे ब्लॉक के अंत तक कूद'],
        ['सेल/रेंज चुनते-चुनते जाना','<code>Shift + Arrow</code> / <code>Ctrl+Shift+Arrow</code>','एक-एक / एक-ब्लॉक भरना चुना जाता है'],
        ['पूरी मौजूदा रेंज','<code>Ctrl + Shift + End / Home</code>','सक्रिय सेल से used-range तक / शुरू तक'],
        ['वर्तमान क्षेत्र / पूरी शीट','<code>Ctrl + A</code> (दो बार दबाएँ)','पहली बार डेटा region, दूसरी बार पूरी शीट (1048576×16384)'],
        ['सबसे अंतिम भरी सेल','<code>Ctrl + End</code>','Used range का कोना (गंदी सेल दिखी तो फ़ाइल भारी समझें)'],
        ['A1 पर वापस','<code>Ctrl + Home</code>','शीट की शुरुआत'],
        ['पूरा कॉलम / पूरी पंक्ति','<code>Ctrl + Space</code> / <code>Shift + Space</code>','चयन — फिर Delete से मान हटेंगे, पंक्ति नहीं'],
        ['असली पंक्ति/कॉलम डिलीट','राइट-क्लिक → Delete / <code>Ctrl + -</code>','<code>Ctrl + +</code> (numeric keypad) = Insert'],
        ['शीट बदलना','<code>Ctrl + PgDn / PgUp</code>','अगली/पिछली शीट'],
        ['Go To / Named तक सीधी छलाँग','<code>F5</code> या <code>Ctrl + G</code>','संवाद में पता/नाम लिखकर Enter; <code>Alt+↓</code> से पहले गए पते'],
        ['सेल में लाइन-ब्रेक','<code>Alt + Enter</code>','एक ही सेल में दो लाइन का टेक्स्ट (Wrap Text के साथ अच्छा)'],
        ['एक ही साथ कई सेल','<code>Ctrl + Enter</code>','चुनी सभी सेल में एक-सा मान/फ़ॉर्म्युला'],
        ['फ़ॉर्म्युला-दिखाना/छिपाना','<code>Ctrl + `</code> (tilde/backquote)','हर सेल में नतीजे की जगह <code>=</code> वाला सूत्र — जाँच का सबसे तेज़ तरीक़ा'],
        ['फ़ॉर्मैट Cells संवाद','<code>Ctrl + 1</code>','Number/Alignment/Font/Border/Fill/Protection — छह टैब'],
        ['छीपा/अनछीपा पंक्तियाँ','<code>Ctrl+9</code> / <code>Ctrl+Shift+(</code>','Hide / Unhide rows (columns: <code>Ctrl+0</code> / <code>Ctrl+Shift+)</code>)'],
        ['डेटा/समय डालना','<code>Ctrl + ;</code> / <code>Ctrl + Shift + ;</code>','आज की तारीख़ / वर्तमान समय (static — बदलेगा नहीं)'],
        ['ऊपर से मान/सूत्र उतारना','<code>Ctrl + D</code> (down) / <code>Ctrl + R</code> (right)','Fill Down/Fill Right — एक ही फ़ॉर्म्युला नीचे भरें'],
        ['मूल मान (value) चिपकाना','<code>Ctrl + Alt + V</code> → Values','फ़ॉर्म्युला हटाकर सिर्फ़ उत्तर रखना; Transpose/Add/Multiply भी यहीं']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">3.1</span> डेटा एंट्री — प्रकार, संरेखण व "टेक्स्ट-नंबर" का चक्र</h3>
      <p>सेल में जो टाइप करते हैं, Excel उसे पहचानकर <b>type</b> दे देता है — यही पहचान आगे फ़ॉर्म्युले, सॉर्ट, फ़िल्टर व Pivot के नतीजे तय करती है। सबसे बड़ी गलती <b>नंबर का टेक्स्ट बन जाना</b> (जैसे रोल नंबर, फ़ोन, पिन, 0 से शुरू कोड) और <b>तारीख़ का टेक्स्ट बन जाना</b> है।</p>
      <p><b>संरेखण का नियम (Alignment rule):</b> संख्या/तारीख़/सूत्र का नतीजा डिफ़ॉल्ट <b>दाईं ओर (right)</b>, टेक्स्ट <b>बाईं ओर (left)</b>, तार्किक (<code>TRUE/FALSE</code>) <b>बीच में</b>, त्रुटि <b>बीच में</b>। यानी बिना देखे भी संरेखण बता देता है कि सेल में क्या है — जाँच का सबसे तेज़ नुक्ता।</p>`},

    {type:'table', head:['डेटा का प्रकार','Excel इसे कैसे पहचानता/दिखाता है','काम व सावधानी'],
      rows:[
        ['<b>Number (संख्या)</b>','दाईं ओर; <code>1234.5</code> सीधा; <code>1,234.50</code> फ़ॉर्मैट से; <code>1.2E+03</code> वैज्ञानिक','गणना होती है; 15 सार्थक अंक (significant digits) के बाद अंक <b>शून्य</b> हो जाते हैं — 16-अंकीय आधार संख्या/कार्ड नंबर टेक्स्ट में रखें'],
        ['<b>Text (शब्द)</b>','बाईं ओर; कोई गणना नहीं','नाम, पता, कोड; बड़ी संख्या कोड (Aadhaar/Card) हमेशा टेक्स्ट के रूप में'],
        ['<b>Date/Time</b>','अंदर से <b>पूर्णांक संख्या</b> — 0 = 00-01-1900; 1 = 01-01-1900; आंशिक भाग = समय (0.5 = दोपहर 12:00)','इसलिए तारीख़ घटाकर दिन मिलते हैं व "50000" जैसी संख्या तारीख़ फ़ॉर्मैट लगने पर दिख जाती है; 1900 की leap-year ग़लती के कारण 29-02-1900 भी मान्य माना जाता है (Lotus संगतता)'],
        ['<b>Logical (Boolean)</b>','<code>TRUE</code>/<code>FALSE</code> बीच में','तुलना (<code>=A1&gt;50</code>) का नतीजा; IF/AND/COUNTIFS इन्हीं पर चलते हैं'],
        ['<b>Error value</b>','<code>#N/A</code>, <code>#REF!</code> आदि','गणना का असफल नतीजा — सेक्शन 5.3 की त्रुटि-तालिका देखें'],
        ['<b>Formula</b>','<code>=</code>, <code>+</code>, <code>-</code>, <code>@</code> से शुरू; नतीजा दिखता है, सूत्र Formula Bar में','सेल में <code>0</code> आ जाए जब सूत्र सही हो → Circular Reference संदेह'],
        ['<b>Empty vs space vs 0</b>','खाली = कोई मान नहीं; <code>" "</code> (space) = टेक्स्ट; <code>0</code> = संख्या','<code>COUNTBLANK</code> सिर्फ़ सच में खाली गिनता है; स्पेस वाले सेल "भरे" दिखते हैं — यही डुप्लिकेट/गिनती की सबसे आम ग़लती']
      ]},

    {type:'table', head:['समस्या','सही तरीक़ा','नतीजा / क्यों'],
      rows:[
        ['0 से शुरू कोड (012345, फ़ोन 098765…, PIN)','सेल में 012345 सीधे न लिखें — <code>&#39;012345</code> टाइप करें (अग्रेणी अपॉस्ट्रॉफी)','अपॉस्ट्रॉफी दिखती नहीं, मान टेक्स्ट रहता है व 0 बचा रहता है; बाईं ओर संरेखण + हरा त्रुटि-निशान'],
        ['पूरे कॉलम को टेक्स्ट बनाना','कॉलम चुनकर पहले <b>Ctrl+1 → Number → Text</b> चुनें, फिर टाइप करें <i>या</i> कॉलम को Text पर सेट करके CSV खोलें','पहले से टाइप किए मान बदलने के लिए सेल दोबारा एंटर करना पड़ता है — सबसे साफ़: <b>Data → Text to Columns → Finish</b>'],
        ['बहुत लंबा अंक (आधार/कार्ड नंबर 16+)','टेक्स्ट के रूप में (अपॉस्ट्रॉफी/प्रीफ़ॉर्मैट Text)','15 के बाद अंक शून्य हो जाते हैं — डेटा चुपचाप बिगड़ जाता है'],
        ['तारीख़ को टाइप करना','<code>05-01-2025</code>, <code>5 Jan 2025</code>, <code>2025-01-05</code>','मान्य <b>locale</b> की क्रमशः तारीख़ पर निर्भर — English (India) में DD-MM-YYYY स्वीकार; <code>05/01/2025</code> तभी तारीख़ बनेगी जब सिस्टम उसे समझे, वरना टेक्स्ट रहेगा'],
        ['तारीख़ टेक्स्ट बन गई','संख्या/तारीख़ फ़ॉर्मैट लगाकर देखें; न बने तो <code>=DATEVALUE(TRIM(A1))</code> या Text to Columns → Date (DMY)','फ़िल्टर/Pivot में महीने समूह (grouping) तभी चलेंगे जब सच में date हो'],
        ['समय डालना','<code>Ctrl+;</code> तारीख़, <code>Ctrl+Shift+;</code> समय — स्थिर मान; <code>=TODAY()</code>/<code>=NOW()</code> — जीवित मान','जीवित फंक्शन हर बार-गणना पर बदलते हैं (<b>volatile</b>)'],
        ['एक-सा मान कई सेल में','रेंज चुनें → टाइप → <code>Ctrl+Enter</code>','सभी चुनी सेल में एक ही मान (खाली/0/सूत्र)'],
        ['ऊपर/बाएँ से भरना','<code>Ctrl+D</code> (Fill Down), <code>Ctrl+R</code> (Fill Right)','रेंज चुनकर करें तो पूरी रेंज भरती है — एक-एक फ़ॉर्म्युला दोबारा टाइप करने की ज़रूरत नहीं']
      ]},

    {type:'table', head:['सुविधा','कैसे चलाएँ','क्या-क्या (विवरण)'],
      rows:[
        ['<b>Fill (Series)</b>','<b>Fill handle</b> (सेल के नीचे-दाएँ कोने का काला +) खींचकर या Home → Fill → Series (<code>Alt, H, F, S</code>)','1,2,3 → क्रम; 2,4 → गुणक; तारीख़ → दिन/माह/वर्ष आगे; अंतिम मान/Step-to/Stop-value सेट; <b>Days/Weekdays/Months/Years</b> के विकल्प'],
        ['<b>Fill Series के प्रकार</b>','<b>Data → Fill → Series</b> → Type','<b>Linear</b> (समान जोड़: 5,10,15), <b>Growth/Geometric</b> (गुणा: 2,4,8), <b>Date</b> (क्रमशः दिन/महीना), <b>AutoFill</b> (पैटर्न/सप्ताह-दिन), <b>Date series</b> में Step = 1 weekday रखकर केवल कार्य-दिन भरें'],
        ['<b>Weekdays/Months का क्रम</b>','January → drag → February, March…','English के नाम/संक्षेप माने जाते हैं (<code>Mon, Tue…Jan…</code>); हिंदी नाम डिफ़ॉल्ट सीरीज़ में नहीं — Custom List बना लीजिए'],
        ['<b>Custom Lists</b>','File → Options → Advanced → General → <b>Edit Custom Lists</b>','"D1,D2,D3", "North,South,East,West", "Jan-Mar…" — टाइप करके drag करने पर क्रम चालू; Excel के डिफ़ॉल्ट सप्ताह/महीने भी यहीं दिखते हैं'],
        ['<b>Flash Fill</b>','<code>Ctrl+E</code> (या Data → Flash Fill)','पहली 1–2 सेल में नतीजा टाइप करें, फंक्शन-बार में Enter — Excel पैटर्न समझकर बाक़ी भर देता है। <b>उदाहरण:</b> <code>राम कुमार शर्मा</code> से प्रथम नाम, नाम का उलटा, मोबाइल से +91 जोड़ना, पिन-सिटी कोड'],
        ['Flash Fill की सीमा','—','<b>मान (value) बनाता है, सूत्र नहीं</b> — स्रोत बदलने पर नतीजा अपने आप नहीं बदलेगा; अस्पष्ट/बदलते पैटर्न पर फेल हो सकता है; तब <code>LEFT/TEXTSPLIT/</code> फ़ॉर्म्युला इस्तेमाल करें'],
        ['<b>Data Validation (एंट्री)</b>','Data → Data Validation (<code>Alt, A, V, V</code>)','पहली बार में ही Dropdown (List) बनाइए — ग़लत टाइप नहीं होगा; सेक्शन 10.2 में पूरा संवाद'],
        ['<b>Wrap Text</b>','Home → Wrap Text (<code>Alt, H, W</code>)','लंबा पता/नोट एक सेल में कई लाइन; पंक्ति-ऊँचाई अपने आप बढ़े; <code>Alt+Enter</code> से मनचाहा लाइन-ब्रेक'],
        ['<b>Shrink to fit</b>','Ctrl+1 → Alignment → Shrink to fit','सेल का आकार स्थिर, टेक्स्ट छोटा होकर एक लाइन में — रजिस्टर फ़ॉर्म में उपयोगी'],
        ['<b>Merge vs Center Across Selection</b>','Home → Merge (बचना है) / Ctrl+1 → Alignment → Horizontal → <b>Center Across Selection</b>','<b>डेटा वाले हिस्से में कभी Merge न करें</b>: रेंज चुनना, सॉर्ट, फ़िल्टर, सूत्र, Pivot व Copy सब बिगड़ते हैं। केवल <b>शीर्षक</b> के लिए Center Across Selection — दिखता वैसे ही, रहता अखंड']
      ]},

    {type:'table', head:['कमांड','रास्ता / शॉर्टकट','विवरण व सावधानी'],
      rows:[
        ['<b>Paste Special — Values</b>','<code>Ctrl+Alt+V</code> → Values (V) → OK','सूत्र हटाकर सिर्फ़ मान रखें; बड़ी फ़ाइल का आकार व स्थिर रिपोर्ट इसी से'],
        ['Values + Source Formatting / Keep Text Only','पेस्ट के बाद <b>Ctrl</b> दबाकर आइकन, या <code>Alt, H, V</code> मेन्यू; <code>Ctrl+Shift+V</code> (365) Paste Options गैलरी','Web से टेक्स्ट साफ़ करने के लिए Keep Text Only'],
        ['<b>Transpose</b>','Ctrl+Alt+V → Transpose (E) + Paste','पंक्ति↔कॉलम पलटें; 365 में <code>=TRANSPOSE(range)</code> डायनैमिक भी'],
        ['<b>Add / Subtract / Multiply / Divide</b>','Ctrl+Alt+V → Operations','एक कॉलम का 100 से गुणा करके पूरे कॉलम में लागू — कैलकुलेटर-सा काम एक बार में; <b>Operation कॉपी करना है तो पहले मान चुनें</b>'],
        ['<b>Skip Blanks</b>','Ctrl+Alt+V → Skip blanks (K) ','चिपकाते समय खाली सेल से ऊपर का मान न मिटे'],
        ['<b>Formats / Column widths / Comments</b>','Ctrl+Alt+V → Formats (T), Column Widths (8), Notes','सिर्फ़ फ़ॉर्मैट/चौड़ाई उतारना — डेटा न छेड़े'],
        ['<b>Linked picture</b>','Ctrl+Alt+V → Paste link + Picture (image icon)','शीट का दृश्य चित्र के रूप में; <b>डेटा बदलें तो चित्र भी बदलेगा</b> — PDF/वर्ड रिपोर्ट में तस्वीर लगाए रखने का तरीक़ा'],
        ['<b>AutoCorrect जाल</b>','File → Options → Proofing → AutoCorrect Options','<b>बदलता है:</b> <code>.com</code> → <code>।com</code> (भाषा के हिसाब से), <code>(c)</code> → ©, पहला अक्षर बड़ा, <code>teh</code>→the; <b>डेटा बिगाड़ता है:</b> टिकट कोड, कैटेगरी नाम। हल: वह जोड़ AutoList से हटाएँ, या सेल को Text प्रीफ़ॉर्मैट करके टाइप करें, या <code>=</code> नहीं — अपॉस्ट्रॉफी'],
        ['<b>AutoComplete</b>','उसी कॉलम में टाइप करते समय सुझाव; बंद करने के लिए Options → Advanced → "Enable AutoComplete for cell values"','एक-से नाम (City, Branch) दोबारा टाइप न करने पड़ें — लेकिन सूची के बाहर का नाम नहीं सुझाता; <code>Alt+↓</code> से उस कॉलम के मौजूदा मान'],
        ['<b>Format Painter</b>','Home → डबल-क्लिक करें','<b>एक बार</b> क्लिक = एक जगह; <b>डबल-क्लिक = बार-बार</b> लगाएँ, <code>Esc</code> से रुकें; <code>Ctrl+Shift+C</code> then <code>Ctrl+Shift+V</code> से फ़ॉर्मैट कॉपी-पेस्ट (टेक्स्ट नहीं)']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">4.1</span> सेल रेफरेंस — Excel का सबसे ज़रूरी सिद्धांत</h3>
      <p>फ़ॉर्म्युला कॉपी/फ़िल होते समय Excel रेफरेंस को कैसे खिसकाता है — यही <b>relative/absolute/mixed</b> है। पूछा यही जाता है: <code>$A$1</code> का अर्थ?</p>
      <ul>
        <li><b>A1 स्टाइल (डिफ़ॉल्ट):</b> <code>D7</code> = कॉलम D, पंक्ति 7। <code>R1C1 स्टाइल:</code> <code>R7C4</code> = पंक्ति 7, कॉलम 4 — Options → Formulas → <b>R1C1 reference style</b> से चालू/बंद। R1C1 में <b>R[-1]C[2]</b> "सापेक्ष" हो जाता है, इसलिए ITI स्तर पर A1 ही रखें, पर परीक्षा में नाम पूछा जा सकता है।</li>
        <li><b>$ चिह्न "लॉक" करता है</b> — जिस चीज़ के ठीक पहले <code>$</code> है, वही कॉपी पर हिलती नहीं।</li>
        <li><b>नोट (locale):</b> भारतीय English (India) सिस्टम में अलग-करने वाला चिह्न <b>कॉमा (,)</b> है; कई यूरोपीय/हिंदी locale में <b>सेमीकॉलन (;)</b>। बदलने के लिए File → Options → Advanced → <b>Use system separators</b>।</li>
      </ul>`},

    {type:'table', head:['प्रकार','लिखावट','कॉपी/फ़िल पर क्या होता है','कब इस्तेमाल'],
      rows:[
        ['<b>Relative</b>','<code>=A1*B1</code>','कॉलम भी, पंक्ति भी — जितना खिसकाएँ उतना बदलें','पंक्ति-दर-पंक्ति एक-सा काम (Total = Qty*Rate)'],
        ['<b>Absolute (column+row)</b>','<code>=$A$1*$B$1</code>','कुछ नहीं बदलता — सदा वही सेल','GST %, विनिमय दर, टैक्सबल, माप-दंड (constant cell)'],
        ['<b>Mixed — पंक्ति लॉक</b>','<code>=A$1*B1</code>','पंक्ति जस की तस, कॉलम बदलता','एक पंक्ति की दरों को नीचे पूरी टेबल में लागू'],
        ['<b>Mixed — कॉलम लॉक</b>','<code>=$A1*A2</code>','कॉलम जस की तस, पंक्ति बदलती','एक कॉलम की मात्रा को दाईं ओर पूरी टेबल में लागू'],
        ['<b>Mixed — दोनों लॉक</b>','<code>=$A2*B$1</code>','दोनों दिशा में एक-एक लॉक','10×10 गुणन-सारणी एक ही सूत्र से पूरी भरती है'],
        ['<b>Whole-column</b>','<code>=SUM(A:A)</code>','पूरा कॉलम (1,048,576 सेल)','सुविधाजनक पर <b>धीमा</b>; बड़ी फ़ाइल में <code>A2:A10000</code> या Table रेफरेंस बेहतर'],
        ['<b>3-D reference</b>','<code>=SUM(Sheet1:Sheet3!A1)</code>','एक-से स्थान पर कई शीटों का जोड़','महीने-दर-महीने अलग शीट → कुल एक शीट पर'],
        ['<b>Cross-sheet</b>','<code>=Jan!D5*2</code>, <code>=&#39;Sales Data&#39;!B2</code>','नाम में स्पेस/बिंदु हो तो <b>single quote</b> लगाएँ','शीटों में काम बाँटने पर; फ़ाइल बदलें तो link टूटता है (भाग 2)'],
        ['<b>Cross-workbook</b>','<code>=&#39;[budget.xlsx]Sheet1&#39;!$A$1</code>, पूर्ण पथ सहित <code>=&#39;C:\\Files\\[budget.xlsx]Sheet1&#39;!$A$1</code>','बाहरी फ़ाइल से मान; खोलते समय Update / Don&#39;t Update पूछता है','Master data; सावधानी-भरा — भाग 2 में विस्तार']
      ]},

    {type:'table', head:['F4 दबाने का क्रम (A1 से शुरू)','अर्थ','यह क्या लॉक करता है'],
      rows:[
        ['<code>A1</code> → F4 → <code>$A$1</code>','Absolute','कॉलम + पंक्ति दोनों — कहीं भी कॉपी करें, वही सेल'],
        ['F4 → <code>A$1</code>','Mixed','केवल <b>पंक्ति 1</b> लॉक; कॉलम खिसकता है'],
        ['F4 → <code>$A2</code>','Mixed','केवल <b>कॉलम A</b> लॉक; पंक्ति खिसकती है'],
        ['F4 → <code>A2</code>','Relative','वापस सामान्य'],
        ['रेंज पर: <code>A1:A10</code> → F4','<code>$A$1:$A$10</code>','पूरी रेंज लॉक — VLOOKUP की table_array <b>यही</b> होती है'],
        ['फ़ॉर्म्युले के <i>अंदर</i> चुनकर F4','केवल वही हिस्सा बदलता है','चयनित रेफरेंस पर ही असर — बाक़ी अनछुआ'],
        ['F4 का दूसरा काम','आख़िरी एंट्री/कमांड दोहराना','12 बार एक-सा फ़ॉर्मैट/मैनुअल ऑपरेशन एक-एक दबाकर नहीं — <code>F4</code> से दोहराएँ']
      ]},

    {type:'table', head:['रेफरेंस का रूप','उदाहरण','क्या मिलता है / कहाँ इस्तेमाल'],
      rows:[
        ['<b>Named range (workbook scope)</b>','Name Box में <code>Rate</code> लिखकर Enter, या <code>Ctrl+F3</code> (Name Manager) → New','<code>=Amount*Rate</code> — पठने-योग्य सूत्र; <b>Formulas → Define Name</b> से भी; स्कोप <b>Workbook</b> = किसी भी शीट से चलेगा'],
        ['<b>Named range (sheet scope)</b>','Name Manager में Scope = <b>Sheet1</b> चुनें','दो शीटों में एक-सा नाम अलग-अलग रेंज दे सकता है; उसी शीट में पहले वही चलेगा'],
        ['<b>Named constant/array</b>','Name Manager में Refers to = <code>0.18</code> या <code>{1,2,3}</code>','<code>=SUM(MyArray)</code>; टैक्स-दर एक जगह बदलें, पूरे वर्कबुक में बदल जाए'],
        ['<b>Table के संरचित रेफरेंस</b>','<code>=SUM(Table1[Salary])</code>, <code>=Table1[[#This Row],[Qty]]*[Rate]</code>','कॉलम नाम से रेफरेंस — पंक्तियाँ जोड़ें/घटाएँ, सूत्र अपने आप फैलता है; <b>Structural references</b> का यही जादू'],
        ['<b> spill range (#)</b>','<code>=UNIQUE(C2:C100)</code> ने A2:A9 भर दिया → <code>=SUM(A2#)</code>','<b>#</b> = "यहाँ से spill के अंत तक"; फ़िल्टर बदलें तो लंबाई अपने आप बदले — 365/2021+'],
        ['<b>spill की शर्तें</b>','—','नीचे-दाईं ओर की खाली जगह चाहिए; रुका तो <code>#SPILL!</code> — बाधा हटाएँ या <code>A2#</code> के बजाय सीधी रेंज दें'],
        ['<b>Used range</b>','<code>Ctrl+End</code>; Name Box में <code>=</code> नहीं, VBA में <code>UsedRange</code>','फ़ाइल "भारी" दिखे तो UsedRange देखें — एक बार Z1048576 तक फ़ॉर्मैट लगा दिया तो फ़ाइल कई MB की बन जाती है; साफ़: अनावश्यक पंक्ति/कॉलम Delete'],
        ['<b>INDIRECT से बनता रेफरेंस</b>','<code>=INDIRECT("Sheet"&B1&"!A1")</code>','नाम टेक्स्ट से जोड़कर पता बनाता है — dependent dropdown/महीना-शीट में; <b>volatile</b> (धीमा) — भाग 2']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">5.1</span> फ़ॉर्म्युला की बनावट (Formula Anatomy)</h3>
      <p>हर फ़ॉर्म्युला <b><code>=</code></b> से शुरू (पुरानी आदत के <code>+</code>, <code>-</code>, <code>@</code> भी चलते हैं, पर <code>=</code> मानक है)। बनावट: <code>=</code> + <b>operator/फंक्शन</b> + <b>operands</b> (संख्या, सेल-रेफरेंस, टेक्स्ट, तारीख़, दूसरा फंक्शन)।</p>
      <ul>
        <li><b>Enter</b> = पूरा करके नीचे; <b>Tab</b] = सूत्र के अंदर दाईं ओर; <b>F2</b] = सेल में edit (रेफरेंस रंग-कोड में दिखते हैं); <b>Esc</b> = बिना बदले बाहर; <b>Ctrl+Enter</b> = वही सेल में रहे; <b>Alt+=</b> = AutoSum अपने आप <code>=SUM()</code> जोड़ता है (नीचे/दाएँ संख्या देखकर)।</li>
        <li><b>Nesting:</b> एक फंक्शन के अंदर दूसरा — <code>=IF(SUM(C2:E2)&gt;=150,"Pass","Fail")</code>। Excel 64 स्तर तक nesting चलाता है, पर 3-4 से ज़्यादा पढ़ने-योग्य नहीं रहता — IFS/लेआउट बदलिए।</li>
        <li><b>Formula AutoComplete:</b> <code>=SU</code> टाइप करें → फंक्शन/नाम की सूची + संक्षिप्त syntax (तर्क-क्रम) tooltip; Tab से स्वीकारें। नाम के बाद <code>(</code> लगते ही help आ जाती है।</li>
        <li><b>Text joining:</b> <code>="नाम: "&A2&" ("&B2&")"</code> — & चिह्न जोड़ता है; खाली सेल से कुछ नहीं जुड़ेगा। <code>CONCAT(A2:A5)</code> (2019+) व <code>TEXTJOIN(", ",TRUE,A2:A5)</code> — delimiter व खाली-छोड़ने का काम एक लाइन में।</li>
        <li><b>तार्किक भाषा:</b> तुलना के चिह्न <code>= &lt; &gt; &lt;= &gt;= &lt;&gt;</code> TRUE/FALSE देते हैं; <code>AND/OR/NOT/XOR</code> उन्हें जोड़ते हैं; IF उसे नतीजे में बदलता है।</li>
        <li><b>Best practice:</b> <b>Hard-coding न करें</b> — <code>=A2*1.18</code> के बदले <code>=A2*$E$1</code> जहाँ E1 में 0.18 है। दर बदलनी हो तो एक सेल बदलिए, पूरी शीट सही।</li>
      </ul>`},

    {type:'table', head:['क्रम (precedence)','चिह्न','क्या','उदाहरण व नतीजा'],
      rows:[
        ['1 (सबसे पहले)','<code>:</code> &nbsp;<code>(space)</code> &nbsp;<code>,</code>','रेंज, Intersection, Union (reference operators)','<code>=SUM(A1:A5 C2:C4)</code> → सिर्फ़ दो रेंज का common भाग'],
        ['2','<code>-</code> (ऋणात्मक)','Negation','<code>=-A1</code>'],
        ['3','<code>%</code>','Percent (मान को 100 से भाग)','<code>=50%</code> → 0.5'],
        ['4','<code>^</code>','Exponent (घात)','<code>=2^3</code> → 8'],
        ['5','<code>*</code> <code>/</code>','गुणा, भाग (बाएँ से दाएँ)','<code>=12/4*3</code> → 9 (क्रम से, 12/12 नहीं)'],
        ['6','<code>+</code> <code>-</code>','जोड़, घटा (बाएँ से दाएँ)','<code>=1+2-3</code> → 0'],
        ['7','<code>&amp;</code>','Text concatenation','<code>="Ra"&"m"</code> → Ram'],
        ['8 (सबसे बाद में)','<code>= &lt; &gt; &lt;= &gt;= &lt;&gt;</code>','तुलना — TRUE/FALSE','<code>=1+2=3</code> → TRUE'],
        ['—','कोष्ठक <code>( )</code>','क्रम बदलने का एकमात्र सही तरीक़ा','<code>=(1+2)*3</code> → 9'],
        ['—','गोल-दोहराव का शिकार','Excel में <code>=-5^2</code> → <b>25</b> (पहले ऋण, फिर घात)','गणित की कक्षा से फ़र्क़ — परीक्षा-प्यारा सवाल'],
        ['—','<code>%</code> का चक्र','प्रतिशत को दर की तरह जोड़ना','% जोड़ने पर मान में <b>0.1</b> जुड़ता है: <code>=1000+10%</code> → <b>1000.1</b>; 10% बढ़ाना है तो <code>=1000*(1+10%)</code> → <b>1100</b>']
      ]},

    {type:'table', head:['त्रुटि (Error)','कारण (क्यों आता है)','समाधान'],
      rows:[
        ['<code>#DIV/0!</code>','0 पर भाग — हर हर (denominator) 0/खाली','<code>=IF(B2=0,0,A2/B2)</code> या <code>=IFERROR(A2/B2,0)</code>; हर सेल में खाली न छोड़ें'],
        ['<code>#N/A</code>','Lookup को मान नहीं मिला (VLOOKUP/XLOOKUP/MATCH/FILTER खाली)','<code>=IFERROR(VLOOKUP(…),"नहीं मिला")</code>; <code>=VLOOKUP(…,FALSE)</code> का आख़िरी arg; 365 में XLOOKUP का if_not_found'],
        ['<code>#NAME?</code>','फंक्शन का नाम ग़लत/स्पेस, या नया फंक्शन पुराने Excel में, या named range undefined','नाम जाँचें (<code>AVERAGE</code> न लिखें <code>AVE</code>); नया फंक्शन न चले तो VLOOKUP/INDEX-MATCH पर लौटें'],
        ['<code>#NULL!</code>','दो रेंज का common भाग नहीं — बीच में space ग़लत जगह','<code>=SUM(A1:A5 B7:B9)</code> वैध नहीं; अलग-अलग जोड़ें <code>=SUM(A1:A5)+SUM(B7:B9)</code>'],
        ['<code>#NUM!</code>','गणना असंभव — ऋण का SQRT, बहुत बड़ी घात, LOG(0)','मान जाँचें: <code>=SQRT(ABS(A1))</code>; IRR/RATE जैसी गणना converge न हो तो guess (अनुमान) बदलें'],
        ['<code>#REF!</code>','<b>रेफरेंस वाली सेल/पंक्ति/कॉलम डिलीट</b> — सबसे आम, डिलीट के बाद दिखता है','Ctrl+Z तुरंत; फिर से सही; बदलने के लिए <b>Clear All</b> या Cut-Insert इस्तेमाल करें, Row Delete नहीं'],
        ['<code>#VALUE!</code>','ग़लत प्रकार — टेक्स्ट में अंक जोड़ना, "12-05-2025" टेक्स्ट रहकर घटना','<code>VALUE()/--/DATEVALUE()</code> से बदलें; Text to Columns; TRIM साफ़ करे'],
        ['<code>#SPILL!</code>','365/2021+: array का नतीजा फैलने की जगह बाँधी गई (कोई सेल भरी/merged)','रास्ता खाली कीजिए, Merge हटाइए, या पहला सेल-पता देकर सीमित कीजिए <code>=LEFT(A1#,2)</code>'],
        ['<code>#CALC!</code>','Array का नतीजा खाली (FILTER में कोई मेल नहीं, या legacy array का calc असमर्थ)','<code>=IFERROR(FILTER(…),"कोई रिकॉर्ड नहीं")</code>; फ़िल्टर मान जाँचें'],
        ['<code>#GETTING_DATA</code>','बाहरी/लाइव डेटा (Stocks-Geography data type, WEBSERVICE, Power Query refresh) लोड हो रहा है','इंतज़ार कीजिए; Data → Query Options/Refresh All; ऑफ़लाइन/सुरक्षा बाधा देखें'],
        ['<code>######</code>','त्रुटि नहीं — कॉलम संकरा (तारीख़/बड़ा नंबर) या नकारात्मक तारीख़','दोहरी-क्लिक पर AutoFit; <code>Ctrl+A</code> के बाद <code>Alt, H, O, I</code>'],
        ['<code>0</code> हर जगह / सूत्र का नतीजा न बदलना','<b>Circular Reference</b> — सेल अपने ही हिसाब पर लौटती है','Formulas → Error Checking → Circular References; त्रुटि-बार में पंता दिखता है; Options → Formulas → <b>Enable iterative calculation</b> केवल ज़रूरत पर (अधिकतम बार 100, change 0.001)']
      ]},

    {type:'table', head:['जाँच (Audit) का औज़ार','रास्ता','क्या करता है — कब उपयोग'],
      rows:[
        ['<b>Trace Precedents</b>','Formulas → Trace Precedents','तीर दिखाता है: <b>इस सेल को कौन-कौन से सेल खिला रहे हैं</b>; दोबारा दबाएँ तो दूसरी शीट के भी'],
        ['<b>Trace Dependents</b>','Formulas → Trace Dependents','<b>यह सेल किन-किन सेलों को प्रभावित करता है</b> — बदलने से पहले जाँचें'],
        ['<b>Remove Arrows</b>','Formulas → Remove Arrows','तीर हटाएँ (सूत्र नहीं बदलते)'],
        ['<b>Show Formulas</b>','<code>Ctrl + `</code> (Formulas टैब से भी)','पूरी शीट में नतीजे की जगह सूत्र — कॉपी-चिपकी/ग़लत-$ पकड़ने का सबसे तेज़ तरीक़ा'],
        ['<b>Evaluate Formula</b>','Formulas → Evaluate Formula → <b>Evaluate</b>/<b>Step In</b>','फ़ॉर्म्युला को टुकड़ा-टुकड़ा हल दिखाए — लंबे nested IF/VLOOKUP की गड़बड़ी पकड़ें'],
        ['<b>F9 (अंदर)</b>','F2 से edit, गड़बड़ हिस्सा चुनें, <code>F9</code>','चुना हिस्सा तुरंत उसके मान में बदल जाता है — <b>Ctrl+Z</b> से वापस', 'जाँच के बाद कभी Enter न दबाएँ, वरना मान hard-code हो जाएगा'],
        ['<b>Error Checking</b>','Formulas → Error Checking / हरा त्रिभुज निशान','"Numbers stored as text", "Formula differs from neighbours", "Cell error" — suggestion देता है; <b>Options → Formulas → Error Checking rules</b> से नियम चालू/बंद'],
        ['<b>Watch Window</b>','Formulas → Watch Window','दूसरी शीट/खुली फ़ाइल के ज़रूरी सेलों का मान व सूत्र एक पैनल में — बड़ी मॉडल की निगरानी'],
        ['<b>सूत्र के बाद Values</b>','Copy → <code>Ctrl+Alt+V</code> → Values','Audit/बदलाव के बाद जमा-हुए नतीजे स्थिर करें (रिपोर्ट भेजने से पहले)'],
        ['<b>Calculation options</b>','Formulas → Calculation Options: Automatic / Automatic Except Tables / Manual; <code>F9</code> गणना','बड़ी फ़ाइल धीमी हो तो <b>Manual</b> + <code>Ctrl+Alt+F9</code> (पूरी पुनर्गणना)']
      ]},
    {type:'callout', kind:'exam', title:'परीक्षा में सबसे ज़्यादा पूछा जाने वाला फ़र्क़',
      html:'<b>फ़ॉर्म्युला</b> = कोई भी गणना जो <code>=</code> से शुरू, जैसे <code>=A2*B2+50</code>। <b>फंक्शन</b> = पहले से बनी, नाम-दी हुई गणना <code>SUM()</code>, <code>IF()</code> — फ़ॉर्म्युले के <i>अंदर</i> भी इस्तेमाल होता है। यानी <b>हर फंक्शन फ़ॉर्म्युला नहीं, हर फ़ॉर्म्युला फंक्शन नहीं</b>; <code>=SUM(A1:A5)*2</code> दोनों का मेल है। साथ में: <code>$A$1</code> = absolute reference, <code>F4</code> = lock toggle, <code>#REF!</code> = referenced cell deleted, <code>Alt+=</code> = AutoSum, <code>F2</code> = edit cell।'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">6.1</span> Number व Cell फ़ॉर्मैटिंग — दिखना बदलो, मान नहीं</h3>
      <p><b>मूल सिद्धांत:</b> Format केवल <b>दिखावट</b> बदलता है, सेल का <b>असली मान नहीं</b>। 1500 को <code>₹1,500.00</code> दिखाया तो भी गणना में 1500 ही चलेगा; <code>=A1&gt;1499</code> सही रहेगा। असली मान Formula Bar में दिखता है।</p>
      <p><b>रास्ते:</b> <code>Ctrl+1</code> → Number टैब (सब कुछ यहीं), Home टैब की Number/Styles ग्रुप, <code>Alt, H, K</code> से तेज़ फ़ॉर्मैट गैलरी (Number/Currency/Accounting/Date/Time/Percent/Fraction/Scientific/Text/Custom), <code>Ctrl+Shift+$ % # ^ ! @ ~</code> एक-एक फ़ॉर्मैट।</p>
      <p><b>Indian (lakh) comma system:</b> Excel का डिफ़ॉल्ट <code>#,##0</code> पश्चिमी समूह देता है — <code>12,34,567</code> नहीं। भारतीय हज़ार-लाख-crोड़ के लिए <b>Custom format</b> लगाएँ: <code>##,##,##0.00</code> या <code>##,##,##0</code> (1234567 → 12,34,567)। विकल्प 2: File → Options → Advanced → separators में <b>Thousands separator</b> व digit pattern बदलना, या Windows की regional setting "English (India)" — तब Accounting फ़ॉर्मैट भी लाख-शैली दिखाता है।</p>
      <p><b>पंक्ति-ऊँचाई/कॉलम-चौड़ाई:</b> Header किनारा खींचें; डबल-क्लिक = <b>AutoFit</b>; पूरी शीट: <code>Ctrl+A</code> के बाद <code>Alt, H, O, I</code> (AutoFit Column Width) व <code>Alt, H, O, A</code> (AutoFit Row Height)। <code>Alt, H, O, H</code> = Height संवाद, <code>Alt, H, W</code> = Width।</p>
      <p><b>छिपाना (Hide):</b> पंक्ति/कॉलम पर राइट-क्लिक → Hide, या <code>Ctrl+9</code>/<code>Ctrl+0</code>; Unhide = दोनों header चुनकर राइट-क्लिक → Unhide (<code>Ctrl+Shift+(</code> / <code>Ctrl+Shift+)</code>)। <b>शीट छिपाना:</b> tab राइट-क्लिक → Hide; दिखने के लिए किसी tab पर राइट-क्लिक → Unhide (सिर्फ़ <b>Hidden</b>, VeryHidden नहीं) — VBA/State = <code>xlSheetVeryHidden</code> से अत्यंत-गोपनीय।</p>
      <p><b>दिखावट के बाक़ी बटन:</b> View → Gridlines (स्क्रीन पर ज़रा-सी रेखाएँ; छपाई के लिए Page Layout → Sheet Options → Print "Gridlines" अलग बॉक्स है), View → <b>Dark Mode</b> (File → Options → General → Office Theme = Black/Dark Gray; केवल UI काला, सेल का Fill नहीं बदलता), View → <b>Page Layout View</b> (पेज-ब्रेक व header/footer दिखते हुए काम), View → Normal, Page Break Preview (<code>Alt, W, B, I</code>)।</p>`},

    {type:'table', head:['Format का नाम / कोड','क्या दिखता है','कब/क्यों'],
      rows:[
        ['<b>General</b>','जैसा टाइप किया वैसा; बहुत बड़ा/छोटा होने पर scientific','डिफ़ॉल्ट; फ़िक्स-साइज़ रिपोर्ट में ठीक नहीं'],
        ['<code>0</code>','पूर्णांक, दशमलव गोल होकर','गिनती, मात्रा, स्टॉक'],
        ['<code>#,##0</code>','1234567 → 1,234,567 (पश्चिमी समूह)','बड़ी रक़में पढ़ने-योग्य'],
        ['<code>##,##,##0</code>','1234567 → <b>12,34,567</b> (lakh शैली)','भारतीय हिसाब-किताब'],
        ['<code>0.00</code>','हमेशा 2 दशमलव (1500 → 1500.00)','दर/रेट जहाँ ज़ीरो दिखना ज़रूरी'],
        ['<code>#,##0.00</code>','समूह + 2 दशमलव','बiller/ग्राहक-Statement'],
        ['<code>0.0%</code> / <code>#,##0.00%</code>','मान को 100 से गुणा करके %','0.157 → 15.7% — % फ़ॉर्मैट सेल का मान नहीं बदलता'],
        ['<code>₹#,##0.00</code> / <code>[$₹-hi-IN]#,##0.00</code>','चिह्न-सहित रुपये; locale-सहित सही दिखता है','आधिकारिक भारत-रिपोर्ट; Currency format में Symbol = ₹/English (India) चुनें'],
        ['<code>dd-mm-yyyy</code> / <code>[$-409]mmm-dd-yyyy</code>','05-01-2025 / Jan-05-2025','तारीख़ के साक्ष्य — भ्रम-रोकने के लिए dd-mm-yyyy या dmmm-yyyy'],
        ['<code>dddd, dd mmmm, yyyy</code>','Monday, 05 January, 2025 (long date)','पत्र/सर्टिफ़िकेट'],
        ['<code>hh:mm AM/PM</code> / <code>h:mm:ss.0</code>','02:30 PM / 14:30:05.3','समय; millisecond भी दिख सकता है'],
        ['<code>h:mm (time text)</code>','<code>=TEXT(A1,"hh:mm")</code> से <b>टेक्स्ट</b> समय','छपाई/कॉपी-पेस्ट में समय स्थिर रखना हो'],
        ['<code># ?/?</code> / <code># ??/??</code>','1.5 → 1 1/2 (Fraction)','बेकिंग/लंबाई/अंश वाले काम'],
        ['<code>0.00E+00</code>','Scientific — 1.23E+09','विज्ञान/बहुत बड़े आँकड़े'],
        ['<code>@</code>','Text — जो टाइप किया वही (0500 → 0500)','रोल नंबर, कोड, फ़ोन (अपॉस्ट्रॉफी का वैकल्पिक रास्ता)'],
        ['<code>0000</code>','4 अंक, आगे शून्य भरकर','PIN, कोड, वर्ष'],
        ['<code>Accounting</code>','चिह्न एक जगह संरेखित, ऋण कोण ( ) में','लेजर/बैलेंस-शीट दिखने-योग्य'],
        ['<code>True/False</code>, <code>Yes/No</code>, <code>On/Off</code>','Boolean के लिए list validation + फ़ॉर्मैट','छपा-भरा फ़ॉर्म; Conditional formatting से रंग']
      ]},

    {type:'table', head:['Custom Format Code','नतीजा (इनपुट → दिखेगा)','क्या हो रहा है'],
      rows:[
        ['<code>0.00</code>','1500 → <b>1500.00</b>','दो दशमलव हमेशा'],
        ['<code>0.00,,</code>','12500000 → <b>12.50</b>','हर कॉमा = 1000 से भाग; दो कॉमा = <b>crore/लाख हज़ार</b> (million scale) — बड़ी रिपोर्ट में "₹ करोड़ में"'],
        ['<code>#,##0.0, "K"</code>','25000 → <b>25.0 K</b>','एक कॉमा = हज़ार; text जोड़कर इकाई'],
        ['<code>"₹"#,##0.00</code>','1234.5 → <b>₹1,234.50</b>','चिह्न manually (उचित कोड है <code>[$₹-hi-IN]</code>)'],
        ['<code>[$₹-hi-IN]#,##0.00</code>','1234.5 → <b>₹1,234.50</b>','locale-सहित currency — सबसे मानक'],
        ['<code>##,##,##0.00</code>','1234567.5 → <b>12,34,567.50</b>','Indian lakh समूह'],
        ['<code>0.0%;[Red](0.0%);"-"</code>','0.05 → <b>5.0%</b>, −0.05 → <b>(5.0%)</b> लाल, 0 → <b>-</b>','चार खंड: <b>positive;negative;zero;text</b>'],
        ['<code>#,##0 ;[Red](#,##0) ;"-"</code>','ऋण लाल कोष्ठक में, शून्य डैश','बहीखाता शैली — बिना Conditional formatting'],
        ['<code>00000</code>','1234 → <b>01234</b>','PIN/कोड में आगे शून्य (मान संख्या रहे, दिखे 5 अंक)'],
        ['<code>0000000000</code>','9876543210 → ठीक 10 अंक','मोबाइल नंबर; अंतर्राष्ट्रीय शैली चाहिए तो मान <code>+910000000000</code> की तरह पाठ रखें'],
        ['<code>00-000-000</code>','12345678 → <b>12-345-678</b>','कोड पैटर्न में बाँटना'],
        ['<code>[h]:mm</code>','36:30 (1 दिन 12 घंटे)','24 घंटे से ज़्यादा समय — साधारण hh:mm 1.5 दिन का नहीं दिखा पाता'],
        ['<code>ddddd</code> / <code>mmmmm</code>','सिस्टम की long date / महीने का नाम','छोटा रास्ता; <code>mmm</code>=Jan, <code>mmmm</code>=January'],
        ['<code>yyyy "वर्ष" q</code>','2025 वर्ष 1','तारीख़ में पाठ जोड़ना'],
        ['<code>_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)</code>','यही <b>Accounting</b> फ़ॉर्मैट का कोड: शून्य पर डैश, ऋण कोष्ठक में, चिह्न कॉलम में संरेखित','<code>*</code> = fill character (खाली जगह भरता है), <code>_</code> = एक अक्षर-चौड़ाई का space'],
        ['<code>????-????</code>','पाठ को 4-4 में बाँटकर स्पेस-भराई','कोड/पैटर्न दिखाना; <code>?</code> = केवल अक्षर के लिए जगह'],
        ['<code>[&lt;60]0.0;[&gt;=60]0.0" (acche)"</code>','45 → <b>45.0</b>, 72 → <b>72.0 (acche)</b>','<b>शर्त फ़ॉर्मैट कोड में चलती है</b> — पर अधिकतम <b>2 शर्तें</b>; उससे ज़्यादा/रंग चाहिए तो Conditional formatting या <code>=IF()</code>'],
        ['<code>0 "दिवस"</code>','45 → <b>45 दिवस</b>','अनुभव/उम्र के कॉलम में इकाई'],
        ['<code>;;0_);(@</code>','शून्य छिपाएँ, शून्य से कम कोण में','<code>;;</code> = positive व negative खंड खाली — बहुत काम का नुक्ता']
      ]},
    {type:'callout', kind:'tip', title:'Custom format की सीमा — जो नई सोच का शिकार करता है',
      html:'एक कोड में <b>चार खंड</b> होते हैं: <code>positive;negative;zero;text</code>। तीन खंड लिखें तो text वाला हिस्सा स्वतः <code>@</code> रहता है। यह <b>मान नहीं बदलता</b> — <code>0.00,,</code> वाला 12.50 दिखने पर <code>=A1*2</code> का नतीजा 25,000,000 ही रहेगा। इसलिए जो कॉलम बाद में जोड़ा/तुलना/चार्ट में जाएगा, उसे <b>सादी संख्या</b> रखिए; सजावट <b>प्रिंट-रिपोर्ट कॉलम</b> में कीजिए।'},

    {type:'table', head:['सुरक्षा की परत','कहाँ से','क्या रोकती है','क्या नहीं रोकती'],
      rows:[
        ['<b>Protect Sheet</b>','Review → Protect Sheet (<code>Alt, R, P, S</code>)','सिर्फ़ <b>Locked</b> सेल (डिफ़ॉल्ट सभी) छेड़े नहीं जा सकेंगे; चुनने-भरने/formatter के विकल्प टिक से तय; पासवर्ड वैकल्पिक','फ़ाइल खोलने/कॉपी/सcreenshots; दूसरी शीट से रेफर कर बदलना (रूपांतरण नहीं रोकता)'],
        ['<b>Cell Locking का सिद्धांत</b>','Ctrl+1 → Protection → <b>Uncheck Locked</b> जहाँ एंट्री चाहिए','इनपुट सेल खुले, फ़ॉर्म्युले वाले Locked → <b>फ़ॉर्म रजिस्टर</b> का असली तरीक़ा','Protection ON किए बिना Locked का कोई असर नहीं — यही 90% लोगों की भूल है'],
        ['<b>Formula छिपाकर input</b>','Locked + <b>Hidden</b> दोनों टिक → Protect Sheet','सूत्र Formula Bar में भी नहीं दिखेगा; सेल चुना जा सकता है, बदला नहीं','सच-छिपाव नहीं — पासवर्ड/दूसरे तरीक़े से निकाला जा सकता है'],
        ['<b>Protect Workbook</b>','Review → Protect Workbook → Structure','शीट डिलीट/नाम/रंग/क्रम/कॉपी नहीं','सेल का डेटा (वह Protect Sheet का काम)'],
        ['<b>Password to open / modify</b>','File → Save As → Tools → General Options','फ़ाइल खोलना / बचाने पर सूचना','—'],
        ['<b>Mark as Final / Encrypt / Signature</b>','File → Info → Protect Document → Mark as Final, Encrypt Password, Add a Digital Signature','बदलाव के बाद चेतावनी; एन्क्रिप्शन सच में मज़बूत','Mark as Final असली सुरक्षा नहीं — तुरंत हटाया जा सकता है'],
        ['<b>Allow Edit Ranges</b>','Review → Allow Users to Edit Ranges','कुछ लोगों/श्रेणी को ही कुछ हिस्से बदलने दें; पासवर्ड-वाले range','नेटवर्क-आधारित अधिकारी (यह Windows/SharePoint का काम)'],
        ['<b>Information Rights Management</b>','File → Info → Protect → Restrict Access (365 ProPlus + Azure IRM)','कॉपी/प्रिंट/फ़ॉरवर्ड पर नियंत्रण','सरल पासवर्ड नहीं; सेटअप प्रबंधन चाहिए']
      ]},
    {type:'callout', kind:'warn', title:'पासवर्ड की असली बात — ज़रूरी, कड़वा, सच',
      html:'<b>(1)</b> Protect Sheet/Workbook का पासवर्ड <b>दुर्घटना-रोकथाम</b> है, सुरक्षा नहीं — पुराने वर्ज़नों में तो कुछ सेकंड में हट जाता था; आज भी खुली फ़ाइल के XML बदलकर हटाया जा सकता है। <b>(2)</b> <b>Password to open</b> (एन्क्रिप्शन, 2007+ में AES-256) सच में सुरक्षित है — पर वह भी कमज़ोर पासवर्ड पर brute-force कर सकता है। <b>(3)</b> <b>पासवर्ड भूलने पर कोई सरकारी/official "unlock" सेवा नहीं</b> है — डेटा खोने का खतरा; इसलिए पासवर्ड एक जगह दर्ज रखिए। <b>(4)</b> सनद: VBA project का पासवर्ड कोड पढ़ने से रोकता है, .xlsm को चलाने से नहीं। <b>(5)</b> असली सुरक्षा = <b>फ़ाइल सिस्टम का अधिकार, एन्क्रिप्टेड ड्राइव/BitLocker, OneDrive/SharePoint permissions और बैकअप</b>।'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">7.1</span> कोर फंक्शन लाइब्रेरी — तैयार डेटा पर</h3>
      <p>नीचे की तालिकाएँ <b>दो एक-से नमूना डेटा सेट</b> पर लिखी हैं — परीक्षा/लैब में यही मान डालकर अभ्यास कीजिए। फ़ॉर्म्युले <b>जैसे टाइप होते हैं वैसे</b> (कॉमा separator; आपके locale में <code>;</code> माँगे तो <code>;</code> डालें)।</p>
      <p><b>शीट "Marks" (A1:H11)</b> — A Roll, B Name, C Hindi, D English, E Maths, F Total, G Percent, H Grade। पंक्ति 2: <code>1, अमिता, 78, 66, 92</code> · पंक्ति 3: <code>2, बोबान, 45, 51, 38</code> · पंक्ति 4: <code>3, कविता, 90, 88, 74</code> … कुल 10 विद्यार्थी (पंक्ति 2–11)।<br>
      <b>शीट "Sales" (A1:G41)</b> — A Date, B Month, C Salesman, D Region, E Qty, F Rate, G Amount (<code>=E2*F2</code>)। उदाहरण पंक्ति 2: <code>05-01-2025, Jan, रमेश, North, 3, 1500, 4500</code> · पंक्ति 3: <code>07-01-2025, Jan, सुनीता, South, 2, 2500, 5000</code>।</p>
      <p><b>तर्क (argument) पढ़ने का नियम:</b> वर्ग कोष्ठक <code>[ ]</code> = वैकल्पिक तर्क; नीले आइकन = संख्या, <code>"…"</code> = पाठ, नाभ = रेंज। Syntax tooltip फंक्शन के बाद <code>(</code> लगाते ही दिख जाता है; <code>Ctrl+A</code> (फंक्शन के अंदर) = Function Arguments संवाद।</p>`},

    {type:'table', head:['फंक्शन (Syntax)','क्या करती है','उदाहरण','नतीजा'],
      rows:[
        ['<code>SUM(number1,[number2]…)</code>','रेंज/मानों का जोड़ — तर्क अधिकतम 255','<code>=SUM(C2:E2)</code>','236 (Marks की पंक्ति 2)'],
        ['<code>SUMIF(range,criteria,[sum_range])</code>','एक शर्त पर जोड़','<code>=SUMIF(Sales!D2:D41,"North",Sales!G2:G41)</code>','केवल North क्षेत्र की बिक्री का जोड़'],
        ['<code>SUMIFS(sum_range,criteria_range1,criteria1,…)</code>','बहुत-शर्तों का जोड़ — <b>पहला तर्क sum_range</b> (SUMIF से उलटा)','<code>=SUMIFS(Sales!G2:G41,Sales!D2:D41,"North",Sales!B2:B41,"Jan")</code>','Jan + North की बिक्री'],
        ['<code>SUMPRODUCT(array1,array2,…)</code>','गुणकर जोड़ — शर्तों पर भी जोड़ (बिना helper कॉलम)','<code>=SUMPRODUCT((Sales!D2:D41="North")*(Sales!G2:G41))</code>','ऊपर वाले SUMIFS जैसा नतीजा; पुराने Excel में काम का रास्ता'],
        ['<code>ROUND(number,num_digits)</code>','मानक गोल (0.5 ऊपर)','<code>=ROUND(15.456,2)</code>','15.46; <code>=ROUND(15.455,2)</code> = 15.46; <code>num_digits</code> ऋण = दहाई/सैकड़ा गोल'],
        ['<code>ROUNDUP / ROUNDDOWN</code>','हमेशा ऊपर / हमेशा नीचे गोल','<code>=ROUNDUP(15.411,1)</code>','15.5; ROUNDDOWN = 15.4'],
        ['<code>MROUND(number,multiple)</code>','निकटतम गुणक पर गोल','<code>=MROUND(23,5)</code>','25; <code>=MROUND(22,5)</code> = 20 — किराया/राउंड-ऑफ़ के काम'],
        ['<code>CEILING(number,significance)</code>','ऊपर की ओर गुणक तक (नकारात्मक पर sign का ध्यान)','<code>=CEILING(23,5)</code>','25; <code>CEILING.MATH(23,5)</code> वही, तर्क सरल'],
        ['<code>FLOOR(number,significance)</code>','नीचे की ओर गुणक तक','<code>=FLOOR(23,5)</code>','20; <code>FLOOR.MATH</code> नए वर्ज़न में'],
        ['<code>INT(number)</code>','नीचे की ओर पूर्णांक (ऋण में फ़र्क़)','<code>=INT(-2.3)</code>','<b>-3</b>; <code>=TRUNC(-2.3)</code> = <b>-2</b> — यही अक्सर पूछा जाता है'],
        ['<code>TRUNC(number,[num_digits])</code>','बिना गोल काटे','<code>=TRUNC(15.99)</code>','15'],
        ['<code>MOD(number,divisor)</code>','भागशेष (remainder)','<code>=MOD(23,5)</code>','3; <code>=MOD(23,0)</code> → <code>#DIV/0!</code>; बड़े काम: हर 5वें दिन/सम-विषम पहचान'],
        ['<code>ABS(number)</code>','निरपेक्ष मान','<code>=ABS(-1250)</code>','1250 — ऋण/शोध (difference) के लिए'],
        ['<code>SIGN(number)</code>','−1 / 0 / +1','<code>=SIGN(G5-F5)</code>','लाभ/हानि की सिर्फ़ दिशा; शून्य पर शून्य'],
        ['<code>POWER(num,power)</code> / <code>^</code>','घात','<code>=POWER(2,10)</code>','1024; वही <code>=2^10</code>'],
        ['<code>SQRT(number)</code> / <code>SQRTPI</code>','वर्गमूल','<code>=SQRT(144)</code>','12; ऋण → <code>#NUM!</code>'],
        ['<code>SUMSQ(number1,…)</code>','वर्गों का जोड़','<code>=SUMSQ(3,4)</code>','25 — RMS/त्रिज्या जैसे काम'],
        ['<code>PRODUCT(num1,num2,…)</code>','गुणनफल','<code>=PRODUCT(E2:F2)</code>','4500 (Qty×Rate); चयनित सभी संख्याओं का गुणा एक सूत्र में'],
        ['<b>सीधे तर्क vs रेंज</b>','यह फ़र्क़ परीक्षा में पूछा जाता है','<code>=SUM(1,2,"3",TRUE)</code> बनाम <code>=SUM(A1:A4)</code>, जहाँ A3 में "3" पाठ है','पहला → <b>6</b> (तर्क-रूप का पाठ/Boolean जुड़ता है); दूसरा → पाठ वाली सेल <b>छूट</b> जाती है (0 मानी जाती है)'],
      ]},

    {type:'table', head:['फंक्शन (Syntax)','क्या करती है','उदाहरण','नतीजा / नोट'],
      rows:[
        ['<code>RAND()</code>','0 से 1 के बीच दशमलव; <b>हर गणना पर नया</b> (volatile)','<code>=RAND()</code>','0.4821… — स्थिर रखने के लिए Copy → Paste Values'],
        ['<code>RANDBETWEEN(bottom,top)</code>','पूर्णांक यादृच्छिक','<code>=RANDBETWEEN(1,50)</code>','1–50; लॉटरी/प्रैक्टिकेड रोल नंबर बनाने में'],
        ['<code>SEQUENCE(rows,[columns],[start],[step])</code>','क्रम की सूची अपने आप','<code>=SEQUENCE(12)</code>, <code>=SEQUENCE(5,2,1,1)</code>','1…12 spill; <b>365/2021+</b>'],
        ['<code>SUBTOTAL(function_num,ref1,…)</code>','<b>फ़िल्टर के बाद</b> दिख रहे मानों का काम; 1-11 = AVERAGE..STDEV, 101-111 = वही + छिपे हुए को भी छोड़','<code>=SUBTOTAL(9,C2:C11)</code>','9 = SUM (filter-छूटे नहीं गिनते); <code>109</code> = SUM, manually-hidden भी छोड़े; 101 = AVERAGE… <b>परीक्षा-प्यारा</b>'],
        ['<code>AGGREGATE(function_num,options,array,[k])</code>','SUBTOTAL + errors नज़रअंदाज़ + LARGE/SMALL/percentile','<code>=AGGREGATE(14,6,Sales!G2:G41,3)</code>','त्रुटियाँ छोड़कर <b>3रा बड़ा</b> मान; option 6 = errors ignore, 7 = errors + hidden ignore'],
        ['<code>AGGREGATE</code> के function_num','<b>1</b> AVERAGE, <b>2</b> COUNT, <b>3</b> COUNTA, <b>4</b> MAX, <b>5</b> MIN, <b>6</b> PRODUCT, <b>7</b> STDEV.S, <b>8</b> VAR.S, <b>9</b> SUM, <b>10</b> VAR.P, <b>11</b> STDEV.P, <b>12</b> MEDIAN, <b>13</b> MODE.SNGL, <b>14</b> LARGE, <b>15</b> SMALL, <b>16</b> PERCENTILE.EXC, <b>17</b> QUARTILE.EXC, <b>18</b> PERCENTILE.INC, <b>19</b> QUARTILE.INC','options: <b>6</b> = errors छोड़ दें, <b>7</b> = errors + छिपी पंक्तियाँ','14–19 के लिए चौथा तर्क <b>k</b> अनिवार्य — SUBTOTAL में यह नहीं है'],
        ['<code>SUMIF/SUMIFS</code> के criteria रूप','शर्त text में, operator जोड़कर','<code>=SUMIFS(G2:G41,A2:A41,"&gt;="&DATE(2025,1,1),A2:A41,"&lt;="&DATE(2025,1,31))</code>','महीने की बिक्री; <code>"&gt;"&amp;D1</code> सेल-शर्त, <code>"*रम*"</code> wildcard, <code>"&lt;&gt;North"</code> अलग'],
        ['<code>SUMPRODUCT((cond1)*(cond2)*values)</code>','पुराने Excel में बहु-शर्त; तारीख़/लंबे फ़िल्टर पर भी','<code>=SUMPRODUCT((MONTH(A2:A41)=1)*(D2:D41="North")*G2:G41)</code>','<b>धीमा</b> — बड़ी शीट में SUMIFS बेहतर (भाग 2)']
      ]},

    {type:'table', head:['फंक्शन (Syntax)','क्या करती है','उदाहरण','नतीजा / नोट'],
      rows:[
        ['<code>AVERAGE(number1,…)</code>','माध्य (mean); खाली सेल छोड़ता है, 0 गिनता है','<code>=AVERAGE(C2:E2)</code>','78.67 — अंतर समझें: खाली ≠ 0'],
        ['<code>AVERAGEIF(range,criteria,[avg_range])</code>','एक शर्त पर औसत','<code>=AVERAGEIF(Sales!D2:D41,"North",Sales!G2:G41)</code>','North का औसत ऑर्डर'],
        ['<code>AVERAGEIFS(avg_range,cr1,c1,…)</code>','बहुत-शर्तों पर औसत','<code>=AVERAGEIFS(G2:G41,D2:D41,"North",B2:B41,"Jan")</code>','शर्त: सभी मान दिए जाएँ वरना <code>#DIV/0!</code>'],
        ['<code>MEDIAN(…)</code>','मध्यक — चरम मानों से प्रभावित नहीं','<code>=MEDIAN(C2:C11)</code>','"औसत सैलरी" रिपोर्ट में MEDIAN ज़्यादा सच बताता है'],
        ['<code>MODE.SNGL</code> / <code>MODE.MULT</code>','सर्वाधिक बार आया मान','<code>=MODE.SNGL(C2:C11)</code>','कोई repeat नहीं → <code>#N/A</code> (पुराना <code>MODE</code> अब legacy)'],
        ['<code>MAX / MIN / LARGE / SMALL</code>','सबसे बड़ा/छोटा/nवाँ','<code>=LARGE(C2:C11,2)</code>','दूसरा सर्वोच्च; <code>=SMALL(C2:C11,3)</code> तीसरा निम्नतम'],
        ['<code>COUNT(value1,…)</code>','केवल <b>संख्या/तारीख़</b> की गिनती','<code>=COUNT(C2:E11)</code>','30 (टेक्स्ट व खाली नहीं)'],
        ['<code>COUNTA(range)</code>','<b>non-blank</b> गिनती — space/""/0 भी गिने','<code>=COUNTA(B2:B11)</code>','10; <code>""</code> वाले सूत्र भी गिने जाते हैं — यही फँसाता है'],
        ['<code>COUNTBLANK(range)</code>','खाली + <code>""</code> दोनों गिनता है','<code>=COUNTBLANK(B2:B20)</code>','10 (11–20 खाली)'],
        ['<code>COUNTIF(range,criteria)</code>','एक शर्त की गिनती','<code>=COUNTIF(C2:C11,"&gt;=60")</code>','pass संख्या; <code>=COUNTIF(B2:B11,"*शर्मा")</code> wildcard'],
        ['<code>COUNTIFS(cr1,c1,cr2,c2,…)</code>','बहुत-शर्तों की गिनती (range पहले, criteria जोड़े में)','<code>=COUNTIFS(D2:D41,"North",B2:B41,"Jan")</code>','Jan में North के ऑर्डर की संख्या'],
        ['<code>RANK(number,ref,[order])</code> / <code>RANK.EQ</code> / <code>RANK.AVG</code>','स्थान; 0/छोड़ा = बड़े-से-बड़ा, 1 = छोटे-से-छोटा','<code>=RANK.EQ(F2,$F$2:$F$11)</code>','कुल अंक में रैंक; <b>बराबरी पर समान रैंक</b> (RANK.AVG औसत देता है)'],
        ['<code>STDEV.S</code> / <code>STDEV.P</code>','विचलन — नमूना / पूरी आबादी','<code>=STDEV.S(C2:C11)</code>','नतीजे का "फैलाव"; <code>STDEV</code>=<code>STDEV.S</code> का पुराना नाम'],
        ['<code>VAR.S / VAR.P</code>','प्रसरण (variance) = STDEV का वर्ग','<code>=VAR.S(C2:C11)</code>','छोटा variance = मान एक-से; <b>STDEV.P = square root of VAR.P</b>'],
        ['<code>CORREL(array1,array2)</code>','सहसंबंध −1 से +1','<code>=CORREL(C2:C11,E2:E11)</code>','0.78 → हिन्दी-गणित अंक साथ चलते हैं; सहसंबंध = कारण नहीं'],
        ['<code>PERCENTILE.INC(array,k)</code> / <code>.EXC</code>','kवीं शतमान-विभाजक (0 से 1)','<code>=PERCENTILE.INC(F2:F11,0.9)</code>','टॉप 10% का कट-ऑफ़; <code>QUARTILE.INC(F2:F11,3)</code> = Q3'],
        ['<code>FREQUENCY(data_array,bins)</code>','श्रेणियों में गिनती (array)','<code>=FREQUENCY(F2:F11,{59,69,79,89,100})</code>','36–59/60–69/… का वितरण; पुराने Excel में <b>Ctrl+Shift+Enter</b>'],
        ['<code>TRIMMEAN(array,percent)</code>','चरम काटकर औसत (ऊपर-नीचे से percent)','<code>=TRIMMEAN(F2:F11,0.2)</code>','10% सबसे अच्छे + 10% सबसे ख़राब छोड़कर औसत — जज/स्कोरिंग में उपयोगी']
      ]},

    {type:'table', head:['फंक्शन (Syntax)','क्या करती है','उदाहरण','नतीजा / नोट'],
      rows:[
        ['<code>TODAY()</code>','आज की तारीख़ (समय नहीं) — <b>volatile</b>','<code>=TODAY()</code>','06-11-2026; स्थिर तारीख़ चाहिए तो <code>Ctrl+;</code>'],
        ['<code>NOW()</code>','तारीख़ + समय दोनों','<code>=NOW()</code>','06-11-2026 14:35; हर बदलाव/गणना पर नया'],
        ['<code>DATE(year,month,day)</code>','तीन अलग मानों से सही date बनाना','<code>=DATE(2025,1,5)</code>','05-01-2025 — <b>यही सबसे सुरक्षित</b>; महीने 13/दिन 32 हो तो अगले वर्ष/माह में घूम जाता है (उपयोगी भी)'],
        ['<code>YEAR / MONTH / DAY</code>','भाग निकालना','<code>=YEAR(A2)</code>, <code>=MONTH(A2)</code>, <code>=DAY(A2)</code>','2025 / 1 / 5 — महीने-वार Pivot से पहले helper कॉलम के लिए'],
        ['<code>HOUR / MINUTE / SECOND</code>','समय के भाग','<code>=HOUR(B2)</code>','14; shift-wise बिलिंग/कंट्रोल-रूम रिपोर्ट'],
        ['<code>WEEKDAY(serial,[return_type])</code>','दिन का क्रमांक','<code>=WEEKDAY(A2,2)</code>','return_type <b>1</b> = रवि 1 … शनि 7 (डिफ़ॉल्ट); <b>2</b> = सोम 1 … रवि 7; <b>3</b> = 0–6; <b>11–17</b> = किसी भी दिन को 1 बनाएँ; <b>21–33</b> = ISO/European शैली'],
        ['<code>WEEKNUM(date,[type])</code>','साल का कौन-सा हफ़्ता','<code>=WEEKNUM(A2,21)</code>','type 21 = ISO 8601 (सोम-शनि, पहले Thursday वाले हफ़्ते को हफ़्ता 1); डिफ़ॉल्ट 1 = रवि से, max 52/53'],
        ['<code>EOMONTH(start,months)</code>','महीने का अंतिम दिन; ऋण = पीछे','<code>=EOMONTH(A2,0)</code>, <code>=EOMONTH(A2,-1)</code>','31-01-2025, 31-12-2024 — <b>बिलिंग/पावती की due date</b> बनाने का मानक सूत्र'],
        ['<code>EDATE(start,months)</code>','बिलकुल वही दिन, महीने आगे-पीछे','<code>=EDATE(A2,3)</code>','05-04-2025 — किराया, insurance, AMc/बॉन्ड की maturity'],
        ['<b>तीनों का फ़र्क़</b>','—','<code>=EOMONTH(TODAY(),0)</code> बनाम <code>=EDATE(TODAY(),1)</code>','EOMONTH = महीने का अंत; EDATE = वही तारीख़ + महीने; DATE + 0 दिन = सादा जोड़ (<code>=A2+15</code>)'],
        ['<code>DATEVALUE(text)</code>','तारीख़-जैसा <b>पाठ</b> → असली date संख्या','<code>=DATEVALUE(\"05-01-2025\")</code>','45664; CSV/मोबाइल से आए text date को ठीक करने का पहला क़दम (locale पर निर्भर)'],
        ['<code>TIMEVALUE(text)</code>','समय-जैसा पाठ → अंश (fraction)','<code>=TIMEVALUE(\"14:30\")</code>','0.60416… = दिन का हिस्सा'],
        ['<code>TIME(hour,minute,second)</code>','समय बनाना','<code>=TIME(9,30,0)</code>','09:30 (0.395833 भीतर)']
      ]},

    {type:'table', head:['फंक्शन (Syntax)','क्या करती है','उदाहरण','नोट / सावधानी'],
      rows:[
        ['<code>DATEDIF(start,end,unit)</code>','<b>पूरे-काम के लिए छिपाया गया (undocumented)</b> — Excel में चलती है, IntelliSense/F1 help नहीं दिखाती; परीक्षा/इंटरव्यू में पूछी जाती है','<code>=DATEDIF(DOB,TODAY(),\"Y\")</code>','unit: <b>\"Y\"</b> पूरे वर्ष, <b>\"M\"</b> पूरे महीने, <b>\"D\"</b> दिन, <b>\"MD\"</b> बचे दिन, <b>\"YM\"</b> बचे महीने, <b>\"YD\"</b> (start को छोड़कर) दिन; start&gt;end हो तो <code>#NUM!</code>'],
        ['<code>DAYS(end,start)</code>','दो तारीख़ों के बीच दिन (क्रम सावधान)','<code>=DAYS(A2,B2)</code>','= end − start; पुराना <code>=A2-B2</code> वही देता है'],
        ['<code>DAYS360(start,end,[method])</code>','हर महीना 30 दिन मानकर ब्याज़-गिनती','<code>=DAYS360(A2,B2,TRUE)</code>','US(EUR=FALSE)/EUR=TRUE — बैंकिंग/बॉन्ड फ़ाइल में मिलता है, सामान्य कैलेंडर दिन नहीं'],
        ['<code>NETWORKDAYS(start,end,[holidays],[weekend])</code>','कार्य-दिन गिनती; 4th तर्क <b>2013+</b>','<code>=NETWORKDAYS(A2,B2,Holidays!$A$2:$A$15)</code>','छुट्टियों की सूची ज़रूर दें वरना Government holiday ग़लत; weekend = <code>{6,7}</code> जैसा array'],
        ['<code>NETWORKDAYS.INTL(start,end,[weekend],[holidays])</code>','भारत/दुबई जैसे अलग weekend के लिए','<code>=NETWORKDAYS.INTL(A2,B2,11,Holidays!$A$2:$A$15)</code>','weekend code 11 = केवल रवि छुट्टी; 1 = शनि+रवि (डिफ़ॉल्ट)'],
        ['<code>WORKDAY(start,days,[holidays])</code>','N कार्य-दिन बाद की तारीख़','<code>=WORKDAY(A2,15,Holidays!$A$2:$A$15)</code>','डिलीवरी/चालान due date; <code>WORKDAY.INTL</code> में weekend code'],
        ['<code>YEARFRAC(start,end,[basis])</code>','वर्ष का अंश (0.58 जैसा)','<code>=YEARFRAC(DOB,TODAY(),1)</code>','basis 0 = US 30/360, <b>1</b> = असली दिन/असली वर्ष, 2 = 365, 3 = 366, 4 = European 30/360 — ब्याज/आयु गणना में basis चुनना ज़रूरी'],
        ['<b>उम्र (age) का भरोसेमंद सूत्र</b>','—','<code>=DATEDIF(B2,TODAY(),\"Y\")&amp;\" वर्ष \"&amp;DATEDIF(B2,TODAY(),\"YM\")&amp;\" माह\"</code>','फ़ाइल भेजने पर TODAY() बदल जाता है — सर्टिफ़िकेट/रिपोर्ट के लिए तारीख़ <b>Paste Values</b> से स्थिर कीजिए'],
        ['<b>सेवा-काल (seniority) माह में</b>','—','<code>=DATEDIF(JOIN_DATE,LEAVE_DATE,\"M\")</code> या <code>=(TODAY()-B2)/365.25</code>','365.25 से leap-year का हिसाब संतुलित; सटीकता चाहिए तो DATEDIF']
      ]},

    {type:'table', head:['फंक्शन (Syntax)','क्या करती है','उदाहरण','नतीजा'],
      rows:[
        ['<code>LEFT(text,[n])</code>','बाएँ से n अक्षर','<code>=LEFT(A2,3)</code>','\"101\"→<b>101</b> (branch कोड)'],
        ['<code>RIGHT(text,[n])</code>','दाएँ से n अक्षर','<code>=RIGHT(A2,4)</code>','रोल नंबर का आख़िरी 4'],
        ['<code>MID(text,start,n)</code>','बीच से काटना','<code>=MID(A2,4,3)</code>','4वें अक्षर से 3 अक्षर'],
        ['<code>LEN(text)</code>','कुल अक्षर (स्पेस भी)','<code>=LEN(A2)</code>','12 — मोबाइल 10 अंकों की जाँच: <code>=IF(LEN(A2)=10,\"OK\",\"ग़लत\")</code>'],
        ['<code>LENB/UNICODE/UNICHAR</code>','बाइट/अक्षर-कोड (कुछ भाषाओं में)','<code>=UNICODE(\"A\")</code>','65; emoji/हिन्दी जाँच में काम आता है'],
        ['<code>REPT(text,n)</code>','दोहराकर बनाना','<code>=REPT(\"*\",C2/10)</code>','<b>बिना चार्ट के</b> बार-ग्राफ़ — रजिस्टर/स्क्रीन-प्रीव्यू में मज़ेदार'],
        ['<code>FIND(find,within,[start])</code>','स्थान, <b>case-sensitive</b>','<code>=FIND(\"@\",A2)</code>','12; न मिले तो <code>#VALUE!</code> (इसलिए IFERROR के साथ)'],
        ['<code>SEARCH(find,within,[start])</code>','स्थान, <b>case-insensitive</b> + wildcard चलते हैं','<code>=SEARCH(\"@\",A2)</code>','12 — आम तौर पर यही इस्तेमाल होता है'],
        ['<code>REPLACE(old,start,n,new)</code>','स्थान से काट-जोड़','<code>=REPLACE(A2,1,3,\"XX-\")</code>','पहले 3 अक्षर बदले (CRNo शैली)'],
        ['<code>SUBSTITUTE(text,old,new,[n])</code>','शब्द बदलो (कितनी बार भी/क्रम से)','<code>=SUBSTITUTE(A2,\"-\",\"\")</code>','डैश हटाकर साफ़ कोड; <code>,1</code> = केवल पहला, <code>-1</code> = आख़िरी'],
        ['<code>TRIM(text)</code>','अतिरिक्त स्पेस हटाएँ (बीच का एक-एक छोड़कर)','<code>=TRIM(A2)</code>','VLOOKUP फेल होने की <b>सबसे आम वजह</b> — trailing space'],
        ['<code>CLEAN(text)</code>','नकाबल-छपाई वर्ण (char 1–31) हटाए','<code>=CLEAN(A2)</code>','दूसरे सिस्टम/वेब से आए डेटा में newline/char-10 के कारण दिखने वाला \"छोटा\" डिब्बा'],
        ['<code>UPPER / LOWER / PROPER</code>','बड़ा/छोटा/शब्दों का पहला अक्षर','<code>=PROPER(A2)</code>','\"rAm kUMar\"→<b>Ram Kumar</b>'],
        ['<code>CONCAT(text1,…)</code>','जोड़ना (2019+/365; पुराना CONCATENATE अब legacy)','<code>=CONCAT(A2,\" \",B2)</code>','रेंज भी स्वीकार करता है'],
        ['<code>TEXTJOIN(delim,ignore_empty,text1,…)</code>','delimiter से जोड़ें, खाली छोड़ें','<code>=TEXTJOIN(\", \",TRUE,C2:E2)</code>','78, 66, 92 — एक cell में कई मान, \"\" भी गिरा देता है'],
        ['<code>TEXT(value,format_text)</code>','संख्या/तारीख़ को मनचाहे पाठ में','<code>=TEXT(B2,\"dd-mmm-yyyy\")</code>, <code>=TEXT(A2,\"ddd\")</code>','\"05-Jan-2025\", \"Wed\" — <b>शीट का नाम/वाक्य जोड़ने का एकमात्र रास्ता</b>'],
        ['<code>VALUE(text)</code> / <code>--</code>','पाठ → संख्या','<code>=VALUE(\"1,234\")</code>, <code>=--A2</code>','1234; <code>NUMBERVALUE(text,dec_sep,group_sep)</code> विदेशी फ़ाइल के लिए (2013+)'],
        ['<code>EXACT(text1,text2)</code>','case-sensitive बराबरी','<code>=EXACT(A2,B2)</code>','TRUE/FALSE — पासवर्ड/कोड मिलान (COUNTIF case-insensitive होता है!)'],
        ['<code>T(value)</code>','केवल पाठ लौटाए, वरना \"\"','<code>=T(C2)</code>','गणना में भूलकर गिरा हुआ टेक्स्ट नहीं जुड़े'],
        ['<code>INDIRECT(ref_text)</code>','पाठ से बनता <b>रेफ़रेंस</b>','<code>=INDIRECT(\"Sheet\"&amp;B2&\"!A1\")</code>','Dependent dropdown/महीना-शीट; <b>volatile</b> व security-धीमा — सावधानी से'],
        ['<code>CHAR(n) / CODE(text)</code>','ASCII वर्ण/कोड','<code>=CHAR(10)</code>','सेल के अंदर लाइन-ब्रेक बनाने/तोड़ने में'],
        ['<code>TEXTSPLIT / TEXTBEFORE / TEXTAFTER</code>','एक सेल को कई क़ैलमों में spill','<code>=TEXTSPLIT(A2,\"-\")</code>','<b>केवल Microsoft 365</b> — Text to Columns का जीवित सूत्र-रूप']
      ]},

    {type:'table', head:['फंक्शन (Syntax)','क्या करती है','उदाहरण','नतीजा / नोट'],
      rows:[
        ['<code>IF(logical_test,value_if_true,value_if_false)</code>','शर्त पर दो नतीजे; <b>256 स्तर तक</b> nesting','<code>=IF(F2&gt;=150,\"Pass\",\"Fail\")</code>','Pass; तीसरी शर्त के लिए nested IF (नीचे code देखें)'],
        ['<code>IFS(test1,v1,test2,v2,…)</code>','बहुत शर्तें, nesting के बिना','<code>=IFS(F2&gt;=180,\"A\",F2&gt;=150,\"B\",F2&gt;=120,\"C\",TRUE,\"D\")</code>','<b>Excel 2019/365+</b> — 2016 में नहीं; <code>TRUE,\"…</code> = default/else'],
        ['<code>AND(log1,log2,…)</code>','सभी सच हों तो TRUE','<code>=IF(AND(C2&gt;=33,D2&gt;=33,E2&gt;=33),\"Pass\",\"Fail\")</code>','हर विषय में पास की जाँच — मार्कशीट का असली नियम'],
        ['<code>OR(log1,log2,…)</code>','कोई एक सच','<code>=IF(OR(B2=\"North\",B2=\"South\"),\"Zona A\",\"-\")</code>','कई क्षेत्र/कई मान पर एक-सा काम'],
        ['<code>NOT(logical)</code>','उलटा','<code>=IF(NOT(ISBLANK(A2)),\"भरा है\",\"-\")</code>','शर्त को पलटने के लिए'],
        ['<code>XOR(log1,log2,…)</code>','विषम संख्या में TRUE हों तो TRUE','<code>=XOR(MOD(A2,2)=0,MOD(B2,2)=0)</code>','2013+; \"केवल एक ही लागू\" जैसी जाँच'],
        ['<code>TRUE() / FALSE()</code>','तार्किक मान सीधे','<code>=IF(B2=\"Present\",TRUE(),FALSE())</code>','1/0 की जगह सच-तर्क; Conditional formatting में अच्छा'],
        ['<code>IFERROR(value,value_if_error)</code>','<b>किसी भी</b> त्रुटि को संभालें','<code>=IFERROR(A2/B2,\"-\")</code>','2007+; ध्यान: सारी ग़लतियाँ छिप जाती हैं — पहले बिना IFERROR जाँच लें'],
        ['<code>IFNA(value,value_if_na)</code>','केवल <code>#N/A</code> संभाले','<code>=IFNA(VLOOKUP(A2,M,2,FALSE),\"नया ग्राहक\")</code>','2013+; <b>सबसे अच्छी आदत</b> — #REF!/#VALUE! छिपते नहीं, इसलिए गड़बड़ी पकड़ में रहती है'],
        ['<code>SWITCH(expr,val1,r1,val2,r2,…,[default])</code>','मान-मिलान से नतीजा (लंबा nested IF छोटा)','<code>=SWITCH(D2,\"North\",1,\"South\",2,\"East\",3,\"West\",4,0)</code>','2019+; शर्तें नहीं, सीधे मान मिलाता है'],
        ['<code>ISBLANK(cell)</code>','बिल्कुल खाली?','<code>=IF(ISBLANK(A2),\"-\",A2)</code>','space या \"\" वाला सेल खाली नहीं माना जाता'],
        ['<code>ISERROR / ISERR / ISNA</code>','त्रुटि की पहचान','<code>=IF(ISERROR(F2),0,F2)</code>','ISERROR = सब त्रुटियाँ; ISERR = सब सिवाय #N/A; ISNA = केवल #N/A'],
        ['<code>ISNUMBER / ISTEXT / ISREF / ISLOGICAL / ISNONTEXT</code>','प्रकार की पहचान','<code>=IF(ISNUMBER(C2),C2,\"-\")</code>','गंदे CSV/मैनुअल डेटा की जाँच — इनसे \"डेटा-साफ़\" सूत्र बनते हैं'],
        ['<code>IF + AND/OR + IS*</code> का मेल','असल ज़िंदगी का सबसे इस्तेमाली ढाँचा','<code>=IF(AND(ISNUMBER(A2),NOT(ISBLANK(B2)),C2&gt;=33,D2&gt;=33),\"पात्र\",\"रूकें\")</code>','एक सूत्र में 4 जाँच — पात्रता/स्क्रूटनी फ़ॉर्म']
      ]},

    {type:'table', head:['तर्क (argument)','क्या डालें','नोट'],
      rows:[
        ['1 — <b>lookup_value</b>','जिसे ढूँढना है (मान, सेल, या सूत्र)','संख्या को text से मेल नहीं — <code>VALUE()/TRIM()</code> से दोनों पक्ष सही रखें'],
        ['2 — <b>table_array</b>','वह रेंज जिसके <b>पहले कॉलम</b> में खोज होगी और दूसरे से नतीजा आए','<b>ज़रूरी नियम:</b> lookup_column सबसे बाएँ होना चाहिए; <code>F4</code> से <code>$A$2:$D$30</code> लॉक करें'],
        ['3 — <b>col_index_num</b>','table_array के अंदर कितने नंबर का कॉलम लौटना है (1 से शुरू)','नाम/पता नहीं, संख्या; कॉलम बीच में डिलीट/इंसर्ट करें तो index ग़लत होकर <b>चुपचाप ग़लत उत्तर</b> दे सकता है'],
        ['4 — <b>range_lookup</b>','<b>FALSE/0 = सटीक मिलान</b>, <b>TRUE/1 (डिफ़ॉल्ट) = अनुमानित</b>','छोड़ दें तो TRUE — यही सबसे बड़ी भूल। अनुमानित के लिए पहला कॉलम <b>आरोही (ascending) sort</b> अनिवार्य'],
        ['<b>अनुमानित (TRUE) कब?</b>','slab/tier टेबल — टैक्स, HRA slab, discount %, ग्रेड सीमा, ब्याज-dil','15% वाली सीमा से नीचे का बड़ा मान लौटाता है; सीमाएँ <code>0, 5, 10, 20…</code> आरोही रखें'],
        ['<b>सटीक (FALSE) कब?</b>','रोल नंबर, PIN, part code, ग्राहक ID','न मिले तो <code>#N/A</code> — IFNA/IFERROR से संभालें; पुराना \"near-match\" भ्रम यहीं खत्म होता है'],
        ['<b>पूरा उदाहरण</b>','<code>=VLOOKUP(B2,$A$2:$D$30,4,FALSE)</code>','B2 का ग्राहक-ID कॉलम A में ढूँढकर D कॉलम का फ़ोन; table_array लॉक, अंतिम तर्क FALSE'],
        ['<code>HLOOKUP(lookup_value,table_row,col_index,FALSE)</code>','ऊपर-की-पंक्ति में खोजकर दाईं ओर से नतीजा','क्षैतिज (left-to-right) टेबल — महीने कॉलमों में हों तो यही/i.e. XLOOKUP'],
        ['<code>INDEX(array,row,[col])</code>','स्थान से मान उठाओ','<code>=INDEX(C2:C11,4)</code> → 4ठा मान; <b>किसी भी दिशा/किसी भी कॉलम</b> से — VLOOKUP जैसा leftmost नियम नहीं'],
        ['<code>MATCH(lookup,range,[type])</code>','कहाँ मिला — <b>स्थान</b> लौटाता है','type <b>0</b> सटीक (range कोई भी क्रम), <b>1</b> आरोही में ≤, <b>-1</b> अवरोही में ≥; यही INDEX के row नंबर में जाता है'],
        ['<code>=INDEX(D2:D11,MATCH(B2,A2:A11,0))</code>','<b>INDEX+MATCH</b> — VLOOKUP का मज़बूत बदली','दायाँ भी खोज सकता है, कॉलम इंसर्ट से नतीजा नहीं बिगड़ता, थोड़ा तेज़ (बड़ी शीट)'],
        ['<b>दो-तरफ़ा (two-way) lookup</b>','पंक्ति और कॉलम — दोनों से','<code>=INDEX(B2:G11,MATCH("अमिता",A2:A11,0),MATCH("Maths",B1:G1,0))</code> — मार्कशीट/रेट-मैट्रिक्स का मानक नमूना; इसे कंठ कीजिए'],
        ['<code>LOOKUP(lookup_value,array,[vector])</code>','पुराना; आख़िरी ≤ मान (आरोही चाहिए)','<code>=LOOKUP(A14,{1,3,5,8},{\"A\",\"B\",\"C\",\"D\"})</code> — constants से slab बनाने का जुगाड़; आज XLOOKUP/INDEX-MATCH बेहतर']
      ]},

    {type:'table', head:['तर्क / फंक्शन','क्या/कब','उदाहरण (जैसे टाइप करें)','नतीजा / नोट'],
      rows:[
        ['1 — <b>lookup_value</b>','लाज़मी','<code>=XLOOKUP(H2,A:A,E:E)</code>','जिसे ढूँढना है — मान/सेल/सूत्र; संख्या बनाम पाठ का मेल ज़रूरी'],
        ['2 — <b>lookup_array</b>','लाज़मी','<code>=XLOOKUP(A2,C2:C20,F2:F20)</code>','<b>एक</b> कॉलम/पंक्ति; leftmost जैसा कोई नियम नहीं'],
        ['3 — <b>return_array</b>','लाज़मी','<code>=XLOOKUP(A2,C2:C20,F2:G20)</code>','किस कॉलम/पंक्ति से मान लाना है; <b>2 कॉलम दें तो 2 स्तंभ spill</b>'],
        ['4 — <b>[if_not_found]</b>','वैकल्पिक','<code>=XLOOKUP(A2,C:C,D:D,"नया ग्राहक")</code>','न मिलने पर आपका संदेश — <b>#N/A की समस्या ही ख़त्म</b>, IFNA की ज़रूरत नहीं'],
        ['5 — <b>[match_mode]</b>','वैकल्पिक (0 डिफ़ॉल्ट)','<code>=XLOOKUP(L2,Slab,Rate,-1)</code>','<b>0</b> सटीक · <b>-1</b> सटीक या बराबर-से-छोटा (slab/tier) · <b>1</b> सटीक या बराबर-से-बड़ा · <b>2</b> wildcard <code>* ? ~</code>'],
        ['6 — <b>[search_mode]</b>','वैकल्पिक','<code>=XLOOKUP(H2,A:A,D:D,"NA",0,-1)</code>','<b>1</b> पहला-से-आख़िर (डिफ़ॉल्ट) · <b>-1</b> आख़िर से-पहला (आख़िरी duplicate) · <b>2</b> binary आरोही (तेज़) · <b>-2</b> binary अवरोही'],
        ['<b>बहुत-शर्त खोज</b>','TRUE/FALSE array वाला trick','<code>=XLOOKUP(1,(D2:D41="North")*(B2:B41="Jan"),G2:G41,"-")</code>','एक ही सूत्र में 2 शर्तें — SUMPRODUCT जैसी शक्तिले खोज, नतीजा सीधा'],
        ['<b>दो-तरफ़ा (grid) lookup</b>','XLOOKUP को nested करके','<code>=XLOOKUP("अमिता",A2:A11,XLOOKUP("Maths",B1:G1,B2:G11))</code>','अंदर वाला कॉलम खोजता है, बाहर वाला पंक्ति — मार्कशीट/रेट-ग्राह मैट्रिक्स'],
        ['<code>XMATCH(lookup,range,[match_mode],[search_mode])</code>','INDEX+MATCH का आधुनिक रूप','<code>=INDEX(D:D,XMATCH(B2,A:A))</code>','स्थान लौटाता है; search_mode से "पहला/आख़िरी" भी; <b>365/2021+</b>'],
        ['<code>FILTER(array,include,[if_empty])</code>','शर्त पर पूरी पंक्तियाँ','<code>=FILTER(A2:G41,(D2:D41="North")*(B2:B41="Jan"),"कोई नहीं")</code>','AutoFilter का live सूत्र-रूप; <b>365/2021+ में ही</b>'],
        ['<code>SORT(array,sort_index,sort_order)</code> / <code>SORTBY</code>','spill को क्रम में','<code>=SORT(A2:G41,7,-1)</code>, <code>=SORTBY(A2:D41,C2:C41,-1)</code>','<code>-1</code> = अवरोही; दूसरे कॉलम से क्रम चाहिए तो SORTBY'],
        ['<code>UNIQUE(array,[by_col],[exactly_once])</code>','अनोखी सूची','<code>=UNIQUE(C2:C41)</code>','several salesman की list अपने आप; <code>TRUE</code> = सिर्फ़ एक बार आए वाले; <b>365/2021+</b>'],
        ['<code>TRANSPOSE(array)</code>','पंक्ति ↔ कॉलम','<code>=TRANSPOSE(A2:A10)</code>','365/2021+ में spill; पुराने में <b>Ctrl+Shift+Enter</b> या Paste Special → Transpose'],
        ['<code>@</code> (implicit intersection) / <code>SINGLE</code>','पुरानी-नई फ़ाइल का फ़र्क़','<code>=SUM(A1:A10)*2</code> बनाम <code>=@A1:A10*2</code>','365/2021 में रेंज अकेली छूटी तो <code>#VALUE!</code>/<code>@</code> लगता है; पुरानी फ़ाइल खोलने पर <code>@</code> अपने आप जुड़ सकता है — "फ़ाइल अलग दिखती है" की यही वजह']
      ]},
    {type:'table', head:['बिंदु','VLOOKUP','INDEX + MATCH','XLOOKUP (365/2021+)'],
      rows:[
        ['कहाँ खोज सकता है','सिर्फ़ <b>सबसे बायाँ कॉलम</b>','कहीं भी','कहीं भी (अलग array)'],
        ['नतीजा किस तरफ़','दाईं ओर only (col_index)','किसी भी दिशा','किसी भी दिशा/कई कॉलम'],
        ['नए कॉलम इंसर्ट करने पर','col_index खिसककर <b>चुपचाप ग़लत</b>','कॉलम-नाम/रेफ़रेंस सही रहता है','array सीधे बदलते हैं — सुरक्षित'],
        ['बहुत-शर्त खोज','नहीं (helper कॉलम बनाना पड़ता है)','&amp; से concat trick','TRUE/FALSE array से सीधे'],
        ['न मिलने पर','#N/A → IFNA/IFERROR','#N/A → IFERROR','<b>4ठा तर्क if_not_found</b> — सबसे सुविधा'],
        ['आख़िरी/पहला duplicate','पहला ही मिलता है','MATCH type 0 पहला; trick से आख़िरी','<b>search_mode = -1</b> से आख़िरी'],
        ['approximate / slab टेबल','<code>TRUE</code> + पहला कॉलम आरोही sort','MATCH type <code>1</code> (आरोही) या <code>-1</code> (अवरोही)','<code>match_mode -1/1</code> — यही slab/टैक्स-दर का सही तरीक़ा; <code>0</code> में sort की शर्त नहीं'],
        ['गति (बड़ी शीट)','ठीक','बहुत बड़ी शीट पर आमतौर पर तेज़','binary search_mode 2 से सबसे तेज़'],
        ['किस वर्ज़न में चलेगा','हर Excel (97 से)','हर Excel','<b>Excel 2019/2016 में नहीं</b> — #NAME? दिखेगा'],
        ['पढ़ने में आसानता','मध्यम','थोड़ा कठिन (दो फंक्शन)','<b>सबसे साफ़</b>'],
        ['सलाह','पुरानी फ़ाइल/सरकारी टेम्पलेट में','<b>हर जगह चलने वाला भरोसेमंद</b>','नए Excel में पहली पसंद']
      ]},

    /* @@END-T1@@ */
  ]
},

{
  id: 'off-excel-2', icon: '📈', group: 'MS Office मास्टरक्लास',
  title: 'MS Excel भाग 2 — Lookup, Pivot, चार्ट व मॉडल',
  sub: 'VLOOKUP/XLOOKUP, SUMIFS, PivotTable, Power Query, What-If, मैक्रो व प्रोजेक्ट',
  kicker: 'Excel Part 2 · Analytics, Pivot & Automation',
  hero: 'भाग 1 की नींव पर इस भाग में <b>Lookup की गहराई, बहुत-शर्तों की गणना, PivotTable व Power Query से रिपोर्ट, What-If से फ़ैसला और मैक्रो से काम-स्वचालन</b> — नौकरी में असल में जो इस्तेमाल होता है, वही।',
  tags: ['VLOOKUP/XLOOKUP','SUMIFS व SUMPRODUCT','PivotTable व स्लाइसर','Power Query','What-If व Solver','मैक्रो/VBA'],
  blocks: [
    /* @@END-T2@@ */

    { type: 'callout', kind: 'info', title: 'इस भाग के बाद आप यह कर पाएँगे', html: '<ol><li>दूसरी शीट/फ़ाइल से डेटा खींचकर <b>Lookup</b> लगा पाएँगे — और बता पाएँगे कि VLOOKUP क्यों टूटता है।</li><li><b>SUMIFS/COUNTIFS/SUMPRODUCT</b> से कई शर्तों वाली रिपोर्ट बना पाएँगे।</li><li>हज़ारों पंक्तियों का <b>PivotTable</b> बनाकर स्लाइसर से काट-छाँट पाएँगे।</li><li><b>Power Query</b> से गंदा डेटा साफ़ करके बार-बार refresh कर पाएँगे।</li><li>सही <b>चार्ट</b> चुनकर, secondary axis व combo chart बना पाएँगे।</li><li><b>Goal Seek / Data Table / Solver</b> से "कितना बेचूँ तो लाभ इतना" का जवाब निकाल पाएँगे।</li><li>मैक्रो रिकॉर्ड करके रोज़ का दोहराव वाला काम एक क्लिक में कर पाएँगे।</li></ol>'},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.1</span> Lookup की गहराई — VLOOKUP क्यों टूटता है</h3>
      <p>भाग 1 में आपने <code>VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])</code> सीखा। असल ऑफ़िस में यही फ़ॉर्म्युला सबसे ज़्यादा <code>#N/A</code> देता है — और कारण लगभग हमेशा नीचे दी गई सूची में से एक होता है। पहले निदान (diagnosis) सीखिए, फिर इलाज।</p>
      <p>सबसे पहले यह समझिए कि VLOOKUP की <b>तीन जन्मजात कमज़ोरियाँ</b> हैं: (1) यह हमेशा table की <b>बाईं ओर के पहले कॉलम</b> में ही ढूँढ़ता है — दाईं ओर के कॉलम में key हो तो नहीं चलेगा; (2) <code>col_index_num</code> एक <b>गिनती वाला नंबर</b> है, इसलिए बीच में एक कॉलम जोड़/हटा देने पर सारा हिसाब ग़लत कॉलम उठाने लगता है; (3) डिफ़ॉल्ट <code>range_lookup = TRUE</code> यानी approximate match — अगर आपने चौथा argument छोड़ दिया और डेटा sorted नहीं है, तो Excel चुपचाप ग़लत (पर दिखने में सही) जवाब देगा। <b>इसलिए चौथा argument हमेशा लिखिए: <code>,0)</code> या <code>,FALSE)</code></b>।</p>` },

    { type: 'table', head: ['#N/A / ग़लत जवाब का कारण', 'कैसे पकड़ें', 'पक्का इलाज'], rows: [
      ['चौथा argument छूट गया (approximate match)', 'फ़ॉर्म्युला बार में अंत देखें — <code>,0)</code> नहीं है', '<code>=VLOOKUP(A2,Sheet2!$A$2:$D$500,3,<b>0</b>)</code>'],
      ['Key टेक्स्ट है पर दिखने में नंबर जैसी', '<code>=ISNUMBER(A2)</code> → FALSE; सेल बाएँ संरेखित', '<code>=VLOOKUP(A2*1,…,0)</code> या Data → Text to Columns → Finish'],
      ['Key में छिपा स्पेस / non-breaking space', '<code>=LEN(A2)</code> अपेक्षा से बड़ा; <code>=CODE(RIGHT(A2,1))</code> = 160', '<code>=TRIM(CLEAN(SUBSTITUTE(A2,CHAR(160)," ")))</code>'],
      ['Lookup column table के पहले कॉलम में नहीं', 'table_array का पहला अक्षर देखें', 'कॉलम को बाएँ ले जाएँ, या <b>INDEX+MATCH / XLOOKUP</b> अपनाएँ'],
      ['कॉलम जोड़ने से col_index पुराना पड़ा', 'header गिनकर मिलाएँ', '<code>MATCH("वेतन",Sheet2!$A$1:$Z$1,0)</code> को col_index में डालें'],
      ['Table range copy करते समय खिसक गया', 'कॉपी किए फ़ॉर्म्युला में range देखें — <code>$</code> नहीं', 'पूरा range <b>F4</b> से absolute करें, या Table/Named Range लें'],
      ['Key डुप्लीकेट है', '<code>=COUNTIF(range,A2)</code> > 1', 'पहला match ही मिलेगा — key को unique बनाएँ (जैसे Code+Date)'],
      ['दिखने में एक जैसे, अलग Unicode अक्षर', 'दोनों keys पर <code>EXACT()</code> → FALSE', 'एक ही स्रोत से paste करें; देवनागरी मात्राएँ दोबारा टाइप न करें'],
      ['Lookup value ख़ुद error है', '<code>=ISERROR(A2)</code> → TRUE', 'पहले स्रोत का error ठीक करें, फिर lookup'],
      ['Cross-workbook link टूटा', 'Data → Edit Links → Status = Error', 'लिंक बदलें या डेटा उसी workbook में लाएँ']
    ]},

    { type: 'callout', kind: 'tip', title: 'IFERROR लगाइए — पर अंदर की ग़लती भी ठीक कीजिए', html: '<code>=IFERROR(VLOOKUP(A2,Sheet2!$A$2:$D$500,3,0),"नहीं मिला")</code> शीट को सुंदर बनाता है, पर यह <b>ग़लती छिपा भी देता है</b>। सही आदत: पहले एक अलग कॉलम में कच्चा VLOOKUP चलाकर देखिए कि कितने #N/A आ रहे हैं; कारण सुधारने के बाद ही IFERROR लगाइए। खाली स्ट्रिंग <code>""</code> बनाम 0 बनाम "नहीं मिला" — आगे की गणना (SUM/AVERAGE) पर असर डालते हैं, इसलिए सोच-समझकर चुनें।'},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.2</span> INDEX + MATCH और XLOOKUP — आधुनिक, न टूटने वाला तरीक़ा</h3>
      <p><b>INDEX(range, row_num, [col_num])</b> उस स्थान का मान लौटाता है; <b>MATCH(lookup_value, lookup_array, [match_type])</b> उस मान की <b>पोज़िशन (नंबर)</b> बताता है। दोनों को जोड़ने पर lookup column कहीं भी हो सकती है और कॉलम जोड़ने-हटाने से फ़ॉर्म्युला नहीं टूटता, क्योंकि कॉलम अब गिनती से नहीं, <b>हेडर के नाम</b> से मिलता है।</p>
      <p><b>XLOOKUP</b> (Microsoft 365 / Excel 2021 और बाद) इन्हीं दोनों का एक ही फ़ॉर्म्युला में बना सुधार है — इसमें default exact match है, बाएँ-दाएँ-ऊपर-नीचे सब ढूँढ़ सकता है, और "न मिले तो" का जवाब अंदर ही दिया जा सकता है। पुराने Excel (2016/2019) में XLOOKUP नहीं है — वहाँ <code>_xlfn.XLOOKUP</code> दिखेगा और <code>#NAME?</code> आएगा, इसलिए सरकारी/पुराने टेम्पलेट में INDEX+MATCH ही सुरक्षित है।</p>` },

    { type: 'code', code: `REM --- तीन तरीक़े, एक ही काम: Roll नंबर से वेतन निकालना ---
REM (1) पुराना — key बाएँ कॉलम में होनी चाहिए
=VLOOKUP(A2, Sheet2!$A$2:$F$500, 5, 0)

REM (2) भरोसेमंद — key किसी भी कॉलम में, header नाम से
=INDEX(Sheet2!$E$2:$E$500, MATCH(A2, Sheet2!$B$2:$B$500, 0))

REM (3) दो-तरफ़ा (row और column दोनों MATCH से)
=INDEX(Sheet2!$A$2:$Z$500,
       MATCH(A2, Sheet2!$A$2:$A$500, 0),
       MATCH("वेतन", Sheet2!$A$1:$Z$1, 0))

REM (4) XLOOKUP — 365/2021+ ; "नहीं मिला" अंदर ही
=XLOOKUP(A2, Sheet2!$B$2:$B$500, Sheet2!$E$2:$E$500, "नहीं मिला", 0)

REM (5) XMATCH — आख़िरी (latest) entry चाहिए तो search_mode = -1
=XLOOKUP(A2, Sheet2!$B$2:$B$500, Sheet2!$E$2:$E$500, "", 0, -1)

REM (6) दो शर्तों वाला lookup (Code + Month) — helper column बनाकर
 helper: =B2&"|"&C2      फिर उसी helper पर VLOOKUP/XLOOKUP

REM (7) बिना helper, boolean array से (Ctrl+Shift+Enter पुराने Excel में)
=INDEX($E$2:$E$500, MATCH(1, ($B$2:$B$500=A2)*($C$2:$C$500=B2), 0))` },

    { type: 'table', head: ['XLOOKUP का argument', 'क्या डालते हैं', 'छोड़ने पर / नोट'], rows: [
      ['lookup_value', 'जिसे ढूँढ़ना है (सेल या मान)', 'अनिवार्य'],
      ['lookup_array', 'वह एक कॉलम/पंक्ति जिसमें ढूँढ़ना है', 'अनिवार्य; <b>एक ही दिशा</b> होनी चाहिए'],
      ['return_array', 'जिस कॉलम/पंक्ति से जवाब चाहिए', 'अनिवार्य; लंबाई lookup_array के बराबर हो'],
      ['if_not_found', 'न मिलने पर दिखने वाला पाठ/मान', 'छोड़ने पर <code>#N/A</code>; IFERROR की ज़रूरत नहीं'],
      ['match_mode', '0 = exact (default), -1 = exact या अगला छोटा, 1 = exact या अगला बड़ा, 2 = wildcard', 'डिफ़ॉल्ट <b>0</b> — यही VLOOKUP से बड़ा सुधार'],
      ['search_mode', '1 = शुरू से (default), -1 = अंत से, 2 = binary ascending, -2 = binary descending', 'binary के लिए डेटा sorted होना अनिवार्य, वरना ग़लत जवाब'],
      ['पूरा उदाहरण', '<code>=XLOOKUP(A2,$B$2:$B$500,$E$2:$E$500,"-",0,-1)</code>', 'आख़िरी matching entry का वेतन']
    ]},

    { type: 'table', head: ['MATCH / XMATCH का match_type', 'अर्थ', 'डेटा की शर्त', 'कब'], rows: [
      ['0 (MATCH) / 0 (XMATCH)', 'बिल्कुल बराबर (exact)', 'कोई sort नहीं चाहिए', '<b>हमेशा यही डिफ़ॉल्ट रखें</b>'],
      ['1 (MATCH)', 'बराबर या उससे छोटा सबसे बड़ा मान', '<b>ascending sort अनिवार्य</b>', 'ग्रेड/स्लैब (जैसे 0–40 F, 41–60 D)'],
      ['-1 (MATCH)', 'बराबर या उससे बड़ा सबसे छोटा मान', '<b>descending sort अनिवार्य</b>', 'कम होते स्लैब'],
      ['XMATCH 2', 'wildcard — <code>*</code> (कई अक्षर), <code>?</code> (एक), <code>~</code> escape', 'कोई नहीं', 'नाम का हिस्सा ढूँढ़ना: <code>"*शर्मा*"</code>'],
      ['XMATCH search_mode -1', 'अंत से खोज', 'कोई नहीं', 'एक key की कई entries में <b>सबसे नई</b> चाहिए'],
      ['ग्रेड-स्लैब का सही तरीक़ा', '<code>=VLOOKUP(marks,{0,"F";40,"D";60,"C";75,"B";90,"A"},2,1)</code>', 'पहला कॉलम ascending', 'यहाँ जान-बूझकर approximate (1) सही है']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.1</span> बहुत-शर्तों वाली गणना — SUMIFS परिवार</h3>
      <p>एक शर्त हो तो <code>SUMIF</code>, दो या ज़्यादा हों तो <b>SUMIFS / COUNTIFS / AVERAGEIFS</b>। ध्यान रखिए — <b>SUMIF और SUMIFS के argument का क्रम उल्टा है</b>: SUMIF में पहले range फिर criteria फिर sum_range; SUMIFS में <b>पहले sum_range</b>, फिर जोड़े (criteria_range, criteria)। यही परीक्षा और इंटरव्यू का पसंदीदा जाल है।</p>
      <p>सभी ranges की <b>लंबाई बराबर</b> होनी चाहिए, वरना <code>#VALUE!</code>। शर्तों के बीच हमेशा <b>AND</b> लगता है (सभी सही हों)। <b>OR</b> चाहिए तो दो SUMIFS जोड़िए, या <code>SUM(SUMIFS(...,{"उत्तर","दक्षिण"}))</code> जैसा array constant दीजिए। खाली सेल के लिए criteria <code>""</code>, भरे हुए के लिए <code>"&lt;&gt;"</code>, और सेल के मान से शर्त बनानी हो तो <b>जोड़ना (concatenate)</b> पड़ता है: <code>"&gt;"&amp;B1</code>।</p>` },

    { type: 'table', head: ['फंक्शन (Syntax)', 'क्या करती है', 'उदाहरण', 'नतीजा / नोट'], rows: [
      ['<code>SUMIFS(sum_rng, cr_rng1, cr1, …)</code>', 'कई शर्तों पर जोड़', '<code>=SUMIFS($D$2:$D$500,$B$2:$B$500,"उत्तर",$C$2:$C$500,"जनवरी")</code>', 'उत्तर क्षेत्र + जनवरी का कुल'],
      ['<code>COUNTIFS(cr_rng1, cr1, …)</code>', 'कई शर्तों पर गिनती', '<code>=COUNTIFS($B$2:$B$500,"उत्तर",$D$2:$D$500,"&gt;10000")</code>', '10000 से ऊपर बिक्री वाले उत्तर के बिल'],
      ['<code>AVERAGEIFS(avg_rng, …)</code>', 'कई शर्तों पर औसत', '<code>=AVERAGEIFS($D$2:$D$500,$C$2:$C$500,"जनवरी")</code>', 'खाली सेल औसत में नहीं गिने जाते'],
      ['<code>MAXIFS / MINIFS</code>', 'शर्तों पर सबसे बड़ा/छोटा', '<code>=MAXIFS($D$2:$D$500,$B$2:$B$500,"दक्षिण")</code>', 'Excel 2019+ / 365'],
      ['<code>SUMIF(rng, cr, [sum_rng])</code>', 'एक शर्त — <b>क्रम अलग</b>', '<code>=SUMIF($B$2:$B$500,"उत्तर",$D$2:$D$500)</code>', 'sum_rng आख़िर में, और वैकल्पिक'],
      ['<code>COUNTIF(rng, cr)</code>', 'एक शर्त पर गिनती', '<code>=COUNTIF($A$2:$A$500,A2)</code>', '>1 = डुप्लीकेट; conditional formatting में यही'],
      ['<code>AVERAGEIF(rng, cr, [avg_rng])</code>', 'एक शर्त पर औसत', '<code>=AVERAGEIF($C$2:$C$500,"&lt;&gt;",$D$2:$D$500)</code>', 'जहाँ माह भरा है वहाँ का औसत'],
      ['<code>SUMPRODUCT((rng1=cr1)*(rng2=cr2)*sum_rng)</code>', 'array-शर्तों का जोड़/गुणनफल', '<code>=SUMPRODUCT(($B$2:$B$500="उत्तर")*($D$2:$D$500))</code>', 'OR/जटिल तर्क यहाँ आसान; पूरे कॉलम न लें (धीमा)'],
      ['<code>SUMPRODUCT(qty_rng, price_rng)</code>', 'दो columns का गुणा-जोड़', '<code>=SUMPRODUCT($C$2:$C$100,$D$2:$D$100)</code>', 'बिना helper column कुल राशि'],
      ['<code>SUMPRODUCT(1/COUNTIF(rng,rng))</code>', 'unique values की गिनती', '<code>=SUMPRODUCT(1/COUNTIF(A2:A100,A2:A100))</code>', 'खाली सेल हों तो <code>#DIV/0!</code> — पहले साफ़ करें'],
      ['<code>SUM(SUMIFS(...,{"क","ख"}))</code>', 'OR शर्त', '<code>=SUM(SUMIFS($D$2:$D$500,$B$2:$B$500,{"उत्तर","दक्षिण"}))</code>', 'दोनों क्षेत्रों का जोड़'],
      ['<code>DSUM(database, field, criteria)</code>', 'database फंक्शन — criteria अलग range में', '<code>=DSUM(A1:D500,"राशि",F1:G2)</code>', 'पुराना तरीक़ा; header नाम बिल्कुल मेल खाना चाहिए']
    ]},

    { type: 'table', head: ['Criteria कैसे लिखें', 'उदाहरण', 'क्या match होगा'], rows: [
      ['बराबर (पाठ)', '<code>"उत्तर"</code>', 'ठीक "उत्तर" (case-insensitive)'],
      ['तुलना — चिह्न कोट में', '<code>"&gt;10000"</code>', '10000 से बड़ा (10000 नहीं)'],
      ['सेल के मान से तुलना', '<code>"&gt;="&amp;B1</code>', 'B1 में लिखी सीमा से बड़ा/बराबर — <b>&amp; लगाना अनिवार्य</b>'],
      ['आज की तारीख़', '<code>TODAY()</code>', 'आज की entries'],
      ['तारीख़ सीमा', '<code>"&gt;="&amp;DATE(2026,1,1)</code>', '1 जनवरी 2026 से आगे; तारीख़ सीधे "1/1/2026" न लिखें'],
      ['दो तारीख़ों के बीच', '<code>"&gt;="&amp;B1</code> और <code>"&lt;="&amp;C1</code> —वही range दो बार', 'B1 से C1 तक (दोनों शामिल)'],
      ['खाली', '<code>""</code> या <code>"="</code>', 'सचमुच ख़ाली सेल'],
      ['भरा हुआ', '<code>"&lt;&gt;"</code>', 'कोई भी मान (0 भी गिना जाएगा)'],
      ['शून्य नहीं', '<code>"&lt;&gt;0"</code>', '0 को छोड़कर सब'],
      ['Wildcard', '<code>"*शर्मा*"</code>, <code>"र?म"</code>', '<code>*</code> = कई अक्षर, <code>?</code> = एक अक्षर; असली <code>*</code> ढूँढ़ना हो तो <code>~*</code>'],
      ['TRUE/FALSE', '<code>TRUE</code> (बिना कोट)', 'logical मान; "TRUE" पाठ से अलग']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.2</span> टेक्स्ट व तारीख़ साफ़ करना — गंदा डेटा ही सबसे बड़ी बाधा</h3>
      <p>ऑफ़िस में मिली CSV/ERP रिपोर्ट लगभग हमेशा गंदी होती है: आगे-पीछे स्पेस, नंबर टेक्स्ट के रूप में, तारीख़ पाठ के रूप में, एक सेल में पूरा पता। इन्हें <b>फ़ॉर्म्युला से ठीक करना</b> और <b>Power Query से ठीक करना</b> — दोनों आने चाहिए। फ़ॉर्म्युला तब अच्छा है जब डेटा एक बार का हो; बार-बार आने वाली फ़ाइल हो तो Power Query (आगे 3.2) सही है।</p>
      <p>तीन सुनहरे नियम: (1) <b>मूल डेटा कभी न बदलें</b> — एक अलग "Raw" शीट रखें और सफ़ाई उसकी कॉपी पर करें; (2) <b> Paste Special → Values</b> से फ़ॉर्म्युला का नतीजा स्थायी करें, वरना स्रोत कॉलम हटाते ही सब <code>#REF!</code>; (3) तारीख़ असल में <b>एक नंबर</b> है (1 = 1 जनवरी 1900), इसलिए तारीख़ जोड़-घटाव सीधे हो जाती है — <code>=B2-A2</code> दिन देता है।</p>` },

    { type: 'table', head: ['फंक्शन', 'काम', 'उदाहरण', 'नतीजा / सावधानी'], rows: [
      ['<code>TRIM(t)</code>', 'आगे-पीछे के स्पेस व बीच के दोहरे स्पेस हटाए', '<code>=TRIM(A2)</code>', 'CHAR(160) नहीं हटाता — उसके लिए SUBSTITUTE'],
      ['<code>CLEAN(t)</code>', 'non-printable अक्षर (0–31) हटाए', '<code>=CLEAN(A2)</code>', 'PDF/वेब से paste किया डेटा साफ़ करने में'],
      ['<code>SUBSTITUTE(t, old, new, [n])</code>', 'पाठ बदले (n = कौन-सी बार)', '<code>=SUBSTITUTE(A2,CHAR(160)," ")</code>', 'REPLACE से अलग — यह position नहीं, पाठ देखता है'],
      ['<code>LEFT / RIGHT / MID</code>', 'बाएँ/दाएँ/बीच से अक्षर', '<code>=MID(A2,4,3)</code>', 'MID में start position 1 से शुरू'],
      ['<code>LEN</code>', 'अक्षर-गिनती', '<code>=LEN(A2)-LEN(TRIM(A2))</code>', 'छिपे स्पेस पकड़ने का तेज़ तरीक़ा'],
      ['<code>FIND / SEARCH</code>', 'पाठ की position', '<code>=FIND("@",A2)</code>', 'FIND case-sensitive, SEARCH नहीं; SEARCH wildcard लेता है'],
      ['<code>TEXTJOIN(delim, ignore_empty, …)</code>', 'जोड़कर एक पाठ', '<code>=TEXTJOIN(", ",TRUE,B2:D2)</code>', '2019+; CONCATENATE का आधुनिक रूप'],
      ['<code>TEXT(value, format)</code>', 'नंबर/तारीख़ को पाठ में', '<code>=TEXT(A2,"dd-mmm-yyyy")</code>', 'बाद में इस पर गणित नहीं होगा'],
      ['<code>VALUE / NUMBERVALUE</code>', 'पाठ को नंबर में', '<code>=NUMBERVALUE(A2,".",",")</code>', 'विदेशी CSV में दशमलव/हज़ार चिह्न अलग हों तो'],
      ['<code>UPPER / LOWER / PROPER</code>', 'बड़े/छोटे/हर शब्द का पहला बड़ा', '<code>=PROPER(A2)</code>', 'हिंदी पर असर नहीं; अंग्रेज़ी नामों पर'],
      ['<code>REPT</code>', 'पाठ दोहराए', '<code>=REPT("★",B2)</code>', 'सेल के अंदर मिनी बार-चार्ट'],
      ['<code>CONCAT / &amp;</code>', 'जोड़ना', '<code>=A2&amp;" "&amp;B2</code>', 'पूरा नाम बनाने में'],
      ['<code>Flash Fill (Ctrl+E)</code>', 'नमूने से बाक़ी अपने आप भरे', 'पहली दो पंक्तियाँ हाथ से लिखें, फिर Ctrl+E', '2013+; एक बार का काम, फ़ॉर्म्युला नहीं बनता — स्रोत बदले तो दोबारा चलाना पड़ेगा'],
      ['<code>Text to Columns</code>', 'एक कॉलम को delimiter/चौड़ाई से तोड़े', 'Data → Text to Columns', 'नंबर-टेक्स्ट और तारीख़-पाठ ठीक करने का सबसे तेज़ रास्ता भी']
    ]},

    { type: 'table', head: ['तारीख़/समय फंक्शन', 'काम', 'उदाहरण', 'नतीजा / नोट'], rows: [
      ['<code>TODAY() / NOW()</code>', 'आज की तारीख़ / तारीख़+समय', '<code>=TODAY()-A2</code>', 'खोलने/recalculate पर बदलते हैं — स्थिर तारीख़ चाहिए तो Ctrl+;'],
      ['<code>DATE(y,m,d)</code>', 'तीन नंबरों से तारीख़', '<code>=DATE(2026,1,31)</code>', 'm=13 अगले साल का जनवरी बन जाता है'],
      ['<code>DAY / MONTH / YEAR</code>', 'तारीख़ से हिस्सा', '<code>=YEAR(A2)</code>', 'A2 असली तारीख़ होनी चाहिए, पाठ नहीं'],
      ['<code>HOUR / MINUTE / SECOND</code>', 'समय से हिस्सा', '<code>=HOUR(A2)</code>', 'shift/घंटे की गणना में'],
      ['<code>WEEKDAY(d,[type])</code>', 'सप्ताह का दिन (नंबर)', '<code>=WEEKDAY(A2,2)</code>', 'type 2 = सोम=1 … रवि=7 (भारत में सुविधाजनक)'],
      ['<code>WEEKNUM / ISOWEEKNUM</code>', 'साल का कौन-सा सप्ताह', '<code>=ISOWEEKNUM(A2)</code>', 'ISO में सप्ताह सोमवार से'],
      ['<code>EOMONTH(d, n)</code>', 'n महीने बाद/पहले का महीना-अंत', '<code>=EOMONTH(A2,0)</code>', 'वेतन/बिलिंग माह की आख़िरी तारीख़'],
      ['<code>EDATE(d, n)</code>', 'n महीने बाद वही तारीख़', '<code>=EDATE(A2,3)</code>', '3 माह की FD maturity'],
      ['<code>DATEDIF(start,end,unit)</code>', 'दो तारीख़ों का अंतर', '<code>=DATEDIF(A2,B2,"Y")</code>', '"Y" पूरे साल, "M" महीने, "D" दिन, "YM" साल छोड़कर महीने — आयु/अनुभव में'],
      ['<code>NETWORKDAYS / NETWORKDAYS.INTL</code>', 'कार्य-दिवस (छुट्टियाँ घटाकर)', '<code>=NETWORKDAYS(A2,B2,$H$2:$H$20)</code>', 'INTL में अपने सप्ताहांत (जैसे केवल रवि) चुन सकते हैं'],
      ['<code>WORKDAY / WORKDAY.INTL</code>', 'n कार्य-दिवस बाद की तारीख़', '<code>=WORKDAY(A2,15,$H$2:$H$20)</code>', 'delivery/अंतिम तिथि निकालने में'],
      ['<code>YEARFRAC(start,end,[basis])</code>', 'साल का अंश', '<code>=YEARFRAC(A2,B2,1)</code>', 'ब्याज की गणना में'],
      ['समय का जोड़ 24 घंटे से ऊपर', 'custom format <code>[h]:mm</code>', '<code>=SUM(C2:C30)</code> + format <code>[h]:mm</code>', 'साधारण <code>h:mm</code> 24 पर रीसेट हो जाता है — यही आम ग़लती'],
      ['तारीख़ पाठ बन गई हो', 'Text to Columns → Date (DMY)', 'या <code>=DATEVALUE(A2)</code>', 'भारतीय दिन-महीना-साल क्रम के लिए DMY चुनें']
    ]},

    { type: 'steps', items: [
      { n: 1, title: 'Raw शीट अलग रखें', text: 'मूल CSV/रिपोर्ट को <b>Raw</b> नाम की शीट पर ज्यों-का-त्यों paste करें। इस शीट को छूना नहीं — यही आपका प्रमाण है।', tips: ['शीट का रंग-टैब अलग रखें (जैसे लाल) ताकि ग़लती से न बदल जाए'], warn: 'Raw पर सीधे सफ़ाई करने पर मूल डेटा हमेशा के लिए खो जाता है' },
      { n: 2, title: 'डुप्लीकेट हटाएँ', text: 'Clean शीट पर डेटा लाकर <b>Data → Remove Duplicates</b> चलाएँ और सही कॉलम चुनें (जैसे केवल Roll, या Roll+Date)।', tips: ['पहले COUNTIF से गिन लें कि कितने डुप्लीकेट हैं', 'Excel Table (Ctrl+T) में यह बटन Table Design टैब पर भी मिलता है'] },
      { n: 3, title: 'स्पेस व case ठीक करें', text: 'helper कॉलम में <code>=TRIM(CLEAN(SUBSTITUTE(A2,CHAR(160)," ")))</code> और नामों पर <code>=PROPER(...)</code> चलाएँ।', tips: ['एक ही फ़ॉर्म्युला पूरी कॉलम में fill handle से नीचे तक ले जाएँ'] },
      { n: 4, title: 'नंबर व तारीख़ असली बनाएँ', text: 'टेक्स्ट-नंबर कॉलम चुनकर <b>Data → Text to Columns → Finish</b>; तारीख़ कॉलम पर वही जाकर तीसरे चरण में  Date → DMY चुनें।', tips: ['बायाँ संरेखण = टेक्स्ट, दायाँ = नंबर — यही तेज़ जाँच है'] },
      { n: 5, title: 'Paste Special → Values', text: 'साफ़ कॉलम चुनकर Copy, उसी जगह <b>Paste Special → Values</b>। अब helper कॉलम हटाए जा सकते हैं।', warn: ['Values किए बिना helper हटाया तो सारा डेटा #REF! हो जाएगा'] },
      { n: 6, title: 'Table में बदलें', text: 'साफ़ डेटा पर <b>Ctrl+T</b> दबाकर Excel Table बनाएँ और नाम दें (जैसे <code>tSales</code>)।', tips: ['Table में नई पंक्ति जोड़ते ही फ़ॉर्म्युला, चार्ट और Pivot की range अपने आप बढ़ती है', 'Structured reference: <code>=SUM(tSales[राशि])</code> — पढ़ने में साफ़ और न टूटने वाला'] }
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.1</span> PivotTable — हज़ारों पंक्तियों का सार, बिना एक भी फ़ॉर्म्युला</h3>
      <p>PivotTable का मतलब है <b>डेटा को घुमाकर (pivot) देखना</b> — वही हज़ारों पंक्तियाँ कभी क्षेत्र-वार, कभी माह-वार, कभी विक्रेता-वार। यह कोई नया डेटा नहीं बनाता, आपके डेटा का <b>cached सारांश</b> बनाता है। इसीलिए यह तेज़ है, और इसीलिए <b>स्रोत बदलने पर Refresh करना पड़ता है</b>।</p>
      <p>PivotTable बनाने की <b>पूर्व-शर्तें</b> (यही सबसे ज़्यादा पूछा जाता है): हर कॉलम का <b>एक ही एक header</b> हो, कोई ख़ाली header नहीं, कोई पूरी ख़ाली पंक्ति/कॉलम नहीं, कोई merged cell नहीं, और हर पंक्ति एक ही record की हो (यानी डेटा <b>flat/tabular</b> हो — पहले से बना हुआ cross-tab नहीं)। स्रोत को <b>Excel Table (Ctrl+T)</b> बना लेना सबसे अच्छा है, क्योंकि तब नई पंक्तियाँ अपने आप शामिल हो जाती हैं।</p>` },

    { type: 'steps', items: [
      { n: 1, title: 'स्रोत तैयार करें', text: 'ऊपर बताई शर्तें पूरी करें और डेटा को <b>Ctrl+T</b> से Table बनाकर नाम दें।', tips: ['header में स्पेस/विशेष चिह्न हों तो Pivot में field नाम अजीब दिख सकता है — सरल नाम रखें'] },
      { n: 2, title: 'Pivot डालें', text: 'Table में कहीं भी क्लिक करके <b>Insert → PivotTable</b>; "New Worksheet" चुनें और OK दबाएँ।', tips: ['Alt, D, P दबाकर पुराना PivotTable wizard भी खुलता है — multiple consolidation ranges के लिए यही चाहिए'] },
      { n: 3, title: 'चार क्षेत्रों में खींचें', text: 'दाईं ओर field list से — <b>Rows</b> में जिसके हिसाब से पंक्तियाँ चाहिए, <b>Columns</b> में जिसके हिसाब से कॉलम, <b>Values</b> में जिसका जोड़/गिनती चाहिए, <b>Filters</b> में पूरी रिपोर्ट पर लगने वाली छान।', tips: ['Values में पाठ वाला field डालेंगे तो Count लगेगा, नंबर वाला डालेंगे तो Sum — इसे Value Field Settings से बदल सकते हैं'] },
      { n: 4, title: 'गिनती/जोड़/औसत चुनें', text: 'Values क्षेत्र में field पर क्लिक → <b>Value Field Settings</b> → Sum/Count/Average/Max/Min चुनें; "Custom Name" से साफ़ नाम दें।', warn: ['नाम में वही पुराना field नाम नहीं रख सकते — Excel मना करेगा; एक स्पेस जोड़ दें या नया नाम दें'] },
      { n: 5, title: '% और अंतर दिखाएँ', text: 'उसी Value Field Settings → <b>Show Values As</b> → "% of Grand Total", "% of Parent Row", "Difference From", "Running Total In" आदि।', tips: ['एक ही field को Values में दो बार डालकर एक को राशि और दूसरे को % बना सकते हैं'] },
      { n: 6, title: 'Group करें', text: 'तारीख़ वाली Row पर right-click → <b>Group</b> → Months/Quarters/Years; नंबर वाली Row पर Group → interval (जैसे 1000 का स्लैब)।', tips: ['Group हटाना हो तो right-click → Ungroup'] },
      { n: 7, title: 'Slicer व Timeline जोड़ें', text: 'Pivot पर क्लिक → <b>PivotTable Analyze → Insert Slicer / Insert Timeline</b>; field चुनें। Slicer को कई Pivot से जोड़ना हो तो right-click → <b>Report Connections</b>।', tips: ['एक Dashboard में एक ही Slicer से चार Pivot+चार्ट एक साथ बदलते हैं — यही असली रिपोर्टिंग है'] },
      { n: 8, title: 'Refresh व स्थायी सेटअप', text: 'स्रोत बदला हो तो <b>Alt+F5</b> (या Analyze → Refresh)। स्थायी के लिए PivotTable Options → Data → "Refresh data when opening the file" टिक करें।', warn: ['Pivot cache पुरानी range याद रखता है — Table स्रोत हो तो range अपने आप बढ़ती है, साधारण range हो तो Analyze → Change Data Source करना पड़ेगा'] }
    ]},

    { type: 'table', head: ['Pivot का क्षेत्र', 'क्या रखते हैं', 'उदाहरण (बिक्री डेटा)', 'नतीजा'], rows: [
      ['<b>Rows</b>', 'जिसकी पंक्तियाँ चाहिए (category)', 'क्षेत्र, फिर शहर', 'बाईं ओर क्षेत्र/शहर की सूची; आगे-पीछे खींचकर drill-down'],
      ['<b>Columns</b>', 'जिसके कॉलम चाहिए (आम तौर पर समय)', 'माह', 'ऊपर जनवरी…दिसंबर के कॉलम'],
      ['<b>Values</b>', 'जिसका हिसाब चाहिए (number)', 'राशि → Sum; बिल → Count', 'हर cell में उस क्षेत्र+माह का कुल'],
      ['<b>Filters</b>', 'पूरी रिपोर्ट पर एक छान', 'वर्ष, विक्रेता', 'रिपोर्ट के ऊपर dropdown; एक मान चुनते ही सब बदल'],
      ['कुछ नहीं (ख़ाली Values)', '—', '—', 'Pivot ख़ाली दिखेगा — सबसे आम शुरुआती ग़लती']
    ]},

    { type: 'table', head: ['Value Field Settings विकल्प', 'क्या करता है', 'कब उपयोग'], rows: [
      ['Sum / Count / Average / Max / Min', 'गणना का प्रकार', 'राशि = Sum; बिलों की संख्या = Count; औसत बिल = Average'],
      ['Count Numbers / Count', 'Count Numbers केवल नंबर गिनता है, Count सब', 'पाठ वाली column में असली entries गिननी हों'],
      ['Show Values As → % of Grand Total', 'कुल का प्रतिशत', 'हिस्सेदारी बतानी हो'],
      ['Show Values As → % of Column/Row Total', 'उस कॉलम/पंक्ति के कुल का %', 'क्षेत्र के अंदर माह की हिस्सेदारी'],
      ['Show Values As → Difference From', 'आधार से अंतर', 'पिछले माह से कितना बढ़ा/घटा'],
      ['Show Values As → % Difference From', 'आधार से % बदलाव', 'वृद्धि दर (growth %)'],
      ['Show Values As → Running Total In', 'जोड़ता चलता है (cumulative)', 'आज तक कुल वसूली'],
      ['Show Values As → Rank Smallest/Largest', 'रैंक', 'टॉप-5 विक्रेता'],
      ['Number Format', 'दिखने का फ़ॉर्मैट (मान नहीं बदलता)', '₹ हज़ार separators, 2 दशमलव'],
      ['For empty cells show', 'ख़ाली cell की जगह 0 या "-"', 'रिपोर्ट साफ़ दिखे'],
      ['Calculated Field (Analyze → Fields, Items & Sets)', 'नया फ़ॉर्म्युला field', '<code>लाभ = राशि - लागत</code> — स्रोत में कॉलम जोड़े बिना'],
      ['Calculated Item', 'किसी field के अंदर नया आइटम', '"उत्तर+दक्षिण" को एक आइटम बनाना (सीमाएँ हैं)']
    ]},

    { type: 'callout', kind: 'warn', title: 'PivotTable की पाँच आम ग़लतियाँ', html: '<ol><li><b>Refresh नहीं किया</b> — स्रोत में 50 नई पंक्तियाँ जोड़ीं, Pivot पुराना आँकड़ा दिखा रहा है। <b>Alt+F5</b> दबाइए।</li><li><b>साधारण range स्रोत</b> — नई पंक्तियाँ शामिल ही नहीं होतीं। स्रोत को <b>Table</b> बनाइए।</li><li><b>Values में Count लगा है, Sum नहीं</b> — क्योंकि स्रोत कॉलम में कुछ सेल टेक्स्ट/ख़ाली हैं। पहले डेटा साफ़ कीजिए।</li><li><b>merged cells / ख़ाली header</b> — Pivot बनते ही error "field name is not valid"। header की एक पंक्ति, हर कॉलम का नाम।</li><li><b>Group नहीं हो रहा</b> — तारीख़ कॉलम में एक भी पाठ/ख़ाली सेल हो तो grouping टूट जाती है।</li></ol>'},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.2</span> Power Query — "एक बार सफ़ाई, हर बार अपने आप"</h3>
      <p>Power Query (Excel में <b>Data → Get Data</b>; Excel 2016+ में built-in, 2010/2013 में add-in) एक <b>ETL औज़ार</b> है — Extract (लाओ), Transform (साफ़/बदलो), Load (शीट या Data Model में डालो)। इसकी सबसे बड़ी ख़ूबी: आप जो कदम करते हैं वे <b>याद रखे जाते हैं</b> ("Applied Steps"), और अगली बार वही फ़ाइल नए डेटा के साथ आए तो बस <b>Refresh</b> — सारी सफ़ाई दोबारा अपने आप।</p>
      <p>Power Query की भाषा का नाम <b>M</b> है (case-sensitive, functional)। ज़्यादातर काम बटनों से हो जाते हैं, पर Advanced Editor में M कोड पढ़ना-सुधारना आना चाहिए। दूसरी भाषा <b>DAX</b> है जो Data Model / Power Pivot के measure में लगती है — दोनों अलग हैं, मिलाइए मत।</p>` },

    { type: 'table', head: ['Power Query का काम (Transform)', 'कहाँ मिलता है', 'क्या होता है'], rows: [
      ['Use First Row as Headers', 'Home / Transform', 'पहली पंक्ति को header बनाता है'],
      ['Remove Rows → Top/Bottom/Errors/Blank', 'Home', 'शिरोलेख (title) की फ़ालतू पंक्तियाँ, ख़ाली पंक्तियाँ हटाना'],
      ['Remove Duplicates', 'Home (कॉलम चुनकर)', 'चुने कॉलम के आधार पर डुप्लीकेट पंक्तियाँ'],
      ['Change Type', 'कॉलम के आइकॉन पर क्लिक', 'Text/Whole Number/Decimal/Date/DateTime — <b>सबसे ज़रूरी कदम</b>'],
      ['Split Column → By Delimiter / Number of Characters', 'Transform', 'एक कॉलम से कई कॉलम'],
      ['Merge Columns', 'Transform', 'कई कॉलम जोड़कर एक (separator चुनकर)'],
      ['Extract → Text Before/After Delimiter', 'Transform', 'पाठ का हिस्सा निकालना'],
      ['Format → Trim / Clean / Upper / Lower', 'Transform', 'स्पेस व case की सफ़ाई'],
      ['Replace Values', 'Transform', 'मान बदलना (null सहित)'],
      ['Fill → Down / Up', 'Transform', 'ख़ाली सेल को ऊपर/नीचे के मान से भरना — merged रिपोर्ट में बहुत काम का'],
      ['Unpivot Columns / Unpivot Other Columns', 'Transform', '<b>चौड़े cross-tab को लंबे flat डेटा में</b> — Pivot के लिए अनिवार्य'],
      ['Pivot Column', 'Transform', 'लंबे डेटा को चौड़ा करना (मान कॉलम चुनकर)'],
      ['Group By', 'Transform / Home', 'स्रोत में ही सारांश बनाना (SUM/COUNT)'],
      ['Append Queries', 'Home', 'एक जैसी संरचना वाली कई फ़ाइलें <b>ऊपर-नीचे जोड़ना</b> (12 माह की CSV)'],
      ['Merge Queries', 'Home', 'दो tables को key पर <b>बाएँ-दाएँ जोड़ना</b> — SQL JOIN जैसा (Left/Right/Full/Inner/Anti)'],
      ['From Folder', 'Get Data → From File', 'एक folder की सारी फ़ाइलें एक साथ; नई फ़ाइल रखते ही Refresh में शामिल'],
      ['Close & Load To…', 'Home', 'Table / Only Create Connection / <b>Add to Data Model</b> चुनना'],
      ['Advanced Editor', 'Home', 'पूरा M कोड देखना/संपादित करना']
    ]},

    { type: 'code', code: `// Power Query की M भाषा — Advanced Editor में ऐसा दिखता है
let
    Source   = Excel.Workbook(File.Contents("C:\\Reports\\Sales2026.xlsx"), null, true),
    Sheet    = Source{[Item="Raw",Kind="Sheet"]}[Data],
    Headers  = Table.PromoteHeaders(Sheet, [PromoteAllScalars=true]),
    Typed    = Table.TransformColumnTypes(Headers,{
                 {"तारीख़", type date}, {"राशि", type number}, {"क्षेत्र", type text}}),
    Trimmed  = Table.TransformColumns(Typed,{{"क्षेत्र", Text.Trim, type text}}),
    NoBlank  = Table.SelectRows(Trimmed, each [राशि] <> null and [राशि] <> 0),
    Added    = Table.AddColumn(NoBlank, "माह", each Date.Month([तारीख़]), Int64.Type),
    Grouped  = Table.Group(Added, {"क्षेत्र", "माह"},
                 {{"कुल", each List.Sum([राशि]), type number}})
in
    Grouped

// नोट: M में पाठ double quotes में, escape के लिए \\ ;
// each ... वाली पंक्ति "हर पंक्ति पर यह करो" कहती है।
// Applied Steps का हर नाम ऊपर के let-चर से मेल खाता है — यही Power Query की ताक़त है।` },

    { type: 'callout', kind: 'tip', title: 'फ़ॉर्म्युला, Pivot, Power Query — कौन कब?', html: '<table class="tbl"><tr><th>ज़रूरत</th><th>सही औज़ार</th><th>क्यों</th></tr><tr><td>एक सेल का हिसाब, तुरंत</td><td>फ़ॉर्म्युला</td><td>सबसे तेज़, हर वर्ज़न में चलता है</td></tr><tr><td>हज़ारों पंक्तियों का सार, घुमा-फिराकर देखना</td><td>PivotTable</td><td>बिना फ़ॉर्म्युला, drag-drop</td></tr><tr><td>हर माह वही गंदी फ़ाइल आती है</td><td><b>Power Query</b></td><td>कदम याद रहते हैं — बस Refresh</td></tr><tr><td>कई फ़ाइलें/शीटें जोड़नी हैं</td><td>Power Query (Append/Merge/From Folder)</td><td>फ़ॉर्म्युला से यह बहुत नाज़ुक होता है</td></tr><tr><td>लाखों पंक्तियाँ, कई tables के बीच संबंध</td><td>Power Pivot + Data Model + DAX</td><td>Excel की 10,48,576 पंक्ति की सीमा से आगे</td></tr></table>'},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.1</span> चार्ट — सही चार्ट चुनना आधा काम है</h3>
      <p>चार्ट का मक़सद <b>तुलना करवाना</b> है, सजाना नहीं। नियम सरल है: <b>समय के साथ बदलाव</b> दिखाना हो तो Line; <b>आपस में तुलना</b> हो तो Column/Bar; <b>हिस्सेदारी</b> हो तो Pie (और वह भी 5–6 हिस्सों तक); <b>दो नंबरों का संबंध</b> हो तो Scatter; <b>भौगोलिक</b> हो तो Map। ग़लत चार्ट सही डेटा को भी झूठा दिखा देता है — जैसे Pie में 12 हिस्से, या 3D चार्ट जिसमें आगे वाला हिस्सा बड़ा दिखता है।</p>
      <p><b>Chart बनाने का सबसे तेज़ तरीक़ा</b>: डेटा (header सहित) चुनकर <b>Alt+F1</b> उसी शीट पर, या <b>F11</b> नई chart-शीट पर। डेटा को Table बना लेना चाहिए ताकि नई पंक्ति आते ही चार्ट बढ़ जाए।</p>` },

    { type: 'table', head: ['चार्ट का प्रकार', 'कब सबसे सही', 'कब नहीं', 'नोट'], rows: [
      ['Column (खड़ा बार)', 'श्रेणियों की आपसी तुलना (क्षेत्र-वार बिक्री)', '12 से ज़्यादा श्रेणियाँ हों तो Bar बेहतर', 'Baseline हमेशा 0 से शुरू करें'],
      ['Bar (लेटा बार)', 'लंबे नाम वाली श्रेणियाँ, रैंकिंग', 'समय-श्रृंखला के लिए नहीं', 'नाम पढ़ने में आसान'],
      ['Line', 'समय के साथ रुझान (माह-वार)', 'अलग-अलग श्रेणियाँ जिनका क्रम नहीं', 'बहुत सारी lines =अव्यवस्थित जाल; 4–5 तक रखें'],
      ['Pie / Doughnut', 'कुल के हिस्से (≤5–6)', 'बहुत हिस्से, या तुलना दो pies में', '% label लगाएँ; 3D Pie कभी नहीं'],
      ['Stacked Column', 'कुल + उसके हिस्से दोनों', 'हिस्सों की आपसी तुलना करवानी हो', '100% Stacked = केवल हिस्सेदारी'],
      ['Scatter (XY)', 'दो नंबरों का संबंध (विज्ञापन खर्च बनाम बिक्री)', 'श्रेणी-नाम वाला डेटा', 'trendline व R² जोड़ सकते हैं'],
      ['Combo (Column + Line)', 'दो अलग इकाइयाँ (राशि ₹ और लाभ %)', 'एक ही इकाई हो तो साधारण चार्ट', '<b>Secondary axis</b> लगाना पड़ता है'],
      ['Histogram', 'वितरण (कितने विद्यार्थी किस अंक-स्लैब में)', 'श्रेणी तुलना', 'Excel 2016+ में built-in; वरना FREQUENCY + Column'],
      ['Box & Whisker', 'माध्यिका, चतुर्थक, outliers', 'आम पाठक के लिए कठिन', '2016+; सांख्यिकी रिपोर्ट में'],
      ['Waterfall', 'शुरुआती मान से अंतिम तक का सफ़र (लाभ-हानि)', 'समय-श्रृंखला', 'बढ़ोतरी/कमी अलग रंग में'],
      ['Treemap / Sunburst', 'पदानुक्रम (hierarchy) की हिस्सेदारी', 'सटीक तुलना', 'आकार से अनुमान लगता है, सटीक नहीं'],
      ['Map / Filled Map', 'राज्य/देश-वार डेटा', 'सटीक तुलना', 'नाम की spelling सही होनी चाहिए'],
      ['Sparkline', 'सेल के अंदर मिनी रुझान', 'विस्तृत विश्लेषण', 'Insert → Sparklines; पंक्ति-वार रुझान के लिए बढ़िया'],
      ['PivotChart', 'Pivot के साथ जुड़ा चार्ट', 'स्वतंत्र सेटअप', 'Slicer बदलते ही चार्ट बदलता है — Dashboard की जान']
    ]},

    { type: 'steps', items: [
      { n: 1, title: 'चार्ट डालें', text: 'header सहित डेटा चुनें → <b>Insert → Recommended Charts</b> या सीधे प्रकार चुनें। Alt+F1 = उसी शीट पर।', tips: ['Recommended Charts आपके डेटा को देखकर सलाह देता है — शुरुआत के लिए अच्छा'] },
      { n: 2, title: 'तत्व जोड़ें/हटाएँ', text: 'चार्ट के किनारे <b>+</b> (Chart Elements) से Chart Title, Axis Titles, Data Labels, Legend, Gridlines, Trendline चुनें।', tips: ['शीर्षक में केवल "बिक्री" नहीं — "क्षेत्र-वार बिक्री, जनवरी–जून 2026" लिखें'] },
      { n: 3, title: 'Combo + Secondary axis', text: 'चार्ट पर right-click → <b>Change Chart Type → Combo</b>; हर series के सामने प्रकार चुनें और दूसरी इकाई वाली series पर <b>Secondary Axis</b> टिक करें।', warn: ['दोनों axis का पैमाना अलग होता है — axis title में इकाई (₹ / %) ज़रूर लिखें, वरना पाठक धोखा खाएगा'] },
      { n: 4, title: 'Axis ठीक करें', text: 'Axis पर right-click → Format Axis → Minimum/Maximum, Major unit, Number format, "Values in reverse order", "Logarithmic scale"।', tips: ['Column chart का Minimum 0 रखें; काटकर दिखाने से छोटा अंतर भी पहाड़ जैसा लगता है'] },
      { n: 5, title: 'रंग व सुलभता', text: 'एक ही रंग-परिवार रखें, सबसे ज़रूरी series को अलग रंग दें। रंगों पर निर्भर न रहें — labels भी लगाएँ (वर्णांध पाठकों के लिए)।', tips: ['3D, छाया, चमक — सब हटा दें; डेटा-स्याही अनुपात (data-ink ratio) बढ़ाइए'] },
      { n: 6, title: 'Dynamic बनाएँ', text: 'स्रोत को Table बनाएँ, या नाम-परिभाषित range में <code>OFFSET/COUNTA</code> लगाएँ। PivotChart हो तो Slicer जोड़ें।', tips: ['चार्ट को किसी सेल से जोड़ना हो तो शीर्षक चुनकर formula bar में <code>=Sheet1!$B$1</code> लिखें — शीर्षक सेल से बदलेगा'] },
      { n: 7, title: 'छापा/निर्यात करें', text: 'चार्ट चुनकर File → Print → <b>Print Selected Chart</b>; या right-click → Save as Picture (PNG/SVG)।', tips: ['Word/PPT में paste करते समय Paste Special → Picture (Enhanced Metafile) दें तो साफ़ छपता है और लिंक नहीं टूटता'] }
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">5.1</span> What-If Analysis — "अगर ऐसा करूँ तो क्या होगा?"</h3>
      <p>अब तक आपने डेटा से जवाब निकाला। What-If इसका उल्टा है — <b>जवाब तय करके पूछना कि इनपुट क्या होना चाहिए</b>। Excel में इसके चार औज़ार हैं और चारों <b>Data → What-If Analysis</b> में मिलते हैं। Solver अलग add-in है (File → Options → Add-ins → Excel Add-ins → Go → Solver Add-in टिक करें)।</p>
      <p>चारों का फ़र्क़ एक पंक्ति में: <b>Goal Seek</b> = एक इनपुट बदलकर एक लक्ष्य; <b>Data Table</b> = एक/दो इनपुट की पूरी सूची डालकर नतीजों की तालिका; <b>Scenario Manager</b> = कई इनपुट के तैयार "सेट" सहेजकर अदला-बदली; <b>Solver</b> = कई इनपुट + कई बाधाएँ (constraints) + अधिकतम/न्यूनतम का लक्ष्य।</p>` },

    { type: 'table', head: ['औज़ार', 'कितने इनपुट बदलता है', 'क्या देता है', 'उदाहरण', 'सीमा'], rows: [
      ['<b>Goal Seek</b>', '1', 'उस इनपुट का मान जिससे लक्ष्य पूरा हो', '"लाभ ₹50,000 चाहिए तो कितनी इकाइयाँ बेचूँ?"', 'केवल एक cell; बाधाएँ नहीं; उत्तर सन्निकट (approximate)'],
      ['<b>Data Table (1-इनपुट)</b>', '1 (पूरी सूची)', 'हर मान के लिए नतीजों की कॉलम/पंक्ति', 'ब्याज दर 6%…12% पर EMI की तालिका', 'एक ही फ़ॉर्म्युला से जुड़ा होना चाहिए'],
      ['<b>Data Table (2-इनपुट)</b>', '2', 'दोनों के मेल का नतीजा-मैट्रिक्स', 'दर × अवधि पर EMI', 'प्रति तालिका केवल <b>एक</b> output फ़ॉर्म्युला'],
      ['<b>Scenario Manager</b>', 'कई (≤32 सेल प्रति scenario)', 'सहेजे हुए सेट + सारांश रिपोर्ट', '"आशावादी / सामान्य / मंदी" तीन बजट', 'सेट हाथ से बनाने पड़ते हैं'],
      ['<b>Solver</b>', 'कई (चर सेल) + बाधाएँ', 'अधिकतम/न्यूनतम/लक्ष्य-मान, बाधाओं के भीतर', '"लाभ अधिकतम, मज़दूरी ≤400 घंटे, कच्चा माल ≤1000 किग्रा"', 'add-in चालू करना पड़ता है; रैखिक मॉडल में Simplex LP चुनें'],
      ['<b>Watch Window</b>', 'कुछ नहीं (केवल निगरानी)', 'चुने सेल का मान हर बदलाव पर दिखता रहे', 'दूर की शीट का कुल लाभ देखते रहना', 'यह विश्लेषण नहीं, केवल जाँच है']
    ]},

    { type: 'steps', items: [
      { n: 1, title: 'मॉडल बनाएँ (तीन हिस्से)', text: 'एक शीट पर <b>इनपुट सेल</b> (इकाइयाँ, मूल्य, लागत), <b>गणना सेल</b> (आय = इकाइयाँ×मूल्य; लागत; लाभ), और <b>लक्ष्य सेल</b> (लाभ का फ़ॉर्म्युला) रखें। लक्ष्य सेल में फ़ॉर्म्युला होना अनिवार्य है।', tips: ['इनपुट सेल का रंग अलग रखें — यही मॉडल की पठनीयता है'] },
      { n: 2, title: 'Goal Seek चलाएँ', text: 'लक्ष्य सेल चुनें → Data → What-If Analysis → <b>Goal Seek</b> → "Set cell" = लक्ष्य, "To value" = 50000, "By changing cell" = इकाइयाँ वाला सेल → OK।', tips: ['Iteration नतीजा दशमलव में आ सकता है — ज़रूरत हो तो ROUND ऊपर लगाएँ'] },
      { n: 3, title: '1-इनपुट Data Table', text: 'एक कॉलम में अलग-अलग दरें लिखें; उसके ठीक ऊपर-दाएँ वाली सेल में EMI फ़ॉर्म्युला का संदर्भ दें; पूरा क्षेत्र चुनें → What-If → Data Table → <b>Column input cell</b> = दर वाला मूल सेल → OK।', warn: ['Data Table एक array फ़ॉर्म्युला (<code>{=TABLE(,B1)}</code>) बनाता है — उसके कुछ सेल अलग से नहीं मिटाए जा सकते; पूरी तालिका मिटानी पड़ती है'] },
      { n: 4, title: '2-इनपुट Data Table', text: 'बाईं कॉलम में एक इनपुट, ऊपर वाली पंक्ति में दूसरा; उनके कोने वाली सेल में output फ़ॉर्म्युला का संदर्भ; क्षेत्र चुनकर Data Table → Row input cell और Column input cell दोनों भरें।', tips: ['कोने वाली सेल को custom format <code>;;;</code> देकर छिपा सकते हैं ताकि तालिका साफ़ दिखे'] },
      { n: 5, title: 'Scenario सहेजें', text: 'What-If → Scenario Manager → Add → नाम ("मंदी") → changing cells चुनें → मान भरें। तीन scenario बनाकर <b>Summary</b> दबाएँ — नई शीट पर तुलना-रिपोर्ट बनती है।', tips: ['Show दबाकर शीट पर वह सेट लागू कर सकते हैं'] },
      { n: 6, title: 'Solver से अधिकतम लाभ', text: 'Solver → Set Objective = लाभ सेल → <b>Max</b> → By Changing Variable Cells = इकाइयाँ → Add constraints (घंटे ≤ 400, कच्चा माल ≤ 1000, इकाइयाँ ≥ 0, integer) → Solving Method = <b>Simplex LP</b> → Solve → Keep Solver Solution।', tips: ['रैखिक (सीधे गुणा-जोड़) मॉडल में Simplex LP सबसे सटीक; ग़ैर-रैखिक में GRG Nonlinear'] }
    ]},

    { type: 'callout', kind: 'danger', title: 'मैक्रो — सुरक्षा की रेखा जिसे पार नहीं करना', html: '<p>मैक्रो असल में <b>कोड</b> है, और कोड आपके कंप्यूटर पर फ़ाइलें पढ़/लिख/मिटा सकता है। इसलिए:</p><ol><li><b>अनजान स्रोत की .xlsm कभी "Enable Content" न दबाएँ।</b> ईमेल attachment, वेबसाइट, USB से आई फ़ाइल — पहले स्रोत की पुष्टि करें।</li><li>File → Options → Trust Center → Trust Center Settings → <b>Macro Settings</b> को "Disable all macros with notification" पर रखें (यही default और सही है)। "Enable all macros" कभी न चुनें।</li><li><b>Mark of the Web</b>: इंटरनेट से आई फ़ाइल पर Excel अब macros को पूरी तरह रोक देता है। इसे हटाने का एकमात्र सही तरीक़ा है — फ़ाइल के Properties में Unblock, और वह भी तभी जब स्रोत भरोसेमंद हो।</li><li>अपना मैक्रो <b>डिजिटल रूप से हस्ताक्षरित</b> (trusted certificate) करें ताकि दूसरों को चेतावनी न झेलनी पड़े।</li><li>Office की <b>VBA project password</b> सुरक्षा नहीं है — वह आसानी से खुल जाती है। संवेदनशील तर्क मैक्रो में न रखें।</li></ol>'},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">6.1</span> मैक्रो रिकॉर्डिंग व VBA — दोहराव वाला काम एक क्लिक में</h3>
      <p><b>Macro Recorder</b> आपके कदमों को VBA कोड में लिखता जाता है। यह सीखने का सबसे अच्छा तरीक़ा है: कोई काम रिकॉर्ड कीजिए, फिर <b>Alt+F11</b> खोलकर कोड पढ़िए — आपको Excel की object model (Application → Workbook → Worksheet → Range) अपने आप समझ आने लगेगी। रिकॉर्ड किया कोड अक्सर फ़ालतू की <code>Select</code>/<code>Selection</code> पंक्तियाँ रखता है; उन्हें हटाकर सीधे <code>Range(...)</code> पर काम करना तेज़ और साफ़ होता है।</p>
      <p>मैक्रो सहेजने के लिए फ़ाइल <b>.xlsm</b> (macro-enabled workbook) या <b>.xlsb</b> (binary, बड़ी फ़ाइलों में तेज़) होनी चाहिए। साधारण <b>.xlsx में मैक्रो सहेजा ही नहीं जाता</b> — Excel चेतावनी देगा और VB part गिरा देगा। Personal Macro Workbook (<code>PERSONAL.XLSB</code>) में रखे मैक्रो हर workbook में उपलब्ध रहते हैं।</p>` },

    { type: 'code', code: `' --- VBA: Alt+F11 → Insert → Module → यह कोड paste करें ---
Option Explicit

Sub FormatReport()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Worksheets("Report")

    ' रिकॉर्डर वाला Select/Selection हटाकर सीधा काम — तेज़ और साफ़
    With ws.Range("A1:F1")
        .Font.Bold = True
        .Interior.Color = RGB(31, 78, 121)
        .Font.Color = vbWhite
    End With

    ws.Columns("A:F").AutoFit
    ws.Range("D2:D500").NumberFormat = "#,##0.00"
    ws.Range("A1").Select
End Sub

Sub MakeSalesTable()
    Dim lastRow As Long, rng As Range
    lastRow = Cells(Rows.Count, "A").End(xlUp).Row   ' आख़िरी भरी पंक्ति
    Set rng = Range("A1:F" & lastRow)
    If wsExists("tSales") Then Exit Sub
    rng.Worksheet.ListObjects.Add(xlSrcRange, rng, , xlYes).Name = "tSales"
End Sub

Function wsExists(nm As String) As Boolean
    Dim sh As Worksheet
    For Each sh In ThisWorkbook.Worksheets
        If sh.Name = nm Then wsExists = True: Exit Function
    Next sh
End Function

' --- हर पंक्ति पर लूप: लाभ ऋणात्मक हो तो लाल ---
Sub FlagLoss()
    Dim r As Long, lastRow As Long
    lastRow = Cells(Rows.Count, 1).End(xlUp).Row
    Application.ScreenUpdating = False          ' तेज़ चलने के लिए
    For r = 2 To lastRow
        If Cells(r, 5).Value < 0 Then
            Cells(r, 5).Interior.Color = vbRed
            Cells(r, 5).Font.Color = vbWhite
        End If
    Next r
    Application.ScreenUpdating = True
End Sub` },

    { type: 'table', head: ['फ़ाइल / सेटिंग', 'क्या रखता है', 'कब चुनें', 'सावधानी'], rows: [
      ['<code>.xlsx</code>', 'केवल डेटा/फ़ॉर्म्युला — <b>मैक्रो नहीं</b>', 'सामान्य रिपोर्ट, सबसे सुरक्षित', 'मैक्रो सहेजने की कोशिश पर Excel VB part हटा देता है'],
      ['<code>.xlsm</code>', 'डेटा + VBA मैक्रो', 'मैक्रो वाली फ़ाइल बाँटनी हो', 'प्राप्तकर्ता को Enable Content दबाना पड़ेगा (यदि trusted न हो)'],
      ['<code>.xlsb</code>', 'binary — डेटा + मैक्रो', 'बहुत बड़ी/भारी फ़ाइल, तेज़ खुलना-सहेजना', 'कुछ तीसरे पक्ष के औज़ार इसे नहीं पढ़ पाते'],
      ['<code>.xltx / .xltm</code>', 'Template (बिना/साथ मैक्रो)', 'हर माह वही ढाँचा चाहिए', 'खोलने पर नई workbook बनती है, मूल नहीं बदलता'],
      ['<code>PERSONAL.XLSB</code>', 'आपके निजी global मैक्रो', 'हर फ़ाइल में एक जैसा काम', 'यह छिपी हुई workbook है; दूसरे PC पर ले जानी पड़ती है'],
      ['Macro Settings (Trust Center)', 'चार स्तर', '"Disable all with notification" रखें', '"Enable all" = कोई भी मैक्रो चुपचाप चल सकता है'],
      ['Trusted Locations', 'भरोसेमंद folder', 'अपना खुद का फ़ोल्डर', 'इसमें रखी फ़ाइल के मैक्रो बिना चेतावनी चलते हैं — इसे सार्वजनिक न बनाएँ'],
      ['Trusted Documents', 'एक बार Enable की गई फ़ाइलें', 'सुविधा', 'फ़ाइल बदल दी जाए तो भी भरोसा बना रह सकता है — सूची समय-समय पर साफ़ करें'],
      ['Digital Signature', 'कोड पर प्रमाणपत्र', 'ऑफ़िस में फ़ाइल बाँटनी हो', 'Self-signed cert दूसरों के PC पर trusted नहीं होता']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">7.1</span> पाँच असली प्रोजेक्ट — इन्हें करके देखिए</h3>
      <p>नीचे दिए गए पाँच लैब भाग 1 + भाग 2 की सारी तकनीक एक साथ माँगते हैं। हर लैब में <b>कच्चा डेटा → सफ़ाई → गणना → रिपोर्ट → चार्ट</b> की पूरी श्रृंखला है। इन्हें करने के बाद आप ऑफ़िस की असल फ़ाइल संभाल सकते हैं।</p>` },

    { type: 'labs', items: [
      { n: 130, title: 'बिक्री रिपोर्ट — Lookup + SUMIFS + Pivot + चार्ट', aim: 'कच्ची बिक्री शीट से क्षेत्र/माह-वार सारांश, % हिस्सेदारी और combo चार्ट बनाना।', tools: ['Excel 2016+', 'तीन शीट: Raw, Master, Report', 'Ctrl+T, Alt+F5'], steps: [
        'Raw शीट पर 200 पंक्तियाँ बनाएँ: दिनांक, बिल-नं, क्षेत्र, शहर, उत्पाद-कोड, मात्रा, दर। उत्पाद-कोड 8 अलग रखें।',
        'Master शीट पर उत्पाद-कोड, उत्पाद-नाम, लागत-दर लिखें। Raw में helper कॉलम लगाकर <code>=XLOOKUP([@कोड],Master!$A$2:$A$9,Master!$B$2:$B$9,"?",0)</code> (या INDEX+MATCH) से नाम और लागत लाएँ।',
        'राशि = मात्रा×दर; लाभ = राशि − मात्रा×लागत। पूरी Raw को Ctrl+T से <code>tSales</code> Table बनाएँ।',
        'Report शीट पर <code>=SUMIFS(tSales[राशि],tSales[क्षेत्र],$A2,tSales[माह],B$1)</code> का मैट्रिक्स बनाएँ (माह helper कॉलम <code>=MONTH([@दिनांक])</code> से)।',
        'उसी डेटा से PivotTable बनाएँ: Rows = क्षेत्र, Columns = माह, Values = राशि (Sum) और राशि (% of Grand Total)।',
        'Insert Slicer → वर्ष/क्षेत्र; Timeline → दिनांक। PivotChart (Combo: Column = राशि, Line = लाभ%) बनाएँ, secondary axis लगाएँ।',
        'Raw में 10 नई पंक्तियाँ जोड़कर <b>Alt+F5</b> दबाएँ और पुष्टि करें कि Table, SUMIFS, Pivot और चार्ट सब अपने आप बढ़े।'
      ], result: 'एक Dashboard शीट जिसमें Slicer हिलाते ही चारों आँकड़े बदलें; नई पंक्ति जोड़ने पर कुछ दोबारा न करना पड़े।' },

      { n: 131, title: 'Power Query — 12 माह की CSV को एक रिपोर्ट में जोड़ना', aim: 'एक folder की कई गंदी CSV फ़ाइलों को Append करके, साफ़ करके, Group By से सारांश बनाना और Refresh से दोहराना।', tools: ['Excel 2016+ (Data → Get Data)', '12 CSV फ़ाइलें एक folder में', 'Power Query Editor'], steps: [
        'एक folder <code>Sales2026</code> में 12 CSV बनाएँ (हर एक में ऊपर 2 फ़ालतू title पंक्तियाँ, फिर header, फिर डेटा; क्षेत्र नाम में आगे-पीछे स्पेस)।',
        'Excel → Data → Get Data → From File → <b>From Folder</b> → folder चुनें → Combine → Combine & Transform Data।',
        'नमूना फ़ाइल चुनें; Query Editor में Home → <b>Remove Rows → Remove Top Rows = 2</b>, फिर <b>Use First Row as Headers</b>।',
        'हर कॉलम का <b>Data Type</b> सेट करें (दिनांक = Date, राशि = Decimal Number, क्षेत्र = Text)।',
        'क्षेत्र कॉलम पर Transform → Format → <b>Trim</b>; राशि में null/0 हो तो Home → Remove Rows → Remove Errors और SelectRows से हटाएँ।',
        'Transform → <b>Group By</b> → क्षेत्र + माह के हिसाब से "कुल" = Sum of राशि।',
        'Home → <b>Close & Load To…</b> → Table + नई शीट। अब folder में 13वीं CSV रखकर <b>Data → Refresh All</b> दबाएँ — नया माह अपने आप शामिल।',
        'Advanced Editor खोलकर M कोड पढ़ें और अपने Applied Steps से मिलाएँ।'
      ], result: 'एक query जो folder की हर फ़ाइल उठा लेती है; सफ़ाई के कदम Applied Steps में दर्ज; Refresh एक क्लिक में।' },

      { n: 132, title: 'वेतन शीट — तारीख़ फंक्शन, NETWORKDAYS और What-If', aim: 'उपस्थिति से वेतन निकालना, कार्य-दिवस गिनना, और Goal Seek/Solver से लक्ष्य पूरा करना।', tools: ['Excel', 'छुट्टियों की सूची', 'Solver Add-in'], steps: [
        'कर्मचारी शीट: नाम, प्रति-दिन मज़दूरी, भत्ता %, कटौती %। उपस्थिति शीट: नाम, माह की हर तारीख़ पर P/A/L।',
        'कार्य-दिवस = <code>=NETWORKDAYS(माह-प्रारंभ,माह-अंत,छुट्टियाँ!$A$2:$A$20)</code>; उपस्थित दिन = <code>=COUNTIF(पंक्ति,"P")</code>।',
        'देय = उपस्थित×मज़दूरी; भत्ता = देय×भत्ता%; सकल = देय+भत्ता; कटौती = सकल×कटौती%; शुद्ध = सकल−कटौती।',
        'शुद्ध पर custom format <code>[Red]-#,##0.00;#,##0.00</code> लगाएँ; कुल पंक्ति में SUBTOTAL(9,…) डालें ताकि filter के बाद भी सही जोड़ दिखे।',
        'लक्ष्य सेल = कुल शुद्ध। Data → What-If → <b>Goal Seek</b>: "कुल शुद्ध = 5,00,000 करने के लिए भत्ता % कितना?" (changing cell = भत्ता %)।',
        '1-इनपुट Data Table: भत्ता 5%…25% पर कुल शुद्ध की तालिका। 2-इनपुट: भत्ता % × कटौती % का मैट्रिक्स।',
        '<b>Solver</b>: अधिकतम कुल शुद्ध, बाधाएँ — भत्ता ≤ 20%, कटौती ≥ 5%, प्रत्येक कर्मचारी का शुद्ध ≥ 0। Simplex LP से हल करें।',
        'Scenario Manager में "कम भत्ता / अधिक भत्ता" दो सेट सहेजकर Summary रिपोर्ट बनाएँ।'
      ], result: 'वेतन शीट जो कार्य-दिवस व छुट्टियाँ सही गिनती है, और Goal Seek/Data Table/Solver से बजट के सवाल तुरंत सुलझाती है।' },

      { n: 133, title: 'मैक्रो — एक क्लिक में मासिक रिपोर्ट तैयार करना', aim: 'रिकॉर्डिंग से शुरू करके साफ़ VBA लिखना, बटन से जोड़ना और .xlsm में सुरक्षित सहेजना।', tools: ['Excel (Developer टैब चालू)', 'Alt+F11 VBA Editor', '.xlsm'], steps: [
        'File → Options → Customize Ribbon → <b>Developer</b> टिक करें। Trust Center → Macro Settings = "Disable all macros with notification"।',
        'Developer → <b>Record Macro</b> → नाम <code>FormatReport</code>, Shortcut <code>Ctrl+Shift+R</code>, Store in = This Workbook → OK।',
        'header पंक्ति bold + रंग, कॉलम AutoFit, राशि कॉलम पर <code>#,##0.00</code>, freeze top row — रिकॉर्ड करते जाएँ → Stop Recording।',
        '<b>Alt+F11</b> खोलकर कोड पढ़ें। फ़ालतू <code>.Select</code>/<code>Selection</code> हटाकर सीधे <code>With ws.Range("A1:F1") … End With</code> लिखें।',
        'आख़िरी पंक्ति गतिशील करें: <code>lastRow = Cells(Rows.Count,"A").End(xlUp).Row</code> और ranges को <code>"D2:D" & lastRow</code> बनाएँ।',
        'लूप जोड़ें: लाभ ऋणात्मक हो तो उस सेल को लाल; <code>Application.ScreenUpdating = False/True</code> से तेज़ करें।',
        'शीट पर Developer → Insert → <b>Button (Form Control)</b> बनाकर मैक्रो assign करें।',
        '<b>.xlsm</b> में सहेजें। फ़ाइल बंद करके दोबारा खोलें, Enable Content दबाकर बटन चलाएँ। फिर .xlsx में Save As करके देखें कि Excel मैक्रो हटाने की चेतावनी देता है।'
      ], result: 'एक बटन जो किसी भी लंबाई की रिपोर्ट को सही फ़ॉर्मैट दे; कोड साफ़, गतिशील lastRow के साथ; .xlsx बनाम .xlsm का फ़र्क़ प्रत्यक्ष।' },

      { n: 134, title: 'डेटा सफ़ाई परीक्षा — गंदी शीट को Pivot-योग्य बनाना', aim: 'merged cells, ख़ाली header, टेक्स्ट-नंबर, तारीख़-पाठ, डुप्लीकेट और cross-tab को पहचानकर ठीक करना।', tools: ['Excel', 'TRIM/CLEAN/SUBSTITUTE', 'Text to Columns', 'Power Query Unpivot'], steps: [
        'जान-बूझकर गंदी शीट बनाएँ: ऊपर 3 merged title पंक्तियाँ, एक ख़ाली header कॉलम, राशि कुछ सेल में टेक्स्ट, दिनांक पाठ में, 10 डुप्लीकेट पंक्तियाँ, और माह के 12 कॉलम (cross-tab)।',
        'Pivot बनाने की कोशिश करें — "field name is not valid" error देखें और कारण लिखें।',
        'title पंक्तियाँ हटाएँ, हर कॉलम को एक header दें, merged cells हटाएँ।',
        'राशि कॉलम: Data → Text to Columns → Finish। दिनांक कॉलम: Text to Columns → Date → <b>DMY</b>।',
        'नाम/क्षेत्र पर helper में <code>=TRIM(CLEAN(SUBSTITUTE(A2,CHAR(160)," ")))</code>, फिर Paste Special → Values।',
        'Data → Remove Duplicates (सही key चुनकर) — पहले COUNTIF से गिनती मिलाएँ।',
        '12 माह वाले cross-tab को Power Query में लाकर <b>Unpivot Other Columns</b> करें → तीन कॉलम बनेंगे (नाम, माह, राशि)।',
        'अब Pivot बनाएँ: Rows = नाम, Columns = माह, Values = राशि। Group करके Quarter भी दिखाएँ।'
      ], result: 'वही डेटा जो पहले Pivot नहीं बना पा रहा था, अब साफ़ flat table बनकर Pivot/चार्ट दोनों दे रहा है — और हर सुधार का कारण लिखा हुआ है।' }
    ]},

    { type: 'acc', title: 'FAQ — Excel भाग 2', items: [
      { q: 'VLOOKUP में चौथा argument 0 क्यों ज़रूरी है?', a: 'छोड़ने पर TRUE (approximate) माना जाता है, जो sorted डेटा पर "सबसे पास का छोटा मान" लौटाता है। डेटा unsorted हो तो Excel चुपचाप ग़लत जवाब देगा — error भी नहीं दिखाएगा। exact match के लिए हमेशा <code>,0)</code> या <code>,FALSE)</code> लिखें।' },
      { q: 'XLOOKUP नहीं चल रहा, #NAME? आ रहा है?', a: 'XLOOKUP केवल Microsoft 365 और Excel 2021+ में है। 2016/2019 में फ़ॉर्म्युला <code>_xlfn.XLOOKUP</code> बन जाता है और #NAME? देता है। वहाँ <code>INDEX(range, MATCH(key, keyrange, 0))</code> इस्तेमाल करें — यह हर वर्ज़न में चलता है।' },
      { q: 'SUMIF और SUMIFS में argument का क्रम अलग क्यों है?', a: 'SUMIF पुराना फ़ॉर्म्युला है: <code>SUMIF(देखने-वाली-range, शर्त, [जोड़ने-वाली-range])</code>। SUMIFS ने कई शर्तें जोड़ीं तो जोड़ने वाली range को सबसे आगे रखा: <code>SUMIFS(जोड़ने-वाली-range, range1, शर्त1, range2, शर्त2, …)</code>। यही सबसे आम भूल है।' },
      { q: 'PivotTable में Sum की जगह Count क्यों लग जाता है?', a: 'Values में डाली गई स्रोत कॉलम में एक भी सेल टेक्स्ट या ख़ाली हो तो Excel Count लगा देता है। पहले उस कॉलम को Text to Columns/VALUE से असली नंबर बनाएँ, फिर Value Field Settings में Sum चुनें।' },
      { q: 'Pivot में नई पंक्तियाँ क्यों नहीं दिखतीं?', a: 'दो कारण — (1) Refresh नहीं किया (<b>Alt+F5</b>), (2) स्रोत साधारण range थी जो नई पंक्तियों तक नहीं बढ़ी। स्रोत को <b>Excel Table (Ctrl+T)</b> बना दें तो range अपने आप बढ़ती है; फिर भी Refresh दबाना पड़ता है।' },
      { q: 'Power Query और macro में क्या फ़र्क़ है?', a: 'Power Query डेटा लाने/साफ़ करने/जोड़ने के लिए है और उसके कदम <b>डेटा पर</b> लागू होते हैं — सुरक्षित, कोई कोड-सुरक्षा चेतावनी नहीं। Macro (VBA) Excel के <b>किसी भी हिस्से</b> को बदल सकता है — फ़ॉर्मैट, शीट, फ़ाइल, प्रिंट — इसलिए शक्तिशाली पर सुरक्षा-जोखिम वाला। डेटा सफ़ाई के लिए Power Query, बाक़ी स्वचालन के लिए VBA।' },
      { q: 'Unpivot किसे कहते हैं और क्यों ज़रूरी है?', a: 'चौड़े cross-tab (12 माह के 12 कॉलम) को लंबे flat डेटा में बदलना — तीन कॉलम: नाम, माह, राशि। Pivot और Power Query दोनों <b>flat डेटा</b> माँगते हैं; चौड़ा डेटा Pivot में माह-वार grouping नहीं दे पाता।' },
      { q: 'Data Table का नतीजा मिटता क्यों नहीं?', a: 'Data Table एक <b>array फ़ॉर्म्युला</b> <code>{=TABLE( row-input, col-input )}</code> बनाता है। उसके किसी एक सेल को नहीं मिटा सकते — पूरी तालिका चुनकर मिटाना पड़ता है। यही "You cannot change part of an array" error का कारण है।' },
      { q: 'Solver और Goal Seek में कब कौन?', a: 'एक इनपुट बदलकर एक लक्ष्य चाहिए → Goal Seek। कई इनपुट + बाधाएँ (संसाधन की सीमा) + अधिकतम/न्यूनतम चाहिए → Solver। Solver add-in है, इसे File → Options → Add-ins से चालू करना पड़ता है।' },
      { q: 'मैक्रो .xlsx में सहेजा क्यों नहीं जाता?', a: '.xlsx फ़ॉर्मैट में VBA part रखने की अनुमति ही नहीं है (सुरक्षा के लिए)। मैक्रो रखना हो तो <b>.xlsm</b> या <b>.xlsb</b> चुनें। .xlsx में Save As करने पर Excel चेतावनी देता है कि VB project हट जाएगा।' },
      { q: 'Secondary axis कब लगाएँ और क्या सावधानी रखें?', a: 'जब दो series की इकाइयाँ अलग हों (राशि ₹ में हज़ारों, लाभ % में 0–100)। सावधानी — दोनों axis का पैमाना अलग होता है, इसलिए axis title में इकाई ज़रूर लिखें वरना पाठक ग़लत तुलना करेगा। एक ही इकाई हो तो secondary axis न लगाएँ।' },
      { q: 'तारीख़ का अंतर महीनों में कैसे निकालें?', a: '<code>=DATEDIF(A2,B2,"M")</code> पूरे महीने देता है; "Y" पूरे साल, "YM" साल छोड़कर बचे महीने। आयु लिखनी हो तो <code>=DATEDIF(A2,TODAY(),"Y")&" साल "&DATEDIF(A2,TODAY(),"YM")&" माह"</code>। DATEDIF छिपा हुआ फ़ॉर्म्युला है — टाइप करने पर ही चलता है, सूची में नहीं दिखता।' },
      { q: 'घंटों का जोड़ 24 पर रीसेट क्यों हो जाता है?', a: 'समय फ़ॉर्मैट <code>h:mm</code> 24 घंटे के बाद शून्य से शुरू होता है। कुल घंटे चाहिए तो custom format <code><b>[h]:mm</b></code> लगाएँ — वर्ग-कोष्ठक elapsed (बीता हुआ) समय दिखाता है।' },
      { q: 'बहुत बड़ी फ़ाइल धीमी क्यों हो जाती है, क्या करें?', a: 'कारण अक्सर — पूरे कॉलम वाले array फ़ॉर्म्युला (<code>A:A</code>), हज़ारों conditional formatting नियम, अनावश्यक Pivot cache, बहुत सारे volatile फंक्शन (NOW/TODAY/INDIRECT/OFFSET)। उपाय: ranges सीमित करें या Table लें, फ़ॉर्म्युला को Power Query/Pivot में बदलें, अनावश्यक शीटें हटाएँ, .xlsb में सहेजें, और Calculation को Manual करके ज़रूरत पर F9 दबाएँ।' }
    ]},

    { type: 'quiz', store: 'off-excel-2', items: [
      { q: 'VLOOKUP में exact match के लिए चौथा argument क्या होना चाहिए?', o: ['TRUE या 1', 'FALSE या 0', 'ख़ाली छोड़ दें', '2'], a: 1, ex: 'FALSE/0 = exact match। छोड़ने पर TRUE (approximate) माना जाता है जो unsorted डेटा पर ग़लत जवाब दे सकता है।' },
      { q: 'VLOOKUP की कौन-सी सीमा INDEX+MATCH दूर करता है?', o: ['तेज़ी से चलना', 'Lookup column का table के पहले कॉलम में होना अनिवार्य', 'फ़ाइल का आकार', 'रंग भरना'], a: 1, ex: 'INDEX+MATCH में key किसी भी कॉलम में हो सकती है और कॉलम जोड़ने-हटाने से फ़ॉर्म्युला नहीं टूटता।' },
      { q: 'XLOOKUP किन वर्ज़न में उपलब्ध है?', o: ['Excel 2010 से', 'Excel 2016 से', 'Microsoft 365 और Excel 2021 से', 'सभी वर्ज़न में'], a: 2, ex: 'पुराने वर्ज़न में यह _xlfn.XLOOKUP बनकर #NAME? देता है; वहाँ INDEX+MATCH अपनाएँ।' },
      { q: 'SUMIFS में पहला argument क्या होता है?', o: ['criteria_range', 'criteria', 'sum_range (जोड़ने वाली range)', 'sheet का नाम'], a: 2, ex: 'SUMIFS(sum_range, cr_range1, cr1, …) — SUMIF से क्रम उल्टा है, यही आम जाल है।' },
      { q: 'SUMIFS में कई शर्तों के बीच कौन-सा तर्क लगता है?', o: ['OR', 'AND', 'NOT', 'XOR'], a: 1, ex: 'सभी शर्तें सही होनी चाहिए (AND)। OR के लिए दो SUMIFS जोड़ें या array constant {"क","ख"} दें।' },
      { q: 'सेल B1 की सीमा से बड़ी राशि जोड़नी हो तो criteria कैसे लिखेंगे?', o: ['">B1"', '">"&B1', '">"B1', 'B1>'], a: 1, ex: 'चिह्न कोट में और सेल-संदर्भ बाहर, दोनों को & से जोड़ना पड़ता है: ">"&B1।' },
      { q: 'PivotTable बनाने के लिए स्रोत डेटा कैसा होना चाहिए?', o: ['पहले से cross-tab', 'merged cells वाला', 'flat — हर कॉलम का एक header, कोई ख़ाली header/पंक्ति नहीं', 'रंगीन'], a: 2, ex: 'Flat/tabular डेटा अनिवार्य है; merged cell या ख़ाली header पर "field name is not valid" आता है।' },
      { q: 'स्रोत डेटा बदलने के बाद PivotTable को क्या करना पड़ता है?', o: ['दोबारा बनाना', 'Refresh (Alt+F5)', 'फ़ाइल बंद करना', 'कुछ नहीं'], a: 1, ex: 'Pivot अपना cache रखता है; Refresh से नया डेटा आता है। Table स्रोत हो तो range भी अपने आप बढ़ती है।' },
      { q: 'PivotTable के किस क्षेत्र में "राशि" डालेंगे ताकि कुल दिखे?', o: ['Rows', 'Columns', 'Values', 'Filters'], a: 2, ex: 'Values में गणना होती है (Sum/Count/Average…)। Rows/Columns श्रेणियाँ बनाते हैं, Filters पूरी रिपोर्ट पर छान लगाता है।' },
      { q: 'Values में Count की जगह Sum क्यों नहीं लग रहा?', o: ['Pivot पुराना है', 'स्रोत कॉलम में कुछ सेल टेक्स्ट/ख़ाली हैं', 'राशि बहुत बड़ी है', 'Excel बंद है'], a: 1, ex: 'एक भी non-numeric सेल हो तो Excel Count लगा देता है। कॉलम को असली नंबर बनाकर Value Field Settings में Sum चुनें।' },
      { q: 'चौड़े cross-tab (12 माह के कॉलम) को flat बनाने की क्रिया क्या कहलाती है?', o: ['Pivot Column', 'Unpivot Columns', 'Group By', 'Merge'], a: 1, ex: 'Unpivot Columns/Unpivot Other Columns चौड़े डेटा को नाम-माह-राशि जैसे लंबे flat रूप में बदलता है।' },
      { q: 'Power Query की भाषा का नाम क्या है?', o: ['DAX', 'VBA', 'M', 'SQL'], a: 2, ex: 'Power Query = M भाषा (case-sensitive)। DAX Data Model/Power Pivot के measure की भाषा है — दोनों अलग हैं।' },
      { q: 'एक folder की 12 CSV फ़ाइलें एक साथ लानी हों तो कौन-सा विकल्प?', o: ['From Text/CSV', 'From Folder', 'From Web', 'From Table'], a: 1, ex: 'Get Data → From File → From Folder; Combine & Transform से सब जुड़ती हैं और नई फ़ाइल रखने पर Refresh में शामिल हो जाती है।' },
      { q: 'दो अलग इकाइयों (₹ और %) वाली series एक चार्ट में दिखानी हों तो?', o: ['दोनों को Pie में', 'Combo chart + Secondary Axis', '3D Column', 'केवल Line'], a: 1, ex: 'Change Chart Type → Combo में एक series को Column, दूसरी को Line रखकर Secondary Axis टिक करें; axis title में इकाई ज़रूर लिखें।' },
      { q: 'समय के साथ रुझान दिखाने का सबसे सही चार्ट कौन-सा है?', o: ['Pie', 'Line', 'Doughnut', 'Treemap'], a: 1, ex: 'Line chart समय-श्रृंखला के रुझान के लिए है; Pie हिस्सेदारी के लिए, Scatter दो नंबरों के संबंध के लिए।' },
      { q: 'एक इनपुट बदलकर तय लक्ष्य तक पहुँचने वाला What-If औज़ार कौन-सा है?', o: ['Data Table', 'Scenario Manager', 'Goal Seek', 'Solver'], a: 2, ex: 'Goal Seek = एक changing cell, एक target value। कई चर + बाधाएँ + Max/Min हो तो Solver।' },
      { q: '2-इनपुट Data Table में कितने output फ़ॉर्म्युला हो सकते हैं?', o: ['कोई नहीं', 'केवल एक', 'दो', 'जितने चाहें'], a: 1, ex: 'प्रति Data Table केवल एक output फ़ॉर्म्युला का संदर्भ कोने वाली सेल में दिया जाता है।' },
      { q: 'मैक्रो सहेजने के लिए कौन-सा फ़ॉर्मैट चाहिए?', o: ['.xlsx', '.xlsm या .xlsb', '.csv', '.pdf'], a: 1, ex: '.xlsx में VBA part सहेजा ही नहीं जाता। .xlsm (macro-enabled) या .xlsb (binary) चुनें।' },
      { q: 'Macro Settings का सबसे सुरक्षित व्यवहारिक विकल्प क्या है?', o: ['Enable all macros', 'Disable all macros without notification', 'Disable all macros with notification', 'कोई सेटिंग नहीं'], a: 2, ex: '"Disable all with notification" — ज़रूरत पर आप स्वयं Enable करते हैं। "Enable all" किसी भी अनजान मैक्रो को चुपचाप चलने देता है।' },
      { q: '24 घंटे से अधिक कुल समय दिखाने के लिए कौन-सा custom format?', o: ['h:mm', '[h]:mm', 'hh:mm:ss', 'dd:h'], a: 1, ex: 'वर्ग-कोष्ठक elapsed समय दिखाता है; साधारण h:mm 24 पर रीसेट हो जाता है।' },
      { q: 'दो तारीख़ों के बीच पूरे महीने निकालने का फंक्शन?', o: ['MONTH()', 'DATEDIF(start,end,"M")', 'DAYS()', 'YEARFRAC()'], a: 1, ex: 'DATEDIF का unit "M" पूरे महीने, "Y" पूरे साल, "YM" साल छोड़कर बचे महीने देता है। यह छिपा फंक्शन है, टाइप करने पर चलता है।' },
      { q: 'SUMPRODUCT का सबसे आम उपयोग क्या है?', o: ['पाठ जोड़ना', 'दो columns का गुणा करके जोड़ना (मात्रा×दर)', 'तारीख़ निकालना', 'चार्ट बनाना'], a: 1, ex: '=SUMPRODUCT(qty_range, price_range) बिना helper column कुल राशि देता है; boolean शर्तों के साथ यह जटिल AND/OR गणना भी करता है।' }
    ]},

    { type: 'callout', kind: 'exam', title: 'परीक्षा/इंटरव्यू — Excel भाग 2 के पक्के बिंदु', html: '<ul><li><b>VLOOKUP</b> = बायाँ पहला कॉलम + col_index गिनती + चौथा argument <b>0/FALSE</b> अनिवार्य।</li><li><b>INDEX+MATCH</b> = key कहीं भी, कॉलम जुड़ने पर न टूटे; <b>XLOOKUP</b> = 365/2021+, default exact, if_not_found अंदर।</li><li><b>SUMIFS(sum_range, cr_range1, cr1, …)</b> — SUMIF से क्रम उल्टा; शर्तें <b>AND</b>; ranges बराबर लंबाई।</li><li>सेल से शर्त: <code>"&gt;="&amp;B1</code>; खाली <code>""</code>; भरा <code>"&lt;&gt;"</code>; wildcard <code>*</code>/<code>?</code>, escape <code>~</code>।</li><li><b>Pivot के चार क्षेत्र</b>: Rows, Columns, Values, Filters। स्रोत flat + एक header; <b>Alt+F5</b> = Refresh।</li><li>Show Values As: % of Grand Total, Difference From, Running Total, Rank।</li><li><b>Power Query = M भाषा</b>; ETL; Applied Steps याद; Append = ऊपर-नीचे, Merge = JOIN; <b>Unpivot</b> = चौड़े से लंबा।</li><li><b>Power Pivot/DAX</b> Data Model के लिए — Power Query से अलग।</li><li>चार्ट: समय → Line, तुलना → Column/Bar, हिस्सेदारी → Pie (≤6), संबंध → Scatter, दो इकाई → <b>Combo + Secondary axis</b>। Alt+F1 = उसी शीट, F11 = chart-शीट।</li><li>What-If: <b>Goal Seek</b> (1 चर, 1 लक्ष्य), <b>Data Table</b> (1/2 चर की तालिका, 1 output), <b>Scenario</b> (≤32 सेल), <b>Solver</b> (कई चर + बाधाएँ + Max/Min, add-in)।</li><li>मैक्रो: <b>.xlsm/.xlsb</b> में सहेजें, Alt+F11 = VBA, Alt+F8 = macro सूची; Trust Center = "Disable all with notification"; अनजान फ़ाइल पर Enable Content न दबाएँ।</li><li>तारीख़: <code>DATEDIF(...,"Y"/"M"/"YM")</code>, <code>NETWORKDAYS</code>, <code>EOMONTH</code>, <code>WORKDAY</code>; 24 घंटे से ऊपर <code>[h]:mm</code>।</li><li>Excel की सीमा: <b>10,48,576 पंक्तियाँ × 16,384 कॉलम (XFD)</b>।</li></ul>'},

    { type: 'pills', items: [
      { text: 'VLOOKUP → INDEX+MATCH → XLOOKUP', kind: 'info' },
      { text: 'SUMIFS का क्रम याद रखें', kind: 'warn' },
      { text: 'Pivot = flat स्रोत + Alt+F5', kind: 'ok' },
      { text: 'Power Query = M, Power Pivot = DAX', kind: 'info' },
      { text: 'Unpivot से चौड़ा डेटा लंबा', kind: 'tip' },
      { text: 'दो इकाई = Combo + Secondary axis', kind: 'tip' },
      { text: 'Goal Seek 1 चर, Solver कई चर + बाधाएँ', kind: 'info' },
      { text: 'मैक्रो .xlsm में, अनजान पर Enable नहीं', kind: 'danger' }
    ]},
  ]
}
]);
