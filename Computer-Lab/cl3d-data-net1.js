/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-net1.js
   इंटरनेट व साइबर सुरक्षा — भाग 1
     M59 : इंटरनेट कैसे काम करता है (net-web)
     M60 : ब्राउज़र व वेब टूल्स (net-browser)
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   59. इंटरनेट कैसे काम करता है
   =================================================================== */
{
  id: 'net-web', icon: '🌍', group: 'इंटरनेट व साइबर सुरक्षा',
  title: 'इंटरनेट कैसे काम करता है — केबल से लेकर पन्ने दिखने तक',
  sub: 'इतिहास, ISP व समुद्री केबल, DNS, IP पता, NAT, IPv6, प्रोटोकॉल, HTTP व ट्रूबलशूटिंग',
  kicker: 'Internet 1 · How the Internet Actually Works',
  hero: 'यह पेज "इंटरनेट आता है या नहीं" से आगे जाकर बताता है कि <b>इंटरनेट के अंदर क्या-क्या है</b> — ARPANET से WWW तक का इतिहास, ISP के तीन स्तर (tier), समुद्री फ़ाइबर, IXP, DNS की जड़, IP पता और सबनेट की गणित, NAT, IPv6, MAC, पोर्ट, HTTP/HTTPS, कोकी (cookie) — और आख़िर में "इंटरनेट नहीं चल रहा" का पूरा फ़्लो। ITI/सर्विसिंग के हर नेटवर्क प्रश्न का जवाब यहीं मिलेगा।',
  tags: ['ARPANET 1969 से WWW 1991', 'ISP Tier 1/2/3', 'DNS रिकॉर्ड व रिज़ॉल्यूशन', 'IPv4/IPv6 व सबनेट', 'NAT व पोर्ट', 'HTTP/HTTPS व पोर्ट', 'ट्रूबलशूटिंग फ़्लो'],
  blocks: [

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.1</span> इंटरनेट है क्या — "नेटवर्क ऑफ़ नेटवर्क्स"</h3>
      <p><b>इंटरनेट (Internet)</b> एक अकेला नेटवर्क या एक कंपनी नहीं — यह दुनिया भर के करोड़ों नेटवर्कों (घरेलू LAN, कॉलेज नेटवर्क, ISP का बैकबोन, मोबाइल नेटवर्क, समुद्री केबल) को <b>आपस में जोड़ने वाला नेटवर्क</b> है, जिसे सही अर्थ में "network of networks" कहते हैं। इसे जोड़ने का एक ही आम नियम है — <b>TCP/IP (Transmission Control Protocol / Internet Protocol)</b> प्रोटोकॉल परिवार। जब तक दो मशीनें TCP/IP बोलती हैं, वे अलग ब्रांड, अलग OS, अलग केबल पर होकर भी बात कर सकती हैं।</p>
      <p>तीन शब्द परीक्षा में उलझाते हैं, इन्हें अलग समझिए:</p>
      <table class="tbl">
        <tr><th>शब्द</th><th>पूरा नाम / अर्थ</th><th>सीमा</th><th>उदाहरण</th></tr>
        <tr><td>PAN</td><td>Personal Area Network — व्यक्ति तक सीमित</td><td>1–10 मीटर</td><td>Bluetooth हेडफ़ोन, USB से फ़ाइल कॉपी</td></tr>
        <tr><td>LAN</td><td>Local Area Network — एक जगह का नेटवर्क</td><td>एक कमरा/इमारत</td><td>लैब के 40 PC स्विच से जुड़े</td></tr>
        <tr><td>MAN</td><td>Metropolitan Area Network — शहर</td><td>एक शहर</td><td>सिटी वाइड फ़ाइबर नेट, IXP</td></tr>
        <tr><td>WAN</td><td>Wide Area Network — दूर-दराज़</td><td>देश/महाद्वीप</td><td>बैंक की शाखाएँ, ISP बैकबोन</td></tr>
        <tr><td>Intranet</td><td>संस्था का निजी नेटवर्क (इंटरनेट तकनीक पर)</td><td>अंदर, लॉगिन से बंद</td><td>कॉलेज/कंपनी का पोर्टल</td></tr>
        <tr><td>Extranet</td><td>Intranet का थोड़ा खुला हिस्सा — साझेदारों के लिए</td><td>चुनिंदा बाहरी लोग</td><td>सप्लायर पोर्टल</td></tr>
        <tr><td>Internet</td><td>सार्वभौमिक WAN — TCP/IP पर सब जुड़े</td><td>पूरी दुनिया</td><td>जो आप रोज़ चलाते हैं</td></tr>
      </table>
      <h4 class="blk2">पैकेट स्विचिंग — इंटरनेट की असली क्रांति</h4>
      <p>पुरानी टेलीफ़ोन लाइन <b>सर्किट स्विचिंग (circuit switching)</b> पर चलती थी — डायल करते ही दो केंद्रों के बीच एक पूरी आरक्षित (dedicated) तार-रेखा बन जाती थी और कॉल टूटने तक वह आपके ही पास रहती थी, खाली पड़ी हो तो भी। इंटरनेट ने <b>पैकेट स्विचिंग (packet switching)</b> लाई — आपका पूरा संदेश छोटे-छोटे टुकड़ों (<b>पैकेट / packet</b>) में बँटता है, हर पैकेट में गंतव्य पता (destination address) लिखा होता है, और वे अलग-अलग रास्ते से, अलग-अलग क्रम में जाकर सामने फिर से जुड़ते हैं। फ़ायदे — लाइन कभी खाली नहीं पड़ी रहती, एक केबल पर सैकड़ों लोग बँट जाते हैं, और रास्ता/केबल टूटे तो पैकेट दूसरे रास्ते से निकल जाते हैं (यही "resilience" ठंडे युग की ज़रूरत थी)।</p>
      <p>यह विचार 1960 के दशक में तीन जगह आया: <b>लियोनार्ड क्लेनरॉक (Leonard Kleinrock)</b> ने कतार सिद्धांत (queueing theory) से गणित दिया, <b>पॉल बैरन (Paul Baran)</b> ने RAND में टूटने-योग्य नेटवर्क सोचा, और <b>डोनाल्ड डेविस (Donald Davies)</b> ने ब्रिटेन की NPL में "packet" शब्द रखा।</p>` },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में बार-बार पूछे जाने वाले 6 तथ्य', html: `<ol>
      <li><b>इंटरनेट का जन्म</b> — <b>ARPANET (Advanced Research Projects Agency Network)</b>, 1969, अमेरिकी रक्षा विभाग के ARPA (आज DARPA) के वित्तपोषित प्रोजेक्ट से। पहला संदेश <b>29 अक्टूबर 1969</b> को UCLA से SRI (Stanford Research Institute) गया; सिस्टम क्रैश हो गया और केवल "<b>LO</b>" तक पहुँचा।</li>
      <li><b>इंटरनेट किस प्रोटोकॉल पर चलता है?</b> — <b>TCP/IP</b>। TCP = Transmission Control Protocol, IP = Internet Protocol।</li>
      <li><b>TCP/IP का आविष्कार</b> — <b>Vint Cerf व Bob Kahn</b>, 1974 (शोध-पत्र "A Protocol for Packet Network Intercommunication")। ARPANET पर आधिकारिक रूप से TCP/IP अपनाया गया <b>1 जनवरी 1983</b> ("flag day") — उस दिन से पुराना NCP (Network Control Program) बंद।</li>
      <li><b>WWW (World Wide Web) का जनक</b> — <b>Tim Berners-Lee</b>, <b>CERN</b> (जिनेवा के पास, स्विटज़रलैंड)। प्रस्ताव <b>मार्च 1989</b>, पहला ब्राउज़र + सर्वर <b>1990</b>, सार्वजनिक <b>1991</b>।</li>
      <li><b>DNS</b> — 1983, <b>Paul Mockapetris</b> (RFC 882/883, बाद में RFC 1034/1035)। पोर्ट <b>53</b>।</li>
      <li><b>पैकेट स्विचिंग बनाम सर्किट स्विचिंग</b> — टेलीफ़ोन = सर्किट (रास्ता आरक्षित), इंटरनेट = पैकेट (रास्ता आरक्षित नहीं)। यही अंतर परीक्षा में एक वाक्य में लिखना है।</li>
    </ol>` },

    { type: 'table', head: ['साल', 'घटना', 'इंटरनेट/वेब पर असर'], rows: [
      ['1961–64', 'क्लेनरॉक ने पैकेट स्विचिंग का गणित (queueing theory) दिया', 'डेटा को टुकड़ों में भेजने की वैज्ञानिक नींव'],
      ['1965–67', 'पॉल बैरन (RAND) व डोनाल्ड डेविस (NPL, UK) — टूटने-योग्य नेटवर्क व "packet" शब्द', 'आर्कि्टेक्चर तय: कोई एक केंद्र नहीं जो टूटने पर सब बंद हो'],
      ['1969', 'ARPANET चालू; 29 अक्टूबर को UCLA → SRI पहला संदेश ("LO")', 'पैकेट स्विचिंग आधारित WAN का पहलें बार काम करता प्रदर्शन'],
      ['1969–70', 'Network Working Group ने RFC (Request For Comments) श्रृंखला शुरू की', 'आज भी हर इंटरनेट मानक "RFC संख्या" से पहचाना जाता है'],
      ['1971', 'रे टॉमलिनसन (Ray Tomlinson) ने नेटवर्क ईमेल बनाया व "@" का प्रयोग नाम@मशीन के लिए चुना', 'इंटरनेट का पहला "killer application"'],
      ['1973', 'बॉब मेटकैल्फ़ (Xerox PARC) ने Ethernet का काम लिखा; IEEE बाद में 802.3 मानक', 'LAN की रीढ़ — आज भी तार वाले नेटवर्क में वही'],
            ['1974', 'सेर्फ़ व खान ने TCP/Internet Protocol का मूल कागज़ प्रकाशित किया', 'अलग-अलग नेटवर्क आपस में जुड़ने लायक बने (यहीं से "internet" शब्द)'],
      ['1978–79', 'TCP से IP अलग परत बनी; Usenet (1980) शुरू', 'आधुनिक "TCP/IP" स्टैक; चर्चा-मंचों की शुरुआत'],
      ['1983', '1 जनवरी — ARPANET ने TCP/IP अपनाया ("flag day"); DNS व SMTP (RFC 821, 1982) की परतें मज़बूत', 'आज का इंटरनेट इसी दिन से गिना जाता है'],
      ['1986', 'NSFNET — अमेरिकी विश्वविद्यालयों का उच्च-गति बैकबोन', 'इंटरनेट सैन्य परियोजना से शैक्षिक/सार्वजनिक ढाँचा बना'],
      ['1989', 'तिम बर्नर्स-ली ने CERN में "Information Management: A Proposal" लिखा', 'WWW का जन्म-प्रस्ताव: HTML + URI + HTTP एक साथ'],
      ['1990', 'पहला वेब ब्राउज़र "WorldWideWeb" व पहला वेब सर्वर (info.cern.ch) चले; ARPANET सेवा-निवृत्त', 'इंटरनेट पर "लिंक दबाकर कूदना" संभव'],
      ['1991', 'सितंबर–अगस्त 1991: वेब CERN से बाहर, alt.hypertext पर घोषणा; Linux kernel भी यहीं', 'वेब सार्वजनिक दुनिया में'],
      ['1993', '30 अप्रैल — CERN ने WWW को बिना रॉयल्टी सबके लिए खुला किया; NCSA Mosaic ब्राउज़र (छवियाँ दिखाने वाला)', 'वेब धमाकेडार बना — कोई भी बिना शुल्क सर्वर/ब्राउज़र बना सके'],
      ['1994', 'अक्टूबर में W3C (World Wide Web Consortium) की स्थापना MIT पर, बर्नर्स-ली के साथ; Netscape की स्थापना', 'वेब मानक बनाने वाली संस्था मिली'],
      ['1995', 'NSFNET बैकबोन वाणिज्यिक नेटवर्क के हवाले; वाणिज्यिक ISP को रीढ़ सौंपी गई; भारत में VSNL के ज़रिए सार्वजनिक इंटरनेट', '"डायल-अप से घर में इंटरनेट" का दौर; India में वाणिज्यिक शुरुआत'],
      ['1997–99', 'RFC 2068/2616 — HTTP/1.1; IPv6 का विनिर्देश RFC 2460 (1998)', 'आधुनिक वेब बातचीत के नियम लिखे गए'],
      ['1998', 'ICANN (Internet Corporation for Assigned Names and Numbers) बनी', 'नाम व पता-संख्या का वैश्विक समन्वय'],
      ['2001', 'विकिपीडिया; wireless broadband का विस्तार', 'वेब "लिखने-पढ़ने" वाला (read-write) बनने लगा'],
      ['2004–08', 'सोशल नेटवर्क, मोबाइल इंटरनेट, TLS 1.2 (RFC 5246, 2008)', 'इंटरनेट जेब में आया'],
      ['2012', '6 जून — World IPv6 Launch Day, बड़े ISP/वेब साइटें IPv6 स्थायी रूप से चालू', 'IPv4 की कमी का आधिकारिक समाधान-आरंभ'],
      ['2014–16', 'HTTP/2 का मानकीकरण (RFC 7540, 2015); Let\'s Encrypt (2016) ने मुफ़्त certificate शुरू', 'HTTPS सबके लिए सस्ता व तेज़'],
      ['2018–22', 'TLS 1.3 (RFC 8446), Wi-Fi 6 (802.11ax), 5G NR (3GPP Release 15), HTTP/3 व QUIC (RFC 9000/9114)', 'अभी चल रहा दौर — तेज़, सुरक्षित, UDP-आधारित'],
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.2</span> इतिहास की पूरी कहानी — ARPANET से WWW तक (समझकर पढ़िए)</h3>
      <p><b>1) 1969 — ARPANET:</b> ठंडे युग में अमेरिकी रक्षा विभाग को डर था कि एक केंद्रीय कमांड-कंट्रोल टूटे तो सारा संचार ख़त्म। ARPA (Advanced Research Projects Agency) ने ऐसी नेटवर्क बनवाई जिसमें <b>कोई एक मालिक/केंद्र न हो</b> और रास्ता ख़ुद बदल सके। चार साइटें जुड़ीं — UCLA, Stanford Research Institute, UC Santa Barbara, University of Utah। जोड़ने वाला डिब्बा <b>IMP (Interface Message Processor)</b> कहलाता था — आज का राउटर उसी का पुरखा है।</p>
      <p><b>2) 1974 — TCP/IP:</b> Cerf व Kahn ने समझाया कि अलग-अलग तरह के नेटवर्क (तार वाला, रेडियो, सैटेलाइट) एक-दूसरे से कैसे बात करें — उत्तर: एक पतली परत जो सबके ऊपर बैठे और "end-to-end" भरोसा दे। इसमें दो हिस्से — <b>IP</b> (पता लगाना और पैकेट पहुँचाना, भरोसे की ज़िम्मेदारी नहीं) और <b>TCP</b> (क्रम, गुम पैकेट दोबारा मँगना, पूरा-पूरा मिलना)। यही "जोड़ने वाला कील" (internet keel) है — शब्द "internet" इसी "internetworking" से आया।</p>
      <p><b>3) 1983 —_Flag day_:</b> 1 जनवरी 1983 को ARPANET ने आधिकारिक रूप से TCP/IP पर स्विच किया। इसी दिन DNS का भी जन्म-year है (Mockapetris, RFC 882/883) — पहले नामों की फ़ाइल <code>HOSTS.TXT</code> रोज़ FTP से उतारी जाती थी; उसी की जगह DNS ने ली।</p>
      <p><b>4) 1986 — NSFNET:</b> National Science Foundation ने विश्वविद्यालयों को जोड़ने वाला तेज़ रीढ़ (backbone) बनाई और ARPANET से भी ज़्यादा लोग जुड़े। 1995 में यह रीढ़ व्यापारिक ISP के हवाले हुई — इंटरनेट "सरकारी" से "बाज़ार" हुआ, और 1995 में ही भारत में VSNL (Videsh Sanchar Nigam Limited) के ज़रिए सार्वजनिक इंटरनेट सेवा शुरू हुई (पहले केवल शैक्षिक/सरकारी कनेक्शन — ERNET (Education and Research Network, 1986 में स्थापित) पहले से चल रहा था)।</p>
      <p><b>5) 1989–1991 — WWW:</b> CERN में वैज्ञानिक दुनिया भर के paper/notes में खोए रहते थे। Tim Berners-Lee ने मार्च 1989 में एक प्रस्ताव लिखा जिसमें चार चीज़ें थीं — एक भाषा (HTML), एक पता-प्रणाली (URI/URL), एक नियम (HTTP), और उस सब को चलाने वाला ब्राउज़र। 1990 में उन्होंने पहला ब्राउज़र (नाम "WorldWideWeb", NeXT मशीन पर), पहला सर्वर और पहली वेबसाइट <code>info.cern.ch</code> बनाई; दिसंबर 1990 को ब्राउज़र↔सर्वर के बीच पहली सफल बातचीत हुई। 1991 में यह कोड CERN से बाहर जाने लगा और 6 अगस्त 1991 को Usenet के <code>alt.hypertext</code> समूह पर सार्वजनिक घोषणा हुई। <b>30 अप्रैल 1993</b> को CERN ने वेब को बिना रॉयल्टी सबके लिए छोड़ दिया — इसी एक कागज़ी हस्ताक्षर के कारण वेब किसी एक कंपनी की संपत्ति नहीं बना।</p>
      <p><b>6) 1993 के बाद — ब्राउज़र युद्ध व मानक:</b> NCSA Mosaic (Marc Andreessen व साथी) ने चित्र पन्ने के अंदर दिखाए, फिर Netscape (1994) और Microsoft का Internet Explorer आए, और अक्टूबर 1994 में बर्नर्स-ली ने W3C बनाकर HTML/CSS के मानक बनाने शुरू किए। 1998 में ICANN बनी ताकि नाम/नंबर का वैश्विक समन्वय हो।</p>
      <div class="callout tip"><b class="ct">याद रखने का आसान सूत्र</b><p>1969 नेटवर्क मिला → 1974 भाषा (TCP/IP) मिली → 1983 वह भाषा आधिकारिक हुई → 1983–84 नाम-सिस्टम (DNS) मिला → 1989–91 उस पर "लिंक वाला संसार" (WWW) चढ़ा → 1993 सस्ता/मुफ़्त हुआ → 1995 घरों तक पहुँचा → 2007 जेब में (स्मार्टफ़ोन) → 2012 IPv6 स्थायी → आज Cloud/5G/AI।</p></div>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.3</span> इंटरनेट बनाम वेब बनाम WWW — बोर्ड पर यही अंतर लिखवाइए</h3>
      <p>सबसे आम ग़लती: "इंटरनेट" और "वेब" को एक समझना। <b>इंटरनेट = तार, केबल, राउटर व TCP/IP का ढाँचा</b> (रास्ता)। <b>WWW (World Wide Web) = उस रास्ते पर चलने वाली एक सेवा</b> (रास्ते पर दौड़ती बस) — जो HTML पन्नों को hyperlinks से जोड़ती है। इंटरनेट पर वेब के अलावा भी बहुत कुछ चलता है — ईमेल, FTP, SSH/Telnet, VoIP, ऑनलाइन गेम, DNS खुद, IoT डिवाइस, IPTV — और ये सब वेब ब्राउज़र से बिना भी चलते हैं या बिल्कुल नहीं चलते।</p>
      <p>एक और नज़ाकत: <b>WWW</b> technically "World Wide Web" नाम का संक्षेप है और <code>www</code> अक्सर डोमेन का एक subdomain (host name) होता है — <code>www.example.com</code> में <code>www</code> सिर्फ़ होस्ट (host) का नाम है, कोई जादू नहीं। इसीलिए बिना www के भी साइट खुलती है (<code>example.com</code>)।</p>
      <h4 class="blk2">तीनों का एक-लाइन फ़र्क़</h4>
      <ul>
        <li>🌐 <b>Internet</b> — वैश्विक नेटवर्क ढाँचा (TCP/IP + केबल + राउटर)। 1969 से अस्तित्व में।</li>
        <li>🔗 <b>WWW / Web</b> — उस ढाँचे पर HTML+URL+HTTP से चलने वाली सेवा। 1989–91 से।</li>
        <li>🏫 <b>Intranet</b> — वही तकनीक, पर एक संस्था के अंदर व लॉगिन-सुरक्षित।</li>
        <li>🔌 <b>वेब सर्वर / ब्राउज़र</b> — WWW के दो हिस्से: सर्वर पन्ना भेजता है, ब्राउज़र उसे समझकर दिखाता है।</li>
      </ul>` },

    { type: 'table', head: ['सवाल', 'इंटरनेट (Internet)', 'वेब / WWW (World Wide Web)'], rows: [
      ['क्या है?', 'कंप्यूटर नेटवर्कों का वैश्विक ढाँचा (infrastructure)', 'उस ढाँचे पर चलने वाली एक सेवा/एप्लिकेशन'],
      ['किस पर निर्भर?', 'TCP/IP, केबल, राउटर, ISP — बिना वेब के भी चलता है', 'इंटरनेट पर निर्भर — इंटरनेट बंद तो वेब बंद'],
      ['कब शुरू?', '1969 (ARPANET), 1983 से TCP/IP', '1989 प्रस्ताव, 1991 सार्वजनिक'],
      ['किसने बनाया?', 'ARPA/DARPA की टीम, सेर्फ़-खान, क्लेनरॉक व कई', 'Tim Berners-Lee, CERN'],
      ['क्या-क्या चलाता है?', 'वेब + ईमेल + FTP + SSH + VoIP + गेम + DNS + IoT', 'केवल HTML पन्ने, लिंक, वेब ऐप्स'],
      ['मानक कौन बनाता है?', 'IETF (RFC के रूप में), ICANN समन्वय', 'W3C (HTML/CSS), IETF (HTTP)'],
      ['बिना ब्राउज़र के चलता है?', 'हाँ — टर्मिनल/SSH/ईमेल क्लाइंट से', 'नहीं — वेब देखने के लिए ब्राउज़र चाहिए'],
      ['परीक्षा का एक-लाइन जवाब', '"नेटवर्क ऑफ़ नेटवर्क्स जो TCP/IP पर चलता है"', '"इंटरनेट पर HTML/URL/HTTP से जुड़े पन्नों की सेवा"'],
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — वेब के तीन स्तंभ (ज़रूर पूछा जाता है)', html: `<p>WWW केवल तीन चीज़ों पर खड़ा है — तीनों Tim Berners-Lee ने 1989–91 में CERN में तैयार किए:</p>
      <ul>
        <li><b>HTML (HyperText Markup Language)</b> — पन्ना <i>क्या</i> है, यह लिखने की भाषा; "hyper" का मतलब लिंक से दूसरे पन्ने पर कूद सक़ना।</li>
        <li><b>URI/URL (Uniform Resource Identifier / Locator)</b> — हर संसाधन का <i>पता</i>; "यह चीज़ कहाँ है" बताता है।</li>
        <li><b>HTTP (HyperText Transfer Protocol)</b> — पन्ना <i>मँगवाने और भेजने के नियम</i>; request–response का खेल।</li>
      </ul>
      <p>याद रखिए — <b>वेब सर्वर</b> (जैसे Apache, Nginx) HTML फ़ाइलें भेजता है, <b>वेब ब्राउज़र</b> उन्हें पढ़कर दिखाता है। और "पहली वेबसाइट" का पता <code>info.cern.ch</code> था।</p>` },

    /* =NETWEB-MORE= */

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.4</span> ISP के तीन स्तर, समुद्री फ़ाइबर और IXP — इंटरनेट का असली ढाँचा</h3>
      <p>इंटरनेट कोई एक कंपनी नहीं, <b>हज़ारों नेटवर्कों का आपसी समझौता</b> है। इसे तीन स्तरों (tier) में बाँटकर समझा जाता है। <b>Tier 1</b> वे विशाल नेटवर्क हैं जो किसी से पैसे लेकर transit नहीं ख़रीदते — वे आपस में मुफ़्त peering करते हैं और पूरी दुनिया तक पहुँच रखते हैं। <b>Tier 2</b> कुछ क्षेत्र में अपने आप पहुँचते हैं और बाक़ी दुनिया के लिए Tier 1 से transit ख़रीदते हैं। <b>Tier 3</b> वही हैं जिनसे हम घर/दुकान पर कनेक्शन लेते हैं — ये पूरी तरह transit ख़रीदते हैं और अंतिम उपयोगकर्ता तक पहुँचाते हैं।</p>
      <p>महाद्वीपों के बीच डेटा <b>समुद्री केबल (submarine cable)</b> से जाता है — हज़ारों किलोमीटर लंबी optical fibre, जिसमें बीच-बीच में repeater लगे होते हैं। ये केबल जहाज़ों के लंगर, भूकंप और मछली पकड़ने के जाल से कटती रहती हैं; इसीलिए किसी देश का इंटरनेट अचानक धीमा हो जाए तो कारण अक्सर समुद्र में कटी केबल होती है, आपका राउटर नहीं। <b>IXP (Internet Exchange Point)</b> वह भवन/स्विच है जहाँ कई ISP आपस में सीधे जुड़कर ट्रैफ़िक exchange करते हैं — इससे ट्रैफ़िक को दूर Tier 1 तक जाने की ज़रूरत नहीं पड़ती, देरी घटती है और खर्च बचता है। भारत में <b>NIXI (National Internet Exchange of India)</b> प्रमुख IXP है।</p>
      <p>ऊपर से देखने पर दो और परतें दिखती हैं: <b>CDN (Content Delivery Network)</b> — बड़ी वेबसाइटें अपनी सामग्री की नकल दुनिया भर के सर्वरों पर रखती हैं ताकि उपयोगकर्ता को पास वाले सर्वर से मिले; और <b>IXP/peering के समझौते</b> जो तय करते हैं कि किसका ट्रैफ़िक किस रास्ते से जाएगा। यही कारण है कि एक ही वेबसाइट दो शहरों में अलग-अलग गति से खुलती है।</p>` },

    { type: 'table', head: ['स्तर / इकाई', 'कौन होता है', 'पैसे का लेन-देन', 'उदाहरण', 'आम ग़लतफ़हमी'], rows: [
      ['<b>Tier 1 ISP</b>', 'वैश्विक backbone, किसी से transit नहीं ख़रीदते', 'आपस में settlement-free peering', ' Tata Communications, Airtel (वैश्विक भाग), Lumen, NTT, Telia', '"Tier 1 = सबसे तेज़" — नहीं, यह पहुँच का स्तर है, गति का नहीं'],
      ['<b>Tier 2 ISP</b>', 'देश/क्षेत्र-स्तर के बड़े नेटवर्क', 'कुछ peering + Tier 1 से transit ख़रीदते', ' BSNL, बड़े क्षेत्रीय ISP', 'ये भी अपने ग्राहकों को सीधे सेवा दे सकते हैं'],
      ['<b>Tier 3 ISP</b>', 'अंतिम उपयोगकर्ता तक पहुँचाने वाले (retail)', 'पूरा transit ख़रीदते हैं', ' स्थानीय केबल/फ़ाइबर ISP, मोबाइल ऑपरेटर', 'यही आपके घर का बिल भेजते हैं'],
      ['<b>IXP</b>', 'तटस्थ विनिमय-केंद्र जहाँ ISP आपस में जुड़ते हैं', 'port शुल्क; ट्रैफ़िक का लेन-देन अक्सर मुफ़्त', ' NIXI (भारत), DE-CIX, AMS-IX, LINX', 'IXP कोई ISP नहीं — यह मिलने की जगह है'],
      ['<b>CDN</b>', 'सामग्री की नकल पास के सर्वरों पर', 'वेबसाइट CDN को पैसा देती है', ' Cloudflare, Akamai, Amazon CloudFront', 'CDN इंटरनेट नहीं, उसके ऊपर की परत है'],
      ['<b>समुद्री केबल</b>', 'महाद्वीपों के बीच optical fibre', 'केबल-संघ (consortium) साझा लागत', ' 2Africa, SEA-ME-WE, MIST', 'उपग्रह से तुलना — fibre बहुत अधिक क्षमता व कम देरी देता है'],
      ['<b>उपग्रह इंटरनेट</b>', 'LEO/GEO सैटेलाइट से सीधे घर', 'उपयोगकर्ता मासिक शुल्क', ' Starlink (LEO), पुराने VSAT (GEO)', 'GEO की देरी ~600 ms; LEO ~20–50 ms — gaming/VoIP में फ़र्क़ साफ़']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.5</span> DNS की जड़ से पत्ती तक — नाम IP में कैसे बदलता है</h3>
      <p>इंसान नाम याद रखता है (<code>example.com</code>), मशीन पता (<code>93.184.216.34</code>)। इनके बीच का अनुवादक <b>DNS (Domain Name System)</b> है — एक <b>वितरित, पदानुक्रमित (hierarchical) database</b>। यह एक केंद्रीय सर्वर नहीं; पूरी दुनिया में बँटा हुआ है और ऊपर से नीचे चार स्तरों में काम करता है।</p>
      <p>जब आप ब्राउज़र में नाम टाइप करते हैं, तो आपका resolver (अक्सर ISP या 8.8.8.8/1.1.1.1) यह सफ़र करता है: <b>Root (.) → TLD (.com) → Authoritative (example.com का सर्वर) → जवाब</b>। बीच में हर जवाब <b>TTL (Time To Live)</b> सेकंड के लिए cache होता है, इसलिए अगली बार पूरा सफ़र नहीं करना पड़ता। यही कारण है कि DNS बदलाव लागू होने में "कुछ घंटे" लग सकते हैं — पुराना cache अभी TTL पूरा कर रहा है।</p>
      <p>पदानुक्रम के नाम: <b>Root servers</b> दुनिया में 13 logical पते (A–M) हैं, पर anycast से हर एक के सैकड़ों भौतिक सर्वर हैं। <b>TLD</b> दो तरह के — gTLD (.com, .org, .net, .info) और ccTLD (.in, .uk, .de)। <b>Registrar</b> वह कंपनी है जिससे आप नाम ख़रीदते हैं; <b>Registry</b> वह संस्था है जो उस TLD का database चलाती है (जैसे .in के लिए NIXI)। <b>ICANN</b> पूरी व्यवस्था का समन्वय करता है, <b>IANA</b> root zone व पते बाँटने का तकनीकी काम करता है।</p>` },

    { type: 'steps', items: [
      { n: 1, title: 'पहले अपना cache देखो', text: 'ब्राउज़र और OS दोनों अपना DNS cache रखते हैं। नाम वहीं मिल गया तो बाहर कोई query नहीं जाती।', tips: ['Windows: <code>ipconfig /displaydns</code> और साफ़ करने = <code>ipconfig /flushdns</code>', 'लिनक्स: systemd-resolved पर <code>resolvectl flush-caches</code>'] },
      { n: 2, title: 'Stub resolver → Recursive resolver', text: 'आपका PC खुद पूरा सफ़र नहीं करता; वह अपने configured resolver (ISP, 8.8.8.8, 1.1.1.1) से पूछता है — "मुझे पूरा जवाब लाकर दो"। यह <b>recursive query</b> है।', tips: ['PC की सेटिंग में DNS सर्वर का पता यही होता है'] },
      { n: 3, title: 'Resolver → Root server', text: 'Resolver root से पूछता है: "example.com कहाँ है?" Root नहीं जानता, पर बताता है — ".com के सर्वर ये रहे"। यह <b>referral</b> है, जवाब नहीं।', tips: ['Root केवल TLD की ओर इशारा करता है'] },
      { n: 4, title: 'Resolver → TLD server (.com)', text: 'Resolver .com वाले सर्वर से पूछता है। वह बताता है — "example.com का authoritative सर्वर ns1.example.com है, उसका पता ये"।', tips: ['यहाँ glue record (A रिकॉर्ड) भी साथ मिलता है ताकि अगला कदम रुके नहीं'] },
      { n: 5, title: 'Resolver → Authoritative server', text: 'अब असली मालिक से पूछा जाता है और वही <b>अंतिम जवाब</b> देता है — example.com का A/AAAA रिकॉर्ड।', tips: ['यही सर्वर आप अपने hosting/DNS प्रदाता के पैनल से संपादित करते हैं'] },
      { n: 6, title: 'जवाब cache + लौटाना', text: 'Resolver जवाब TTL भर अपने पास रखता है और आपके PC को देता है। PC भी cache करता है। अगली बार यही जवाब तुरंत मिलेगा।', tips: ['TTL कम रखें तो बदलाव जल्दी लागू, पर query-load बढ़ता है'] },
      { n: 7, title: 'अब असली कनेक्शन', text: 'IP मिलते ही ब्राउज़र TCP (या QUIC) कनेक्शन बनाता है, TLS handshake करता है और HTTP request भेजता है। DNS का काम यहीं ख़त्म।', warn: ['DNS सही होकर भी साइट न खुले तो समस्या TCP/TLS/HTTP स्तर पर है — ping से IP जाँचें, curl -I से headers'] }
    ]},

    { type: 'table', head: ['DNS रिकॉर्ड', 'पूरा नाम / काम', 'उदाहरण', 'कब उपयोग'], rows: [
      ['<b>A</b>', 'Address — नाम को IPv4 से जोड़े', '<code>example.com → 93.184.216.34</code>', 'सबसे बुनियादी; वेबसाइट का पता'],
      ['<b>AAAA</b>', 'Quad-A — नाम को IPv6 से जोड़े', '<code>example.com → 2606:2800:220:1:…</code>', 'IPv6 सक्षम साइट'],
      ['<b>CNAME</b>', 'Canonical Name — एक नाम को दूसरे नाम का उपनाम', '<code>www.example.com → example.com</code>', 'उपनाम; <b>root/domain apex पर CNAME नहीं लगा सकते</b> (वहाँ A/ALIAS चाहिए)'],
      ['<b>MX</b>', 'Mail Exchange — डाक किस सर्वर पर जाए', '<code>example.com → mail.example.com (priority 10)</code>', 'ईमेल; कम priority संख्या = पहले preference'],
      ['<b>TXT</b>', 'मुक्त पाठ — सत्यापन व नीति', '<code>v=spf1 include:_spf.google.com ~all</code>', 'SPF, DKIM, DMARC, domain-ownership सत्यापन'],
      ['<b>NS</b>', 'Name Server — इस zone का authoritative कौन', '<code>example.com → ns1.hosting.com</code>', 'delegate करने पर; registrar पर यही सेट करते हैं'],
      ['<b>SOA</b>', 'Start of Authority — zone की प्रशासनिक जानकारी', 'serial, refresh, retry, expire, minimum TTL', 'हर zone में एक; serial बढ़ाए बिना बदलाव secondary तक नहीं पहुँचता'],
      ['<b>PTR</b>', 'Pointer — उल्टा DNS (IP → नाम)', '<code>34.216.184.93.in-addr.arpa → example.com</code>', 'mail सर्वर की विश्वसनीयता; reverse lookup'],
      ['<b>SRV</b>', 'Service — सेवा का host व port', '<code>_sip._tcp.example.com → 10 60 5060 sip.example.com</code>', 'VoIP, XMPP, कुछ gaming सेवाएँ'],
      ['<b>CAA</b>', 'Certification Authority Authorization', '<code>0 issue "letsencrypt.org"</code>', 'कौन-सी CA इस domain का certificate जारी कर सकती है'],
      ['<b>TTL</b>', 'Time To Live (रिकॉर्ड नहीं, हर रिकॉर्ड का गुण)', '<code>3600</code> सेकंड', 'कितनी देर cache में रहे; बदलाव से पहले TTL घटा देना अच्छी आदत']
    ]},

    { type: 'callout', kind: 'tip', title: 'DNS जाँच के तीन कमांड — रट लीजिए', html: '<p><b>Windows</b>: <code>nslookup example.com</code> (बुनियादी), <code>nslookup example.com 8.8.8.8</code> (किसी विशेष सर्वर से), <code>ipconfig /flushdns</code> (cache साफ़)।</p><p><b>लिनक्स/macOS</b>: <code>dig example.com</code> (पूरा ब्योरा), <code>dig +short example.com</code> (केवल जवाब), <code>dig MX example.com</code> (डाक), <code>dig @1.1.1.1 example.com</code> (दूसरा resolver), <code>dig +trace example.com</code> (root से पूरा सफ़र दिखाता है — सीखने के लिए सबसे अच्छा)।</p><p><b>निदान का नियम</b>: अपने ISP के DNS और सार्वजनिक DNS (8.8.8.8 / 1.1.1.1) दोनों से एक ही नाम पूछें। जवाब अलग आएँ तो समस्या आपके resolver/cache में है, वेबसाइट में नहीं।</p>'},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.6</span> IP पता, MAC, सबनेट और NAT — पते की पूरी गणित</h3>
      <p><b>IP पता</b> network-layer का logical पता है — बदल सकता है, राउटर इसे पढ़कर अगला hop तय करता है। <b>MAC पता</b> data-link स्तर का भौतिक पता है (48-bit, जैसे <code>00:1A:2B:3C:4D:5E</code>), network card में जन्म से लिखा होता है और केवल <b>उसी स्थानीय खंड (LAN segment)</b> में काम आता है। एक वाक्य में फ़र्क़: <b>IP बताता है "किस नेटवर्क तक", MAC बताता है "इसी केबल पर किस कार्ड को"</b>। हर hop पर MAC बदलता है, IP (आम तौर पर) वही रहता है।</p>
      <p><b>IPv4</b> 32-bit है — चार octet, हर एक 0–255, कुल लगभग 4.3 अरब पते। ये चुक गए, इसलिए दो उपाय आए: <b>NAT</b> (एक सार्वजनिक IP के पीछे कई निजी डिवाइस) और <b>IPv6</b> (128-bit, लगभग असीमित पते)। निजी श्रेणियाँ (RFC 1918) जो इंटरनेट पर route नहीं होतीं: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>। घर का राउटर इन्हीं में से पता बाँटता है (DHCP से)।</p>
      <p><b>Subnet mask / CIDR</b> बताता है कि पते का कितना हिस्सा network है और कितना host। <code>/24</code> = पहले 24 bit network = mask <code>255.255.255.0</code> = 256 पते, जिनमें से <b>पहला network address</b> और <b>आख़िरी broadcast</b> होता है, यानी <b>254 usable host</b>। सूत्र: usable = 2^(32−prefix) − 2। <code>/25</code> = 126, <code>/26</code> = 62, <code>/30</code> = 2 (point-to-point लिंक के लिए)।</p>
      <p><b>NAT (Network Address Translation)</b> राउटर पर चलता है: अंदर से बाहर जाता पैकेट का source निजी IP हटाकर सार्वजनिक IP + अलग port लगा देता है, और जवाब आने पर उसी table से सही अंदरूनी डिवाइस तक लौटा देता है। port-स्तर के इस रूप को <b>PAT / NAT overload</b> कहते हैं — इसी से एक ही सार्वजनिक IP पर सैकड़ों डिवाइस चलते हैं। <b>Port forwarding</b> इसका उल्टा है: बाहर से आए विशिष्ट port को अंदर के किसी डिवाइस पर भेजना (CCTV, गेम सर्वर)।</p>
      <p><b>IPv6</b> 128-bit, आठ समूह hex में (<code>2001:0db8:85a3:0000:0000:8a2e:0370:7334</code>)। लगातार शून्य समूहों को <code>::</code> से एक बार संक्षिप्त कर सकते हैं (<code>2001:db8:85a3::8a2e:370:7334</code>), और हर समूह के आगे के शून्य हटा सकते हैं। IPv6 में NAT की ज़रूरत नहीं — हर डिवाइस को सार्वजनिक पता मिल सकता है; broadcast की जगह multicast है, और ARP की जगह <b>NDP (Neighbor Discovery)</b>।</p>` },

    { type: 'table', head: ['CIDR / mask', 'कुल पते', 'usable host', 'कहाँ उपयोग', 'नोट'], rows: [
      ['<code>/8</code> = 255.0.0.0', '1,67,77,216', '1,67,77,214', 'बहुत बड़ा निजी नेटवर्क (10.0.0.0/8)', 'Class A का पुराना रूप'],
      ['<code>/16</code> = 255.255.0.0', '65,536', '65,534', 'मध्यम संस्थान (172.16.0.0/16)', 'Class B'],
      ['<code>/24</code> = 255.255.255.0', '256', '<b>254</b>', 'घर/छोटा ऑफ़िस LAN (192.168.1.0/24)', 'सबसे आम; Class C'],
      ['<code>/25</code> = 255.255.255.128', '128', '126', 'एक /24 को दो हिस्सों में बाँटना', 'subnetting का पहला अभ्यास'],
      ['<code>/26</code> = 255.255.255.192', '64', '62', 'चार हिस्से', 'हर विभाग को अलग subnet'],
      ['<code>/27</code> = 255.255.255.224', '32', '30', 'आठ हिस्से', 'छोटी टीम/CCTV VLAN'],
      ['<code>/28</code> = 255.255.255.240', '16', '14', 'सोलह हिस्से', 'बहुत छोटा खंड'],
      ['<code>/30</code> = 255.255.255.252', '4', '<b>2</b>', 'दो राउटरों के बीच point-to-point', 'केवल दो usable — इसीलिए लिंक के लिए'],
      ['<code>/32</code> = 255.255.255.255', '1', '1 (host route)', 'एक ही होस्ट', 'routing/firewall नियम में single IP'],
      ['<code>0.0.0.0/0</code>', 'पूरा IPv4', '—', '<b>default route</b> — "बाक़ी सब यहाँ भेजो"', 'gateway की ओर इशारा']
    ]},

    { type: 'table', head: ['विशेष पता / श्रेणी', 'अर्थ', 'नोट'], rows: [
      ['<code>127.0.0.1</code> (पूरा 127.0.0.0/8)', 'Loopback — अपना ही PC', '<code>localhost</code> इसी पर जाता है; नेटवर्क कार्ड के बिना भी चलता है'],
      ['<code>169.254.x.x</code> (/16)', 'APIPA / link-local', '<b>DHCP न मिले तो</b> विंडोज़/लिनक्स खुद यह पता ले लेता है — यानी "इंटरनेट नहीं" का पहला संकेत'],
      ['<code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>', 'निजी (RFC 1918)', 'इंटरनेट पर route नहीं होते; NAT के पीछे चलते हैं'],
      ['<code>0.0.0.0</code>', 'अनिर्दिष्ट / सभी interface', 'सर्वर "0.0.0.0 पर listen" = हर interface से स्वीकार'],
      ['<code>255.255.255.255</code>', 'सीमित broadcast', 'उसी LAN पर सबको; राउटर पार नहीं करता'],
      ['पहला पता (जैसे 192.168.1.0/24)', 'Network address', 'host को नहीं दिया जाता'],
      ['आख़िरी पता (जैसे 192.168.1.255/24)', 'Directed broadcast', 'host को नहीं दिया जाता'],
      ['<code>224.0.0.0/4</code>', 'Multicast (Class D)', 'एक-से-कई; streaming/राउटिंग प्रोटोकॉल'],
      ['<code>::1</code> (IPv6)', 'Loopback', '127.0.0.1 का IPv6 रूप'],
      ['<code>fe80::/10</code> (IPv6)', 'Link-local', 'हर interface पर अपने आप; उसी खंड तक सीमित'],
      ['<code>fc00::/7</code> (IPv6)', 'Unique Local (ULA)', 'IPv6 का निजी पता (RFC 1918 जैसा)'],
      ['<code>2000::/3</code> (IPv6)', 'Global unicast', 'इंटरनेट पर route होने वाले सार्वजनिक पते']
    ]},

    { type: 'code', code: `# ---- सबनेट की गणना: 192.168.1.0/24 ----
prefix          = 24
host bits       = 32 - 24 = 8
कुल पते          = 2^8  = 256
usable hosts    = 256 - 2 = 254        (network + broadcast घटाकर)
network address = 192.168.1.0
broadcast       = 192.168.1.255
पहला usable     = 192.168.1.1
आख़िरी usable    = 192.168.1.254
subnet mask     = 255.255.255.0

# ---- /26 में बाँटना (चार हिस्से) ----
192.168.1.0/26    -> .0   से .63   (usable .1–.62)
192.168.1.64/26   -> .64  से .127  (usable .65–.126)
192.168.1.128/26  -> .128 से .191  (usable .129–.190)
192.168.1.192/26  -> .192 से .255  (usable .193–.254)

# ---- किसी पते का network निकालना (bitwise AND) ----
IP   192.168.1.77   = 11000000.10101000.00000001.01001101
Mask 255.255.255.0  = 11111111.11111111.11111111.00000000
AND  -----------------------------------------------
Network            = 11000000.10101000.00000001.00000000 = 192.168.1.0

# ---- जाँच के कमांड ----
Windows : ipconfig /all          (IP, mask, gateway, DNS, DHCP)
          route print            (routing तालिका)
          arp -a                 (IP <-> MAC cache)
Linux   : ip -br a ; ip r ; ip neigh
          ping -c 4 192.168.1.1  (अपना gateway)
          ping -c 4 8.8.8.8      (नाम के बिना बाहर)
          dig +short example.com (DNS)
          curl -I https://example.com (HTTP)` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.7</span> पोर्ट, HTTP/HTTPS, TLS और Cookie — पन्ना दिखने तक का सफ़र</h3>
      <p>एक ही सर्वर पर कई सेवाएँ चलती हैं, इसलिए <b>port नंबर</b> से तय होता है कि पैकेट किस सेवा को जाए। Port 16-bit है (0–65535)। तीन श्रेणियाँ: <b>0–1023 well-known</b> (IANA द्वारा निर्धारित, जैसे 80/443), <b>1024–49151 registered</b>, <b>49152–65535 dynamic/ephemeral</b> (क्लाइंट अपने outgoing कनेक्शन के लिए अस्थायी रूप से इन्हीं में से चुनता है)।</p>
      <p><b>HTTP</b> (port 80) सादा-पाठ प्रोटोकॉल है — request और response दोनों पढ़े जा सकते हैं। <b>HTTPS</b> (port 443) = HTTP + <b>TLS</b>। TLS तीन काम करता है: <b>encryption</b> (कोई बीच में पढ़ न सके), <b>integrity</b> (रास्ते में बदला न जाए), <b>authentication</b> (certificate से पुष्टि कि यही असली सर्वर है)। Certificate किसी <b>CA (Certificate Authority)</b> से जारी होता है और ब्राउज़र उसकी chain को root store से मिलाकर जाँचता है। <b>certificate error</b> के तीन आम कारण: तारीख़ समाप्त, नाम मेल नहीं खाता (जिस नाम के लिए जारी हुआ उससे अलग खोला), या आपके PC की घड़ी ग़लत है।</p>
      <p>HTTP <b>methods</b>: GET (माँगना), POST (भेजना/बनाना), PUT/PATCH (बदलना), DELETE (मिटाना), HEAD (केवल headers)। <b>Status codes</b> पाँच परिवारों में: 1xx सूचना, <b>2xx सफल</b> (200 OK, 201 Created, 204 No Content), <b>3xx redirect</b> (301 स्थायी, 302 अस्थायी, 304 Not Modified), <b>4xx क्लाइंट की ग़लती</b> (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests), <b>5xx सर्वर की ग़लती</b> (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout)।</p>
      <p><b>Cookie</b> सर्वर द्वारा ब्राउज़र में रखी छोटी पाठ-फ़ाइल है जो हर request के साथ वापस भेजी जाती है — इसी से login याद रहता है। <b>Session cookie</b> ब्राउज़र बंद होते ही मिट जाती है, <b>persistent cookie</b> expiry तक रहती है। <b>First-party</b> उसी साइट की, <b>third-party</b> किसी और domain की (विज्ञापन/tracking)। सुरक्षा के गुण: <code>HttpOnly</code> (JavaScript न पढ़ सके → XSS से चोरी रुके), <code>Secure</code> (केवल HTTPS पर भेजी जाए), <code>SameSite</code> (cross-site request के साथ न जाए → CSRF से बचाव)। Cookie के विकल्प/पूरक हैं <b>localStorage</b> (स्थायी, JS पढ़ सकता है), <b>sessionStorage</b> (टैब बंद होते ही मिटे) और <b>IndexedDB</b> (बड़ा structured डेटा)।</p>` },

    { type: 'table', head: ['Port', 'सेवा / प्रोटोकॉल', 'TCP/UDP', 'नोट'], rows: [
      ['20 / 21', 'FTP (data / control)', 'TCP', 'सादा-पाठ, असुरक्षित — इसकी जगह SFTP (22) या FTPS'],
      ['22', 'SSH / SFTP / SCP', 'TCP', 'सुरक्षित दूर-शेल व फ़ाइल; telnet (23) की जगह'],
      ['23', 'Telnet', 'TCP', '<b>सादा-पाठ — कभी उपयोग न करें</b>, पासवर्ड खुला जाता है'],
      ['25', 'SMTP (सर्वर-से-सर्वर डाक)', 'TCP', 'submission के लिए 587, SMTPS के लिए 465'],
      ['53', 'DNS', 'UDP (बड़े जवाब/zone transfer पर TCP)', 'नाम→IP; UDP तेज़, TCP भरोसेमंद'],
      ['67 / 68', 'DHCP (सर्वर / क्लाइंट)', 'UDP', 'IP अपने आप बाँटना'],
      ['80', 'HTTP', 'TCP', 'सादा-पाठ वेब'],
      ['110 / 995', 'POP3 / POP3S', 'TCP', 'डाक उतारकर स्थानीय रखना (सर्वर से हट सकती है)'],
      ['143 / 993', 'IMAP / IMAPS', 'TCP', 'डाक सर्वर पर ही रहती है, कई डिवाइस पर sync'],
      ['443', 'HTTPS (HTTP over TLS)', 'TCP', 'आधुनिक वेब का मानक; QUIC/HTTP3 इसी port पर <b>UDP</b> से भी'],
      ['465 / 587', 'SMTPS / SMTP submission', 'TCP', 'क्लाइंट से सर्वर डाक भेजना'],
      ['3389', 'RDP (Remote Desktop)', 'TCP+UDP', 'विंडोज़ का दूर-नियंत्रण; इंटरनेट पर सीधे खोलना जोखिम'],
      ['3306', 'MySQL / MariaDB', 'TCP', 'डेटाबेस — इंटरनेट पर कभी न खोलें'],
      ['5432', 'PostgreSQL', 'TCP', 'डेटाबेस'],
      ['6379', 'Redis', 'TCP', 'cache/कतार — बिना पासवर्ड इंटरनेट पर घातक'],
      ['8080 / 8443', 'वैकल्पिक HTTP / HTTPS', 'TCP', 'विकास सर्वर, proxy'],
      ['123', 'NTP', 'UDP', 'घड़ी मिलाना — ग़लत समय = TLS certificate error']
    ]},

    { type: 'table', head: ['HTTP स्थिति कोड', 'अर्थ', 'किसकी ग़लती', 'आम कारण / उपाय'], rows: [
      ['<b>200</b> OK', 'सफल', '—', 'सब ठीक'],
      ['<b>201</b> Created', 'नया संसाधन बना', '—', 'POST के बाद'],
      ['<b>204</b> No Content', 'सफल, पर लौटाने को कुछ नहीं', '—', 'DELETE के बाद आम'],
      ['<b>301</b> Moved Permanently', 'स्थायी redirect', '—', 'SEO में पुराना URL नए पर; ब्राउज़र cache कर लेता है'],
      ['<b>302</b> Found', 'अस्थायी redirect', '—', 'login के बाद वापस भेजना'],
      ['<b>304</b> Not Modified', 'cache वाली नकल ही सही है', '—', 'bandwidth बचती है'],
      ['<b>400</b> Bad Request', 'request समझ नहीं आई', 'क्लाइंट', 'ग़लत syntax, टूटा JSON'],
      ['<b>401</b> Unauthorized', 'पहचान चाहिए/ग़लत है', 'क्लाइंट', 'login नहीं या पासवर्ड ग़लत'],
      ['<b>403</b> Forbidden', 'पहचान है पर अनुमति नहीं', 'क्लाइंट', 'IP block, ग़लत permissions'],
      ['<b>404</b> Not Found', 'यह URL मौजूद नहीं', 'क्लाइंट', 'टूटा लिंक, हटाया पन्ना, टाइपो'],
      ['<b>405</b> Method Not Allowed', 'यह method यहाँ नहीं चलता', 'क्लाइंट', 'GET-only endpoint पर POST'],
      ['<b>429</b> Too Many Requests', 'दर-सीमा पार', 'क्लाइंट', 'rate limiting; Retry-After header देखें'],
      ['<b>500</b> Internal Server Error', 'सर्वर के कोड में त्रुटि', 'सर्वर', 'लॉग देखना पड़ेगा'],
      ['<b>502</b> Bad Gateway', 'proxy/gateway को ऊपर से ग़लत जवाब', 'सर्वर', 'backend बंद या क्रैश'],
      ['<b>503</b> Service Unavailable', 'सेवा अभी उपलब्ध नहीं', 'सर्वर', 'रखरखाव या अति-भार'],
      ['<b>504</b> Gateway Timeout', 'ऊपर वाले ने समय पर जवाब नहीं दिया', 'सर्वर', 'धीमा backend, timeout कम']
    ]},

    { type: 'steps', items: [
      { n: 1, title: 'URL टाइप किया', text: 'ब्राउज़र पहले अपना cache और HSTS सूची देखता है। नाम हो तो DNS चाहिए; सीधे IP हो तो DNS की ज़रूरत नहीं।', tips: ['HSTS में दर्ज साइट पर http:// टाइप करने पर भी ब्राउज़र अपने आप https:// कर देता है'] },
      { n: 2, title: 'DNS resolution', text: 'ऊपर 1.5 का पूरा सफ़र — root → TLD → authoritative → IP।', tips: ['यहीं रुकावट हो तो dig/nslookup से जाँचें'] },
      { n: 3, title: 'TCP three-way handshake', text: 'क्लाइंट <b>SYN</b> भेजता है → सर्वर <b>SYN-ACK</b> → क्लाइंट <b>ACK</b>। अब भरोसेमंद कनेक्शन बना।', tips: ['HTTP/3 (QUIC) यह handshake UDP पर खुद करता है और 0-RTT में तेज़ शुरू होता है'] },
      { n: 4, title: 'TLS handshake (HTTPS हो तो)', text: 'ClientHello (समर्थित cipher, SNI में नाम) → ServerHello + <b>certificate</b> → ब्राउज़र certificate की chain जाँचता है → key exchange → अब encrypted सत्र।', warn: ['घड़ी ग़लत, certificate expired, या नाम मेल न खाए तो यहीं "Your connection is not private" आता है'] },
      { n: 5, title: 'HTTP request भेजी', text: '<code>GET /path HTTP/1.1</code> + headers (Host, User-Agent, Accept, Cookie, Authorization)। Host header बताता है कि एक ही IP पर कौन-सी साइट चाहिए।', tips: ['HTTP/2 में एक ही कनेक्शन पर कई request समांतर (multiplexing) जाती हैं'] },
      { n: 6, title: 'सर्वर ने जवाब दिया', text: 'Status line + headers (Content-Type, Content-Length, Set-Cookie, Cache-Control) + body (HTML)।', tips: ['301/302 मिला तो ब्राउज़र नए URL पर दोबारा शुरू करता है'] },
      { n: 7, title: 'HTML parse + संसाधन', text: 'ब्राउज़र HTML पढ़कर DOM बनाता है, फिर CSS (CSSOM), फिर images/JS/fonts के लिए अलग requests। JS मिलने पर parsing रुक सकती है (इसीलिए <code>defer</code>/<code>async</code> उपयोगी)।', tips: ['DevTools → Network टैब में यही पूरा waterfall दिखता है — सीखने का सबसे अच्छा औज़ार'] },
      { n: 8, title: 'Render', text: 'DOM + CSSOM → Render tree → Layout (कहाँ क्या) → Paint (रंग) → Composite (परतें)। स्क्रीन पर पन्ना दिखता है।', tips: ['बड़ा CSS/JS, धीमा सर्वर, या heavy images — तीनों इसी चरण को धीमा करते हैं'] }
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.8</span> "इंटरनेट नहीं चल रहा" — पूरा निदान-फ़्लो</h3>
      <p>यह सबसे आम शिकायत है और इसका जवाब कभी भी "राउटर restart कर दो" तक सीमित नहीं होना चाहिए। नीचे का क्रम <b>नीचे की परत से ऊपर</b> चलता है — केबल से लेकर वेबसाइट तक। हर कदम पर एक कमांड है और एक निष्कर्ष; जहाँ कदम विफल हो, समस्या उसी परत में है।</p>` },

    { type: 'table', head: ['क्रम', 'क्या जाँचें', 'कमांड (Windows / लिनक्स)', 'विफल हो तो अर्थ', 'अगला कदम'], rows: [
      ['1', 'केबल/link चालू है?', 'देखें: NIC की LED; <code>Get-NetAdapter</code> / <code>ip -br link</code>', 'DOWN = केबल/Wi-Fi/पोर्ट की समस्या', 'केबल बदलें, दूसरा पोर्ट, Wi-Fi reconnect'],
      ['2', 'IP मिला है?', '<code>ipconfig</code> / <code>ip -br a</code>', '<b>169.254.x.x</b> = DHCP विफल', 'राउटर का DHCP जाँचें; <code>ipconfig /release</code> + <code>/renew</code>'],
      ['3', 'Gateway तक पहुँच?', '<code>ping 192.168.1.1</code> (अपना gateway)', 'नहीं पहुँचा = LAN/राउटर की समस्या', 'राउटर restart, Wi-Fi signal, IP टकराव'],
      ['4', 'बाहर IP तक पहुँच?', '<code>ping -n 4 8.8.8.8</code> / <code>ping -c 4 8.8.8.8</code>', 'gateway चले पर बाहर नहीं = ISP/WAN समस्या', 'राउटर का WAN status, ISP को कॉल'],
      ['5', 'DNS काम कर रहा?', '<code>nslookup example.com</code> / <code>dig +short example.com</code>', 'IP ping होता है पर नाम नहीं खुलता = <b>DNS समस्या</b>', 'DNS बदलकर 1.1.1.1/8.8.8.8; cache flush'],
      ['6', 'रास्ता कहाँ रुका?', '<code>tracert example.com</code> / <code>traceroute</code> या <code>mtr</code>', 'किसी hop के बाद * = वहाँ block/कटाव', 'ISP या बीच का नेटवर्क; firewall जाँचें'],
      ['7', 'HTTP जवाब दे रहा?', '<code>curl -I https://example.com</code>', '502/503/504 = सर्वर की समस्या; timeout = firewall/port', 'वेबसाइट की स्थिति, अपना firewall/proxy'],
      ['8', 'केवल एक साइट या सब?', 'दूसरी साइट खोलें; मोबाइल hotspot से मिलाएँ', 'एक साइट = उसी साइट की समस्या; सब = आपका नेटवर्क', 'hotspot से तुलना सबसे तेज़ निर्णायक जाँच है'],
      ['9', 'Proxy/VPN तो नहीं?', '<code>inetcpl.cpl</code> → Connections → LAN settings / <code>env | grep -i proxy</code>', 'ग़लत proxy सब रोक देता है', 'proxy बंद करें, VPN disconnect'],
      ['10', 'MTU / ड्राइवर / firewall', '<code>ping -f -l 1472 8.8.8.8</code> (Win) / adapter driver update', 'बड़े पैकेट गिरें = MTU समस्या', 'MTU 1492/1400 आज़माएँ; ड्राइवर अपडेट; firewall नियम']
    ]},

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — इंटरनेट ढाँचे के पक्के तथ्य', html: '<ul><li><b>इंटरनेट ≠ वेब</b>: इंटरनेट नेटवर्कों का जाल (1969 ARPANET, TCP/IP 1 जनवरी 1983), वेब उस पर चलने वाली एक सेवा (1989 प्रस्ताव, 1991 सार्वजनिक — Tim Berners-Lee, CERN)।</li><li>वेब के तीन स्तंभ: <b>HTML</b> (सामग्री), <b>URL/URI</b> (पता), <b>HTTP</b> (प्रोटोकॉल)।</li><li><b>Tier 1</b> transit नहीं ख़रीदता (settlement-free peering); <b>Tier 3</b> retail ISP। <b>IXP</b> = आपस में जुड़ने की जगह; भारत में <b>NIXI</b>।</li><li><b>DNS क्रम</b>: cache → recursive resolver → <b>Root → TLD → Authoritative</b>। Root केवल referral देता है। 13 logical root पते (anycast से सैकड़ों भौतिक)।</li><li><b>A</b> = IPv4, <b>AAAA</b> = IPv6, <b>CNAME</b> = उपनाम (apex पर नहीं), <b>MX</b> = डाक, <b>TXT</b> = SPF/DKIM/DMARC, <b>PTR</b> = उल्टा, <b>NS</b> = authoritative, <b>SOA</b> = zone प्रशासन (serial बढ़ाना अनिवार्य)।</li><li><b>TTL</b> = cache में रहने की अवधि; इसीलिए DNS बदलाव में देरी लगती है।</li><li><b>IP = logical (बदलने योग्य), MAC = भौतिक (48-bit, उसी LAN में)</b>। हर hop पर MAC बदलता है।</li><li>निजी श्रेणियाँ: <b>10/8, 172.16/12, 192.168/16</b>। <b>169.254.x.x = DHCP विफल (APIPA)</b>। <b>127.0.0.1 = loopback</b>।</li><li>usable host = <b>2^(32−prefix) − 2</b>; /24 = 254, /26 = 62, /30 = 2। पहला = network, आख़िरी = broadcast।</li><li><b>NAT/PAT</b> = एक सार्वजनिक IP के पीछे कई निजी; <b>port forwarding</b> = बाहर से अंदर भेजना।</li><li><b>IPv6</b> = 128-bit, आठ hex समूह, <code>::</code> एक बार, NAT अनिवार्य नहीं, broadcast नहीं (multicast), ARP की जगह <b>NDP</b>। ::1 loopback, fe80::/10 link-local, fc00::/7 ULA, 2000::/3 global।</li><li>Ports: <b>21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 993 IMAPS, 995 POP3S, 587 submission, 3389 RDP, 3306 MySQL, 5432 PostgreSQL, 123 NTP</b>।</li><li><b>HTTPS = HTTP + TLS</b>; TLS = encryption + integrity + authentication। Certificate error के तीन कारण: expiry, नाम mismatch, ग़लत घड़ी।</li><li>Status: <b>2xx सफल, 3xx redirect, 4xx क्लाइंट, 5xx सर्वर</b>। 401 ≠ 403 (पहचान बनाम अनुमति)। 502/504 = gateway/backend।</li><li>Cookie गुण: <b>HttpOnly</b> (XSS से बचाव), <b>Secure</b> (केवल HTTPS), <b>SameSite</b> (CSRF से बचाव)। Session बनाम persistent; first-party बनाम third-party।</li><li>पन्ना दिखने का क्रम: <b>DNS → TCP handshake → TLS handshake → HTTP request → response → parse (DOM/CSSOM) → render</b>।</li></ul>'},

    { type: 'labs', items: [
      { n: 166, title: 'DNS का पूरा सफ़र अपनी आँखों से देखना', aim: 'root से authoritative तक की पूरी श्रृंखला, अलग-अलग रिकॉर्ड और cache का असर प्रत्यक्ष देखना।', tools: ['लिनक्स/WSL या विंडोज़', 'dig / nslookup', 'ब्राउज़र DevTools'], steps: [
        'लिनक्स/WSL में <code>dig +trace example.com</code> चलाएँ — root, .com TLD और authoritative के तीनों चरण दिखेंगे। हर चरण का सर्वर-नाम नोट करें।',
        '<code>dig example.com</code> और <code>dig +short example.com</code> का फ़र्क़ देखें; ANSWER SECTION में TTL पढ़ें।',
        'अलग रिकॉर्ड पूछें: <code>dig MX example.com</code>, <code>dig TXT example.com</code>, <code>dig NS example.com</code>, <code>dig AAAA example.com</code>।',
        'दो resolver से तुलना: <code>dig @8.8.8.8 +short example.com</code> और <code>dig @1.1.1.1 +short example.com</code> — जवाब मिलाएँ।',
        'उल्टा DNS: <code>dig -x 8.8.8.8</code> (PTR रिकॉर्ड)।',
        'विंडोज़ पर <code>ipconfig /displaydns</code> से cache देखें, फिर <code>ipconfig /flushdns</code> करके दोबारा dig/nslookup करें — पहले query का समय अधिक लगेगा।',
        'ब्राउज़र DevTools → Network खोलकर किसी साइट पर जाएँ; पहली request के "DNS Lookup" समय को नोट करें और page reload पर उसका शून्य होना देखें।'
      ], result: 'आप बता सकते हैं कि root केवल referral देता है, TTL cache तय करता है, और A/AAAA/MX/TXT/NS/PTR में क्या फ़र्क़ है।' },

      { n: 167, title: 'अपने नेटवर्क का नक़्शा और सबनेट गणित', aim: 'अपना IP/mask/gateway/DNS/MAC निकालना, usable hosts गिनना, और ARP table देखना।', tools: ['विंडोज़ या लिनक्स', 'ipconfig / ip', 'कैलकुलेटर'], steps: [
        'विंडोज़: <code>ipconfig /all</code> — IPv4, Subnet Mask, Default Gateway, DNS Servers, DHCP Enabled, Physical Address (MAC) नोट करें। लिनक्स: <code>ip -br a; ip r; cat /etc/resolv.conf</code>।',
        'अपने prefix से usable hosts गिनें: /24 हो तो 254। network address और broadcast भी लिखें।',
        'अपने gateway को ping करें: <code>ping -n 4 192.168.1.1</code> (या जो आपका gateway है)। फिर <code>ping -n 4 8.8.8.8</code>।',
        'ARP cache देखें: विंडोज़ <code>arp -a</code>, लिनक्स <code>ip neigh</code> — gateway का MAC पहचानें।',
        'राउटर के admin पन्ने (अक्सर http://192.168.1.1) में DHCP range देखें और अपने IP से मिलाएँ।',
        'एक ही LAN के दो PC लें और दोनों के IP का bitwise AND अपने mask से करें — दोनों का network address समान आना चाहिए।',
        'अब जान-बूझकर ग़लत subnet mask वाला static IP सेट करें (जैसे /24 की जगह /25) और देखें कि gateway ping होना बंद हो जाता है; फिर वापस DHCP करें।',
        '<code>tracert 8.8.8.8</code> / <code>traceroute</code> चलाकर पहले तीन hop लिखें — पहला आपका राउटर, दूसरा ISP।'
      ], result: 'आप अपने नेटवर्क का पूरा नक़्शा (IP, mask, network, broadcast, usable, gateway, DNS, MAC) काग़ज़ पर बना सकते हैं और बता सकते हैं कि ग़लत mask क्यों कनेक्शन तोड़ता है।' },

      { n: 168, title: '"इंटरनेट नहीं चल रहा" — दस-कदम निदान अभ्यास', aim: 'ऊपर 1.8 की तालिका को असल में चलाकर एक लिखित निदान-रिपोर्ट बनाना।', tools: ['PC + राउटर', 'ping/tracert/nslookup/curl', 'मोबाइल hotspot (तुलना के लिए)'], steps: [
        'एक फ़ाइल <code>net-report.txt</code> खोलें और हर कदम का कमांड + नतीजा + निष्कर्ष लिखते जाएँ।',
        'कदम 1–2: adapter की स्थिति और IP देखें (<code>ipconfig</code> / <code>ip -br a</code>)। 169.254 मिला तो DHCP विफल लिखें।',
        'कदम 3–4: gateway और 8.8.8.8 को ping करें। दोनों के नतीजे अलग-अलग लिखें — यहीं LAN बनाम WAN का फ़र्क़ पकड़ में आता है।',
        'कदम 5: <code>nslookup example.com</code> और <code>nslookup example.com 1.1.1.1</code>। जवाब अलग आएँ तो DNS समस्या लिखें।',
        'कदम 6: <code>tracert example.com</code> — किस hop के बाद * आया, नोट करें।',
        'कदम 7: <code>curl -I https://example.com</code> — status code, server header, content-type लिखें।',
        'कदम 8: मोबाइल hotspot से जुड़कर वही साइट खोलें। चली तो समस्या आपके LAN/ISP में, न चली तो साइट में।',
        'कदम 9: proxy/VPN जाँचें (<code>inetcpl.cpl</code> → LAN settings, या <code>env | grep -i proxy</code>)।',
        'अंत में रिपोर्ट का सार लिखें: "समस्या ___ परत पर थी, प्रमाण ___ कमांड का ___ नतीजा, उपाय ___"।'
      ], result: 'एक पेशेवर निदान-रिपोर्ट जो बताती है कि गड़बड़ी केबल, DHCP, LAN, WAN, DNS, रास्ते, firewall या वेबसाइट में थी — अनुमान नहीं, प्रमाण के साथ।' }
    ]},

    { type: 'acc', title: 'FAQ — इंटरनेट कैसे काम करता है', items: [
      { q: 'इंटरनेट और वेब में असल फ़र्क़ क्या है?', a: 'इंटरनेट = दुनिया भर के नेटवर्कों का भौतिक/तार्किक जाल (केबल, राउटर, TCP/IP) — इस पर ईमेल, FTP, SSH, gaming सब चलता है। वेब (WWW) = उस जाल पर चलने वाली <b>एक</b> सेवा, जो HTML पन्नों को HTTP से लाती है। यानी वेब इंटरनेट का हिस्सा है, पूरा इंटरनेट नहीं।' },
      { q: 'Tier 1 ISP का मतलब सबसे तेज़ इंटरनेट है?', a: 'नहीं। Tier का अर्थ है <b>पहुँच और पैसे का संबंध</b> — Tier 1 किसी से transit नहीं ख़रीदता और सब जगह पहुँचता है। आपके घर की गति Tier 3 ISP की योजना, भीड़ और तकनीक (फ़ाइबर/केबल) तय करती है, Tier नहीं।' },
      { q: 'DNS root सर्वर केवल 13 क्यों हैं?', a: '13 <b>logical</b> पते (A–M) हैं — यह पुराने UDP पैकेट में root hints फ़िट करने की तकनीकी सीमा से बना आँकड़ा है। भौतिक रूप से anycast के कारण हर पते के सैकड़ों सर्वर दुनिया भर में हैं, इसलिए यह व्यवस्था न तो कमज़ोर है न एक जगह टिकी है।' },
      { q: 'DNS बदलाव लागू होने में घंटों क्यों लगते हैं?', a: 'हर रिकॉर्ड का <b>TTL</b> होता है; दुनिया भर के resolver पुराना जवाब TTL पूरा होने तक cache में रखते हैं। बदलाव से पहले TTL घटाकर (जैसे 300 सेकंड) रखना चाहिए ताकि प्रसार तेज़ हो। SOA serial बढ़ाना भी अनिवार्य है वरना secondary सर्वर बदलाव नहीं उठाते।' },
      { q: 'CNAME को domain के root पर क्यों नहीं लगा सकते?', a: 'DNS नियम कहता है कि जिस नाम पर CNAME है वहाँ कोई और रिकॉर्ड नहीं हो सकता, पर root/apex पर SOA और NS अनिवार्य होते हैं — इसलिए टकराव होता है। उपाय: वहाँ A/AAAA रिकॉर्ड दें, या प्रदाता का ALIAS/ANAME/CNAME-flattening विकल्प अपनाएँ।' },
      { q: 'IP और MAC में फ़र्क़ एक उदाहरण से समझाइए?', a: 'चिट्ठी भेजने जैसा: <b>IP = पूरा डाक-पता</b> (शहर, मोहल्ला, मकान) जो तय करता है चिट्ठी किस नेटवर्क तक जाएगी; <b>MAC = उस आख़िरी गली का दरवाज़ा-नंबर</b> जो केवल स्थानीय वितरण में काम आता है। रास्ते के हर पड़ाव (hop) पर दरवाज़ा-नंबर बदलता है, पूरा पता वही रहता है।' },
      { q: '169.254.x.x पता दिखे तो क्या समझें?', a: 'यह <b>APIPA/link-local</b> है — DHCP सर्वर से पता नहीं मिला तो OS ने खुद यह ले लिया। मतलब इंटरनेट नहीं चलेगा। कारण: राउटर का DHCP बंद, केबल/Wi-Fi टूटी, या DHCP pool ख़त्म। <code>ipconfig /release</code> + <code>/renew</code> आज़माएँ, फिर राउटर जाँचें।' },
      { q: '/24 में 254 ही host क्यों, 256 क्यों नहीं?', a: 'पहला पता <b>network address</b> (पूरे खंड का नाम) और आख़िरी <b>broadcast</b> (सबको एक साथ) के लिए आरक्षित है। इसलिए usable = 2^(32−prefix) − 2। अपवाद: /31 point-to-point लिंक पर दोनों पते usable माने जाते हैं (RFC 3021), और /32 एक ही होस्ट है।' },
      { q: 'NAT क्या है और IPv6 में इसकी ज़रूरत क्यों नहीं?', a: 'NAT एक सार्वजनिक IP के पीछे कई निजी डिवाइस चलाता है — बाहर जाते पैकेट का source बदलकर public IP+port लगाता है और जवाब आने पर table से सही डिवाइस तक लौटाता है। यह IPv4 पते बचाने का जुगाड़ था। IPv6 में पते इतने हैं कि हर डिवाइस को अपना सार्वजनिक पता मिल सकता है, इसलिए NAT अनिवार्य नहीं (सुरक्षा firewall से आती है, NAT से नहीं)।' },
      { q: 'HTTPS में certificate error क्यों आता है?', a: 'तीन आम कारण — (1) certificate की अवधि समाप्त, (2) जिस नाम के लिए जारी हुआ आपने उससे अलग नाम खोला (जैसे IP सीधे, या www बनाम बिना-www), (3) <b>आपके PC की घड़ी ग़लत</b> है जिससे वैध अवधि भी ग़लत लगती है। चौथा कारण: बीच में कोई proxy अपना certificate घुसा रहा हो (कॉर्पोरेट निरीक्षण)।' },
      { q: '401 और 403 में फ़र्क़?', a: '<b>401 Unauthorized</b> = पहचान चाहिए या ग़लत है (login करें/सही credentials दें)। <b>403 Forbidden</b> = पहचान हो गई पर इस संसाधन की अनुमति नहीं (IP block, ग़लत permissions, ग़लत खाता)। नाम भ्रमित करते हैं — 401 असल में "unauthenticated" है।' },
      { q: '502, 503, 504 — तीनों सर्वर की ग़लती हैं, फ़र्क़ क्या?', a: '<b>502 Bad Gateway</b> = proxy/gateway को ऊपर वाले backend से ग़लत/अवैध जवाब मिला (backend क्रैश)। <b>503 Service Unavailable</b> = सेवा जान-बूझकर बंद या अति-भार में। <b>504 Gateway Timeout</b> = backend ने तय समय में जवाब ही नहीं दिया (धीमा)।' },
      { q: 'Cookie, localStorage और sessionStorage में फ़र्क़?', a: '<b>Cookie</b> हर HTTP request के साथ सर्वर को वापस जाती है (इसलिए login/session के लिए), आकार ~4 KB, expiry सेट हो सकती है। <b>localStorage</b> केवल ब्राउज़र में रहता है, सर्वर को अपने आप नहीं जाता, स्थायी (~5–10 MB), JavaScript पढ़ सकता है। <b>sessionStorage</b> वैसा ही पर टैब बंद होते ही मिट जाता है।' },
      { q: 'HttpOnly, Secure, SameSite — क्या करते हैं?', a: '<b>HttpOnly</b>: JavaScript document.cookie से नहीं पढ़ सकती → XSS से cookie चोरी रुकती है। <b>Secure</b>: cookie केवल HTTPS पर भेजी जाती है → चोरी-सुनने से बचाव। <b>SameSite</b> (Lax/Strict/None): दूसरी साइट से आने वाली request के साथ cookie जाए या नहीं → CSRF से बचाव। None के साथ Secure अनिवार्य है।' },
      { q: 'एक ही वेबसाइट दो शहरों में अलग गति से क्यों खुलती है?', a: 'CDN आपको पास वाले सर्वर से सामग्री देता है, IXP/peering तय करते हैं कि ट्रैफ़िक किस रास्ते से जाएगा, और अंतिम छोर की तकनीक (फ़ाइबर/केबल/मोबाइल) व भीड़ अलग होती है। समुद्री केबल कटने पर पूरे क्षेत्र की देरी बढ़ सकती है — यह आपके राउटर की ग़लती नहीं होती।' },
      { q: 'HTTP/2 और HTTP/3 में क्या नया है?', a: '<b>HTTP/2</b>: एक ही TCP कनेक्शन पर कई request समांतर (multiplexing), header compression, server push — पर TCP का head-of-line blocking बना रहता है। <b>HTTP/3</b>: TCP की जगह <b>QUIC (UDP पर)</b> — कनेक्शन तेज़ बनता है (0/1-RTT), एक पैकेट खोने से बाक़ी stream नहीं रुकतीं, और नेटवर्क बदलने (Wi-Fi→मोबाइल) पर कनेक्शन बना रहता है।' }
    ]},

    { type: 'quiz', store: 'net-web', items: [
      { q: 'ARPANET का पहला संदेश कब भेजा गया था?', o: ['1969', '1983', '1989', '1991'], a: 0, ex: '1969 में ARPANET का पहला नोड-से-नोड संदेश। TCP/IP पर पूरा बदलाव 1 जनवरी 1983 को हुआ।' },
      { q: 'World Wide Web का प्रस्ताव किसने और कब रखा?', o: ['Vint Cerf, 1974', 'Tim Berners-Lee, 1989 (CERN)', 'Bill Gates, 1991', 'Marc Andreessen, 1993'], a: 1, ex: 'Tim Berners-Lee ने 1989 में CERN में प्रस्ताव रखा; 1991 में सार्वजनिक हुआ। Vint Cerf व Bob Kahn TCP/IP के सह-आविष्कारक हैं।' },
      { q: 'वेब के तीन स्तंभ कौन-से हैं?', o: ['TCP, IP, DNS', 'HTML, URL/URI, HTTP', 'FTP, SMTP, SSH', 'CSS, JS, PHP'], a: 1, ex: 'HTML = सामग्री का ढाँचा, URL/URI = पता, HTTP = लाने का प्रोटोकॉल।' },
      { q: 'Tier 1 ISP की पहचान क्या है?', o: ['सबसे तेज़ गति', 'किसी से transit नहीं ख़रीदता, settlement-free peering करता है', 'केवल घरों को सेवा देता है', 'सबसे सस्ता'], a: 1, ex: 'Tier = पहुँच व पैसे का स्तर, गति का नहीं। Tier 3 retail ISP अंतिम उपयोगकर्ता तक पहुँचाता है।' },
      { q: 'IXP क्या है?', o: ['एक ISP', 'तटस्थ केंद्र जहाँ कई ISP आपस में ट्रैफ़िक exchange करते हैं', 'DNS सर्वर', 'समुद्री केबल'], a: 1, ex: 'IXP = Internet Exchange Point; भारत में NIXI। इससे ट्रैफ़िक स्थानीय रहता है, देरी व लागत घटती है।' },
      { q: 'DNS resolution का सही क्रम क्या है?', o: ['Authoritative → TLD → Root', 'Root → TLD → Authoritative', 'TLD → Root → Authoritative', 'केवल Authoritative'], a: 1, ex: 'Resolver पहले root से पूछता है (वह TLD का referral देता है), फिर TLD (वह authoritative बताता है), फिर authoritative अंतिम जवाब देता है।' },
      { q: 'DNS में A और AAAA रिकॉर्ड में फ़र्क़?', o: ['A = नाम, AAAA = पता', 'A = IPv4, AAAA = IPv6', 'A = डाक, AAAA = वेब', 'कोई फ़र्क़ नहीं'], a: 1, ex: 'A रिकॉर्ड 32-bit IPv4 पता देता है; AAAA (quad-A) 128-bit IPv6।' },
      { q: 'ईमेल किस DNS रिकॉर्ड से सही सर्वर तक पहुँचता है?', o: ['A', 'CNAME', 'MX', 'TXT'], a: 2, ex: 'MX (Mail Exchange) बताता है कि इस domain की डाक किस सर्वर पर जाए; priority संख्या कम हो तो पहले preference।' },
      { q: 'SPF, DKIM और DMARC किस रिकॉर्ड में रखे जाते हैं?', o: ['MX', 'TXT', 'NS', 'SRV'], a: 1, ex: 'ये तीनों TXT रिकॉर्ड में प्रकाशित होते हैं और ईमेल की प्रामाणिकता/स्पूफ़िंग रोकने में मदद करते हैं।' },
      { q: 'DNS बदलाव लागू होने में देरी क्यों होती है?', o: ['सर्वर धीमा है', 'पुराना जवाब TTL भर cache में रहता है', 'केबल लंबी है', 'IP चुक गए'], a: 1, ex: 'TTL (Time To Live) तय करता है कि resolver जवाब कितनी देर रखे। बदलाव से पहले TTL घटाना अच्छी आदत है।' },
      { q: 'IP और MAC पते में सही कथन कौन-सा है?', o: ['दोनों भौतिक हैं', 'IP logical/बदलने योग्य, MAC भौतिक व उसी LAN में उपयोगी', 'MAC इंटरनेट पर route होता है', 'IP कभी नहीं बदलता'], a: 1, ex: 'IP network-layer का logical पता है; MAC 48-bit भौतिक पता जो केवल स्थानीय खंड में काम आता है। हर hop पर MAC बदलता है।' },
      { q: '169.254.x.x पता दिखने का अर्थ?', o: ['सार्वजनिक IP मिला', 'DHCP विफल — APIPA/link-local पता', 'IPv6 पता', 'VPN चालू'], a: 1, ex: 'DHCP न मिलने पर OS खुद 169.254/16 ले लेता है; इससे इंटरनेट नहीं चलता।' },
      { q: '192.168.1.0/24 में usable host कितने?', o: ['256', '255', '254', '252'], a: 2, ex: '2^(32−24) = 256 कुल; पहला network और आख़िरी broadcast घटाकर 254 usable।' },
      { q: '/30 subnet में कितने usable host मिलते हैं?', o: ['4', '2', '6', '30'], a: 1, ex: '2^2 = 4 कुल − 2 = 2। इसीलिए /30 दो राउटरों के point-to-point लिंक के लिए आदर्श है।' },
      { q: 'निजी (RFC 1918) श्रेणी कौन-सी नहीं है?', o: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '169.254.0.0/16'], a: 3, ex: '169.254/16 link-local (APIPA) है, RFC 1918 निजी श्रेणी नहीं। तीन निजी श्रेणियाँ 10/8, 172.16/12, 192.168/16 हैं।' },
      { q: 'NAT/PAT क्या करता है?', o: ['नाम को IP में बदलता है', 'एक सार्वजनिक IP के पीछे कई निजी डिवाइस चलाता है', 'डेटा encrypt करता है', 'MAC बदलता है'], a: 1, ex: 'NAT source IP बदलता है; PAT (NAT overload) port भी जोड़ता है ताकि एक ही public IP पर कई डिवाइस चलें।' },
      { q: 'IPv6 पते की लंबाई और loopback पता क्या है?', o: ['32-bit, 127.0.0.1', '128-bit, ::1', '64-bit, fe80::1', '128-bit, 0.0.0.0'], a: 1, ex: 'IPv6 = 128-bit, आठ hex समूह; ::1 loopback, fe80::/10 link-local, fc00::/7 ULA, 2000::/3 global unicast।' },
      { q: 'HTTPS का port और DNS का port क्रमशः क्या हैं?', o: ['80 और 53', '443 और 53', '443 और 80', '8080 और 22'], a: 1, ex: 'HTTPS = 443 (TCP; HTTP/3 में UDP भी), DNS = 53 (UDP, बड़े जवाब पर TCP), HTTP = 80।' },
      { q: 'SSH, SMTP और IMAP के port क्या हैं?', o: ['22, 25, 143', '23, 25, 110', '22, 110, 143', '21, 25, 993'], a: 0, ex: 'SSH=22, SMTP=25 (submission 587), IMAP=143 (IMAPS 993), POP3=110 (POP3S 995), Telnet=23, FTP=21।' },
      { q: 'TLS तीन में से कौन-सा काम नहीं करता?', o: ['Encryption', 'Integrity', 'Authentication (certificate)', 'IP पता बाँटना'], a: 3, ex: 'TLS = encryption + integrity + authentication। IP बाँटना DHCP का काम है।' },
      { q: 'HTTP 401 और 403 में सही फ़र्क़ क्या है?', o: ['401 सर्वर, 403 क्लाइंट', '401 = पहचान चाहिए/ग़लत, 403 = पहचान है पर अनुमति नहीं', 'दोनों एक ही', '401 redirect, 403 सफल'], a: 1, ex: '401 असल में unauthenticated है; 403 authenticated-but-forbidden। दोनों 4xx = क्लाइंट पक्ष।' },
      { q: '504 Gateway Timeout का अर्थ?', o: ['क्लाइंट ने ग़लत भेजा', 'ऊपर वाले backend ने समय पर जवाब नहीं दिया', 'पन्ना नहीं मिला', 'स्थायी redirect'], a: 1, ex: '5xx सर्वर पक्ष की त्रुटि। 502 = ग़लत जवाब, 503 = सेवा उपलब्ध नहीं, 504 = backend धीमा/चुप।' },
      { q: 'Cookie पर HttpOnly लगाने से क्या बचाव होता है?', o: ['CSRF', 'XSS से cookie चोरी', 'SQL injection', 'DDoS'], a: 1, ex: 'HttpOnly से JavaScript document.cookie नहीं पढ़ सकती, इसलिए XSS से session चोरी रुकती है। CSRF के लिए SameSite, चोरी-सुनने के लिए Secure।' },
      { q: 'HTTPS पन्ना दिखने तक का सही क्रम?', o: ['HTTP → DNS → TLS → TCP', 'DNS → TCP handshake → TLS handshake → HTTP request → render', 'TLS → DNS → TCP → HTTP', 'TCP → DNS → HTTP → TLS'], a: 1, ex: 'पहले नाम से IP (DNS), फिर TCP three-way handshake, फिर TLS, फिर HTTP request/response, अंत में parse व render।' },
      { q: 'IP ping हो रहा है पर नाम से साइट नहीं खुलती — समस्या कहाँ?', o: ['केबल', 'DNS', 'वेबसाइट बंद', 'RAM'], a: 1, ex: '8.8.8.8 ping होना बताता है कि बाहर तक पहुँच है; नाम न खुलना DNS की विफलता है। resolver बदलकर/cache flush करके जाँचें।' },
      { q: 'HTTP/3 किस पर बना है?', o: ['TCP', 'QUIC (UDP पर)', 'ICMP', 'FTP'], a: 1, ex: 'HTTP/3 = QUIC, जो UDP पर चलता है; इससे head-of-line blocking घटता है और कनेक्शन तेज़ बनता है।' }
    ]},

    { type: 'pills', items: [
      { text: 'इंटरनेट ≠ वेब', kind: 'info' },
      { text: 'DNS: Root → TLD → Authoritative', kind: 'tip' },
      { text: 'A=IPv4 · AAAA=IPv6 · MX=डाक · TXT=SPF', kind: 'info' },
      { text: 'usable = 2^(32−prefix) − 2', kind: 'ok' },
      { text: '169.254 = DHCP विफल', kind: 'warn' },
      { text: '443 HTTPS · 53 DNS · 22 SSH', kind: 'info' },
      { text: '4xx क्लाइंट · 5xx सर्वर', kind: 'tip' },
      { text: 'HttpOnly · Secure · SameSite', kind: 'ok' },
      { text: 'निदान: link → IP → gateway → DNS → HTTP', kind: 'warn' }
    ]},
  ]
},

/* =END-OF-SECTION-1= */
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id:'net-browser', icon:'🌐', group:'इंटरनेट व साइबर सुरक्षा',
  title:'ब्राउज़र व वेब औज़ार',
  sub:'इंजन, DevTools, cache/cookies/storage, extensions, खोज-ऑपरेटर, privacy व वेब त्रुटियाँ',
  kicker:'Internet & Security 2 · Browsers & Web Tools',
  hero:'ब्राउज़र आज सबसे ज़्यादा इस्तेमाल होने वाला सॉफ़्टवेयर है — और सबसे कम समझा जाने वाला। यह पृष्ठ बताता है कि URL टाइप करने के बाद अंदर क्या-क्या होता है, Blink/Gecko/WebKit इंजन में क्या फ़र्क़ है, हर टैब अलग प्रक्रिया क्यों है, DevTools के सातों टैब से असली समस्या कैसे पकड़ें, cache/cookies/localStorage में क्या अंतर है, extension कब ख़तरा बनता है, खोज-ऑपरेटर से सही जानकारी कैसे निकालें, Incognito असल में क्या छिपाता है और क्या नहीं — और आम वेब त्रुटियों का अर्थ व हल।',
  tags:['इंजन व रेंडरिंग','DevTools के 7 टैब','Cache/Cookies/Storage','Extensions व सुरक्षा','खोज-ऑपरेटर','Privacy व वेब त्रुटियाँ'],
  blocks:[

  { type:'callout', kind:'info', title:'इस पृष्ठ के बाद आप क्या कर पाएँगे', html:'<p>1) बता सकेंगे कि पन्ना load होने में कौन-से चरण लगते हैं और कहाँ देरी होती है। 2) DevTools खोलकर Console की त्रुटि, Network का असफल request और Elements से बिगड़ा layout पकड़ सकेंगे। 3) cache, cookies, localStorage और sessionStorage में सही फ़र्क़ कर सकेंगे। 4) “साइट ठीक नहीं चल रही” पर hard refresh, cache clear और extension बंद करने का सही क्रम चला सकेंगे। 5) खोज-ऑपरेटर से फ़ाइल/साइट/तारीख़ तक सीमित खोज कर सकेंगे। 6) Incognito, tracking protection, DoH और password manager की असली सीमा बता सकेंगे। 7) आम HTTP/DNS/TLS त्रुटियों का अर्थ समझकर सही दिशा में हल कर सकेंगे।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">2.1</span> ब्राउज़र के अंदर — इंजन और प्रक्रियाएँ</h3><p>ब्राउज़र दो इंजन चलाता है। <b>Rendering engine</b> HTML/CSS को पढ़कर pixels बनाता है; <b>JavaScript engine</b> कोड चलाता है। आज बाज़ार में तीन ही बड़े rendering इंजन बचे हैं, और यही असली विविधता है — Chrome, Edge, Brave, Opera, Vivaldi सब एक ही <b>Blink</b> पर हैं।</p>' },
  { type:'table', head:['ब्राउज़र','Rendering इंजन','JS इंजन','खास बात'], rows:[
    ['Chrome','Blink','V8','सबसे बड़ा हिस्सा; Google सेवाओं से गहरा जुड़ाव'],
    ['Edge','Blink','V8','विंडोज़ में built-in; sleeping tabs, Collections, Copilot'],
    ['Brave','Blink','V8','डिफ़ॉल्ट ad/tracker block, Brave Rewards'],
    ['Opera / Vivaldi','Blink','V8','बहुत अनुकूलन योग्य UI, built-in टूल'],
    ['Firefox','Gecko','SpiderMonkey','स्वतंत्र इंजन; मज़बूत privacy व container tabs'],
    ['Safari','WebKit','JavaScriptCore (Nitro)','macOS/iOS; कम बैटरी खपत, ITP tracking रोक'],
    ['Tor Browser','Gecko (सख़्त)','SpiderMonkey','सर्किट routing, fingerprint एक-जैसा'],
    ['Chromium-आधारित कोई भी','Blink','V8','इंजन एक होने से एक ही bug सब पर असर करता है'],
  ] },
  { type:'html', html:'<p><b>Multi-process बनावट</b> — आधुनिक ब्राउज़र एक नहीं, कई प्रक्रियाएँ चलाता है: एक <b>browser process</b> (UI, पता-पट्टी), हर साइट के लिए अलग <b>renderer process</b> (site isolation), एक <b>GPU process</b>, एक <b>network service</b>, और extensions के लिए अलग। लाभ — एक टैब crash हो तो बाक़ी बचे रहते हैं, और एक दुर्भावनापूर्ण साइट दूसरी साइट की मेमोरी आसानी से नहीं पढ़ सकती (Spectre-युग की सीमा)। कीमत — अधिक RAM। Chrome/Edge का अपना Task Manager (<code>Shift+Esc</code>) बताता है कौन-सा टैब/extension कितना खा रहा है।</p>' },
  { type:'steps', items:[
    { n:1, title:'URL समझना और DNS', text:'पता-पट्टी में लिखा scheme (https), host, path, query पहचाना जाता है। host का IP पहले browser cache → OS cache → hosts फ़ाइल → resolver से ढूँढ़ा जाता है।' },
    { n:2, title:'TCP + TLS handshake', text:'server से TCP कनेक्शन बनता है; https पर TLS handshake होता है — certificate जाँच, cipher तय, session key। यहीं “Your connection is not private” आ सकता है।' },
    { n:3, title:'HTTP request और पहला byte', text:'GET request जाती है (headers में cookies, Accept, User-Agent)। server उत्तर देता है — status code और HTML। इस देरी को TTFB कहते हैं।' },
    { n:4, title:'HTML parse और DOM', text:'HTML पढ़ते-पढ़ते DOM tree बनता है। CSS मिलने पर CSSOM बनता है। बीच में script मिले तो parsing रुक सकती है — इसीलिए defer/async उपयोगी हैं।' },
    { n:5, title:'Render tree, Layout, Paint', text:'DOM + CSSOM से render tree; हर डिब्बे की जगह-आकार (layout/reflow); फिर रंग भरना (paint); परतों को जोड़ना (composite)। CSS/ज्यामिति बदलने पर layout दोबारा होता है — यही jank है।' },
    { n:6, title:'JavaScript और अंतिम interactive स्थिति', text:'JS चलता है, event listener जुड़ते हैं, और fetch से अतिरिक्त डाटा आता है। तब पन्ना सचमुच उपयोग योग्य होता है।' },
  ] },
  { type:'kv', items:[
    { label:'DOMContentLoaded', value:'HTML parse पूरा', desc:'DOM तैयार; चित्र/stylesheet अभी बाक़ी हो सकते हैं।' },
    { label:'load', value:'सब संसाधन आ गए', desc:'चित्र, iframe, CSS सब — Network टैब में नीली रेखा।' },
    { label:'TTFB', value:'Time To First Byte', desc:'अनुरोध से पहले byte तक — server/नेटवर्क की देरी।' },
    { label:'FCP / LCP', value:'First/Largest Contentful Paint', desc:'पहला कुछ दिखा / सबसे बड़ा तत्व दिखा — उपयोगकर्ता को कब लगा “खुल गया”।' },
    { label:'CLS', value:'Cumulative Layout Shift', desc:'पन्ना कितना खिसका — बिना आकार दिए चित्र इसका मुख्य कारण।' },
    { label:'INP', value:'Interaction to Next Paint', desc:'क्लिक के बाद कितनी देर में प्रतिक्रिया — भारी JS इसे बिगाड़ता है।' },
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">2.2</span> DevTools — ब्राउज़र का सर्विसिंग औज़ार</h3><p><code>F12</code> या <code>Ctrl+Shift+I</code> (Mac पर Cmd+Opt+I) से खुलता है। यह केवल डेवलपर के लिए नहीं — “साइट नहीं खुल रही”, “login नहीं हो रहा”, “बटन काम नहीं कर रहा” जैसी हर शिकायत का पहला जाँच-केंद्र यही है।</p>' },
  { type:'table', head:['टैब','क्या दिखाता है','किस शिकायत पर खोलें'], rows:[
    ['Elements','जीवित DOM + लागू CSS; बदलकर तुरंत असर देखें','layout बिगड़ा, रंग/छिपा तत्व, कोई बटन दिख नहीं रहा'],
    ['Console','JS त्रुटियाँ, चेतावनियाँ, आपका अपना कोड चलाना','बटन क्लिक पर कुछ नहीं होता; लाल त्रुटि पढ़ें'],
    ['Network','हर request — status, समय, आकार, headers, response','पन्ना धीमा, कोई फ़ाइल नहीं आई, 404/500/CORS'],
    ['Sources','JS/CSS फ़ाइलें, breakpoint लगाकर कदम-दर-कदम','कोड कहाँ अटकता है; minified फ़ाइल को {} से सुंदर करें'],
    ['Performance','समय-रेखा — layout, paint, JS, लंबे कार्य','jank/धीमा स्क्रॉल; कौन-सा फंक्शन समय खा रहा'],
    ['Memory','heap snapshot, allocation','टैब धीरे-धीरे RAM खा रहा (leak)'],
    ['Application','cookies, localStorage, sessionStorage, IndexedDB, cache storage, service worker, manifest','login टिकता नहीं, पुराना डाटा दिख रहा, offline व्यवहार'],
    ['Lighthouse','प्रदर्शन/Accessibility/SEO का अंक और सुझाव','साइट कितनी अच्छी — सुधार की सूची'],
    ['Security','certificate, TLS संस्करण, mixed content','ताला किन कारणों से पूरा नहीं'],
    ['Recorder','उपयोगकर्ता के कदम रिकॉर्ड करके दोहराना','bug दोहराने की पक्की विधि'],
  ] },
  { type:'code', code: '// --- Console में तुरंत काम आने वाले छोटे आदेश ---\nconsole.log(document.title, location.href);\ndocument.querySelectorAll(\'a\').length          // कितने links\n$$(\'img\').filter(i => !i.complete || i.naturalWidth === 0)   // टूटे चित्र\nconsole.table([...document.querySelectorAll(\'table tr\')].map(r => r.innerText))\ngetEventListeners(document.querySelector(\'button\'))   // Chrome में\ncopy(document.body.innerText)                  // clipboard में\nmonitorEvents(document.body, \'click\')          // हर click छपेगा\n\n// --- Network से जाँच ---\n// 1) Network टैब खोलें, "Disable cache" tick करें, पन्ना reload करें\n// 2) लाल पंक्ति = असफल request; उस पर क्लिक -> Headers/Response पढ़ें\n// 3) Status खेत देखें: 200 ठीक, 301/302 redirect, 304 cache,\n//    401/403 अनुमति, 404 नहीं मिला, 429 बहुत अनुरोध, 500/502/503 server\n// 4) Timing टैब में TTFB बनाम Content Download देखें\n// 5) ऊपर filter: -mime-type:image  या  status-code:500\n\n// --- Application से storage साफ़ ---\n// Application -> Storage -> "Clear site data" (सब कुछ एक साथ)\nlocalStorage.clear(); sessionStorage.clear();\ndocument.cookie.split(\';\').forEach(c => {\n  document.cookie = c.replace(/^ +/, \'\').replace(/=.*/, \'=;expires=\' + new Date(0).toUTCString() + \';path=/\');\n});\n\n// --- Service worker हटाना (पुराना cached ऐप अटका हो) ---\nnavigator.serviceWorker?.getRegistrations().then(rs => rs.forEach(r => r.unregister()));' },
  { type:'callout', kind:'tip', title:'“साइट ठीक नहीं चल रही” — 6 कदम का क्रम', html:'<p>1) <b>Hard refresh</b> — Ctrl+Shift+R (Ctrl+F5) cache छोड़कर सब नया लाता है। 2) <b>वही साइट दूसरे ब्राउज़र/Incognito में</b> खोलें — चले तो समस्या आपके cache/cookie/extension की है। 3) <b>Console</b> में लाल त्रुटि पढ़ें। 4) <b>Network</b> में असफल request ढूँढ़ें। 5) <b>Extensions सब बंद</b> करके जाँचें, फिर एक-एक चालू करें (ad blocker अक्सर कारण होता है)। 6) <b>Clear site data</b> (Application टैब) — login दोबारा करना पड़ेगा, यह पहले बता दें।</p>' },
  { type:'table', head:['DevTools शॉर्टकट','काम'], rows:[
    ['F12 / Ctrl+Shift+I','DevTools खोलना/बंद'],
    ['Ctrl+Shift+C','सीधे element चुनने वाला mode'],
    ['Ctrl+Shift+J','सीधे Console'],
    ['Ctrl+Shift+R','Hard reload (cache छोड़कर)'],
    ['Ctrl+Shift+P (DevTools में)','Command menu — कोई भी कमांड नाम से'],
    ['Ctrl+F (Elements में)','DOM में खोज'],
    ['Ctrl+Shift+M','Device toolbar — mobile दृश्य'],
    ['Shift+Esc (ब्राउज़र में)','ब्राउज़र का अपना Task Manager'],
    ['Esc (DevTools में)','नीचे Console drawer खोलना'],
    ['Ctrl+Shift+Delete','Clear browsing data विंडो'],
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">2.3</span> Cache, Cookies और Storage — कौन क्या रखता है</h3><p>ये चारों अलग-अलग चीज़ें हैं जिन्हें लोग मिला देते हैं। <b>Cache</b> में फ़ाइलों की नक़ल रहती है (चित्र, CSS, JS) ताकि दोबारा न डाउनलोड हों। <b>Cookies</b> में छोटा पहचान/स्थिति डाटा रहता है जो <i>हर request के साथ server को जाता है</i>। <b>Web Storage</b> केवल ब्राउज़र में रहता है, server को अपने आप नहीं जाता, और बड़ा हो सकता है।</p>' },
  { type:'table', head:['भंडार','आकार','कब तक','server को जाता है?','किस काम'], rows:[
    ['HTTP Cache (disk/memory)','सैकड़ों MB','Cache-Control/Expires अनुसार','नहीं (उल्टा बचाता है)','चित्र/CSS/JS दोबारा न लाना'],
    ['Cookie','~4 KB प्रति cookie','Expires/Max-Age; न दिया तो session','हाँ — हर उसी domain की request पर','login session, पसंद, tracking'],
    ['localStorage','~5–10 MB प्रति origin','स्थायी — आप हटाएँ तब तक','नहीं','पसंद, थीम, offline डाटा'],
    ['sessionStorage','~5 MB','टैब बंद होते ही मिटता','नहीं','एक टैब का अस्थायी काम/form'],
    ['IndexedDB','बहुत बड़ा (सैकड़ों MB+)','स्थायी','नहीं','संरचित डाटा, offline ऐप'],
    ['Cache Storage (SW)','बड़ा','Service worker के नियंत्रण में','नहीं','PWA की offline फ़ाइलें'],
    ['Service Worker','कोड','unregister तक','यह ख़ुद request रोकता है','offline, push, background sync'],
  ] },
  { type:'table', head:['Cookie का गुण','अर्थ','सुरक्षित मान'], rows:[
    ['HttpOnly','JavaScript उसे पढ़ नहीं सकती','session cookie पर ON — XSS से चोरी मुश्किल'],
    ['Secure','केवल HTTPS पर भेजी जाए','हमेशा ON'],
    ['SameSite=Strict/Lax/None','दूसरी साइट से आने पर भेजें या नहीं','Lax अच्छा संतुलन; None के साथ Secure अनिवार्य'],
    ['Expires / Max-Age','कब मिटे','session के लिए कम समय'],
    ['Domain / Path','किस पथ पर लागू','जितना छोड़ा जा सके उतना कम'],
    ['Third-party cookie','दूसरे domain की cookie (विज्ञापन)','आज अधिकांश ब्राउज़र रोक रहे हैं'],
  ] },
  { type:'callout', kind:'warn', title:'“Clear browsing data” में क्या-क्या मिटता है', html:'<p>Ctrl+Shift+Delete की विंडो में हर डिब्बे का अलग असर है — <b>Browsing history</b> (पता-सूची का इतिहास), <b>Cookies and site data</b> (सब साइट से logout हो जाएँगे), <b>Cached images and files</b> (सुरक्षित, केवल दोबारा डाउनलोड होगा), <b>Passwords</b> (सहेजे पासवर्ड — ध्यान!), <b>Autofill form data</b>, <b>Site settings/permissions</b>। आम सफ़ाई के लिए केवल <b>cached files</b> चुनें; login समस्या हो तो उसी एक साइट का data हटाएँ, पूरी दुनिया का नहीं।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">2.4</span> Extensions — सुविधा और जोखिम</h3><p>Extension ब्राउज़र के अंदर चलने वाला छोटा प्रोग्राम है, और उसे दी गई अनुमति के अनुसार यह <b>आपके खोले हर पन्ने का पाठ पढ़ सकता है</b>। “Read and change all your data on all websites” अनुमति का यही अर्थ है — इसमें आपका बैंक पन्ना भी आता है। इसीलिए extension केवल भरोसेमंद स्रोत से और कम-से-कम रखें।</p>' },
  { type:'table', head:['श्रेणी','उपयोगी उदाहरण','सावधानी'], rows:[
    ['Ad/Tracker blocker','uBlock Origin','कुछ साइटें टूटती हैं; साइट-वार बंद करना सीखें'],
    ['Password manager','Bitwarden, 1Password','master password मज़बूत; autofill केवल सही domain पर'],
    ['Privacy','Privacy Badger, ClearURLs','बहुत सारे एक साथ = धीमा और टूटी साइट'],
    ['भाषा/अनुवाद','शब्दकोश, immersive translate','पन्ने का पाठ बाहर जाता है — संवेदनशील पर न चलाएँ'],
    ['Screenshot/PDF','पन्ना सहेजना','“सब डाटा पढ़ें” अनुमति माँगे तो सोचें'],
    ['Developer','React/Vue DevTools, JSON viewer','केवल काम के समय चालू रखें'],
    ['Coupon/Shopping','Honey आदि','आपकी browsing का पूरा इतिहास एकत्र कर सकती हैं'],
    ['VPN/Proxy extension','—','केवल ब्राउज़र का ट्रैफ़िक, पूरे सिस्टम का नहीं; कई भरोसेमंद नहीं'],
    ['“Video downloader”','—','सबसे ज़्यादा मैलवेयर/डेटा-चोरी इसी श्रेणी में'],
  ] },
  { type:'callout', kind:'danger', title:'Extension जाँच की 5 पंक्ति', html:'<p>1) क्या यह सचमुच चाहिए? न हो तो हटाएँ। 2) अनुमति में “all websites” है? तो इसे आपकी हर गतिविधि दिखेगी। 3) डेवलपर कौन है, कितने उपयोगकर्ता, आखिरी अपडेट कब? 4) review अचानक बदल गए हों तो सतर्क — अच्छा extension बिककर बुरा बन सकता है। 5) बैंकिंग/आधार का काम अलग ब्राउज़र profile में करें जिसमें कोई extension न हो।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">2.5</span> खोज को औज़ार की तरह इस्तेमाल करना</h3><p>सामान्य खोज में विज्ञापन और SEO-भरी साइटें ऊपर आती हैं। ऑपरेटर लगाकर आप खोज को सीमित कर सकते हैं — यही शोध का असली कौशल है।</p>' },
  { type:'table', head:['ऑपरेटर','काम','उदाहरण'], rows:[
    ['"…"','ठीक वही वाक्यांश','"electrician trade theory"'],
    ['site:','एक ही साइट/domain के अंदर','site:ncvtmis.gov.in syllabus'],
    ['filetype: / ext:','केवल एक फ़ाइल प्रकार','filetype:pdf "SMPS" notes'],
    ['-शब्द','उस शब्द को हटाओ','arduino -toy -kit'],
    ['OR / |','इनमें से कोई','soldering OR brazing'],
    ['intitle:','शीर्षक में वह शब्द','intitle:"answer key" iti'],
    ['inurl:','URL में वह शब्द','inurl:login bank'],
    ['after: / before:','तारीख़ सीमा','after:2025-01-01 windows 11'],
    ['related:','मिलती-जुलती साइटें','related:archive.org'],
    ['define: / meaning','अर्थ','define:latency'],
    ['*','wildcard शब्द','"measure * with multimeter"'],
    ['(..)','संख्या श्रेणी','laptop 30000..45000'],
    ['cache: (अब सीमित)','सहेजा रूप','अब Wayback Machine बेहतर'],
    ['intext:','मुख्य पाठ में','intext:"admit card" 2026'],
  ] },
  { type:'steps', items:[
    { n:1, title:'स्रोत की जाँच करें', text:'domain कौन-सा है — .gov.in/.nic.in सरकारी, .ac.in/.edu शैक्षिक। लेखक और तारीख़ दिख रही है? “About” और “Contact” पन्ना मौजूद है?' },
    { n:2, title:'दूसरे स्रोत से मिलाएँ', text:'कोई भी महत्वपूर्ण तथ्य कम-से-कम दो स्वतंत्र जगह देखें। एक ही बात 20 साइटों पर हो पर सब एक ही स्रोत से copy हों तो वह एक ही स्रोत है।' },
    { n:3, title:'तारीख़ देखें', text:'तकनीकी जानकारी में तारीख़ निर्णायक है — 2019 का Windows इंस्टॉल लेख आज आधा ग़लत होगा। खोज में after: लगाएँ।' },
    { n:4, title:'मूल स्रोत तक जाएँ', text:'समाचार में कोई दावा हो तो उस शोध-पत्र/आधिकारिक अधिसूचना को खोलें। Wikipedia के संदर्भ-सूची से मूल तक पहुँचना सबसे तेज़ रास्ता है।' },
    { n:5, title:'पुराना/हटाया पन्ना', text:'लिंक टूटा हो तो Wayback Machine (archive.org) पर वही URL डालें — पुराने snapshot मिल सकते हैं। यही डिजिटल अभिलेखागार है।' },
    { n:6, title:'उद्धरण और नोट', text:'जो काम का मिले उसका URL, तारीख़ और एक-पंक्ति सार अपने नोट में रखें (OneNote/Notion)। बाद में वही स्रोत दोबारा ढूँढ़ने में घंटे बचते हैं।' },
  ] },
  { type:'callout', kind:'tip', title:'AI खोज-सारांश पर भरोसा कहाँ तक', html:'<p>खोज-इंजन का AI सारांश तेज़ है पर कभी-कभी आत्मविश्वास से ग़लत बात कह देता है। नियम — <b>सारांश से दिशा लें, तथ्य मूल स्रोत से पक्का करें</b>। कोई संख्या, तारीख़, क़ानून, दवा या परीक्षा-नियम हो तो मूल पन्ना खोलकर ही मानें। AI का दिया लिंक भी खोलकर देखें — वह मौजूद न भी हो सकता है।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">2.6</span> Privacy — Incognito, tracking और पासवर्ड</h3><p><b>Incognito/Private विंडो</b> केवल आपके कंप्यूटर पर निशान नहीं छोड़ती — बंद करने पर इतिहास, cookies और form डाटा मिट जाते हैं। यह आपको <b>इंटरनेट पर अदृश्य नहीं बनाती</b>। आपकी ISP, दफ़्तर का नेटवर्क, वह वेबसाइट और आपका login सब आपको देख सकते हैं।</p>' },
  { type:'table', head:['क्या छिपता है','Incognito में','किससे छिपता है','किससे नहीं'], rows:[
    ['ब्राउज़िंग इतिहास','हाँ, बंद होने पर मिटता','उसी PC के अगले उपयोगकर्ता से','ISP/नेटवर्क admin से नहीं'],
    ['Cookies/site data','हाँ, सत्र तक','अगले सत्र से','साइट से नहीं (सत्र के दौरान)'],
    ['डाउनलोड की फ़ाइल','नहीं — फ़ाइल रहती है','—','किसी से नहीं'],
    ['Bookmarks बनाए','नहीं — रहते हैं','—','—'],
    ['IP पता','नहीं','—','साइट/ISP सब देखते हैं'],
    ['Login किया खाता','नहीं — साइट आपको जानती है','—','साइट से नहीं'],
    ['Extension','कुछ चालू रह सकते हैं','—','extension देख सकती है'],
    ['Fingerprinting','नहीं','—','साइट पहचान सकती है'],
  ] },
  { type:'table', head:['सुरक्षा आदत','कैसे','क्यों'], rows:[
    ['Password manager','Bitwarden/1Password; हर साइट का अलग लंबा पासवर्ड','एक लीक हुआ पासवर्ड सब खाते न खोले'],
    ['2FA / Passkey','authenticator ऐप या hardware key; SMS से बेहतर','पासवर्ड चोरी होने पर भी खाता सुरक्षित'],
    ['HTTPS-Only मोड','ब्राउज़र सेटिंग में चालू','ग़लती से http पर जाने से बचाव'],
    ['DNS over HTTPS','Settings → Privacy → Secure DNS','ISP को आपकी DNS खोज न दिखे'],
    ['Tracking protection','Strict/Standard चुनें','third-party tracker कम'],
    ['अलग profile','काम / बैंकिंग / व्यक्तिगत','extension और cookie का दायरा बँटा रहे'],
    ['Permissions जाँच','कैमरा/माइक/लोकेशन — साइट-वार Allow','ग़ैर-ज़रूरी पहुँच बंद'],
    ['Autofill पता/कार्ड','संवेदनशील साइट पर बंद','छिपे form खेत भरने से बचाव'],
    ['अपडेट','ब्राउज़र स्वतः अपडेट रहने दें','ज्ञात कमज़ोरी तुरंत बंद'],
    ['Pop-up/Redirect','ब्लॉक रखें','नक़ली “virus alert” से बचाव'],
  ] },
  { type:'callout', kind:'danger', title:'ब्राउज़र के चार आम जाल', html:'<p>1) <b>“आपका कंप्यूटर संक्रमित है — अभी call करें”</b> — पूरा पन्ना नक़ली है; ब्राउज़र बंद करें (Task Manager से), कोई number न मिलाएँ। 2) <b>“Allow notifications” दबाएँ</b> — दबाते ही दिन-भर नक़ली विज्ञापन-सूचनाएँ आएँगी; Site settings → Notifications से हटाएँ। 3) <b>नक़ली अपडेट/CAPTCHA</b> — “Chrome update करें” या “Win+R दबाकर यह paste करें” — यह मैलवेयर है; अपडेट केवल ब्राउज़र के अपने मेनू से। 4) <b>मिलता-जुलता domain</b> — पता-पट्टी का आख़िरी दो हिस्सा पढ़ें, बीच के hyphen/शब्द नहीं।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">2.7</span> डाउनलोड, PDF, अनुवाद और वेब त्रुटियाँ</h3><p>ब्राउज़र केवल पन्ने दिखाने का औज़ार नहीं — फ़ाइल प्रबंधन, दस्तावेज़ पढ़ना, अनुवाद और offline ऐप भी उसी में होते हैं। पर हर डाउनलोड एक जोखिम भी है।</p>' },
  { type:'table', head:['डाउनलोड प्रकार','जोखिम','क्या करें'], rows:[
    ['.pdf / .docx','macro/शोषण सम्भव','विश्वसनीय स्रोत; Protected View में खोलें; macro Enable न करें'],
    ['.exe / .msi / .bat','सीधा प्रोग्राम चलाना','केवल निर्माता की साइट से; डिजिटल हस्ताक्षर जाँचें'],
    ['.zip / .rar / .7z','अंदर कुछ भी','खोलने से पहले स्कैन; अंदर .exe/.lnk/.js खासकर देखें'],
    ['.iso / .img','बड़ा disk image','अक्सर पायरेटेड/मैलवेयर; केवल आधिकारिक स्रोत'],
    ['.js / .vbs / .lnk / .scr','स्क्रिप्ट/शॉर्टकट — लगभग हमेशा ख़तरा','कभी न चलाएँ'],
    ['“आपका इनवॉइस.html”','नक़ली login फ़ॉर्म','अटैचमेंट में HTML कभी न खोलें'],
    ['Crack/keygen/activator','लगभग निश्चित मैलवेयर','कभी नहीं'],
    ['SmartScreen/Defender चेतावनी','अपरिचित/हस्ताक्षर रहित','रुकें; स्रोत पक्का करें; “Run anyway” आदत न बनाएँ'],
  ] },
  { type:'table', head:['त्रुटि / संदेश','अर्थ','पहला हल'], rows:[
    ['ERR_NAME_NOT_RESOLVED','DNS से नाम का IP नहीं मिला','दूसरा साइट खोलें; DNS बदलें (1.1.1.1/8.8.8.8); ipconfig /flushdns'],
    ['ERR_CONNECTION_TIMED_OUT','server ने उत्तर नहीं दिया','इंटरनेट/फ़ायरवॉल; दूसरे नेटवर्क से जाँचें; साइट down हो सकती है'],
    ['ERR_CONNECTION_REFUSED','पोर्ट बंद/सेवा नहीं चल रही','सही पता/पोर्ट; server-side समस्या'],
    ['ERR_CERT_DATE_INVALID','certificate की तारीख़ ग़लत','अपने PC की तारीख़/समय ठीक करें'],
    ['ERR_CERT_AUTHORITY_INVALID','जारीकर्ता भरोसेमंद नहीं','कैप्टिव पोर्टल/प्रॉक्सी हो सकता है; संस्था का root CA चाहिए'],
    ['ERR_CERT_COMMON_NAME_INVALID','certificate दूसरे नाम का','URL ग़लत या प्रॉक्सी बीच में है'],
    ['ERR_SSL_PROTOCOL_ERROR','TLS बात नहीं बनी','पुराना OS/ब्राउज़र; TLS 1.0/1.1 बंद साइट; समय जाँचें'],
    ['403 Forbidden','अनुमति नहीं','login/अधिकार; VPN/IP ब्लॉक भी हो सकता'],
    ['404 Not Found','पन्ना नहीं है','URL की spelling; Wayback Machine; साइट की खोज'],
    ['429 Too Many Requests','बहुत अनुरोध','थोड़ी देर रुकें; automation धीमा करें'],
    ['500 / 502 / 503','server की ग़लती','आपके यहाँ हल नहीं; बाद में आज़माएँ'],
    ['CORS त्रुटि (Console में)','दूसरे origin से JS रोक','यह साइट/डेवलपर की सेटिंग है; extension से न छेड़ें'],
    ['Mixed content','https पन्ने पर http संसाधन','Security टैब में देखें; साइट को ही ठीक करना होगा'],
    ['ERR_BLOCKED_BY_CLIENT','आपका ad blocker रोक रहा','उस साइट पर blocker बंद करके जाँचें'],
    ['“Aw, Snap!” / टैब crash','renderer प्रक्रिया गिरी','extension बंद, RAM जाँच, ब्राउज़र अपडेट/रीसेट'],
  ] },
  { type:'table', head:['वेब औज़ार','काम','ध्यान'], rows:[
    ['Built-in PDF viewer','पढ़ना, भरना, हस्ताक्षर, छापना','संवेदनशील PDF ऑनलाइन टूल पर न चढ़ाएँ'],
    ['ब्राउज़र अनुवाद','पूरा पन्ना अनुवाद','तकनीकी शब्द ग़लत हो सकते हैं; मूल से मिलाएँ'],
    ['Reading mode','विज्ञापन हटाकर साफ़ पाठ','लंबा लेख पढ़ने में आराम'],
    ['Read aloud / TTS','पन्ना सुनाना','दृष्टि-बाधा व बहु-कार्य में उपयोगी'],
    ['PWA (Install app)','साइट को ऐप जैसा इंस्टॉल','offline भी चल सकती है; service worker सँभालता है'],
    ['Tab groups / Sleeping tabs','बहुत टैब सँभालना','RAM बचती है; Edge/Chrome दोनों में'],
    ['Sync (खाता)','bookmark/password सब उपकरण पर','साझा PC पर sign out ज़रूर'],
    ['Reader/Print to PDF','पन्ने को PDF में सहेजना','Ctrl+P → Save as PDF — रसीद का पक्का सबूत'],
    ['Wayback Machine','पुराना/हटाया पन्ना','शोध और प्रमाण के लिए'],
    ['Online converters','फ़ाइल रूप बदलना','निजी दस्तावेज़ कभी अपलोड न करें — स्थानीय औज़ार लें'],
  ] },

  { type:'callout', kind:'exam', title:'परीक्षा में यहाँ से प्रश्न', html:'<p>Blink/Gecko/WebKit किस ब्राउज़र का है, Incognito क्या छिपाता है और क्या नहीं, cookie बनाम localStorage, HTTP status codes (200/301/401/403/404/429/500/503), HTTPS व ताले का अर्थ, DNS का काम, खोज-ऑपरेटर (site:, filetype:, ""), DevTools के टैब, और Ctrl+Shift+R / Ctrl+Shift+Delete के काम — ये सबसे आम वस्तुनिष्ठ प्रश्न हैं।</p>' },

  { type:'labs', items:[
    { n:169, title:'DevTools से एक पन्ने का पूरा निरीक्षण', aim:'Elements, Console और Network से असली आँकड़े निकालना।', tools:['Chrome/Edge/Firefox', 'कोई समाचार या सरकारी साइट'], steps:['साइट खोलकर F12 दबाएँ; Elements में शीर्षक का tag व class लिखें।', 'Console में document.title, location.href और $$("a").length चलाकर मान लिखें।', 'Network टैब खोलकर Disable cache tick करें और Ctrl+Shift+R करें।', 'कुल requests, कुल transferred आकार, DOMContentLoaded व load समय नोट करें।', 'सबसे बड़ी फ़ाइल और सबसे धीमी request पहचानें; उसका status व timing लिखें।', 'Lighthouse चलाकर चारों अंक और दो सुधार-सुझाव लिखें।'], result:'एक पन्ने की भरी निरीक्षण-तालिका — आँकड़े, धीमी फ़ाइल और दो सुधार-सुझाव।' },
    { n:170, title:'Cache, Cookie और Storage का अंतर प्रयोग से दिखाना', aim:'चारों भंडारों को अपने हाथ से देखना और साफ़ करना।', tools:['ब्राउज़र DevTools → Application', 'कोई login वाली अभ्यास साइट'], steps:['साइट पर login करें; Application → Cookies में session cookie का नाम, Expires, HttpOnly, Secure, SameSite लिखें।', 'localStorage और sessionStorage में क्या रखा है, keys की सूची लिखें।', 'Console में localStorage.setItem("class","ITI") चलाकर Application में दिखता देखें; टैब बंद करके दोनों की स्थिति जाँचें।', 'केवल cached files साफ़ करके reload करें — login बचा रहेगा, यह प्रमाणित करें।', 'अब उस साइट का cookies+site data हटाएँ — logout हो जाएगा, यह दिखाएँ।', 'चारों भंडारों की एक तुलना-तालिका अपने प्रेक्षण से भरें।'], result:'cookie के गुणों की नक़ल, storage की keys और दो तरह की सफ़ाई का दिखाया गया अंतर।' },
    { n:171, title:'खोज-ऑपरेटर से लक्षित शोध', aim:'सामान्य खोज और ऑपरेटर-खोज की गुणवत्ता नापना।', tools:['कोई खोज-इंजन', 'विषय — "ITI electrician trade theory PDF"'], steps:['पहले सादा खोज करें; पहले 10 परिणामों में से कितने सचमुच काम के हैं, गिनें।', 'अब filetype:pdf site:gov.in लगाकर वही खोज करें; दोबारा गिनें।', '"…" से एक ठीक वाक्यांश और -शब्द से एक अनावश्यक शब्द हटाकर खोजें।', 'after:2024-01-01 लगाकर पुराने परिणाम हटाएँ।', 'तीन सबसे अच्छे स्रोत चुनें और हर एक के लिए domain, तारीख़, लेखक व विश्वसनीयता-टिप्पणी लिखें।', 'एक टूटे लिंक को Wayback Machine पर ढूँढ़ने का प्रयास करें।'], result:'दो खोजों की तुलना-तालिका और तीन सत्यापित स्रोतों की सूची।' },
    { n:172, title:'Incognito की सीमा प्रयोग से सिद्ध करना', aim:'“गुप्त विंडो” के दावे की असली सीमा दिखाना।', tools:['सामान्य और Incognito विंडो', 'IP दिखाने वाली साइट', 'कोई login साइट'], steps:['सामान्य विंडोज़ में एक साइट खोलें; इतिहास में दिखती देखें।', 'Incognito में वही साइट खोलें; विंडो बंद करके इतिहास जाँचें — नहीं मिलेगी।', 'Incognito में IP देखने वाली साइट खोलें — वही सार्वजनिक IP दिखेगा; लिखें।', 'Incognito में किसी खाते में login करें — साइट आपको पहचान लेगी; यह प्रमाणित करें।', 'Incognito में एक फ़ाइल डाउनलोड करें — विंडो बंद करने पर भी फ़ाइल रहेगी।', 'निष्कर्ष में लिखें — Incognito किससे बचाता है और किससे नहीं (चार बिंदु)।'], result:'चार प्रयोगों के प्रेक्षण और Incognito की सीमा का स्पष्ट लिखित निष्कर्ष।' },
    { n:173, title:'Extensions का असर नापकर सुरक्षित सेट बनाना', aim:'extension से गति/टूटन पर असर देखना और न्यूनतम सुरक्षित सूची तय करना।', tools:['ब्राउज़र', '2–3 extension', 'DevTools Network', 'Lighthouse'], steps:['सब extension बंद करके एक भारी साइट का load समय व Lighthouse अंक लिखें।', 'एक ad blocker चालू करके वही मापें — requests कितनी घटीं, लिखें।', 'एक-एक और extension जोड़ते हुए मापें; कौन-सा सबसे ज़्यादा समय खा रहा है, पहचानें।', 'Shift+Esc से ब्राउज़र Task Manager में हर extension की RAM लिखें।', 'हर extension की अनुमतियाँ पढ़ें — किसे “all websites” चाहिए और क्यों।', 'अपनी अंतिम न्यूनतम सूची (अधिकतम 4) और हर एक का कारण लिखें।'], result:'पहले/बाद के load आँकड़े, अनुमति-समीक्षा और तर्कसहित न्यूनतम extension सूची।' },
    { n:174, title:'वेब त्रुटियों का निदान — पाँच मामले', aim:'अलग-अलग त्रुटि संदेशों को सही कारण से जोड़ना।', tools:['ब्राउज़र DevTools', 'जान-बूझकर ग़लत URL', 'PC की तारीख़ बदलने की अनुमति (VM)'], steps:['ग़लत domain खोलें → ERR_NAME_NOT_RESOLVED; screenshot व अर्थ लिखें।', 'बंद पोर्ट वाला पता खोलें → ERR_CONNECTION_REFUSED; अंतर लिखें।', 'VM की तारीख़ दो साल पीछे करके https साइट खोलें → certificate त्रुटि; तारीख़ ठीक करके हल दिखाएँ।', 'किसी साइट पर ग़लत पथ डालकर 404 पाएँ; सही पथ से 200 दिखाएँ।', 'ad blocker चालू रखकर कोई स्क्रिप्ट-निर्भर साइट खोलें → ERR_BLOCKED_BY_CLIENT; blocker बंद करके हल।', 'पाँचों की एक तालिका बनाएँ — संदेश | कारण | पहला कदम | हल।'], result:'पाँच त्रुटियों के screenshots और भरी निदान-तालिका।' },
  ] },

  { type:'acc', title:'ब्राउज़र व वेब — 14 आम प्रश्न', items:[
    { q:'Chrome, Edge और Brave अलग-अलग ब्राउज़र हैं या एक?', a:'इंजन के स्तर पर तीनों एक ही हैं — Blink (rendering) और V8 (JavaScript), Chromium से बने। ऊपर का UI और privacy नीति अलग है। इसीलिए कोई Blink bug तीनों पर असर करता है। Firefox (Gecko) और Safari (WebKit) सचमुच अलग इंजन हैं।' },
    { q:'ब्राउज़र इतनी RAM क्यों खाता है?', a:'हर साइट/टैब अलग renderer प्रक्रिया में चलती है (site isolation) ताकि एक के crash या हमले से दूसरी न प्रभावित हो। ऊपर से GPU प्रक्रिया, network सेवा और extensions। Chrome/Edge के Shift+Esc Task Manager से दोषी टैब दिखता है; sleeping tabs और tab groups बहुत बचत करते हैं।' },
    { q:'Hard refresh और साधारण refresh में फ़र्क़?', a:'साधारण refresh (F5) cache से फ़ाइलें इस्तेमाल कर सकता है। Hard refresh (Ctrl+Shift+R / Ctrl+F5) cache छोड़कर सब कुछ server से नया लाता है। “साइट में बदलाव हुआ पर पुराना दिख रहा है” — यही पहला इलाज है।' },
    { q:'Cookie और localStorage में क्या फ़र्क़ है?', a:'Cookie हर उसी domain की HTTP request के साथ server जाती है, ~4 KB की होती है और उसकी मियाद तय हो सकती है। localStorage केवल ब्राउज़र में रहता है, server अपने आप नहीं जाता, ~5–10 MB का होता है और स्थायी रहता है। login के लिए cookie, पसंद/offline डाटा के लिए storage।' },
    { q:'Incognito में VPN की ज़रूरत नहीं रह जाती?', a:'नहीं। Incognito केवल आपके PC पर इतिहास/cookie नहीं छोड़ता। आपका IP, ISP को दिखने वाला ट्रैफ़िक और साइट पर आपका login सब वैसा ही रहता है। नेटवर्क-स्तर की गोपनीयता के लिए भरोसेमंद VPN या Tor चाहिए — और वह भी पूर्ण अदृश्यता नहीं देता।' },
    { q:'“आपका कंप्यूटर वायरस से भरा है, इस number पर call करें” — क्या करें?', a:'यह 100% धोखा है, कोई वेबसाइट आपके सिस्टम को स्कैन नहीं कर सकती। ब्राउज़र बंद करें; न बंद हो तो Task Manager से प्रक्रिया समाप्त करें। कोई number न मिलाएँ, कोई सॉफ़्टवेयर न डालें, remote access न दें। बाद में असली antivirus से स्कैन कर लें।' },
    { q:'ग़लती से “Allow notifications” दबा दिया, अब विज्ञापन आ रहे हैं।', a:'Settings → Privacy and security → Site settings → Notifications में जाएँ; Allowed सूची से उस साइट को Remove/Block करें। Chrome में पता-पट्टी के ताले पर क्लिक → Site settings → Notifications → Block भी सीधा रास्ता है। भविष्य में “quieter notification prompts” चालू रखें।' },
    { q:'ताला (HTTPS) दिखे तो साइट सुरक्षित है?', a:'HTTPS केवल यह बताता है कि <b>आप और उस server के बीच का रास्ता encrypted है</b> और certificate उस नाम का है। यह नहीं बताता कि साइट ईमानदार है — धोखेबाज़ भी मुफ़्त certificate ले सकते हैं। ताला + सही domain + भरोसेमंद स्रोत, तीनों देखें।' },
    { q:'“Your connection is not private” हर साइट पर आ रहा है।', a:'सबसे पहले अपने PC की तारीख़, समय और समय-क्षेत्र जाँचें — ग़लत घड़ी certificate को अमान्य बना देती है। फिर antivirus का “HTTPS scanning” और संस्था का प्रॉक्सी देखें। केवल एक साइट पर आए तो उसी साइट के certificate की समस्या है; “Advanced → Proceed” आदत न बनाएँ।' },
    { q:'कोई फ़ाइल डाउनलोड करते समय SmartScreen रोक रहा है — जबरदस्ती चलाएँ?', a:'नहीं। पहले स्रोत पक्का करें — क्या यह निर्माता की असली साइट है? फ़ाइल का डिजिटल हस्ताक्षर (Properties → Digital Signatures) जाँचें और hash मिलाएँ यदि निर्माता देता है। अपरिचित “crack”, “activator”, “invoice.html” को कभी न चलाएँ।' },
    { q:'Extension कितने रखने चाहिए?', a:'जितने कम उतना अच्छा — आमतौर पर 3–4: एक ad blocker, एक password manager, और काम की एक-दो विशिष्ट। हर extension एक अतिरिक्त हमला-सतह है और RAM/CPU खाता है। “सब वेबसाइटों का डाटा पढ़ें” अनुमति वाले extension पर विशेष ध्यान दें।' },
    { q:'बहुत सारे टैब खोलने की आदत कैसे सुधारें?', a:'Tab groups बनाएँ और काम पूरा होते ही समूह बंद करें; Edge/Chrome में sleeping tabs चालू रखें; पढ़ने-योग्य पन्ने bookmark में “बाद में पढ़ें” folder में डालें; OneTab जैसे extension से पूरा सेट एक सूची में समेटें। इससे RAM भी बचती है और ध्यान भी।' },
    { q:'DNS over HTTPS (DoH) क्या करता है?', a:'आपकी DNS खोज (किस नाम का IP चाहिए) को सादे UDP के बजाय encrypted HTTPS से भेजता है, इसलिए आपकी ISP या स्थानीय नेटवर्क यह नहीं देख पाती कि आप कौन-सी साइट खोल रहे हैं। ध्यान रहे — इसके बाद भी ISP को IP/SNI से बहुत कुछ दिखता है; यह पूर्ण गोपनीयता नहीं है।' },
    { q:'ऑनलाइन PDF/फ़ोटो converter इस्तेमाल करना ठीक है?', a:'सार्वजनिक, ग़ैर-संवेदनशील फ़ाइल के लिए ठीक है। आधार, मार्कशीट, बैंक statement, संस्था का दस्तावेज़ कभी किसी अनजान साइट पर अपलोड न करें — वह copy उनके server पर रह जाती है। ऐसे काम के लिए स्थानीय औज़ार (LibreOffice, PDF24 offline, ImageMagick) इस्तेमाल करें।' },
  ] },

  { type:'quiz', store:'net-browser', items:[
    { q:'Chrome, Edge और Brave किस rendering इंजन पर बने हैं?', o:['Gecko','WebKit','Blink','Trident'], a:2, ex:'तीनों Chromium/Blink पर हैं (JS इंजन V8)। Firefox = Gecko, Safari = WebKit.' },
    { q:'Firefox का rendering इंजन कौन-सा है?', o:['Blink','Gecko','WebKit','Presto'], a:1, ex:'Gecko Firefox का स्वतंत्र इंजन है; JS इंजन SpiderMonkey कहलाता है।' },
    { q:'हर टैब अलग प्रक्रिया में चलाने का मुख्य लाभ?', o:['RAM बचना','एक टैब crash/हमला दूसरों को न गिराए (site isolation)','तेज़ डाउनलोड','कम बिजली'], a:1, ex:'लाभ स्थिरता और सुरक्षा है; कीमत अधिक RAM। Chrome/Edge का Shift+Esc Task Manager इसे दिखाता है।' },
    { q:'DevTools का कौन-सा टैब हर HTTP request दिखाता है?', o:['Elements','Console','Network','Sources'], a:2, ex:'Network में status, timing, headers, size और response सब मिलता है — “साइट धीमी/अटकी” का पहला जाँच-स्थल।' },
    { q:'JavaScript की लाल त्रुटियाँ कहाँ दिखती हैं?', o:['Network','Console','Application','Performance'], a:1, ex:'Console में JS त्रुटियाँ, चेतावनियाँ और आपका अपना कोड चलाने की जगह — Ctrl+Shift+J से सीधे खुलता है।' },
    { q:'Cookies, localStorage और Service Worker कहाँ देखें/साफ़ करें?', o:['Elements','Sources','Application','Security'], a:2, ex:'Application टैब में storage का पूरा नक़्शा और “Clear site data” बटन है।' },
    { q:'Hard refresh (cache छोड़कर) का शॉर्टकट?', o:['F5','Ctrl+R','Ctrl+Shift+R','Ctrl+D'], a:2, ex:'Ctrl+Shift+R (या Ctrl+F5) सब संसाधन server से नया लाता है। साधारण F5 cache इस्तेमाल कर सकता है।' },
    { q:'Cookie और localStorage में सबसे बड़ा फ़र्क़?', o:['आकार का','Cookie हर request के साथ server जाती है; localStorage नहीं','रंग का','localStorage अस्थायी है'], a:1, ex:'Cookie पहचान/स्थिति के लिए server को भेजी जाती है (~4 KB); localStorage केवल क्लाएंट पर रहता है (~5–10 MB), स्थायी।' },
    { q:'sessionStorage कब मिट जाता है?', o:['ब्राउज़र बंद होने पर','टैब बंद होते ही','कभी नहीं','24 घंटे बाद'], a:1, ex:'sessionStorage उसी टैब तक सीमित है; टैब बंद होते ही मिट जाता है। localStorage स्थायी रहता है।' },
    { q:'HttpOnly cookie का लाभ?', o:['तेज़ भेजना','JavaScript उसे पढ़ नहीं सकती — XSS से चोरी कठिन','छोटा आकार','रंग'], a:1, ex:'HttpOnly से document.cookie के ज़रिए session cookie नहीं पढ़ी जा सकती; Secure और SameSite भी साथ लगाएँ।' },
    { q:'Incognito विंडो क्या नहीं छिपाती?', o:['स्थानीय इतिहास','आपका IP पता और ISP/साइट से गतिविधि','session cookies','form data'], a:1, ex:'Incognito केवल आपके PC पर निशान नहीं छोड़ता। IP, ISP, नेटवर्क admin और login की हुई साइट आपको सामान्य रूप से देखते हैं।' },
    { q:'HTTP 404 का अर्थ?', o:['अनुमति नहीं','संसाधन नहीं मिला','server त्रुटि','बहुत अनुरोध'], a:1, ex:'404 Not Found. 401 = प्रमाणीकरण चाहिए, 403 = अनुमति नहीं, 429 = बहुत अनुरोध, 500 = server त्रुटि.' },
    { q:'HTTP 503 का अर्थ?', o:['पन्ना हट गया','सेवा अस्थायी अनुपलब्ध','redirect','cache'], a:1, ex:'5xx परिवार server की ग़लती है — 500 internal error, 502 bad gateway, 503 service unavailable। आपके यहाँ हल नहीं।' },
    { q:'HTTP 301 और 302 में फ़र्क़?', o:['दोनों समान','301 स्थायी redirect, 302 अस्थायी','301 त्रुटि, 302 सफल','301 cache, 302 नहीं'], a:1, ex:'301 Moved Permanently — खोज-इंजन नया URL अपना लेते हैं। 302 Found = अस्थायी।' },
    { q:'ताला (HTTPS) क्या पक्का करता है?', o:['साइट ईमानदार है','आप और server के बीच encryption + उस नाम का certificate','साइट सरकारी है','कोई वायरस नहीं'], a:1, ex:'धोखेबाज़ भी मुफ़्त TLS certificate ले सकते हैं। ताला केवल रास्ते की सुरक्षा बताता है, साइट की नीयत नहीं।' },
    { q:'ERR_CERT_DATE_INVALID का सबसे आम कारण?', o:['साइट बंद','आपके PC की तारीख़/समय ग़लत','RAM कम','extension'], a:1, ex:'certificate की वैधता अवधि आपकी घड़ी से जाँची जाती है। तारीख़/समय/क्षेत्र ठीक करते ही हल हो जाता है।' },
    { q:'ERR_NAME_NOT_RESOLVED किस स्तर की समस्या है?', o:['TLS','DNS','HTML','CSS'], a:1, ex:'नाम का IP नहीं मिल रहा। DNS बदलें, ipconfig /flushdns करें, या साइट का नाम जाँचें।' },
    { q:'ERR_BLOCKED_BY_CLIENT आमतौर पर किसका असर है?', o:['server','आपका ad blocker/extension','ISP','router'], a:1, ex:'क्लाएंट-साइड blocker ने request रोकी। उस साइट पर blocker बंद करके जाँचें।' },
    { q:'खोज में केवल PDF परिणाम चाहिए तो?', o:['pdf:','filetype:pdf','only:pdf','type=pdf'], a:1, ex:'filetype:pdf (या ext:pdf)। site: से domain और "…" से ठीक वाक्यांश सीमित करें।' },
    { q:'site:gov.in का काम?', o:['सरकारी साइट खोलना','परिणाम केवल उसी domain तक सीमित करना','साइट बनाना','cache दिखाना'], a:1, ex:'site: ऑपरेटर खोज को एक domain/साइट के अंदर सीमित कर देता है — शोध में बहुत उपयोगी।' },
    { q:'Extension की “Read and change all your data on all websites” अनुमति का अर्थ?', o:['केवल bookmark पढ़ना','आपके खोले हर पन्ने का पाठ पढ़ और बदल सकती है','केवल नया टैब','कुछ नहीं'], a:1, ex:'इसमें बैंकिंग पन्ना भी शामिल है। इसीलिए कम और भरोसेमंद extension रखें; संवेदनशील काम अलग profile में करें।' },
    { q:'TTFB क्या मापता है?', o:['पूरा पन्ना आने का समय','अनुरोध से पहले byte मिलने तक की देरी','चित्र का आकार','JS की गति'], a:1, ex:'Time To First Byte — server और नेटवर्क की देरी दिखाता है। बड़ा TTFB = धीमा backend/दूरी।' },
    { q:'DNS over HTTPS (DoH) का लाभ?', o:['साइट तेज़ खुलती है','ISP को आपकी DNS खोज नहीं दिखती','वायरस रुकता है','पासवर्ड बनता है'], a:1, ex:'DNS प्रश्न encrypted HTTPS से जाते हैं। पर ISP को IP/SNI से अभी भी बहुत कुछ दिखता है — यह पूर्ण गोपनीयता नहीं।' },
    { q:'हटाया/टूटा पन्ना ढूँढ़ने का सबसे अच्छा औज़ार?', o:['Cache:','Wayback Machine (archive.org)','Ctrl+F','Incognito'], a:1, ex:'Wayback Machine उसी URL के पुराने snapshots रखता है — शोध और प्रमाण दोनों में उपयोगी।' },
    { q:'“आपका PC संक्रमित है, call करें” वाला पन्ना दिखे तो?', o:['number मिलाना','ब्राउज़र बंद करना (ज़रूरत पर Task Manager से), कुछ न डालना','सॉफ़्टवेयर डाउनलोड करना','remote access देना'], a:1, ex:'कोई वेबसाइट आपके सिस्टम को स्कैन नहीं कर सकती — यह पूरा पन्ना नक़ली tech-support धोखा है।' },
  ] },
  { type:'pills', items:[
    { text:'Blink · Gecko · WebKit', kind:'info' },
    { text:'F12 = DevTools', kind:'tip' },
    { text:'Ctrl+Shift+R = hard refresh', kind:'tip' },
    { text:'Cookie server जाती है', kind:'info' },
    { text:'Incognito ≠ अदृश्य', kind:'warn' },
    { text:'ताला = encryption, नीयत नहीं', kind:'warn' },
    { text:'filetype: · site: · "…"', kind:'ok' },
    { text:'कम extension = कम जोखिम', kind:'danger' },
  ] },
  ]
},
]);
