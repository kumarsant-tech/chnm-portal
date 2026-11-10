/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-win1.js
   विंडोज़ मास्टरक्लास — भाग 1 : परिचय/इतिहास + पूरा इंटरफ़ेस
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   1. विंडोज़ का परिचय व इतिहास
   =================================================================== */
{
  id:'win-intro', icon:'🪟', group:'विंडोज़ मास्टरक्लास',
  title:'विंडोज़ का परिचय व इतिहास',
  sub:'संस्करण, एडिशन, लाइसेंस और 32/64-बिट की पूरी समझ',
  kicker:'Windows Masterclass 1 · Versions, Editions & Licensing',
  hero:'यह पेज विंडोज़ की पूरी पहचान सिखाता है — कौन-सा संस्करण (version) कब आया, उसके अंदर कौन-सा हिस्सा क्या करता है, कौन-सा एडिशन (edition) किस काम का है, लाइसेंस कैसे जाँचे और 32/64-बिट में असली फ़र्क़ क्या। सर्विसिंग में ग्राहक का PC देखकर यही चार सवाल तुरंत आते हैं — “कौन-सा विंडोज़ है, असली है या नहीं, अपग्रेड चलेगा या नहीं, पुराना ड्राइवर लगेगा या नहीं”。',
  tags:['1985 से 2026 तक','एडिशन तुलना','32/64/ARM64','लाइसेंस व Activation','फ़ोल्डर संरचना','सपोर्ट डेट'],
  blocks:[

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.1</span> ऑपरेटिंग सिस्टम (Operating System) क्या है?</h3>
      <p>OS एक <b>सिस्टम सॉफ़्टवेयर (system software)</b> है जो हार्डवेयर पर कब्ज़ा रखता है और ऐप्स को “काम करने लायक जगह” देता है। BIOS/UEFI POST पूरा करने के बाद <b>Windows Boot Manager (bootmgr)</b> चलाता है, जो <code>ntoskrnl.exe</code> (kernel) को मेमोरी में लादता है — इसी क्षण से OS सब कुछ संभालता है।</p>
      <ul>
        <li><b>बिना OS के:</b> हर ऐप को खुद डिस्क पढ़नी पड़े, RAM का हिसाब रखना पड़े, कीबोर्ड का स्कैन-कोड डिकोड करना पड़े — यानी व्यवहारिक रूप से असंभव।</li>
        <li><b>Firmware vs OS:</b> BIOS/UEFI = मदरबोर्ड की चिप में स्थायी छोटा सॉफ़्टवेयर (सिर्फ़ जगाना)। Windows = डिस्क पर रहने वाला बड़ा सॉफ़्टवेयर (सब मैनेज करना)।</li>
        <li><b>Single/Multi-user:</b> Windows NT लाइन एक ही मशीन पर कई अकाउंट व सेशन रख सकती है (RDP पर 2 Administrative sessions)। पुराना DOS/Win 3.1 single-user था।</li>
        <li><b>Shell:</b> “विंडोज़” नाम GUI shell (प्रogram Manager → Explorer) से आया — kernel अकेले काली स्क्रीन देता है, दिखने वाला सब shell का काम है।</li>
        <li><b>32/64-बिट:</b> यह OS का पता-लगाने का आकार (address width) है — नीचे 1.4 में पूरी तालिका।</li>
      </ul>`},

    {type:'table', head:['OS का काम (English term)','Windows में कौन करता है','सर्विसिंग में इसका असर'],
      rows:[
        ['प्रोसेस मैनेजमेंट (Process & Thread)','Kernel का Scheduler + <code>svchost.exe</code> समूह','“CPU 100%” हो तो Task Manager में svchost का सेवा-समूह पहचानें'],
        ['मेमोरी मैनेजमेंट (Virtual Memory)','MM + <code>pagefile.sys</code>/<code>swapfile.sys</code>','RAM कम हो तो pagefile डिस्क पर swap बढ़ाता है — PC धीमा'],
        ['फ़ाइल व डिस्क (File System)','<code>ntfs.sys</code>, <code>fastfat.sys</code>, Explorer','NTFS permission/ADS/जर्नल — Data Execution Prevention'],
        ['डिवाइस I/O (Driver Model)','WDM/UMDF/KMDF ड्राइवर, <code>usbstor.sys</code>','ड्राइवर न लगे तो Device Manager में पीला चिह्न'],
        ['सुरक्षा व अकाउंट (Security)','LSA, ACL, User Account Control (UAC)','“Run as administrator” का असली मतलब = UAC token elevation'],
        ['यूज़र इंटरफ़ेस (GUI/CLI)','<code>explorer.exe</code>, CMD, PowerShell, Settings','GUI ठीक न हो तो Safe Mode/Task Manager से CLI चलाएँ'],
        ['नेटवर्क स्टैक (TCP/IP)','<code>tcpip.sys</code>, DNS Client सेवा','IP न मिले तो <code>ipconfig /all</code> व DHCP सेवा जाँचें'],
        ['सर्विस व शेड्यूलिंग (Services)','services.exe + Task Scheduler','एक सेवा रुकी हो तो <code>services.msc</code> व <code>eventvwr.msc</code>']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.2</span> Windows के अंदर की परतें (HAL, Kernel, Driver Model, API, Shell)</h3>
      <h4 class="blk2">क) HAL — Hardware Abstraction Layer</h4>
      <p><code>hal.dll</code> मदरबोर्ड के अंतर (इंटरप्ट कंट्रोलर, TPM, ARM चिप का फ़र्क़) छिपाता है ताकि एक ही kernel कई हार्डवेयर पर चले। इसीलिए Windows XP-era मशीन पर <code>hal.dll</code> का प्रकार (ACPI/APIC/MP) ग़लत होने पर बूट फेल होता था; आज UEFI + ACPI इसे संभालता है।</p>
      <h4 class="blk2">ख) Kernel और Executive</h4>
      <p><b>Mixed kernel</b>: <code>ntoskrnl.exe</code> में Kernel (interrupts, thread scheduling का आधार, DSP) + Executive मॉड्यूल (Object Mgr, Memory Mgr, Process/Thread Mgr, Local Kernel, I/O Mgr, Cache Mgr, Security Ref Mgr)। User mode vs Kernel mode — kernel mode में कोई भी ड्राइवर पूरी RAM/hardware छू सकता है, इसलिए एक बुरा ड्राइवर BSOD देता है।</p>
      <h4 class="blk2">ग) Driver Model</h4>
      <ul>
        <li><b>WDM (Windows Driver Model)</b> — पुराना kernel-mode मॉडल (USB, audio के आधार)।</li>
        <li><b>KMDF / UMDF</b> — Windows Driver Frameworks; UMDF ड्राइवर user mode में चलते हैं, क्रैश हो तो BSOD नहीं (छोटे USB/Bluetooth devices)।</li>
        <li><b>WDDM (Windows Display Driver Model)</b> — GPU ड्राइवर का मॉडल, 10 में WDDM 2.7/2.x, 11 में WDDM 3.x; DWM (Desktop Window Manager) इसी पर compose करता है।</li>
        <li><b>NDIS / WFP</b> नेटवर्क, <b>Port class</b> स्टोरेज (storport), <b>Windows Audio Session Service</b> ऑडियो।</li>
      </ul>
      <h4 class="blk2">घ) API — Win32 और NT</h4>
      <p>ऐप सिर्फ़ API से काम माँगते हैं। <b>Win32 API</b> (<code>kernel32.dll</code>, <code>user32.dll</code>, <code>gdi32.dll</code>) desktop ऐप्स का आधार; <b>NT Native API</b> (<code>ntdll.dll</code>) kernel call का असली रास्ता — Win32 अंदर से इसे ही बुलाता है; <b>COM/OLE, .NET (CLR), UWP/WinRT (Metro)</b> उसके ऊपर के फ़्रेमवर्क। Win32 नाम “16-bit API की 32-bit कक्षा” से आया — आज भी 64-bit Windows में वही नाम है।</p>
      <h4 class="blk2">ङ) GUI बनाम CLI</h4>
      <table class="tbl">
        <tr><th>रास्ता (Mode)</th><th>उदाहरण</th><th>कब उपयोगी</th></tr>
        <tr><td>GUI (Graphical User Interface)</td><td>Desktop, Explorer, Settings</td><td>रोज़ का काम, ग्राहक को दिखाना</td></tr>
        <tr><td>CLI (Command Line Interface)</td><td><code>cmd.exe</code> (DOS-style), <code>powercfg</code>, <code>slmgr</code></td><td>तेज़, स्क्रिप्ट, Remote/Safe Mode</td></tr>
        <tr><td>Shell scripting</td><td><code>.bat</code> (.cmd) और PowerShell <code>.ps1</code></td><td>लैब में सारे PC एक जैसे बनाना</td></tr>
        <tr><td>GUI shell प्रोसेस</td><td><code>explorer.exe</code> (Win11 में Start/Taskbar इसी में)</td><td>shell क्रैश = बार-बार desktop रीलोड</td></tr>
      </table>`},

    {type:'table', head:['नाम (फ़ाइल/प्रोसेस)','परत','क्या करता है','बंद/हटाया तो'],
      rows:[
        ['<code>ntoskrnl.exe</code>','Kernel + Executive','Memory, process, I/O, interrupt का मालिक (System प्रोसेस)','बूट नहीं होगा'],
        ['<code>hal.dll</code>','HAL','हार्डवेयर अंतर छिपाता है','बूट नहीं होगा'],
        ['<code>win32k.sys</code>','GDI/Core window','विंडो, मेन्यू, फ़ॉन्ट रेंडरिंग, input desktop','GUI ख़त्म'],
        ['<code>csrcs.exe</code>','User-mode subsystem','Win32 सबसिस्टम + console windows','CMD/कंसोल नहीं खुलेगा'],
        ['<code>smss.exe</code>','Session Manager','पहला user-mode प्रोसेस — pagefile, subsystems, wininit चालू करता है','Session नहीं बनेगी'],
        ['<code>services.exe</code>','Service Control Manager','सभी Windows services का चालू/रुकना','कोई सेवा नहीं चलेगी'],
        ['<code>lsass.exe</code>','Local Security Authority','लॉगिन, token, password/NTLM/Kerberos','लॉगिन असंभव'],
        ['<code>winlogon.exe</code>','Logon UI','Ctrl+Alt+Del screen, secure desktop, lock','लॉगिन स्क्रीन नहीं'],
        ['<code>svchost.exe</code>','Service host','DLL सेवाओं को समूह में चलाता है (DcomLaunch, NetworkLocation)','नेटवर्क/अपडेट टूटेगा'],
        ['<code>taskhostw.exe</code>','Scheduled tasks','Task Scheduler के user tasks','अनइंस्टॉल/अपडेट रुक सकते'],
        ['<code>runtimebroker.exe</code>','UWP broker','Store ऐप्स का permission broker','Store ऐप न चलें'],
        ['<code>dwm.exe</code>','Desktop Window Manager','विंडो compose, Snap animation, transparency','Snap/एनिमेशन चालू नहीं (Win10/11 में बंद करना संभव नहीं)'],
        ['<code>explorer.exe</code>','Shell','Taskbar, Start, File Explorer, Desktop icons','बार-ग़ायब (रीस्टार्ट = OK)'],
        ['<code>spoolsv.exe</code>','Print spooler','प्रिंट क्यू','प्रिंटिंग रुकती है (0x7e BSOD यहीं आती है)']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.3</span> विंडोज़ का इतिहास — दो अलग-अलग ख़ानदान</h3>
      <p>इतिहास याद रखने का एक ही सूत्र है — <b>दो लाइन एक समय चलती थीं, फिर NT ने 95/98/ME को निगल लिया।</b></p>
      <ul>
        <li><b>9x/MS-DOS लाइन:</b> Windows 1.0 → 3.1 → 95 → 98 → ME। ये MS-DOS पर ( या उसके ऊपर built DOS के साथ) चलती थीं, 16-bit कोड + असुरक्षित memory, कोई असली मेमोरी प्रोटेक्शन नहीं। यहाँ एक ऐप क्रैश पूरा Windows गिरा देता था।</li>
        <li><b>NT लाइन:</b> NT 3.1 → 4.0 → 2000 → XP → Vista → 7 → 8 → 10 → 11। 32-bit (बाद में 64-bit) preemptive, हर प्रोसेस अपनी virtual memory, security token/ACL, और server editions। यही आज की Windows है — Windows 10/11 का kernel NT 10.0 है, 2015 में शुरू हुआ और आज भी वही kernel चल रहा है।</li>
        <li>इसीलिए <code>winver</code> में Windows 7 “6.1”, Vista “6.0”, XP “5.1”, 2000 “5.0”, 10/11 “10.0” दिखता है — यह NT kernel version है, मार्केटिंग नाम नहीं।</li>
        <li>16-bit सपोर्ट: 32-bit Windows में AMD64/Intel64 (64-bit) पर 16-bit कभी नहीं चला; Win10 64-bit में भी 16-bit नहीं (WOW16 सिर्फ़ 32-bit Windows में)।</li>
      </ul>`},

    {type:'table', head:['संस्करण','वर्ष','बिल्ड/कोडनाम','मुख्य फ़ीचर','आज काम में'],
      rows:[
        ['Windows 1.0','नवंबर 1985','1.01 (1987 में 1.02/1.03)','MS-DOS पर graphical shell, सिर्फ़ tiled windows (overlap नहीं), पेन्ट/कैलकुलेटर/reversi','पुरातन — संग्रह/इंटरव्यू की बात'],
        ['Windows 2.0 / 2.1','दिसंबर 1987','2.03; Windows/286, Windows/386','Overlap+minimize करने लायक विंडो, Control Panel; /386 में 386 protected mode','पुरातन'],
        ['Windows 3.0','मई 1990','3.0','Program Manager + File Manager, VGA/EGA रंग, 386 Enhanced Mode — पहला “चलने लायक” विंडोज़','पुरातन'],
        ['Windows 3.1','अप्रैल 1992','3.1 (1993 में for Workgroups 3.11)','TrueType फ़ॉन्ट, multimedia, drag &amp; drop, WfW में नेटवर्क/sharing','DOS-based PC अब museum में'],
        ['Windows NT 3.1','जुलाई 1993','NT (32-bit, x86/MIPS/Alpha)','पहला असली 32-bit NT: domains, security model, TCP/IP, Client/Server','कोड का मूल'],
        ['Windows NT 3.5 / 3.51','1994 / 1995','NT 3.5, 3.51','तेज़, घटती RAM पर भी चले, पहला परिपक्‍व workstation रूप','पुरातन'],
        ['Windows for Workgroups 3.11','दिसंबर 1993','3.11','32-bit file access, peer networking — छोटे office का पहला LAN','पुरातन'],
        ['Windows NT 4.0','जुलाई 1996','NT 4.0 (Shell 4.00.1381)','95 जैसा shell NT kernel पर — पहला “व्यावसायिक मानक”; Service Pack 6a तक','पुराने ATM/industrial controllers में आज भी'],
        ['Windows 95','24 अगस्त 1995','4.00.950','Start मेन्यू, Taskbar, 32-bit preemptive multitasking, Plug and Play, लंबे नाम (long file names)','शेल का जन्म — हर इंटरव्यू का सवाल'],
        ['Windows 95 OEM Service Release 2/2.5','1996 / 1997','4.00.950 (OSR2/OSR2.5)','<b>FAT32</b>, IE इंटीग्रेशन, USB बेहतर, Device Manager','OSR2 से पहले की disk पर 2 GB से ऊपर पार्टिशन नहीं'],
        ['Windows 98 / 98 SE','जून 1998 / मई 1999','4.10.1998 / 4.10.2222 (Nahant)','ACPI, USB stack, AGP, Web-integrated shell, SE में ICF firewall, FDISK 32GB+','98 SE servicing का क्लासिक “पहला चालू PC”'],
        ['Windows ME','सितंबर 2000','4.90.3000 (Millennium)','System Restore, Movie Maker, MS-DOS real-mode छिपाया, Auto Updates','“सबसे कमज़ोर विंडोज़” — जल्दी BSOD, servicing में बदलने की सलाह'],
        ['Windows 2000 Professional','फ़रवरी 2000','NT 5.0.2195','NTFS 3.0, Active Directory, Group Policy, Plug and Play NT लाइन में, USB printing','Server 2000 आज भी कुछ PLC/medical PCs पर'],
        ['Windows 2000 Server / Advanced Server','2000','NT 5.0.2195','AD, DNS, DHCP, Terminal Services (2 admin session)','पुराने domain controller की समझ के लिए ज़रूरी'],
        ['Windows XP (Home/Pro)','25 अक्टूबर 2001','NT 5.1.2600 (Whistler)','Luna थीम, Fast User Switching, side-by-side DLL, ClearType, firewall (SP2)','SP3 = 5.1.2600.5512; पुराने account PCs में आज भी'],
        ['XP Service Pack 2 / SP3','अगस्त 2004 / अप्रैल 2008','2600.2180 / 2600.5512','SP2 में Security Center, Windows Firewall चालू, DEP; SP3 में BITS 3.0','“SP2 वाला XP” कहना servicing की भाषा है'],
        ['XP 64-Bit / XP x64','2005 (Itanium 2003)','NT 5.2.3790 (Whistler x64)','AMD64/Intel64 का पहला desktop — 4 GB से ऊपर RAM','WOW64 यहीं से (1.4 में)'],
        ['Windows Server 2003','अप्रैल 2003','NT 5.2.3790','IIS 6, GPResult, per-session firewall, 64-bit editions','छोटे office DC आज भी मिलते हैं'],
        ['Windows Vista','30 जनवरी 2007','NT 6.0.6000 (Longhorn)','Aero/DWM, UAC, WDDM, BitLocker, SuperFetch, NTFS 3.1, Search indexer','6001=SP1, 6002=SP2; UAC की शिकायतें यहीं से शुरू'],
        ['Windows 7','22 अक्टूबर 2009','NT 6.1.7600 / SP1 7601 (Vienna)','Jump Lists, Libraries, Aero Snap/Peek, बिना bloat तेज़, notification area छिपाना','SP1 (7601) सबसे ज़्यादा बिका हुआ विंडोज़; EOL 14 जनवरी 2020'],
        ['Windows 8','26 अक्टूबर 2012','NT 6.2.9200 (Windows 8)','Start screen/tiles, Windows Store, Charms bar, Hyper-V client, Fast Startup, Refresh PC','टच-first गलती — ग्राहक शिकायत का इतिहास'],
        ['Windows 8.1','18 अक्टूबर 2013','NT 6.3.9600 (Blue)','Desktop पर Start बटन वापस, बूट-टू-desktop, Store/OneDrive बेहतर, 4K DPI','8.1 की key से 8 ISO एक्टिवेट नहीं होता'],
        ['Windows RT / RT 8.1','2012 / 2013','ARM (NT 6.2/6.3 kernel)','Tegra 3 पर Windows, सिर्फ़ Store ऐप + Office','Windows-on-ARM का पहला प्रयोग']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.4</span> Windows 10 — “Service” मॉडल और LTSB/LTSC</h3>
      <p>Windows 10 (build 10.0.10240) 29 जुलाई 2015 को आया और Microsoft ने इसे “अंतिम संस्करण” कहा — अब हर साल <b>Feature Update</b> आता है, जिसका नाम YYMM (वर्ष-माह) होता है। हर feature update का अपना build number होता है और उसका <b>support 18 महीने</b> (Home/Pro) या <b>30 महीने</b> (Enterprise/Education) रहता है — इसीलिए “Windows 10 का version” पूछना servicing का पहला कदम है।</p>
      <ul>
        <li><b>In-place upgrade</b> यहीं से आसान: पुराना build रखकर feature update लगता है, <code>Windows.old</code> 10 दिन बाद हटता है।</li>
        <li><b>LTSB 2015/2016 → LTSC 2019/2021</b>: Store/Cortana/bloat और automatic feature update नहीं; सिर्फ़ security मिलाकर 10 साल support। कियोस्क, ATM, medical machine, लैब PC के लिए — यही सिफ़ारिश करते हैं।</li>
        <li><b> servicing के नियम:</b> हर नया build पुराने का support ख़त्म करता है; 22H2 विंडोज़ 10 का आख़िरी feature update था (build 19045)।</li>
      </ul>`},

    {type:'table', head:['Windows 10 Version','रिलीज़','OS Build','इसमें क्या आया','Support स्थिति'],
      rows:[
        ['1507 (RTM)','जुलाई 2015','10240','Start menu, Edge (Spartan), Virtual desktop, Cortana','11 मई 2016 को समाप्त'],
        ['1511 (Threshold 2)','नवंबर 2015','10586','Offline slipstream install, Menu key से context menu, Wi-Fi Direct बेहतर','समाप्त'],
        ['1607 (Anniversary Update)','अगस्त 2016','14393','Windows Ink, WSL (Linux subsystem), Notification area सुधार, Shell/Explorer features, Hyper-V updates','LTSB 2016 इसी build पर'],
        ['1703 (Creators Update)','अप्रैल 2017','15063','3D Paint/Viewer, Game Mode, नीले BSOD का नया रूप, Night light, Bluetooth audio multipoint','समाप्त'],
        ['1709 (Fall Creators)','अक्टूबर 2017','16299','Fluent Design (acrylic), Windows Mixed Reality, OneDrive Files On-Demand, SMB cloud connections','समाप्त'],
        ['1803 (April 2018)','अप्रैल 2018','17134','Timeline (Task View में history), Control Panel की बची कड़ियाँ Settings में, browser default API, Storage Sense on-demand','समाप्त'],
        ['1809 (October 2018)','नवंबर 2018','17763','Clipboard history (<kbd>Win</kbd>+<kbd>V</kbd>), Dark theme Explorer/Store, Your Phone ऐप, Sets (बाद में हटा)','LTSC 2019 इसी build पर'],
        ['1903 (May 2019)','मई 2019','18362','Windows Sandbox, नया Game Bar, “Keep files” वाली reset, update pause 35 दिन','समाप्त'],
        ['1909 (November 2019)','नवंबर 2019','18363','छोटा enablement package (1903 के binary पर), Scheduler/Group Policy छोटे सुधार','समाप्त'],
        ['2004 (May 2020)','मई 2020','19041','WSL2 (असली Linux kernel), Cortana ऐप हटा, OneDrive folder backup, Home RAM limit 128→135 GB','समाप्त'],
        ['20H2 (October 2020)','अक्टूबर 2020','19042','नया Start/Taskbar, Edge Chromium default, same OS build family','समाप्त'],
        ['21H1 (May 2021)','मई 2021','19043','Enablement package — नई binary नहीं; Windows Hello बाहरी कैमरा support','समाप्त'],
        ['21H2 (November 2021)','नवंबर 2021','19044','Virtual Wi-Fi adapter, WSL में GPU support, Windows 11 से साझा binary','LTSC 2021 इसी build पर'],
        ['22H2 (नवंबर 2022)','नवंबर 2022','19045','छोटा enablement package; Windows 10 का आख़िरी feature update','Home/Pro 14 अक्टूबर 2025 तक, फिर ESU'],
        ['IoT Enterprise LTSC 2021','मार्च 2022','19044','बिना Store/bloat, सिर्फ़ security मिलाकर ~10 वर्ष support','कियोस्क/ATM/POS में उपयोग']
      ]},

    {type:'table', head:['Windows 11 Version','रिलीज़','OS Build','इसमें क्या आया','टिप्पणी'],
      rows:[
        ['21H2','5 अक्टूबर 2021','22000','Centred taskbar, Snap layouts, Widgets, Android subsystem (WSA), rounded corners everywhere','TPM 2.0 + Secure Boot + UEFI/GPT अनिवार्य'],
        ['22H2','20 सितंबर 2022','22621','Explorer tabs, taskbar overflow, camera/file widgets, Task Manager नया, Copy as path','आज की सबसे ज़्यादा चलती 11 वाली मशीन'],
        ['23H2','31 अक्टूबर 2023','22631','नया Notepad (tabs), Photos व Clipchamp का नया रूप, Windows Copilot sidebar, taskbar overflow icons, Shared-device improvements','Enablement package — binary 22H2 के समान'],
        ['24H2','1 अक्टूबर 2024','26100','<b>नई core binary</b>: Sudo for Windows, Wi-Fi 7, Dynamic Lighting (RGB), on-device AI (Copilot+ PC), Compression API (XPRESS), नया WDDM','24H2 से पहले के 22621 PC भी 26100 पर चढ़ते हैं (सिर्फ़ enablement नहीं — नया OS build)'],
        ['25H2','अक्टूबर 2025','26200','24H2 का enablement package (same platform binary) + Copilot AI improvements, Windows 11 का नवीनतम feature update','नई ख़रीदी PC यही लेती हैं'],
        ['Windows 11 SE','2021→2024','22H2/23H2-based','सिर्फ़ Education डिवाइस (Azure AD/Intune managed), ऐप install प्रशासक के बिना नहीं','Chromebook प्रतिस्पर्धी'],
        ['Windows 11 IoT LTSC','2024','26100','11 का LTSC — 10 वर्ष security updates','कियोस्क/POS']
      ]},

    {type:'table', head:['Server / मोबाइल-एम्बेडेड','वर्ष','Kernel / Build','मुख्य बात','आज काम में / सपोर्ट-एंड'],
      rows:[
        ['Server 2003 / R2','2003 / 2005','NT 5.2.3790','Active Directory, IIS 6, पहला 64-bit server','R2 14 जुलाई 2015 को बंद'],
        ['Server 2008','2008','NT 6.0.6001/6002','Server Manager, IIS 7, Hyper-V R2 में','14 जनवरी 2020'],
        ['Server 2008 R2','2009','NT 6.1.7600/7601','Server Core, RemoteFX, Live Migration','14 जनवरी 2020'],
        ['Server 2012','2012','NT 6.2.9200','GUI-less install विकल्प, Storage Spaces','10 अक्टूबर 2023'],
        ['Server 2012 R2','2013','NT 6.3.9600','Data deduplication, PowerShell 4.0, Generation 2 VM','10 अक्टूबर 2023'],
        ['Server 2016','2016','NT 10.0.14393','Nano Server/containers, Shielded VM, Hyper-V containers','12 जुलाई 2027'],
        ['Server 2019','2018','NT 10.0.17763','Server Core containers, Storage Migration Service','9 जनवरी 2029'],
        ['Server 2022','2021','NT 10.0.20348','Secured-core, TLS 1.3 default, SMB QUIC, Azure Arc','14 अक्टूबर 2031'],
        ['Server 2025','2024','NT 10.0.26100','Hotpatch (Azure Arc), NIC combining, hybrid features','5+5 वर्ष का नियम'],
        ['Windows CE 1.0–4.2','1996–2000','Win32-derived modular','Pocket PC, ATM, car audio, factory HMI','CE 6.0/7.0 आज भी embedded panels पर'],
        ['Pocket PC / Windows Mobile 5–6.x','2001–2009','CE 3.0/5.0/6.0','Stylus UI, ActiveSync, Exchange ActiveSync, .NET Compact Framework','पुराने barcode/handheld devices'],
        ['Windows Phone 7 / 7.5','2010 / 2011','CE-derived + Metro UI','Live tiles, flat design, Zune sync','store बंद — कोई सपोर्ट नहीं'],
        ['Windows Phone 8 / 8.1','2012 / 2014','NT 6.2 kernel','Desktop का NT kernel फ़ोन में, Cortana, IE11','Cortana ऐप 2021 में हटा'],
        ['Windows 10 Mobile','2015–2017','NT 10.0','Continuum (फ़ोन को desktop UI बनाना)','2020 से updates नहीं — अब dead'],
        ['Windows IoT Core / IoT Enterprise','2015 / 2021','NT 10.0 / LTSC','Raspberry Pi 2/3, Minwin कस्टम image','kiosk/POS/embedded में आज भी']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.5</span> 16 / 32 / 64-बिट और ARM64 — असली फ़र्क़ क्या</h3>
      <p>“बिट” यहाँ CPU का पता-चौड़ाई (address width) है — एक बार में कितना बड़ा memory पता (pointer) बन सकता है। 32-bit CPU 2<sup>32</sup> पते बना सकता है = <b>4 GB</b>। इसलिए 32-bit Windows पर 8 GB RAM लगाने पर भी सिस्टम करीब 3.2–3.5 GB ही दिखाता है — बाकी पते PCI devices के MMIO ने घेर लिए। 64-bit में यह सीमा व्यावहारिक नहीं रहती।</p>
      <ul>
        <li><b>16-bit:</b> DOS, Windows 3.x — 64-bit Windows पर 16-bit ऐप नहीं चलते (WOW16 सिर्फ़ 32-bit Windows में)। पुराना billing/inventory सॉफ़्टवेयर यहीं अटकता है।</li>
        <li><b>32-bit (x86):</b> Win 3.1 से XP/7/10 तक; Windows 10 32-bit का अंतिम feature update 21H1 था, 22H2 केवल 64-bit।</li>
        <li><b>WOW64 (Windows 32-bit on Windows 64-bit):</b> 32-bit ऐप चलाने वाली translation परत — इसीलिए 64-bit Windows में दो Program Files और दो system folders हैं।</li>
        <li><b>Driver signing:</b> 64-bit Windows पर kernel-mode ड्राइवर का Microsoft-signed होना अनिवार्य। यही कारण है कि पुराना scanner/printer ड्राइवर 64-bit पर न चढ़ने का शिकार बनता है। <code>bcdedit /set testsigning on</code> सिर्फ़ अस्थायी उपाय (स्क्रीन कोने पर “Test Mode” लिखा आता है)।</li>
        <li><b>ARM64 (Windows on ARM):</b> Qualcomm Snapdragon X/8cx, SQ1–SQ3, Microsoft Dev Kit 2023। NT kernel का ARM64 build; x86 ऐप emulator से चलते हैं (11 में Prism ने x64 emulation भी जोड़ा), kernel-mode ड्राइवर और भारी CPU-लोड काम धीमे/असमर्थित रह सकते हैं। Windows RT (32-bit ARM, Tegra 3) विफल रहा — वह सिर्फ़ Store ऐप चलाता था।</li>
        <li><b>System32 बनाम SysWOW64:</b> <code>C:\\Windows\\System32</code> में 64-bit फ़ाइलें रहती हैं (नाम इतिहास है, “32-bit” का अर्थ नहीं), 32-bit सिस्टम DLL <code>C:\\Windows\\SysWOW64</code> में। Registry भी दो view दिखाता है — 32-bit सॉफ़्टवेयर की चाबियाँ <code>HKLM\\SOFTWARE\\WOW6432Node</code> के नीचे दिखती हैं, इसलिए “install हुआ पर Add/Remove Programs में नहीं दिख रहा” वाले case में दोनों जगह देखिए।</li>
        <li><b>32-bit process का address space:</b> 4 GB, पर Windows पर आमतौर पर 2 GB user + 2 GB kernel; LARGE_ADDRESS_AWARE (LAA) flag से 64-bit kernel पर 3–4 GB तक।</li>
      </ul>`},

    {type:'table', head:['आर्किटेक्चर','Windows में नाम','RAM की व्यावहारिक सीमा','32-bit ऐप?','आज कहाँ मिलता है'],
      rows:[
        ['16-bit','x86 real mode (DOS / Win 3.x)','16 MB addressable (EMS/XMS से आगे)','—','पुराने CRT/billing PCs, DOS games'],
        ['32-bit','<code>x86</code> / i386','कुल 4 GB, प्रति process 2 GB (LAE से 3 GB)','नेटिव','सस्ते netbook, XP/7-era workshop PC'],
        ['64-bit Intel/AMD','<code>x64</code> / AMD64','Home 135 GB, Pro/Enterprise 2 TB, Pro for Workstations 6 TB','हाँ — WOW64 से','आज का लगभग हर desktop/laptop'],
        ['64-bit ARM','<code>ARM64</code> / aarch64','SKU के अनुसार (Pro/Enterprise तक 2 TB)','हाँ — emulation','Snapdragon X लैपटॉप, Surface Pro 9 5G, Dev Kit'],
        ['32-bit ARM','ARM (Windows RT / CE / Phone 7)','4 GB से कम','केवल Store/CE ऐप','RT, पुराने handheld, CE panels']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.6</span> एडिशन व लाइसेंस (Editions & Licensing) — कौन-सा किसके लिए</h3>
      <p>एक ही build कई SKU में बिकता है; फ़र्क़ सिर्फ़ features व licensing का है। <b>Home</b> घरेलू, <b>Pro</b> छोटा office (Domain, RDP host, BitLocker, Hyper-V), <b>Pro for Workstations</b> heavy compute (ReFS, SMB Direct/RDMA, NVDIMM-N, 6 TB RAM तक, 2 socket / 256 logical processors), <b>Enterprise</b> Volume licensing की पूरी security+manageability, <b>Education</b> Enterprise जैसा पर स्कूल licensing, <b>Single Language (SL)</b> OEM Home जिसमें UI भाषा-pack बदलने की छूट नहीं, <b>LTSC</b> बिना Store/bloat लंबे support वाला।</p>
      <p><b>लाइसेंस की चार श्रेणियाँ</b> नीचे की तालिका में हैं — <b>OEM</b> (मदरबोर्ड से बंधा, ट्रांसफ़र नहीं), <b>Retail/FPP</b> (स्थानांतरण-योग्य), <b>Volume</b> (MAK एक-एक PC पर, KMS network host से हर 180 दिन renew), और <b>digital licence/entitlement</b> (key नहीं, hardware + MS account)। Windows 10/11 में activation entitlement पर चलता है, इसलिए format के बाद key अक्सर माँगी ही नहीं जाती — यह बात ग्राहक को समझाना servicing का काम है।</p>
      <ul>
        <li><b>Home से Pro</b> “App Store” जैसा unlock होता है: Settings › System › Activation › “Go to the Store” — key लगाकर upgrade, format ज़रूरी नहीं। यह upgrade license Retail/Store से ही मिलता है, Volume MAK से सीधे नहीं।</li>
        <li><b>SL बनाम Home:</b> SL में UI भाषा बदलने का विकल्प ग्रे रहेगा; Home में कोई भी भाषा-pack डाल सकते हैं। SL मशीन पर Home key डालकर upgrade होने पर भाषा बदलना खुल जाता है।</li>
        <li><b>N / KN SKU</b> (EU/Korea): N में Windows Media Player/Video ऐप पहले से नहीं — “Media Feature Pack” Settings › Apps › Optional features से लगाना पड़ता है। servicing में इनका ISO/बूट media अलग रखना पड़ता है।</li>
        <li><b>IoT Enterprise / LTSC</b> में Edge का भारी UI/Cortana/Store नहीं, Group Policy पूरा, support ~10 वर्ष — कियोस्क/ATM/लैब का पहली पसंद।</li>
      </ul>`},

    {type:'table', head:['फ़ीचर','Home','Pro','Pro for Workstations','Enterprise / Education','SL (Single Language)'],
      rows:[
        ['अधिकतम RAM','135 GB','2 TB','6 TB','2 TB (Workstation-class SKU 6 TB)','135 GB'],
        ['BitLocker (पूरा, Group-Policy वाला)','Device encryption only','हाँ','हाँ','हाँ (+ BitLocker To Go, network unlock)','Device encryption only'],
        ['Hyper-V (client hypervisor)','नहीं','हाँ','हाँ','हाँ','नहीं'],
        ['Windows Sandbox','नहीं','हाँ','हाँ','हाँ','नहीं'],
        ['Remote Desktop का HOST','नहीं (सिर्फ़ client)','हाँ','हाँ','हाँ + RDS CAL','नहीं'],
        ['Active Directory Domain में join','नहीं (Workgroup/Entra sign-in only)','हाँ','हाँ','हाँ','नहीं'],
        ['Group Policy Editor <code>gpedit.msc</code>','नहीं','हाँ','हाँ','हाँ','नहीं'],
        ['AppLocker / Credential Guard','नहीं','Credential Guard (supported)','हाँ','दोनों पूरे','नहीं'],
        ['ReFS वॉल्यूम / SMB Direct (RDMA)','नहीं','नहीं','हाँ','Pro W जैसा विकल्प','नहीं'],
        ['BranchCache / DirectAccess / Start-layout lockdown','नहीं','नहीं','नहीं','हाँ','नहीं'],
        ['Windows Update deferral (हफ़्ते)','बहुत कम/नहीं','हाँ (7 दिन तक rings)','हाँ','rings + WSUS/ConfigMgr/Intune','बहुत कम'],
        ['Windows To Go (certified USB drive)','नहीं','हाँ (10 में)','हाँ','हाँ','नहीं'],
        ['Licensing रास्ता','OEM/Retail','OEM/Retail/Volume','Retail/Volume','केवल Volume/MAK-KMS (OEM नहीं)','OEM (मुख्यतः developing markets)']
      ]},

    {type:'table', head:['लाइसेंस प्रकार','कहाँ मिलता / कैसे मिलेगा','बाँध (binding)','दूसरे PC पर ट्रांसफ़र','सपोर्ट व नोट'],
      rows:[
        ['<b>OEM</b> (System Builder / preinstalled)','नया PC/लैपटॉप के साथ, या System Builder box की सस्ती key','मदरबोर्ड से — key UEFI की <code>ACPI\\MSDM</code> टेबल में छपी होती है (COA स्टिकर पर 5×5)','<b>नहीं</b> — मदरबोर्ड बदला = लाइसेंस ख़त्म','Microsoft नहीं, बनाने वाली कंपनी (HP/Dell/Asus) सपोर्ट करती है'],
        ['<b>Retail / FPP</b> (Full Packaged Product)','दुकान/MS Store से डिजिटल डिलीवरी या पैकेज','1 PC एक समय (key से या MS account से)','हाँ — पुराने PC से हटाकर नए पर सक्रिय करें','Microsoft सीधे सपोर्ट; महँगी पर स्थानांतरण-योग्य'],
        ['<b>Upgrade</b> license','Win7/8.1 → 8.1/10, 10 → 11','पुराने लाइसेंस पर सवारी (2015-16 के मुफ़्त अपग्रेड ने hardware पर digital entitlement बना दी)','जैसा base licence कहता है','2016 के बाद मुफ़्त अपग्रेड आधिकारिक रूप से बंद; अब eligibility से तय'],
        ['<b>Volume — MAK</b> (Multiple Activation Key)','कंपनी/स्कूल/लैब को MSVL के लिए जारी 5×5 key','हर PC पर एक बार इंटरनेट/फ़ोन से activate (key का activation काउंट तय)','सीमित — रीआर्म/नई key से','<code>slmgr /ipk</code> + <code>slmgr /ato</code>; काउंट ख़त्म = MSVL से बढ़ाएँ'],
        ['<b>Volume — KMS</b> (Key Management Service)','office/school का अपना KMS host','PC हर 180 दिन host से renew (हर 7 दिन retry), TCP पोर्ट <b>1688</b>','host बदलें तो <code>slmgr /skms</code> नया server','client पर Generic KMS key Microsoft docs से; desktop threshold 25, server 5 — इसलिए home PC पर KMS काम नहीं करता'],
        ['<b>Digital licence / Entitlement</b>','10/11 अपग्रेड या MS Store खरीद के बाद','hardware ID (machine fingerprint) + optional Microsoft account','MS account से linked हो तो “Change hardware” विकल्प से','key नहीं माँगी जाती; वही PC format+reinstall = अपने-आप activate'],
        ['<b>Embedded / POS, Server, SPLA, Education</b>','औद्योगिक डिवाइस, सर्विस प्रोवाइडर, स्कूल agreement','डिवाइस या सर्वर-आधारित (Core CAL)','नहीं','COA स्टिकर पर “OEM System Builder/Embedded” लिखा हो तो Retail जैसा व्यवहार न करें']
      ]},

    {type:'code', lang:'cmd', code:`:: ---- लाइसेंस व Activation की जाँच (Admin CMD में) ----
slmgr /dli          :: संक्षिप्त: Description (OEM/Volume/RETAIL), Name, Partial Product Key
slmgr /dlv          :: पूरा विवरण: License Status (LICENSED / NOTIFICATIONS / GRACE_PERIOD),
                      KMS machine FQDN, Remaining Windows rearm count, Evaluation: FALSE
slmgr /xpr          :: "The machine is permanently activated"  = digital licence
                      "Volume activation will expire ..."        = KMS (180 दिन का टाइमर)

:: ---- key/activation कमांड ----
slmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX    :: product key डालें
slmgr /ato                                  :: online activate
slmgr /skms kms.example.com:1688            :: KMS host बदलें
slmgr /upk                                  :: key अणइंस्टॉल
slmgr /cpkh 1234abcd                        :: Partial Product Key (अंतिम 7 अक्षर) हटाएँ
slmgr /rearm                                :: licensing cache रीसेट + रीस्टार्ट (गिनती सीमित)
slui 3                                      :: GUI से key डालें
slui 4                                      :: फ़ोन activation विज़ार्ड

:: ---- असली key कहाँ छपी है ----
wmic path softwarelicensingservice get OA3xOriginalProductKey   :: UEFI/BIOS MSDM की OEM key
reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v EditionID
reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v ProductName
dism /online /get-edition /format:table                         :: install का edition (offline image पर भी)
powershell "(Get-CimInstance Win32_OperatingSystem).Caption + ' / ' + (Get-CimInstance Win32_OperatingSystem).BuildNumber"`},

    {type:'callout', kind:'warn', title:'Activation के नियम जो ग्राहक से ज़्यादा पूछे जाते हैं', html:'<b>(1)</b> नया Windows 11 ISO format करके लगाएँ तो UEFI में छपी <b>OEM key अपने-आप पहचानती है</b> और वही edition (आमतौर पर Home) install होती है — key माँगें तो बाद में “Change product key”। <b>(2)</b> Digital licence hardware-bound है: मदरबोर्ड बदलने पर Settings › System › Activation › “Troubleshoot” से MS-account entitlement link करिए। <b>(3)</b> KMS-active PC में <code>slmgr /xpr</code> में 180 दिन का countdown दिखता है — ग्राहक इसे “लाइसेंस ख़राब” समझता है, समझाइए। <b>(4)</b> Evaluation/preview builds (90 दिन, <code>slmgr /dlv</code> में <code>Evaluation: TRUE</code>) पर <code>slmgr /rearm</code> सिर्फ़ सीमित बार चलता है, फिर re-install। <b>(5)</b> Windows 7/8 की COA key से Windows 10/11 का official activation समर्थित नहीं — मुफ़्त अपग्रेड की खिड़की बंद हो चुकी है।'},

    {type:'table', head:['संस्करण','सपोर्ट-एंड (Extended)','क्या हुआ / क्या करें','ग्राहक को यह कहें'],
      rows:[
        ['Windows XP / SP3','8 अप्रैल 2014','अब कोई security update नहीं; कुछ embedded/PoS SKUs को बढ़ाया गया','सिर्फ़ offline machine पर चले; इंटरनेट वाला XP PC न बेचें/न खरीदें'],
        ['Windows Vista','11 अप्रैल 2017','ESU नहीं मिला (सिर्फ़ Server 2008 को)','आज भी मिलने वाली Vista laptop = e-waste'],
        ['Windows 7 / SP1','<b>14 जनवरी 2020</b>','ESU (व्यावसायिक) 10 जनवरी 2023 को बंद; अब नया browser/सॉफ़्टवेयर नहीं','सेकंड-हैंड Win7 PC सस्ता हो, पर 2026 में ब्राउज़र/सुरक्षा दोनों बंद — Win10/11 पर ले जाएँ'],
        ['Windows 8','12 जनवरी 2016','पहले ही बंद; 8.1 पर अपडेट ज़रूरी था','8 वाली मशीन पर Windows Update भी अब नहीं'],
        ['Windows 8.1','<b>10 जनवरी 2023</b>','Server 2012 R2 के साथ बंद; ESU सिर्फ़ Server लाइन को','“8.1 चल रहा है” = अपडेट नहीं, नई hardware के driver नहीं'],
        ['Windows 10 (22H2)','<b>14 अक्टूबर 2025</b>','इसके बाद ESU (Extended Security Updates) — घरेलू के लिए शर्तों के साथ मुफ़्त, business के लिए paid','आज चलेगा, पर 2025-26 के बाद security updates बंद — खरीदते समय 11-eligible देखें'],
        ['Windows 10 LTSB/LTSC','2016 = 9 जुलाई 2026, 2019 = 10 जनवरी 2029, 2021 = 13 जनवरी 2032','10 वर्ष security-only — कियोस्क/ATM के लिए यही','ATM/POS पर “पुराना विंडोज़” दिखे तो पहले LTSC पूछें, फिर फ़ैसला लें'],
        ['Windows 11 21H2 / 22H2 / 23H2 (Home/Pro)','8 अक्टूबर 2024 / 14 अक्टूबर 2025 / 11 नवंबर 2025','हर feature update के ~24 महीने बाद पुराना बंद; नया अपडेट चढ़ाते रहें','About में Version 23H2 दिखे तो 24H2/25H2 कराकर दें'],
        ['Windows 11 24H2 / 25H2','24H2 ~ अक्टूबर 2026; 25H2 आगे (18/24 महीने नियम)','2026 की नई मशीनों में 25H2 (build 26200) आता है','नई खरीद में build 26100/26200 दिखना अच्छा संकेत'],
        ['<b>32-bit Windows 10</b>','21H1 अंतिम feature update; अब 64-bit only','22H2 व Windows 11 कभी 32-bit नहीं','32-bit वाली सस्ती laptop पर 4 GB से ऊपर RAM बेकार']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.7</span> सिस्टम रिक्वायरमेंट व “चलेगा या नहीं” की जाँच</h3>
      <p>Microsoft की न्यूनतम सूची सिर्फ़ “बूट होगा” की गारंटी है — servicing में हमेशा व्यावहारिक (comfortable) मान देखिए: <b>Windows 11 + SSD + 8 GB RAM</b> आज की न्यूनतम अच्छी मशीन है। “64 GB storage” का मतलब है कि 32 GB वाली eMMC laptop पर feature update अक्सर असफल रहता है, क्योंकि install के दौरान अस्थायी रूप में 20–30 GB खाली जगह चाहिए होती है।</p>
      <ul>
        <li><b>सबसे तेज़ जाँच:</b> Microsoft का आधिकारिक <b>PC Health Check app</b> (<code>HealthCheck.exe</code>) — “This PC meets Windows 11 requirements” या reason list (TPM / Secure Boot / CPU generation / RAM / storage) दिखाता है। पुराने नाम: “Get Windows 11 app”, पहले “Windows 10 Upgrade Assistant”।</li>
        <li><b>32-bit के बारे में:</b> Windows 10 32-bit का अंतिम feature update 21H1; Windows 11 कभी 32-bit नहीं आया — 32-bit install वाले पुराने PC का अपग्रेड रास्ता clean 64-bit install है (सॉफ़्टवेयर key/ड्राइवर पहले जाँच लें)।</li>
        <li><b>BIOS mode याद रखें:</b> Windows 11 को UEFI + GPT चाहिए; Legacy BIOS + MBR पर install असमर्थित — पहले <code>mbr2gpt /convert</code> + BIOS को UEFI पर बदलना पड़ता है (डेटा का बैकअप ज़रूरी)।</li>
      </ul>`},

    {type:'table', head:['क्या','Windows 10 (न्यूनतम)','Windows 11 (न्यूनतम)','कैसे जाँचें'],
      rows:[
        ['CPU','1 GHz या तेज़, 32/64-bit हो','1 GHz या तेज़, <b>2 या अधिक कोर</b>, 64-bit compatible CPU/SoC','<code>msinfo32</code> › Processor; <code>dxdiag</code> › System'],
        ['RAM','1 GB (32-bit) / 2 GB (64-bit)','<b>4 GB</b>','<code>msinfo32</code> › Installed Physical Memory; Task Manager › Performance › Memory'],
        ['Storage','16 GB (32-bit) / 20 GB (64-bit, 1903 से)','<b>64 GB</b> या अधिक','<code>diskmgmt.msc</code>; Settings › System › Storage'],
        ['Firmware','BIOS या UEFI','<b>UEFI</b>, Secure Boot capable','<code>msinfo32</code> › “BIOS Mode” व “Secure Boot State”'],
        ['TPM','1.2 (वैकल्पिक)','<b>TPM 2.0</b>','<code>tpm.msc</code> › “Specification Version 2.0”; PowerShell <code>Get-Tpm</code>'],
        ['GPU / DirectX','DirectX 9 + WDDM 1.0','DirectX 12 या बाद + <b>WDDM 2.0</b>','<code>dxdiag</code> › Display (Driver Model, DDI Version)'],
        ['Display','800×600 से ऊपर','9 इंच से बड़ी, 720p, 8-bit प्रति रंग','Settings › System › Display; <code>dxdiag</code>'],
        ['Internet / Microsoft account','OOBE में Home को MS account + internet चाहिए (Pro में local option बचा था)','OOBE में Home व Pro दोनों में internet + MS account माँगा जाता है','local अकाउंट के लिए: नेटवर्क काटना + audit mode (<code>Ctrl+Shift+F3</code>) या OOBE की bypass विधि — Microsoft इन्हें support नहीं करती'],
        ['Disk का प्रकार','HDD भी चलेगा (काफी धीमा)','HDD पर चलता है, पर NVMe/SATA SSD सिफ़ारिश','Defragment and Optimize Drives (<code>dfrgui</code>) › “Media type”'],
        ['Driver आर्किटेक्चर','32-bit OS पर 32-bit ड्राइवर','केवल 64-bit signed kernel ड्राइवर','Device Manager › Properties › Driver provider/date'],
        ['<b>Version / Build</b>','10.0.10240 से 19045','10.0.22000 से 26200','<code>winver</code>, <code>ver</code>, <code>systeminfo</code>, Settings › About, registry <code>DisplayVersion/CurrentBuild/UBR</code>'],
        ['Edition / licence','Home–Pro (OEM/Retail/Volume)','Home–Pro–Enterprise–Education–LTSC','<code>slmgr /dlv</code>, <code>dism /online /get-edition</code>, registry <code>EditionID</code>'],
        ['Boot का तरीका','MBR/Legacy भी चलता था','UEFI + GPT + Secure Boot (install के लिए)','<code>msinfo32</code> › BIOS Mode; <code>diskmgmt.msc</code> › partition style; <code>mbr2gpt /validate</code>']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.8</span> विंडोज़ का फ़ोल्डर ढाँचा (C:\\ में क्या-क्या)</h3>
      <p>Hidden + system फ़ाइलें दिखाने के लिए: Explorer › View › Show › <b>Hidden items</b>, फिर Folder Options › View › <b>“Hide protected operating system files (Recommended)” uncheck</b> (काम ख़त्म होने पर वापस check करिए)। ज़्यादातर चीज़ें मिटाने की नहीं होतीं; सफ़ाई हमेशा <code>cleanmgr</code>/Storage sense या DISM से कीजिए।</p>
      <h4 class="blk2">वर्ज़न/बिल्ड पहचानने के दस रास्ते</h4>
      <ul>
        <li><code>winver</code> → “Version 23H2 (OS Build 22631.2428)” — सबसे तेज़।</li>
        <li><code>ver</code> (CMD) → <code>Microsoft Windows [Version 10.0.19045.5198]</code> — kernel version + UBR, edition नहीं।</li>
        <li><code>systeminfo</code> → OS Name, Version/Build, System Type, BIOS Mode, Domain, RAM, hotfixes; <code>systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type" /C:"BIOS Mode"</code>।</li>
        <li><code>msinfo32</code> → Summary (Version, Build, Secure Boot State, BIOS, CPU, RAM, TPM); <code>msinfo32 /ns report.txt</code> से सेव।</li>
        <li>Settings › System › About → Edition, Version, Installed on, OS build, Experience, System type — ग्राहक को दिखाने के लिए सबसे साफ़।</li>
        <li>Registry <code>HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion</code> → <code>ProductName</code>, <code>EditionID</code>, <code>ReleaseId</code>, <code>DisplayVersion</code>, <code>CurrentBuild</code>, <code>UBR</code>, <code>InstallDate</code>। <code>ReleaseId</code> कई नए builds पर स्थिर रहता है, इसलिए <code>DisplayVersion + CurrentBuild + UBR</code> भरोसेमंद।</li>
        <li><code>dism /online /get-edition /format:table</code> और offline image के लिए <code>dism /image:D:\\ /get-edition</code>।</li>
        <li>PowerShell → <code>Get-CimInstance Win32_OperatingSystem | fl Caption,BuildNumber,OSArchitecture,InstallDate</code>।</li>
        <li><code>C:\\Windows\\Panther\\setupact.log</code> + <code>setuperr.log</code> (और अपग्रेड के लिए <code>C:\\$WINDOWS.~BT\\Sources\\Panther</code>) → install/अपग्रेड कैसे हुआ, कौन-सा media, कहाँ फेल हुआ; <code>C:\\Windows\\Logs\\CBS\\CBS.log</code> = servicing/DISM त्रुटि का पहला सुराग।</li>
        <li><code>slmgr /dlv</code> → Part number (SKU) + licence + activation स्थिति — edition व licence दोनों की पुष्टि।</li>
      </ul>`},

    {type:'table', head:['पथ / फ़ाइल','क्या है','मिटाएँ?','कमांड/नियम'],
      rows:[
        ['<code>C:\\Windows</code>','OS: kernel, drivers, servicing, fonts, logs','<b>नहीं</b>','<code>sfc /scannow</code>, <code>DISM /Online /Cleanup-Image /RestoreHealth</code>'],
        ['<code>C:\\Windows\\System32</code>','64-bit system binaries + registry hives (<code>System32\\config</code>) + <code>drivers</code>','नहीं','—'],
        ['<code>C:\\Windows\\SysWOW64</code>','32-bit सिस्टम DLL/EXE (WOW64)','नहीं','<code>C:\\Windows\\SysWOW64\\cmd.exe</code> = 32-bit CMD'],
        ['<code>C:\\Windows\\WinSxS</code>','Component store — installed + superseded components','<b>मिटाएँ नहीं</b>; cleanup हाँ','<code>Dism /Online /Cleanup-Image /StartComponentCleanup /ResetBase</code>'],
        ['<code>...\\SoftwareDistribution</code>','Windows Update का download/staging','हाँ (services रोककर)','<code>net stop wuauserv</code> → मिटाएँ → <code>net start wuauserv</code>'],
        ['<code>C:\\Windows\\Temp</code>, <code>%TEMP%</code>','अस्थायी फ़ाइलें, installer log','हाँ — खुली फ़ाइलें छोड़कर','Win+R → <code>%temp%</code>; <code>cleanmgr</code>'],
        ['<code>C:\\Windows\\Prefetch</code>','आम ऐप की launch trace (<code>.pf</code>)','मिटाने से लाभ नहीं; forensics में काम की','<code>del C:\\Windows\\Prefetch\\*.pf</code>'],
        ['<code>C:\\Windows\\Installer</code>','MSI/MSP cache — uninstall/repair के लिए','<b>बिल्कुल नहीं</b>','space के लिए Disk Cleanup का “Installer Cleanup”'],
        ['<code>Microsoft.NET</code>, <code>assembly</code>','.NET runtimes/GAC','नहीं','—'],
        ['<code>...\\Logs\\CBS</code>, <code>...\\Panther</code>','servicing/update/setup logs','पुरानी logs हट सकती हैं','<code>CBS.log</code> = DISM त्रुटि का पहला सुराग'],
        ['<code>\\Boot\\BCD</code>, EFI System Partition','बूट डेटा (<code>\\EFI\\Microsoft\\Boot\\bootmgfw.efi</code>)','<b>नहीं</b>','<code>bcdedit /enum</code>, <code>bootrec /rebuildbcd</code>'],
        ['<code>C:\\Recovery</code> + <code>Winre.wim</code>','Windows RE — Reset this PC, Startup Repair','नहीं','<code>reagentc /info</code>, <code>reagentc /enable</code>'],
        ['<code>C:\\pagefile.sys</code>','Virtual memory (RAM का disk विस्तार)','चलते OS में नहीं','System › Advanced › Performance › Advanced › Virtual memory'],
        ['<code>C:\\swapfile.sys</code>','UWP/Store ऐप्स का छोटा swap','नहीं','—'],
        ['<code>C:\\hiberfil.sys</code>','Hibernation image (RAM का ~40%, Fast Startup भी इसी पर)','hibernate बंद करके','<code>powercfg /h off</code> / <code>powercfg /h on /type full</code>'],
        ['<code>C:\\Windows.old</code>','पुरानी install (upgrade/refresh के बाद)','हाँ — Disk Cleanup से','“Previous Windows installation(s)”; 10 दिन में स्वतः हटता है'],
        ['<code>C:\\$Recycle.Bin</code>','प्रति volume/user deleted items','हाँ — bin खाली करके','हर user का अलग SID फ़ोल्डर; ACL से protected'],
        ['<code>Program Files</code>, <code>Program Files (x86)</code>, <code>ProgramData</code>, <code>Users</code>','64-bit ऐप, 32-bit ऐप, सभी-यूज़र डेटा, profiles','uninstall/profile हटाने से','<code>appwiz.cpl</code>; <code>netplwiz</code>']
      ]},

    {type:'table', head:['तुलना','Windows (10/11)','Linux (Ubuntu/Fedora)','macOS'],
      rows:[
        ['Kernel','NT (mixed/hybrid) — <code>ntoskrnl.exe</code>','Linux (monolithic)','XNU (Mach + BSD, hybrid)'],
        ['File system','NTFS (journaling, ACL, ADS) + boot के लिए FAT32 ESP','ext4 / XFS / Btrfs','APFS (+ HFS+ पुराना)'],
        ['पथ व separator','<code>C:\\Users\\Ravi\\Docs</code>, drive letters','<code>/home/ravi/Docs</code> — एक tree, mount points','<code>/Users/Ravi/Documents</code>, disk images mount'],
        ['सेटिंग्स कहाँ','Registry (<code>regedit</code>) + Group Policy + कुछ <code>.ini</code>','text files <code>/etc</code>, <code>~/.config</code>','property lists (<code>.plist</code>) + <code>defaults</code>'],
        ['सॉफ़्टवेयर install','MSI/EXE, Store, <code>winget</code>, <code>choco</code>','package manager: <code>apt</code> / <code>dnf</code> / <code>pacman</code>','DMG/pkg, <code>brew</code>, Mac App Store'],
        ['ड्राइवर','64-bit पर signed अनिवार्य; Windows Update से आते हैं','kernel modules ज़्यादातर built-in; signing optional','सिर्फ़ Apple + certified extensions'],
        ['सुरक्षा मॉडल','UAC, NTFS ACL, Defender, Secure Boot/TPM, SmartScreen','POSIX perms + <code>sudo</code> + SELinux/AppArmor','Gatekeeper, notarization, SIP, TCC permissions'],
        ['रिमोट एडमिन','RDP (3389), PowerShell Remoting, SSH server भी','SSH (22) मानक','Screen Sharing (VNC 5900), SSH'],
        ['गेमिंग','DirectX 12 — सबसे बड़ा प्लेटफ़ॉर्म','Vulkan + Proton/Wine से बड़ा हिस्सा चल जाता है','Metal — सीमित library'],
        ['लाइसेंस/क़ीमत','paid (OEM/Retail/Volume); Server अलग','free & open source (enterprise support paid)','सिर्फ़ Apple hardware के साथ (hardware में शामिल)'],
        ['Recovery','WinRE (<code>Winre.wim</code>), Reset this PC, System Restore','live USB + GRUB + chroot','macOS Recovery + Time Machine'],
        ['Servicing लैब में उपयोग','90% ग्राहक मशीनें — driver/key/activation/UI','server, Raspberry Pi, forensics, data recovery','Apple devices + iPhone sync/backup']
      ]},

    {type:'steps', items:[
      {n:1, title:'पहचान: कौन-सा Windows है', text:'Win+R → <code>winver</code> — Edition, Version (22H2/23H2), OS build नोट कीजिए। फिर <code>msinfo32</code> से System Type (x64/ARM64) और BIOS Mode (UEFI/Legacy)।'},
      {n:2, title:'लाइसेंस की स्थिति', text:'Admin CMD → <code>slmgr /dli</code>, फिर <code>slmgr /dlv</code> और <code>slmgr /xpr</code>। OEM/Retail/Volume और “permanently activated” / KMS countdown लिखिए। UEFI key के लिए <code>wmic path softwarelicensingservice get OA3xOriginalProductKey</code>।',
        tips:'पूरी key कहीं नोट न करें — Partial Product Key (अंतिम 7 अक्षर) काफ़ी है।'},
      {n:3, title:'Hardware eligibility', text:'<code>dxdiag</code> (GPU/DirectX/WDDM), <code>tpm.msc</code> (TPM 2.0), Settings › System › Storage (64 GB+ खाली), Task Manager › Performance (cores/RAM)। फिर PC Health Check चलाकर Windows 11 eligibility का कारण नोट कीजिए।',
        warn:'“TPM not found” का मतलब हार्डवेयर नहीं भी हो सकता है — BIOS/Security में Intel PTP / AMD fTPM enable करना भूल जाएँ तो यही दिखता है।'},
      {n:4, title:'डिस्क की सेहत व जगह', text:'<code>cleanmgr</code> से कब्ज़ा, <code>dfrgui</code> से media type (SSD/HDD), CrystalDiskInfo/SMART से स्वास्थ्य; WinSxS व <code>Windows.old</code> DISM/Disk Cleanup से कम कीजिए।'},
      {n:5, title:'ड्राइवर व update स्थिति', text:'Device Manager में ⚠ वाला डिवाइस, Windows Update का last quality update, LTSC मशीन हो तो उस build का सपोर्ट-एंड नोट कीजिए।'},
      {n:6, title:'रिपोर्ट लिखिए', text:'चार लाइन में: <b>OS/Edition/Build</b> · <b>Licence</b> (OEM/Retail/Volume + status) · <b>Hardware</b> (CPU/RAM/disk + आर्किटेक्चर + सेहत) · <b>सलाह</b> (Win11 पर जाएँ / ESU / LTSC / RAM बढ़ाएँ / SSD डालें)।',
        tips:'यही format repair slip/invoice पर भी काम आता है और परीक्षा के प्रैक्टिकल में भी।'}
    ]},

    {type:'acc', title:'अक्सर पूछे जाने वाले प्रश्न (FAQ)', items:[
      {q:'Windows 11 में Windows 10 का kernel है या नहीं?', a:'<b>वही NT kernel (10.0)</b>। Windows 11 build 22000 से शुरू होता है और उसकी binary family Windows 10 21H2 (19044) से मिलती-जुली है — यानी 11 = 10 का नया UI + सख़्त hardware floor (UEFI+Secure Boot, TPM 2.0, 64-bit only)। इसीलिए बहुत-से 10 के ड्राइवर व टूल 11 पर चलते हैं।'},
      {q:'32-bit Windows पर 8 GB RAM लगी है, 3.4 GB क्यों दिखता है?', a:'32-bit का address space 2<sup>32</sup> = 4 GB, और उसमें से 0.5–1.2 GB PCIe devices के MMIO BAR बुक कर लेते हैं। बचा हुआ ~3.2–3.5 GB ही OS देख सकता है। इलाज: Windows 10/11 का 64-bit install (सॉफ़्टवेयर के 64-bit ड्राइवर/keys पहले जाँचिए)।'},
      {q:'System32 में 64-bit फ़ाइलें क्यों, नाम “32” क्यों?', a:'1990 में 32-bit Windows के लिए यह नाम रखा गया; 64-bit आया तो पुराने scripts/paths न टूटें इसलिए वही folder 64-bit की फ़ाइलों वाला रहा और 32-bit DLL <code>SysWOW64</code> में डाल दी गईं। Registry का 32-bit view <code>HKLM\\SOFTWARE\\WOW6432Node</code> है।'},
      {q:'Format के बाद फिर से key क्यों नहीं माँगती?', a:'Activation Windows 10/11 में <b>hardware entitlement</b> पर आधारित है: UEFI में छपी OEM key (<code>ACPI\\MSDM</code>) या digital licence hardware ID से मैच करती है। वही मदरबोड + वही edition = install के बाद अपने-आप “Active”। मदरबोर्ड बदलें तो Settings › Activation › Troubleshoot से entitlement link करें (MS account में linked हो तो)।'},
      {q:'OEM और Retail लाइसेंस में सबसे बड़ा फ़र्क़?', a:'<b>स्थानांतरण (transfer)</b>। OEM = मदरबोर्ड से बंधा, ट्रांसफ़र नहीं, सपोर्ट बनाने वाली कंपनी का। Retail = हटाकर दूसरे PC पर लगाया जा सकता है, Microsoft सीधे सपोर्ट। Volume (MAK/KMS) सिर्फ़ संगठनों के लिए — KMS पर client हर 180 दिन host (TCP 1688) से renew करता है, इसलिए घर का PC कानूनी रूप से KMS से एक्टिवेट नहीं हो सकता।'},
      {q:'<code>slmgr /xpr</code> में “Volume activation will expire” आया — मशीन ग़लत है?', a:'इसका अर्थ मशीन KMS से active है (आमतौर पर corporate/domain PC) और हर 180 दिन host से renew करती है। घरेलू Retail/digital licence मशीन पर “The machine is permanently activated” दिखता है। ग्राहक की मशीन पर countdown दिखे तो साफ़ कीजिए कि वो company-managed है या बिना लाइसेंस के KMS emulator से चली है (पिछला ग़ैर-कानूनी है)।'},
      {q:'ग्राहक सेकंड-हैंड PC लाया है — पहली तीन जाँच क्या?', a:'<b>(1)</b> <code>slmgr /dlv</code> + UEFI key — licence असली है या नहीं। <b>(2)</b> <code>winver</code> + <code>tpm.msc</code> + <code>msinfo32</code> — Windows 11 eligible है या Windows 10 (14 अक्टूबर 2025 के बाद ESU का जोखिम) रहेगा। <b>(3)</b> RAM/डिस्क/SMART — 32-bit OS + 4 GB से ऊपर RAM हो तो 64-bit पर जाएँ, HDD हो तो SSD सिफ़ारिश करें। “key मिल गई, OS डाल दी” जैसी grey-market बात पर कभी लिखित गारंटी न दें।'},
      {q:'LTSC/LTSB कब चुनें?', a:'जब मशीन का काम स्थिर हो और feature update बिगाड़ सकता हो — कियोस्क, ATM, POS, CNC/medical panel, लैब इमेज। इसमें Store/Cortana/bloat नहीं, सिर्फ़ security updates, ~10 वर्ष support; पर build पुराना रह जाता है (LTSC 2021 = 19044), इसलिए नए hardware/सॉफ़्टवेयर की driver समस्या हो सकती है।'},
      {q:'Home में gpedit/RDP host/BitLocker चाहिए — कोई trick?', a:'आधिकारिक रास्ता = Pro key से upgrade: Settings › System › Activation › Change product key (format नहीं)। “Home में gpedit enable करने” वाले script unsupported हैं और बड़े Windows Update के बाद टूट जाते हैं — servicing में ऐसी मशीन की warranty व upgrade दोनों जोखिम में डालते हैं।'},
      {q:'Windows 7/8 की key से Windows 10/11 activate हो जाएगा?', a:'आधिकारिक रूप से नहीं — मुफ़्त अपग्रेड की खिड़की बंद हो चुकी है और Microsoft ऐसी activations अस्वीकार/डिएक्टिवेट कर सकता है। कानूनी विकल्प: असली Retail/Upgrade license, या OEM key वाली मशीन (key के मatching edition का ISO इस्तेमाल करके)।'}
    ]},

    {type:'callout', kind:'exam', title:'परीक्षा/इंटरव्यू — इस अध्याय के संभावित प्रश्न', html:'<b>(1)</b> OS के पाँच काम + Windows का layer मॉडल (HAL → kernel/Executive → driver model → Win32/NT API → shell)। <b>(2)</b> <code>System32</code> = 64-bit फ़ाइलें, <code>SysWOW64</code> = 32-bit, registry view <code>WOW6432Node</code>। <b>(3)</b> 32-bit विंडोज़ 4 GB से ऊपर RAM क्यों नहीं देखता। <b>(4)</b> Home में ये पाँच नहीं: Domain join, RDP host, पूरा BitLocker, Hyper-V, <code>gpedit.msc</code>। <b>(5)</b> OEM vs Retail vs MAK vs KMS vs digital licence — कौन transferable, KMS का 180 दिन व पोर्ट 1688। <b>(6)</b> <code>slmgr /dli</code>, <code>/dlv</code>, <code>/xpr</code> का फ़र्क़। <b>(7)</b> EOL डेट: Win7 14-01-2020 · Win8.1 10-01-2023 · Win10 14-10-2025 (ESU)। <b>(8)</b> Win11 floor: 1 GHz 2-core 64-bit, 4 GB RAM, 64 GB storage, UEFI+Secure Boot, TPM 2.0, DX12/WDDM 2.0, 720p 9&quot; स्क्रीन। <b>(9)</b> वर्ज़न पहचान: <code>winver</code>/<code>systeminfo</code>/registry <code>DisplayVersion+CurrentBuild+UBR</code>/Panther log। <b>(10)</b> WinSxS, Installer, hiberfil, pagefile, Windows.old — क्या मिटेगा, क्या नहीं, और कौन-सा कमांड।'},

    /* @@T1MORE@@ */
  ]
},

/* ===================================================================
   2. विंडोज़ का पूरा इंटरफ़ेस
   =================================================================== */
{
  id:'win-ui', icon:'🖥️', group:'विंडोज़ मास्टरक्लास',
  title:'विंडोज़ का पूरा इंटरफ़ेस (10 व 11)',
  sub:'डेस्कटॉप, टास्कबार, एक्सप्लोरर, Settings और शॉर्टकट — एक-एक बटन',
  kicker:'Windows Masterclass 2 · Desktop, Explorer & Settings',
  hero:'यहाँ विंडोज़ 10 और 11 का हर दिखने वाला हिस्सा बटन-बटन तोड़कर समझाया है — डेस्कटॉप आइकॉन से टास्कबार, स्टार्ट मेन्यू, File Explorer के हर pane, Settings बनाम Control Panel, Snap/मॉनिटर, थीम, शॉर्टकट, एक्सेसिबिलिटी, पावर और Run कमांड।',
  tags:['डेस्कटॉप व टास्कबार','File Explorer','Settings व Control Panel','शॉर्टकट','Win+R कमांड','Snap व मॉनिटर'],
  blocks:[
    {type:'html', html:`<h3 class="blk"><span class="blk-n">2.1</span> डेस्कटॉप (Desktop) और उसके आइकॉन</h3>
      <p>डेस्कटॉप कोई folder नहीं, एक <b>shell view</b> है — असली फ़ोल्डर दो जगह: सार्वजनिक <code>C:\\Users\\Public\\Desktop</code> (हर यूज़र को दिखता है) और व्यक्तिगत <code>C:\\Users\\&lt;user&gt;\\Desktop</code>। Desktop icon इसलिए <code>%USERPROFILE%\\Desktop\\desktop.ini</code> में layout stored रहता है — “आइकॉन बिखर गए” तो View › Sort by › Auto arrange icons से ठीक होते हैं।</p>
      <p>आइकॉन चालू/बंद करने का रास्ता: <b>Settings › Personalization › Themes › Desktop icon settings</b> (Win10: Themes › “Related Settings: Desktop icon settings”)। वहाँ checkbox: This PC (Win10 में “File Explorer”), Networks/Microsoft Edge, Control Panel, User’s Files। Win11 में default desktop पर सिर्फ़ Recycle Bin + Files का shortcut रहता है — बाकी खुद जोड़ने पड़ते हैं।</p>`},

    {type:'table', head:['आइकॉन','अंदर क्या मिलता है','डबल-क्लिक से खुलता है','सेटिंग/नोट'],
      rows:[
        ['<b>This PC</b> (Win10 में “File Explorer”, पुराना My Computer)','ड्राइव, devices/drives, Map network drive, “Scan for changes”','Explorer का This PC view','Properties में Device specs (CPU/RAM, 64-bit), Computer name, Windows activation link; “Manage” = Computer Management'],
        ['<b>Recycle Bin</b>','हर volume के <code>C:\\$Recycle.Bin\\&lt;SID&gt;</code> की हटी फ़ाइलें ($I metadata + $R content)','Delete का screen — Name, Original location, Date deleted, Size','Right-click › Properties: प्रति drive <b>Custom size</b> (MB/%), max ≈ drive का कुछ %, “Don’t move files to the Recycle Bin (remove immediately)”, “Display delete confirmation dialog” checkbox'],
        ['<b>Network / Microsoft Edge</b>','LAN के PC, devices, shared folders (Win11 में Edge का आइकॉन)','Network window / ब्राउज़र','Network खाली दिखे तो Network discovery + File sharing चालू करना पड़ता है (Network & Sharing Center)'],
        ['<b>Control Panel</b>','Classic सेटिंग्स के सभी applet','Category/Icons/Large icons view','View: Small icons = सारे applet एक list में; address bar में “\\All Control Panel Items”'],
        ['<b>User’s Files</b>','उस यूज़र का profile folder (Documents/Pictures/Desktop)','Explorer में <code>%USERPROFILE%</code>','login screen पर “other user” हो तो हर यूज़र का अपना desktop आइकॉन'],
        ['<b>Shortcut (.lnk)</b>','किसी ऐप/फ़ाइल/folder का pointer','target खुलता है','Properties › Shortcut: Target, Start in, Run (Normal/Minimized/Maximized), Key shortcut, “Advanced › Run as administrator”; <code>.lnk</code> 1 KB के around होते हैं और Target खो जाने पर “bad shortcut”'],
        ['<b>Widget / Copilot icon</b> (Win11)','Weather+news panel / Copilot pane','Slide-out panel','Settings › Personalization › Taskbar › System tray icons से बंद; पुराने Windows में “Desktop gadgets” 7 के बाद हटे']
      ]},

    {type:'callout', kind:'tip', title:'Recycle Bin — servicing के तीन काम', html:'<b>(1) Restore:</b> फ़ाइल चुनकर Right-click › Restore — वह <b>Original location</b> पर वापस जाती है; मूल folder हटा हो तो path बनाकर डालती है। “Restore all items” से सारी एक साथ। <b>(2) Size:</b> USB/HDD पर भी हर volume का अलग recycle bin होता है — pen drive की हटी फ़ाइल उसी pen drive के <code>$Recycle.Bin</code> में रहती है, दूसरे PC पर खोलें तो वही वहाँ दिखेगी। <b>(3) Recovery:</b> Shift+<kbd>Delete</kbd> से हटी फ़ाइल bin में नहीं जाती — तुरंत रिकवरी टूल (Recuva/PhotoRec) चलाइए और उस ड्राइव पर लिखना रोक दीजिए। “Empty Recycle Bin” के बाद भी अक्सर data sectors पर बचा रहता है, पर जल्दी overwrite होता है।'},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">2.2</span> टास्कबार (Taskbar) की बनावट</h3>
      <p>टास्कबार shell (<code>explorer.exe</code>) का हिस्सा है। क्रम: <b>Start</b> → <b>Search</b> (box या सिर्फ़ लुप-आइकॉन) → <b>Task View</b> (Win10) → pinned/running ऐप → <b>Widgets</b> (Win11 बाएँ किनारे) → दाईं ओर <b>system tray / notification area</b> (छिपे icons का arrow ^) → network/sound/battery → clock + notification bell → सबसे किनारे पर <b>Show Desktop</b> की पतली पट्टी।</p>
      <p>सेटिंग्स का रास्ता: Right-click टास्कबार › <b>Taskbar settings</b> (Win10 में सीधे Settings खोलती है; Win11 में Taskbar › Taskbar behaviors)। टास्कबार लॉक/अनलॉक, auto-hide, toolbars — सब वहीं। टास्कबार ग़ायब/टूटे तो <code>explorer.exe</code> Task Manager से रीस्टार्ट कीजिए (File › Run new task › <code>explorer.exe</code>)।</p>`},

    {type:'table', head:['हिस्सा / सेटिंग','Windows 10','Windows 11','कैसे बदलें'],
      rows:[
        ['Start बटन','बाएँ कोने में, tiles वाला मेन्यू','Center में, सिर्फ़ pinned grid','Settings › Personalization › Start (Win10) / Taskbar (Win11)'],
        ['Search','taskbar पर box + टाइप करते ही results','icon या छोटा box (Win11 में बड़ा search box हटा)','Taskbar settings › Search › “Search icon / icon and label / hidden”'],
        ['Task View बटन','हाँ (अतिरिक्त desktop + timelines)','हाँ','<kbd>Win</kbd>+<kbd>Tab</kbd> से बिना बटन भी'],
        ['Widgets','(नहीं; 10 में News&Interests)','बाएँ किनारे पर Widgets board','Taskbar › System tray icons › Widgets on/off'],
        ['Pinned apps','Right-click ऐप › “Pin to taskbar”','वही; Start/Store ऐप से भी Pin','unpin = Right-click › Unpin from taskbar; drag करके क्रम बदलें'],
        ['Running apps','icon + live thumbnail preview','icon + thumbnail preview','hover पर thumbnail; <kbd>Ctrl</kbd>+click से उस ऐप की windows cycle'],
        ['Combine buttons','Always / When full / Never hide labels','icon + label का विकल्प; overflow flyout','Taskbar settings › “Combine taskbar buttons and hide labels”'],
        ['Auto-hide','हाँ','हाँ (behaviors में)','Taskbar settings › Automatically hide the taskbar'],
        ['Alignment','बायाँ (left only)','Center या Left','Win11: Taskbar behaviors › Taskbar alignment'],
        ['Toolbars','Address / Links / Desktop toolbar','यह feature हटाया गया','Win10: right-click › Toolbars'],
        ['Notification area icons','“Select which icons appear on the taskbar” + Always all','“Other system tray icons” › Show more icons for system tray','Settings › Personalization › Taskbar › …'],
        ['Clock में सेकंड','Settings में विकल्प नहीं; registry <code>HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced</code> में DWORD <code>ShowSecondsInSystemClock = 1</code>, फिर explorer restart','24H2/25H2 से आधिकारिक toggle: Settings › Personalization › Taskbar › Taskbar behaviors › “Show seconds in system clock tray icon”','सेकंड दिखाने से clock tray ज़्यादा battery खाता है; नए build की पुष्टि <code>winver</code> से करके ही दिखाइए'],
        ['Show Desktop','किनारे पर पतली sliver (click = desktop, दोबारा click = windows वापस)','वही sliver','<kbd>Win</kbd>+<kbd>D</kbd> से भी; Aero Peek = <kbd>Win</kbd>+<kbd>Home</kbd> (सिर्फ़ active window रखे)'],
        ['Multiple monitors','हर monitor पर taskbar, mini-toolbar','हर monitor पर taskbar + center/left per monitor','Taskbar settings › Multiple displays / Show taskbar on all displays']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">2.3</span> Start मेन्यू, टाइलें व Start फ़ोल्डर</h3>
      <p><b>Win10:</b> तीन हिस्से — बाएँ list (All apps), बीच में tile groups (रंग/size/नाम बदलने लायक, group बनाकर resize), दाएँ “Suggested/Recent” + Power/All apps/Settings बटन। टाइल पर right-click › More › “Turn live tile off”, Resize (small/medium/wide/large), Unpin। Start की सेटिंग: Settings › Personalization › Start — “Show recently added apps”, “Show most used apps”, “Use Start full screen”, “Show app suggestions in Start”।</p>
      <p><b>Win11:</b> केंद्र में grid (pinned apps, folder बनाने लायक — एक icon को दूसरे पर छोड़ें) + नीचे “Recommended” (recently added/files) + ऊपर All apps बटन + search box। Live tiles नहीं हैं — tile का स्थान fixed grid + folders ने ले लिया। Classic Start (Win7 जैसा) third-party tools से आता है; Microsoft ने Win11 22H2/23H2 में ऐसे tweaks को आधिकारिक रूप से असमर्थित कर दिया (update पर टूटते हैं)।</p>
      <p><b>Start के shortcuts असल में दो फ़ोल्डरों में होते हैं</b> — सभी-यूज़र: <code>C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs</code> (shell: <code>shell:common programs</code>) और उस-यूज़र: <code>C:\\Users\\&lt;user&gt;\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs</code> (shell: <code>shell:programs</code>)। इनमें <code>System Tools</code>, <code>Windows Administrative Tools</code>, <code>Accessories</code> जैसे folder हैं; यहाँ कोई .lnk डालें = Start में दिखेगा, हटाएँ = ग़ायब। Store ऐप यहाँ नहीं, <code>shell:AppsFolder</code> में रहते हैं।</p>`},

    {type:'table', head:['काम','Windows 10','Windows 11','कमांड/पथ'],
      rows:[
        ['Start खोलें','<kbd>Win</kbd> / Ctrl+Esc','<kbd>Win</kbd>','<code>shell:StartMenu</code>? नहीं — classic मेन्यू फ़ोल्डर: <code>shell:programs</code>'],
        ['Start के shortcuts','Programs folders (ऊपर)','वही folders + Store apps','<code>shell:programs</code>, <code>shell:common programs</code>, <code>shell:AppsFolder</code>'],
        ['Pinned item हटाना','Unpin from Start','Unpin from Start','—'],
        ['Folder बनाना/नाम','tile groups (resize/rename)','pinned icon को दूसरे पर ड्रॉप → folder','Win10 में group का नाम टाइप करके बदलें'],
        ['Live tiles','चालू/बंद किया जा सकता','फ़ीचर मौजूद नहीं','—'],
        ['Start को दूसरी drive पर ले जाना','User Shell Folders की value बदलकर रीस्टार्ट के साथ','आधिकारिक समर्थन नहीं; नए builds पर असफल/टूटा हुआ','<code>regedit</code> → <code>HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders</code> → “<code>{A520A1A4-173D-4FCC-95C4-DC8607A3F940}</code>” (Programs) — बैकअप लेते हुए; Win11 में tweaks असमर्थित'],
        ['All apps list','सारे .lnk + Store','All apps button','—'],
        ['Search from Start','Windows Search index','वही + cloud results (Bing, ग्रे करने का विकल्प?)','indexing settings: <code>control /name Microsoft.IndexingOptions</code>'],
        ['Power button','Power › Sleep/Shut down/Restart/Update','वही + Sign out/Fox? नहीं — Power menu','<kbd>Alt</kbd>+<kbd>F4</kbd> desktop पर = Shut Down Windows dialog'],
        ['Quick link menu','<kbd>Win</kbd>+<kbd>X</kbd>','<kbd>Win</kbd>+<kbd>X</kbd> (नया क्रम)','Settings, Device Manager, Disk Management, Terminal, Task Manager, Shut down यहीं से']
      ]},

    /* @@T2@@ */

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.4</span> File Explorer — हर pane, हर बटन, हर पथ</h3>
      <p>File Explorer (विंडोज़ 10 में "This PC", विंडोज़ 11 में ribbon की जगह कमांड बार) विंडोज़ का सबसे ज़्यादा इस्तेमाल होने वाला औज़ार है। इसे खोलने का सबसे तेज़ तरीक़ा <b>Win+E</b>। इसका हर हिस्सा एक अलग काम करता है, और servicing में आधी समस्याएँ यहीं से सुलझती हैं — "फ़ाइल दिख नहीं रही", "extension छिपी है", "C: भर गई"।</p>
      <p>सबसे ज़रूरी आदत: <b>View → Show → File name extensions</b> और <b>Hidden items</b> दोनों चालू रखें। Extension छिपी हो तो <code>invoice.pdf.exe</code> दिखेगा <code>invoice.pdf</code> — यही सबसे आम malware जाल है। Hidden items चालू न हों तो <code>AppData</code>, <code>ProgramData</code> और startup फ़ोल्डर नहीं दिखते, और आप निदान ही नहीं कर पाते।</p>` },

    { type: 'table', head: ['File Explorer का हिस्सा', 'क्या करता है', 'Windows 10 बनाम 11', 'servicing में काम'], rows: [
      ['<b>Address bar (पता पट्टी)</b>', 'ऊपर का लंबा बक्सा — वर्तमान पथ दिखाता है', 'दोनों में एक जैसा; क्लिक करने पर पथ editable हो जाता है', 'यहाँ <code>C:\\Windows\\System32</code> या <code>shell:startup</code> टाइप करके सीधे पहुँचें'],
      ['<b>Navigation pane (बायाँ)</b>', 'Quick access/Home, This PC, Network, drive tree', '11 में "Home" नाम; pin किए फ़ोल्डर यहीं', 'किसी drive/फ़ोल्डर तक पहुँचने का सबसे तेज़ रास्ता'],
      ['<b>Ribbon / Command bar</b>', 'Copy, Paste, Rename, Delete, New, Sort, View', '10 = Ribbon (Home/Share/View); 11 = पतली command bar + "…" मेन्यू', '11 में पूरा ribbon चाहिए तो "…" → Options या View मेन्यू'],
      ['<b>Search box (दायाँ ऊपर)</b>', 'वर्तमान फ़ोल्डर और उसके अंदर ढूँढ़ता है', 'दोनों में; 11 में indexing पर निर्भर', '<code>kind:document</code>, <code>datemodified:this week</code>, <code>*.pdf</code> जैसे फ़िल्टर'],
      ['<b>Details pane</b>', 'दाईं ओर चुनी फ़ाइल के गुण (आकार, प्रकार, तिथि)', 'View → Show → Details pane (Alt+Shift+P)', 'फ़ाइल का आकार/प्रकार बिना Properties खोले देखना'],
      ['<b>Preview pane</b>', 'दाईं ओर फ़ाइल का पूर्वावलोकन', 'Alt+P; PDF/चित्र/Office दिखते हैं', 'बिना खोले पुष्टि कि यही फ़ाइल चाहिए'],
      ['<b>Status bar (नीचे)</b>', 'कुल आइटम, चुने आइटम, कुल आकार', 'View → Show → Status bar', '"कितनी फ़ाइलें चुनीं, कितना आकार" — कॉपी से पहले जाँच'],
      ['<b>Quick access / Home</b>', 'अक्सर खुलने वाले फ़ोल्डर + हाल की फ़ाइलें', '10 = Quick access, 11 = Home', 'गोपनीयता के लिए Options → Privacy → दोनों टिक हटाएँ'],
      ['<b>This PC</b>', 'सारी drives, फ़ोल्डर, नेटवर्क स्थान', 'दोनों में', 'C: का ख़ाली स्थान देखने का पहला पड़ाव'],
      ['<b>Network</b>', 'नेटवर्क पर दिखने वाले दूसरे PC/साझा फ़ोल्डर', 'दोनों में; Network discovery चालू होनी चाहिए', 'साझा printer/फ़ाइल न दिखे तो यहीं जाँचें']
    ]},

    { type: 'table', head: ['Explorer शॉर्टकट / कमांड', 'क्या होता है', 'नोट'], rows: [
      ['<code>Win+E</code>', 'File Explorer खोलता है', 'सबसे तेज़ रास्ता'],
      ['<code>Alt+D</code> या <code>Ctrl+L</code> या <code>F4</code>', 'Address bar चुनता है', 'पथ टाइप करके Enter'],
      ['<code>Alt+P</code> / <code>Alt+Shift+P</code>', 'Preview pane / Details pane', 'टॉगल'],
      ['<code>Ctrl+Shift+N</code>', 'नया फ़ोल्डर', 'फ़ोल्डर के अंदर'],
      ['<code>F2</code>', 'नाम बदलें (Rename)', 'बहु-चयन पर सामूहिक rename'],
      ['<code>Alt+Enter</code>', 'Properties (गुण)', 'आकार, स्थान, सुरक्षा, पिछले संस्करण'],
      ['<code>Alt+←</code> / <code>Alt+→</code> / <code>Alt+↑</code>', 'पीछे / आगे / एक स्तर ऊपर', 'माउस के चौथे-पाँचवें बटन भी यही'],
      ['<code>Ctrl+A</code> फिर <code>Shift+Delete</code>', 'सब चुनकर स्थायी मिटाना', '<b>Recycle Bin में नहीं जाता</b> — सावधानी'],
      ['<code>Ctrl+C</code> / <code>Ctrl+X</code> / <code>Ctrl+V</code>', 'कॉपी / कट / पेस्ट', 'कट से मूल हटता है'],
      ['<code>Ctrl+Z</code> / <code>Ctrl+Y</code>', 'अंतिम फ़ाइल-क्रिया वापस / दोबारा', 'ग़लती से मिटाई फ़ाइल तुरंत वापस'],
      ['<code>Ctrl+माउस-क्लिक</code> / <code>Shift+क्लिक</code>', 'अलग-अलग चुनना / लगातार श्रेणी चुनना', 'सैकड़ों फ़ाइलें एक साथ'],
      ['<code>Ctrl+Shift+1…8</code>', 'View बदलना (बड़े आइकॉन → Details)', 'Details सबसे उपयोगी'],
      ['<code>shell:startup</code> (address bar में)', 'चालू होते ही चलने वाले प्रोग्राम का फ़ोल्डर', 'यहाँ रखी shortcut अपने आप चालू होती है'],
      ['<code>shell:sendto</code>', 'Send To मेन्यू के आइटम', 'अपना फ़ोल्डर जोड़कर एक-क्लिक कॉपी'],
      ['<code>%temp%</code> / <code>%appdata%</code>', 'अस्थायी / ऐप-डेटा फ़ोल्डर', 'सफ़ाई व निदान में'],
      ['<code>\\\\server\\share</code>', 'नेटवर्क साझा फ़ोल्डर (UNC पथ)', 'दो backslash से शुरू']
    ]},

    { type: 'callout', kind: 'warn', title: 'छिपी फ़ाइलें और extension — servicing की दो अनिवार्य सेटिंग', html: '<p>विंडोज़ 11: File Explorer → <b>View → Show</b> → <b>File name extensions</b> और <b>Hidden items</b> टिक करें। विंडोज़ 10: <b>View</b> ribbon → यही दो checkbox। स्थायी रूप से: Folder Options → View टैब → "Hide extensions for known file types" <b>अनटिक</b>, और "Show hidden files, folders, and drives" चुनें।</p><p><b>Protected operating system files</b> अलग सेटिंग है — इसे आम तौर पर छिपा ही रहने दें; केवल तभी दिखाएँ जब <code>bootmgr</code>, <code>pagefile.sys</code>, <code>hiberfil.sys</code> जैसे फ़ाइलों का आकार देखना हो। इन्हें मिटाना सिस्टम को boot न होने लायक बना सकता है।</p>'},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.5</span> Settings बनाम Control Panel — दो दरवाज़े, एक ही मकान</h3>
      <p>विंडोज़ 8 से Microsoft ने पुराना <b>Control Panel</b> धीरे-धीरे नए <b>Settings</b> ऐप में समेटना शुरू किया। विंडोज़ 11 तक लगभग सब Settings में आ गया, पर Control Panel <b>अभी भी मौजूद है</b> और कुछ गहरे काम (Device Manager का पुराना दृश्य, Programs and Features, Sound का classic dialog, Indexing Options, Administrative Tools) वहीं से तेज़ होते हैं। इसलिए दोनों खोलना आना चाहिए।</p>
      <p>याद रखने का नियम: <b>रोज़मर्रा की सेटिंग = Settings (Win+I)</b>; <b>हार्डवेयर/ड्राइवर/पुराना गहरा काम = Control Panel या सीधा .cpl</b>। हर Control Panel आइटम का एक <code>.cpl</code> नाम होता है जिसे Win+R में टाइप करके सीधे खोला जा सकता है — servicing में यही सबसे तेज़ रास्ता है।</p>` },

    { type: 'table', head: ['काम', 'Settings में रास्ता (Win+I)', 'Control Panel / सीधा कमांड', 'नोट'], rows: [
      ['ड्राइवर देखना/बदलना', 'System → About → Device Manager (लिंक)', '<code>devmgmt.msc</code>', 'पीला ! = ड्राइवर समस्या; यहीं से Update/Roll Back/Disable'],
      ['प्रोग्राम हटाना', 'Apps → Installed apps', '<code>appwiz.cpl</code> (Programs and Features)', 'पुराना दृश्य तेज़; "Turn Windows features on or off" भी यहीं'],
      ['डिस्प्ले/रिज़ॉल्यूशन', 'System → Display', '<code>desk.cpl</code>', 'Scale, Refresh rate, Multiple displays, HDR'],
      ['नेटवर्क एडाप्टर', 'Network &amp; internet → Advanced network settings', '<code>ncpa.cpl</code>', 'IP बदलना, adapter disable/enable — servicing का पहला कदम'],
      ['साउंड', 'System → Sound', '<code>mmsys.cpl</code>', 'classic dialog में Recording/Playback अलग टैब'],
      ['पावर योजना', 'System → Power &amp; battery', '<code>powercfg.cpl</code>', 'उच्च प्रदर्शन/संतुलित; sleep समय'],
      ['यूज़र खाते', 'Accounts', '<code>netplwiz</code> या <code>control userpasswords2</code>', 'स्थानीय बनाम Microsoft खाता; auto-login सेटिंग'],
      ['सिस्टम गुण / वर्चुअल मेमोरी', 'System → About → Advanced system settings', '<code>sysdm.cpl</code>', 'Performance → Advanced → Virtual memory (pagefile)'],
      ['तारीख़ व समय', 'Time &amp; language → Date &amp; time', '<code>timedate.cpl</code>', 'ग़लत समय = HTTPS certificate error का आम कारण'],
      ['Region / भाषा', 'Time &amp; language → Language &amp; region', '<code>intl.cpl</code>', 'तारीख़-मुद्रा का रूप यहीं से तय होता है'],
      ['प्रिंटर', 'Bluetooth &amp; devices → Printers &amp; scanners', '<code>control printers</code>', 'पुराना दृश्य स्पूलर/डिफ़ॉल्ट प्रिंटर के लिए'],
      ['फ़ायरवॉल', 'Privacy &amp; security → Windows Security', '<code>firewall.cpl</code> / <code>wf.msc</code>', 'wf.msc = उन्नत नियम (inbound/outbound)'],
      ['इंडेक्सिंग (खोज)', 'Privacy &amp; security → Searching Windows', 'Indexing Options (<code>control srchadmin.dll</code>)', 'खोज धीमी/अधूरी हो तो यहाँ Rebuild'],
      ['सिस्टम पुनर्स्थापना', 'System → About → System protection', '<code>rstrui.exe</code> (Restore) / <code>sysdm.cpl</code> → System Protection', 'Restore point बनाना/चुनना'],
      ['सेवाएँ (Services)', '—', '<code>services.msc</code>', 'Print Spooler, Windows Update, BITS यहीं से restart']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.6</span> विंडोज़ खोज (Search), Task View, Snap और Virtual Desktop</h3>
      <p><b>Win+S</b> या taskbar का search box खोलता है। यह तीन जगह ढूँढ़ता है — स्थानीय फ़ाइलें/ऐप, सेटिंग्स, और वेब (Bing)। वेब नतीजे हटाने हों तो Settings → Privacy &amp; security → Search permissions → "Cloud content search" बंद करें। खोज अधूरी मिले तो Indexing Options में जाकर फ़ोल्डर शामिल करें या index Rebuild करें।</p>
      <p><b>Task View (Win+Tab)</b> सारी खुली विंडोज़ और <b>Virtual Desktops</b> दिखाता है। Virtual desktop का मतलब है एक ही मॉनिटर पर कई अलग "कार्यस्थान" — एक पर पढ़ाई, दूसरे पर ऑफ़िस, तीसरे पर संगीत। यह RAM नहीं बढ़ाता, केवल विंडोज़ को अलग-अलग समूह में रखता है। <b>Win+Ctrl+D</b> नया desktop, <b>Win+Ctrl+←/→</b> अगला-पिछला, <b>Win+Ctrl+F4</b> वर्तमान बंद।</p>
      <p><b>Snap</b> विंडोज़ को स्क्रीन के हिस्सों में बाँटता है। विंडोज़ 11 में विंडोज़ के maximize बटन पर माउस ले जाने से <b>Snap Layouts</b> दिखते हैं (या <b>Win+Z</b>)। <b>Win+←/→</b> आधी स्क्रीन, फिर <b>Win+↑/↓</b> चौथाई। <b>Snap Assist</b> बची जगह के लिए दूसरी विंडोज़ सुझाता है। दो मॉनिटर हों तो <b>Win+Shift+←/→</b> विंडोज़ को दूसरे मॉनिटर पर भेजता है, और <b>Win+P</b> प्रोजेक्शन मोड (PC screen only / Duplicate / Extend / Second screen only) चुनता है।</p>` },

    { type: 'table', head: ['शॉर्टकट', 'क्या करता है', 'कब सबसे उपयोगी'], rows: [
      ['<code>Win</code>', 'Start मेन्यू खोलना/बंद करना', 'अकेला Win दबाकर टाइप करना = सबसे तेज़ खोज'],
      ['<code>Win+S</code> / <code>Win+Q</code>', 'Search', 'ऐप/फ़ाइल/सेटिंग ढूँढ़ना'],
      ['<code>Win+E</code>', 'File Explorer', 'फ़ाइल काम'],
      ['<code>Win+I</code>', 'Settings', 'कोई भी सेटिंग'],
      ['<code>Win+R</code>', 'Run dialog', '<code>cmd</code>, <code>msconfig</code>, <code>devmgmt.msc</code> सीधे'],
      ['<code>Win+X</code>', 'Power User मेन्यू (Quick Link)', 'Terminal(Admin), Device Manager, Disk Management — servicing का ख़ज़ाना'],
      ['<code>Win+D</code>', 'Desktop दिखाएँ/वापस', 'सब minimize; दोबारा दबाने पर वापस'],
      ['<code>Win+M</code> / <code>Win+Shift+M</code>', 'सब minimize / वापस', 'Win+D से अलग — यह restore नहीं करता'],
      ['<code>Win+Tab</code>', 'Task View + Virtual Desktops', 'बहुत सारी विंडोज़ में से चुनना'],
      ['<code>Alt+Tab</code>', 'खुली विंडोज़ में बदलना', 'दबाए रखकर तीर से चुनें; Alt+Esc क्रम से'],
      ['<code>Win+Ctrl+D</code> / <code>Win+Ctrl+F4</code>', 'नया virtual desktop / वर्तमान बंद', 'काम अलग-अलग रखना'],
      ['<code>Win+Ctrl+←/→</code>', 'पिछला/अगला virtual desktop', 'तेज़ी से कार्यस्थल बदलना'],
      ['<code>Win+←/→/↑/↓</code>', 'Snap (आधा/चौथाई/maximize/minimize)', 'दो फ़ाइलें साथ देखना'],
      ['<code>Win+Z</code>', 'Snap Layouts (विंडोज़ 11)', 'तीन-चार विंडोज़ का तैयार ढाँचा'],
      ['<code>Win+Shift+←/→</code>', 'विंडोज़ दूसरे मॉनिटर पर', 'दो-मॉनिटर सेटअप'],
      ['<code>Win+P</code>', 'Project / प्रोजेक्टर मोड', 'क्लास में प्रोजेक्टर लगाते समय'],
      ['<code>Win+L</code>', 'लॉक स्क्रीन', 'सीट छोड़ते ही — सुरक्षा की पहली आदत'],
      ['<code>Win+A</code>', 'Quick Settings (विंडोज़ 11) / Action Center (10)', 'Wi-Fi, Bluetooth, Volume, Brightness, Focus'],
      ['<code>Win+N</code>', 'Notification Center + Calendar (विंडोज़ 11)', 'सूचनाएँ पढ़ना/हटाना'],
      ['<code>Win+W</code>', 'Widgets (विंडोज़ 11)', 'मौसम/समाचार; बंद करना हो तो taskbar से हटाएँ'],
      ['<code>Win+V</code>', 'Clipboard history', 'पहले चालू करना पड़ता है; कई चीज़ें paste करने में'],
      ['<code>Win+.</code> या <code>Win+;</code>', 'Emoji / symbol panel', 'हिंदी टाइपिंग में भी काम का'],
      ['<code>Win+Shift+S</code>', 'Snipping Tool — स्क्रीनशॉट का हिस्सा', 'रिपोर्ट/शिकायत में चित्र जोड़ना'],
      ['<code>Win+PrtScn</code>', 'पूरी स्क्रीन का PNG', 'Pictures\\Screenshots में सहेजता है'],
      ['<code>Win+G</code>', 'Xbox Game Bar', 'स्क्रीन रिकॉर्डिंग (वीडियो) भी यहीं से'],
      ['<code>Ctrl+Shift+Esc</code>', 'Task Manager सीधे', 'Ctrl+Alt+Del से एक कदम कम'],
      ['<code>Win+Pause</code>', 'System → About', 'RAM/CPU/विंडोज़ संस्करण तुरंत']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.7</span> Personalization — थीम, रंग, टास्कबार और लॉक स्क्रीन</h3>
      <p>Settings → <b>Personalization</b> में छह मुख्य पन्ने हैं: Background, Colors, Themes, Lock screen, Start, Taskbar। <b>Theme</b> एक ही पैकेज है — wallpaper + रंग + ध्वनि + mouse cursor। अच्छी थीम चुनने से पूरा रूप एक साथ बदल जाता है। थीम फ़ाइलें <code>%localappdata%\\Microsoft\\Windows\\Themes</code> में सहेजी जाती हैं और दूसरे PC पर ले जाई जा सकती हैं।</p>
      <p><b>Colors</b> में Light/Dark/Custom चुनें; "Accent color" से taskbar/Start/Title bar का रंग तय होता है। <b>Transparency effects</b> चालू रखने पर पुराने/कमज़ोर PC पर हल्का प्रदर्शन-असर पड़ सकता है। <b>Contrast themes</b> (पहले High Contrast) कम दृष्टि वाले उपयोगकर्ताओं के लिए हैं — इन्हें Accessibility से भी चालू किया जा सकता है।</p>
      <p>विंडोज़ 11 का taskbar डिफ़ॉल्ट रूप से <b>बीच (center)</b> में होता है और केवल नीचे रह सकता है। बाएँ करना हो तो Settings → Personalization → Taskbar → Taskbar behaviors → <b>Taskbar alignment = Left</b>। आइकॉन छोटे करने का विकल्प विंडोज़ 11 में नहीं है (registry hack असमर्थित है) — पर <b>Taskbar size</b> के लिए display scaling बदला जा सकता है। Widgets, Chat, Search, Task View, Copilot — हर बटन यहीं से अलग-अलग छिपाया जा सकता है।</p>` },

    { type: 'table', head: ['Personalization पन्ना', 'मुख्य विकल्प', 'servicing/कक्षा में नोट'], rows: [
      ['<b>Background</b>', 'Picture / Solid color / Slideshow / Windows Spotlight', 'Spotlight रोज़ नया चित्र लाता है (इंटरनेट चाहिए); कक्षा में स्थिर चित्र बेहतर'],
      ['<b>Colors</b>', 'Light/Dark/Custom, Accent color, Transparency, Title bar रंग', 'Dark मोड कम रोशनी में आँखों को आराम; प्रिंट पर असर नहीं'],
      ['<b>Themes</b>', 'तैयार थीम, Save theme, Get more themes (Store)', 'एक थीम = wallpaper+रंग+ध्वनि+cursor; दूसरे PC पर ले जाई जा सकती है'],
      ['<b>Lock screen</b>', 'Spotlight/Picture/Slideshow, " fun facts, tips ", ऐप सूचनाएँ', 'लॉक स्क्रीन पर निजी सूचना दिखे तो Privacy जोखिम — ऐप चुनकर हटाएँ'],
      ['<b>Start</b>', 'Layout (More pins / Default / More recommendations), Recently added, Most used, Folders', 'विंडोज़ 11 22H2+ में Start के नीचे Documents/Downloads आदि के फ़ोल्डर-आइकॉन जोड़े जा सकते हैं'],
      ['<b>Taskbar</b>', 'Search/Task View/Widgets/Chat/Copilot टॉगल, Taskbar behaviors (alignment, auto-hide, multiple displays, badges)', 'Auto-hide से स्क्रीन की जगह बढ़ती है; "Combine buttons" से एक ही ऐप की कई विंडोज़ अलग दिखती हैं'],
      ['<b>Fonts</b>', 'स्थापित फ़ॉन्ट, Store से नए, फ़ॉन्ट फ़ाइल खींचकर स्थापित करना', 'हिंदी के लिए Mangal/Nirmala UI; दस्तावेज़ में फ़ॉन्ट न हो तो रूप बिगड़ता है'],
      ['<b>Device usage / Touch keyboard</b>', 'टच कीबोर्ड थीम, हाथ से लिखना', 'टैबलेट/2-in-1 पर'],
      ['<b>Contrast themes</b> (Accessibility में)', 'Aquatic, Desert, Dusk, Night sky', 'कम दृष्टि; स्क्रीनशॉट/प्रोजेक्टर पर बहुत स्पष्ट']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.8</span> Accessibility (सुगम्यता) — हर विद्यार्थी के लिए विंडोज़</h3>
      <p>Settings → <b>Accessibility</b> (विंडोज़ 10 में "Ease of Access") में दृष्टि, श्रवण और संवाद (interaction) — तीनों तरह की सहायता है। कक्षा में यह केवल दिव्यांग विद्यार्थियों के लिए नहीं, <b>सबके लिए</b> काम की है — जैसे Text size बढ़ाकर प्रोजेक्टर पर पढ़ना, या Mouse pointer बड़ा करके दिखाते समय स्पष्ट करना।</p>
      <p>तीन सबसे उपयोगी: <b>Narrator (Win+Ctrl+Enter)</b> स्क्रीन पर लिखा पढ़कर सुनाता है; <b>Magnifier (Win और +)</b> स्क्रीन का हिस्सा बड़ा करता है; <b>Live captions (Win+Ctrl+L, विंडोज़ 11 22H2+)</b> किसी भी ऑडियो/वीडियो के शब्द स्क्रीन पर लिख देता है — हिंदी व्याख्यान को पाठ में बदलने में बहुत काम का।</p>` },

    { type: 'table', head: ['Accessibility सुविधा', 'शॉर्टकट / रास्ता', 'क्या करती है', 'कब'], rows: [
      ['<b>Narrator</b>', '<code>Win+Ctrl+Enter</code>', 'स्क्रीन का पाठ बोलकर सुनाता है (screen reader)', 'दृष्टि बाधित; हिंदी आवाज़ के लिए भाषा पैक चाहिए'],
      ['<b>Magnifier</b>', '<code>Win</code> + <code>+</code> / <code>−</code>; बंद = <code>Win+Esc</code>', 'पूरी स्क्रीन/lens/डॉक में zoom', 'प्रोजेक्टर पर छोटा पाठ दिखाना'],
      ['<b>Live captions</b>', '<code>Win+Ctrl+L</code>', 'चल रही ऑडियो के शब्द स्क्रीन पर', 'श्रवण बाधा; ऑनलाइन व्याख्यान के नोट्स'],
      ['<b>Text size / Display scale</b>', 'Accessibility → Text size; System → Display → Scale', 'अक्षर/पूरा UI बड़ा', 'बुज़ुर्ग/कम दृष्टि; 125–150% आम'],
      ['<b>Mouse pointer व touch</b>', 'Accessibility → Mouse pointer and touch', 'pointer का आकार/रंग, touch indicator', 'पढ़ाते समय pointer स्पष्ट दिखे'],
      ['<b>Color filters</b>', 'Accessibility → Color filters (<code>Win+Ctrl+C</code>)', 'वर्णांधता के लिए रंग-फ़िल्टर, grayscale, inverted', 'रंग-पहचान में कठिनाई'],
      ['<b>Contrast themes</b>', 'Accessibility → Contrast themes', 'उच्च-कंट्रास्ट रंग योजना', 'कम दृष्टि; बहुत तेज़ धूप में स्क्रीन'],
      ['<b>Sticky / Filter / Toggle Keys</b>', 'Accessibility → Keyboard', 'एक-एक करके संयोजन दबाना; छोटे/दोहरे keystroke अनदेखा; Caps/Num पर बीप', 'मोटर कठिनाई; ग़लती से दबने वाली keys रोकना'],
      ['<b>On-screen / Voice typing</b>', '<code>Win+Ctrl+O</code>; Voice typing = <code>Win+H</code>', 'स्क्रीन पर कीबोर्ड; बोलकर टाइप करना', 'कीबोर्ड ख़राब हो तो अस्थायी सहारा; हिंदी डिक्टेशन'],
      ['<b>Eye control</b>', 'Accessibility → Eye control', 'आँख की पुतली से माउस/टाइपिंग (विशेष हार्डवेयर)', 'गंभीर मोटर बाधा'],
      ['<b>Mono audio / Visual alerts</b>', 'Accessibility → Audio', 'दोनों चैनल एक में; ध्वनि की जगह स्क्रीन flash', 'एक कान से कम सुनाई दे; शोर वाला कमरा']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.9</span> Power, Startup और Notification — रोज़ की तीन सेटिंग्स</h3>
      <p><b>Power</b>: Settings → System → Power &amp; battery। यहाँ Screen off समय, Sleep समय, Power mode (Best power efficiency / Balanced / Best performance) और Battery saver है। लैपटॉप पर " Lid बंद करने पर क्या हो" वाला विकल्प Control Panel → Power Options → "Choose what closing the lid does" में मिलता है — सर्विसिंग के दौरान लैपटॉप बंद करके भी काम जारी रखना हो तो यहाँ "Do nothing" चुना जाता है (बाद में वापस Sleep करना न भूलें)।</p>
      <p><b>Startup</b>: बहुत सारे प्रोग्राम चालू होते ही अपने आप चलने लगते हैं और PC धीमा कर देते हैं। इन्हें <b>Task Manager → Startup apps</b> (विंडोज़ 11) या Settings → Apps → Startup से बंद करें। "Startup impact" कॉलम बताता है कि कौन कितना भारी है। <b>msconfig</b> का Startup टैब अब Task Manager पर भेज देता है। जो चीज़ यहाँ न दिखे वह <code>shell:startup</code> फ़ोल्डर या Task Scheduler में हो सकती है।</p>
      <p><b>Notifications</b>: Settings → System → Notifications। हर ऐप की सूचना अलग-अलग बंद की जा सकती है, और <b>Do not disturb / Focus assist</b> (Win+A से Focus) तय समय पर सारी सूचनाएँ रोक देता है। कक्षा/परीक्षा के समय Focus चालू रखना अच्छी आदत है। लॉक स्क्रीन पर सूचना का पाठ दिखे या नहीं — यह अलग गोपनीयता सेटिंग है।</p>` },

    { type: 'table', head: ['Win+R में टाइप करें', 'क्या खुलता है', 'किस काम का'], rows: [
      ['<code>cmd</code> / <code>cmd /k</code>', 'Command Prompt', 'बुनियादी कमांड; <code>Ctrl+Shift+Enter</code> = admin'],
      ['<code>powershell</code> / <code>wt</code>', 'PowerShell / Windows Terminal', 'आधुनिक स्क्रिप्टिंग; wt = टैब वाला टर्मिनल'],
      ['<code>msconfig</code>', 'System Configuration', 'Boot options, Safe boot, Services छिपाना'],
      ['<code>devmgmt.msc</code>', 'Device Manager', 'ड्राइवर/हार्डवेयर'],
      ['<code>diskmgmt.msc</code>', 'Disk Management', 'partition बनाना/बढ़ाना, drive letter'],
      ['<code>services.msc</code>', 'Services', 'Spooler/Update/BITS restart'],
      ['<code>taskschd.msc</code>', 'Task Scheduler', 'समय पर चलने वाले काम'],
      ['<code>eventvwr.msc</code>', 'Event Viewer', 'crash/BSOD के log'],
      ['<code>regedit</code>', 'Registry Editor', '<b>सावधानी</b> — बदलने से पहले File → Export'],
      ['<code>gpedit.msc</code>', 'Local Group Policy', 'Pro/Enterprise में; Home में नहीं'],
      ['<code>control</code>', 'Control Panel', 'पुराना केंद्र'],
      ['<code>appwiz.cpl</code>', 'Programs and Features', 'प्रोग्राम हटाना'],
      ['<code>ncpa.cpl</code>', 'Network Connections', 'adapter/IP'],
      ['<code>sysdm.cpl</code>', 'System Properties', 'computer name, pagefile, restore point'],
      ['<code>inetcpl.cpl</code>', 'Internet Properties', 'proxy, पुराने IE/Edge legacy सेटिंग'],
      ['<code>cleanmgr</code>', 'Disk Cleanup', 'temporary/update फ़ाइलें हटाना'],
      ['<code>mrt</code>', 'Malicious Software Removal Tool', 'Microsoft का मासिक स्कैनर'],
      ['<code>msinfo32</code>', 'System Information', 'पूरा हार्डवेयर/सॉफ़्टवेयर ब्योरा — रिपोर्ट में'],
      ['<code>dxdiag</code>', 'DirectX Diagnostic', 'GPU/ड्राइवर/ध्वनि की जाँच'],
      ['<code>resmon</code>', 'Resource Monitor', 'कौन-सा प्रोग्राम disk/CPU/net खा रहा है'],
      ['<code>perfmon</code>', 'Performance Monitor', 'लंबे समय का प्रदर्शन-रिकॉर्ड'],
      ['<code>rstrui</code>', 'System Restore', 'पुरानी स्थिति पर लौटना'],
      ['<code>shutdown /r /t 0</code>', 'तुरंत restart', '<code>/s</code> = बंद, <code>/a</code> = रद्द'],
      ['<code>shell:startup</code>', 'Startup फ़ोल्डर', 'चालू होते ही चलने वाली shortcuts'],
      ['<code>.</code> / <code>..</code> / <code>\\\\</code>', 'वर्तमान फ़ोल्डर / मूल / drives', 'तेज़ navigation']
    ]},

    { type: 'callout', kind: 'danger', title: 'Registry और msconfig — जोखिम की रेखा', html: '<p><b>regedit</b> में ग़लत key हटाने से विंडोज़ boot होना बंद हो सकता है। नियम: (1) बदलने से पहले <b>File → Export</b> से उस branch का backup लें; (2) केवल वही बदलें जिसका भरोसेमंद स्रोत हो; (3) इंटरनेट से मिली ".reg फ़ाइल डबल-क्लिक कर दें" वाली सलाह बिना पढ़े न मानें — पहले Notepad में खोलकर देखें।</p><p><b>msconfig → Services → "Hide all Microsoft services"</b> टिक करके बाक़ी बंद करना safe-boot निदान का अच्छा तरीक़ा है, पर <b>Startup टैब से अज्ञात चीज़ें स्थायी रूप से हटाने से पहले</b> पहचान लें — कुछ एंटीवायरस/ड्राइवर utility ज़रूरी होते हैं।</p>'},

    { type: 'labs', items: [
      { n: 50, title: 'File Explorer को servicing-योग्य बनाना', aim: 'Extension व hidden files दिखाना, address bar से गहरे फ़ोल्डर खोलना, और छिपी फ़ाइलों का आकार मापना।', tools: ['विंडोज़ 10/11', 'File Explorer', 'Folder Options'], steps: [
        'Win+E दबाएँ। View → Show → <b>File name extensions</b> और <b>Hidden items</b> चालू करें (10 में View ribbon)।',
        'Folder Options → View टैब खोलकर पुष्टि करें कि "Hide extensions for known file types" अनटिक है।',
        'Address bar में <code>%appdata%</code> टाइप करके Enter — Roaming फ़ोल्डर खुलेगा। एक स्तर ऊपर (Alt+↑) जाकर Local और LocalLow देखें।',
        'Address bar में <code>shell:startup</code> खोलें — यहाँ कौन-सी shortcuts हैं, लिखें।',
        '<code>C:\\</code> खोलें। अब "Protected operating system files" दिखाएँ और <code>pagefile.sys</code> व <code>hiberfil.sys</code> का आकार नोट करें (Details view)।',
        'Protected files दोबारा छिपाएँ। किसी फ़ोल्डर में Ctrl+A करके status bar से कुल आकार पढ़ें।',
        'एक नक़ली फ़ाइल <code>test.pdf.txt</code> बनाएँ और देखें कि extension दिखने से असली प्रकार पकड़ में आता है।'
      ], result: 'Explorer अब extension/hidden files दिखाता है; आप address bar से AppData, startup और system फ़ाइलों तक सीधे पहुँच सकते हैं।' },

      { n: 51, title: 'Snap, Virtual Desktop और दो-मॉनिटर अभ्यास', aim: 'विंडोज़ को हिस्सों में बाँटना, अलग कार्यस्थल बनाना और प्रोजेक्टर मोड चुनना।', tools: ['विंडोज़ 11 (या 10)', 'चार ऐप', 'वैकल्पिक दूसरा मॉनिटर/प्रोजेक्टर'], steps: [
        'चार ऐप खोलें (Explorer, Notepad, Browser, Calculator)। एक विंडोज़ पर <b>Win+←</b> दबाएँ, दूसरी पर Win+→ — Snap Assist से बाक़ी चुनें।',
        'विंडोज़ 11 में maximize बटन पर माउस रखकर <b>Snap Layouts</b> देखें (या Win+Z) और तीन-कॉलम वाला ढाँचा चुनें।',
        '<b>Win+Ctrl+D</b> से नया virtual desktop बनाएँ; उस पर केवल Calculator रखें। <b>Win+Ctrl+←</b> से पहले वाले पर लौटें।',
        '<b>Win+Tab</b> खोलकर दोनों desktops देखें; एक विंडोज़ को खींचकर दूसरे desktop पर भेजें।',
        '<b>Win+P</b> दबाकर चारों मोड पढ़ें। दूसरा मॉनिटर हो तो <b>Extend</b> चुनें और एक विंडोज़ को <b>Win+Shift+→</b> से उस पर भेजें।',
        'Settings → System → Display में दोनों मॉनिटर की पहचान (Identify) करें, मुख्य मॉनिटर चुनें और resolution/scale मिलाएँ।',
        'अंत में <b>Win+Ctrl+F4</b> से extra desktop बंद करें — उसकी विंडोज़ अपने आप पहले desktop पर आ जाती हैं।'
      ], result: 'आप एक स्क्रीन पर चार विंडोज़ बाँट सकते हैं, काम के हिसाब से अलग desktop रख सकते हैं और प्रोजेक्टर/दूसरे मॉनिटर पर सही मोड चुन सकते हैं।' },

      { n: 52, title: 'Personalization + Accessibility + Startup सफ़ाई', aim: 'थीम/टास्कबार बदलना, सुगम्यता सुविधाएँ आज़माना और अनावश्यक startup बंद करके boot तेज़ करना।', tools: ['Settings', 'Task Manager', ' msconfig'], steps: [
        'Settings → Personalization → Colors में <b>Dark</b> चुनें; Accent color अपने मन का रखें; फिर Light पर लौटें।',
        'Taskbar → Taskbar behaviors → <b>alignment = Left</b> करें; Widgets और Chat बंद करें।',
        'Themes में एक थीम चुनें, फिर "Save theme" से अपनी थीम सहेजें और उस फ़ोल्डर का पथ नोट करें।',
        'Accessibility → Text size बढ़ाकर Apply करें; फिर <b>Win+Ctrl+Enter</b> से Narrator चालू करके सुनें और बंद करें।',
        '<b>Win+H</b> से Voice typing खोलकर हिंदी में एक वाक्य बोलकर टाइप करवाएँ।',
        '<b>Ctrl+Shift+Esc</b> → Task Manager → <b>Startup apps</b>: "Startup impact" के हिसाब से छाँटें और अनावश्यक (जैसे updater, cloud sync) Disable करें।',
        'Win+R → <code>msconfig</code> → Services → "Hide all Microsoft services" टिक करके बाक़ी सूची देखें (बंद न करें, केवल पहचानें)।',
        'PC restart करके boot समय और taskbar की सफ़ाई का अंतर नोट करें।'
      ], result: 'विंडोज़ का रूप आपकी पसंद का, सुगम्यता सुविधाएँ हाथ में, और startup हल्का — boot तेज़।' }
    ]},

    { type: 'acc', title: 'FAQ — विंडोज़ इंटरफ़ेस', items: [
      { q: 'File Explorer में extension क्यों दिखानी चाहिए?', a: 'छिपी extension पर <code>invoice.pdf.exe</code> केवल <code>invoice.pdf</code> दिखता है और आइकॉन भी PDF जैसा हो सकता है — यही सबसे आम malware जाल है। View → Show → File name extensions चालू रखें।' },
      { q: 'Settings और Control Panel में क्या फ़र्क़ है, कौन-सा सीखें?', a: 'Settings नया, टच-अनुकूल ऐप है (Win+I) और रोज़मर्रा की सारी सेटिंग यहीं है। Control Panel पुराना है पर अभी भी मौजूद — Device Manager, Programs and Features, Network Connections, Indexing Options जैसे गहरे काम वहाँ तेज़ हैं। दोनों सीखें; हर Control Panel आइटम का <code>.cpl</code> नाम Win+R में सीधे चलता है।' },
      { q: 'Win+D और Win+M में फ़र्क़?', a: 'Win+D desktop दिखाता है और <b>दोबारा दबाने पर सारी विंडोज़ वापस</b> आ जाती हैं। Win+M केवल सब minimize करता है और restore नहीं करता (उसके लिए Win+Shift+M)। रोज़ के काम में Win+D बेहतर है।' },
      { q: 'Virtual Desktop क्या RAM बढ़ाता है?', a: 'नहीं। यह केवल खुली विंडोज़ को अलग-अलग समूहों ("कार्यस्थलों") में बाँटता है ताकि स्क्रीन साफ़ रहे। सारी विंडोज़ उसी RAM में चलती रहती हैं। Win+Ctrl+D नया, Win+Ctrl+←/→ बदलना, Win+Ctrl+F4 बंद।' },
      { q: 'विंडोज़ 11 का taskbar बाएँ कैसे करें और छोटा कैसे हो?', a: 'Settings → Personalization → Taskbar → Taskbar behaviors → <b>Taskbar alignment = Left</b>। आइकॉन छोटे करने का समर्थित विकल्प विंडोज़ 11 में नहीं है; registry hack असमर्थित है और अपडेट में टूट सकता है। पूरा UI छोटा/बड़ा करना हो तो Display → Scale बदलें।' },
      { q: 'खोज (Search) में फ़ाइलें नहीं मिल रहीं, क्या करें?', a: 'Settings → Privacy &amp; security → Searching Windows देखें कि फ़ोल्डर excluded तो नहीं। फिर Control Panel → <b>Indexing Options</b> → Modify से सही फ़ोल्डर शामिल करें; ज़रूरत हो तो Advanced → <b>Rebuild</b>। नया index बनने में समय लगता है। वेब नतीजे हटाने के लिए "Cloud content search" बंद करें।' },
      { q: 'PC चालू होते ही बहुत धीमा क्यों है?', a: 'Startup apps ज़्यादा हैं। Ctrl+Shift+Esc → Task Manager → <b>Startup apps</b> → "Startup impact" High वाले अनावश्यक Disable करें। जो यहाँ न दिखे वह <code>shell:startup</code> फ़ोल्डर या Task Scheduler में हो सकता है। एंटीवायरस/ड्राइवर utility बंद न करें।' },
      { q: 'लैपटॉप का lid बंद करने पर भी काम चलता रहे तो?', a: 'Control Panel → Power Options → "Choose what closing the lid does" → <b>Do nothing</b> (बैटरी और plugged both)। काम पूरा होने पर वापस Sleep कर दें, वरना बैग में गर्मी और बैटरी ख़त्म।' },
      { q: 'Quick Settings और Notification Center कैसे खोलें?', a: 'विंडोज़ 11: <b>Win+A</b> = Quick Settings (Wi-Fi, Bluetooth, Volume, Brightness, Focus), <b>Win+N</b> = Notification Center + Calendar। विंडोज़ 10 में Win+A = Action Center जिसमें दोनों एक साथ हैं।' },
      { q: 'Clipboard history चालू कैसे करें, क्या सुरक्षित है?', a: '<b>Win+V</b> दबाकर "Turn on" करें। अब कई चीज़ें कॉपी करके बाद में चुनकर paste कर सकते हैं। सावधानी — पासवर्ड कॉपी करने पर वह history में रह जाता है; संवेदनशील चीज़ के बाद Win+V → Clear all करें, और Settings → System → Clipboard → "Sync across devices" बंद रखें।' },
      { q: 'Live captions हिंदी में काम करता है?', a: 'विंडोज़ 11 22H2+ में Live captions (Win+Ctrl+L) कई भाषाएँ का समर्थन करता है; हिंदी के लिए भाषा पैक डाउनलोड करना पड़ता है और पहली बार में मॉडल डाउनलोड होता है। शोर रहित ऑडियो पर सटीकता अच्छी, शोर में कम।' },
      { q: 'Registry बदलने से पहले क्या करना अनिवार्य है?', a: 'regedit में उस branch को चुनकर <b>File → Export</b> से .reg backup लें, या पूरा restore point बनाएँ (<code>sysdm.cpl</code> → System Protection → Create)। बिना backup के registry बदलना विंडोज़ को boot-अयोग्य बना सकता है।' }
    ]},

    { type: 'quiz', store: 'win-ui', items: [
      { q: 'File Explorer खोलने का शॉर्टकट क्या है?', o: ['Win+E', 'Win+F', 'Ctrl+E', 'Alt+E'], a: 0, ex: 'Win+E = Explorer। Win+F पुराने वर्ज़न में खोज था; Win+S अब खोज है।' },
      { q: 'फ़ाइल का extension दिखाने की सेटिंग कहाँ है?', o: ['Settings → System', 'File Explorer → View → Show → File name extensions', 'Control Panel → Sound', 'Task Manager'], a: 1, ex: 'विंडोज़ 10 में View ribbon पर checkbox; Folder Options → View में स्थायी सेटिंग।' },
      { q: 'Settings खोलने का शॉर्टकट?', o: ['Win+S', 'Win+I', 'Win+C', 'Ctrl+I'], a: 1, ex: 'Win+I = Settings। Win+S = Search।' },
      { q: 'Run dialog खोलने का शॉर्टकट?', o: ['Win+R', 'Win+X', 'Alt+R', 'Ctrl+R'], a: 0, ex: 'Win+R में cmd, msconfig, devmgmt.msc जैसे कमांड सीधे टाइप कर सकते हैं।' },
      { q: 'Device Manager सीधे खोलने का कमांड?', o: ['diskmgmt.msc', 'devmgmt.msc', 'services.msc', 'taskschd.msc'], a: 1, ex: 'devmgmt.msc = Device Manager; diskmgmt = Disk Management; services = सेवाएँ।' },
      { q: 'Power User (Quick Link) मेन्यू कौन-सा शॉर्टकट खोलता है?', o: ['Win+X', 'Win+P', 'Win+Q', 'Win+Z'], a: 0, ex: 'Win+X में Terminal(Admin), Device Manager, Disk Management, Event Viewer आदि मिलते हैं — servicing का तेज़ रास्ता।' },
      { q: 'Task View और Virtual Desktops दिखाने वाला शॉर्टकट?', o: ['Alt+Tab', 'Win+Tab', 'Ctrl+Tab', 'Win+D'], a: 1, ex: 'Win+Tab = Task View। Alt+Tab केवल खुली विंडोज़ में बदलता है।' },
      { q: 'नया Virtual Desktop बनाने का शॉर्टकट?', o: ['Win+D', 'Win+Ctrl+D', 'Win+Ctrl+N', 'Alt+D'], a: 1, ex: 'Win+Ctrl+D नया, Win+Ctrl+←/→ बदलना, Win+Ctrl+F4 वर्तमान बंद।' },
      { q: 'विंडोज़ को आधी स्क्रीन पर snap करने का शॉर्टकट?', o: ['Win+← या Win+→', 'Win+↑', 'Alt+←', 'Ctrl+←'], a: 0, ex: 'Win+←/→ आधा, फिर Win+↑/↓ चौथाई। विंडोज़ 11 में Win+Z से Snap Layouts।' },
      { q: 'विंडोज़ को दूसरे मॉनिटर पर भेजने का शॉर्टकट?', o: ['Win+P', 'Win+Shift+←/→', 'Win+M', 'Alt+Shift+→'], a: 1, ex: 'Win+Shift+तीर = विंडोज़ दूसरे मॉनिटर पर। Win+P प्रोजेक्शन मोड चुनता है।' },
      { q: 'प्रोजेक्टर/दूसरी स्क्रीन का मोड चुनने वाला शॉर्टकट?', o: ['Win+P', 'Win+D', 'Win+K', 'Win+L'], a: 0, ex: 'Win+P = PC screen only / Duplicate / Extend / Second screen only। Win+K = Cast (वायरलेस डिस्प्ले)।' },
      { q: 'स्क्रीनशॉट का चुना हिस्सा काटने का शॉर्टकट?', o: ['PrtScn', 'Win+Shift+S', 'Alt+PrtScn', 'Win+PrtScn'], a: 1, ex: 'Win+Shift+S = Snipping Tool का selection। Win+PrtScn पूरी स्क्रीन का PNG Pictures\\Screenshots में सहेजता है।' },
      { q: 'Task Manager सीधे खोलने का सबसे तेज़ शॉर्टकट?', o: ['Ctrl+Alt+Del', 'Ctrl+Shift+Esc', 'Win+T', 'Alt+F4'], a: 1, ex: 'Ctrl+Shift+Esc सीधे Task Manager; Ctrl+Alt+Del पहले सुरक्षा स्क्रीन देता है।' },
      { q: 'क्लिकबोर्ड हिस्ट्री का शॉर्टकट?', o: ['Win+C', 'Win+V', 'Ctrl+Shift+V', 'Win+H'], a: 1, ex: 'Win+V = Clipboard history (पहले चालू करना पड़ता है)। Win+H = Voice typing।' },
      { q: 'Narrator चालू/बंद करने का शॉर्टकट?', o: ['Win+Ctrl+Enter', 'Win+N', 'Win+Enter', 'Ctrl+Alt+N'], a: 0, ex: 'Win+Ctrl+Enter Narrator टॉगल करता है; Win+N विंडोज़ 11 में Notification Center है।' },
      { q: 'Magnifier बड़ा/छोटा करने के शॉर्टकट?', o: ['Win और + / −', 'Ctrl और + / −', 'Alt और + / −', 'Win+M'], a: 0, ex: 'Win + प्लस = zoom in, Win + माइनस = zoom out, Win+Esc = बंद।' },
      { q: 'PC लॉक करने का शॉर्टकट?', o: ['Win+L', 'Win+K', 'Alt+L', 'Ctrl+L'], a: 0, ex: 'Win+L = Lock। सीट छोड़ते ही यह आदत सुरक्षा की पहली सीढ़ी है।' },
      { q: 'चालू होते ही अपने आप चलने वाले प्रोग्राम कहाँ से बंद करें?', o: ['Settings → Display', 'Task Manager → Startup apps', 'Control Panel → Sound', 'Disk Cleanup'], a: 1, ex: 'Ctrl+Shift+Esc → Startup apps → Startup impact देखकर अनावश्यक Disable करें। msconfig का Startup टैब भी यहीं भेजता है।' },
      { q: 'चालू होते ही चलने वाली shortcuts का फ़ोल्डर कौन-सा कमांड खोलता है?', o: ['shell:sendto', 'shell:startup', '%temp%', 'shell:recent'], a: 1, ex: 'Win+R या Explorer address bar में shell:startup टाइप करें।' },
      { q: 'विंडोज़ 11 में taskbar के आइकॉन बाएँ कैसे करें?', o: ['Taskbar खींचकर', 'Personalization → Taskbar → Taskbar behaviors → alignment = Left', 'registry से drag', 'संभव नहीं'], a: 1, ex: 'Alignment = Left समर्थित सेटिंग है। आइकॉन का आकार छोटा करने का समर्थित विकल्प नहीं है।' },
      { q: 'Registry बदलने से पहले क्या करना चाहिए?', o: ['कुछ नहीं', 'File → Export से backup या restore point बनाना', 'PC बंद करना', 'एंटीवायरस हटाना'], a: 1, ex: 'ग़लत key हटाने से विंडोज़ boot होना बंद हो सकता है; backup अनिवार्य है।' },
      { q: 'Live captions (ऑडियो को पाठ में) का शॉर्टकट?', o: ['Win+Ctrl+L', 'Win+L', 'Win+C', 'Ctrl+L'], a: 0, ex: 'Win+Ctrl+L विंडोज़ 11 22H2+ में Live captions; भाषा पैक डाउनलोड करना पड़ सकता है।' }
    ]},

    { type: 'callout', kind: 'exam', title: 'परीक्षा/इंटरव्यू — विंडोज़ इंटरफ़ेस के पक्के शॉर्टकट', html: '<ul><li><b>Win+E</b> Explorer, <b>Win+I</b> Settings, <b>Win+R</b> Run, <b>Win+S/Q</b> Search, <b>Win+X</b> Power User मेन्यू।</li><li><b>Win+D</b> desktop (टॉगल), <b>Win+M</b> minimize (restore नहीं), <b>Win+L</b> lock, <b>Win+P</b> project मोड।</li><li><b>Win+Tab</b> Task View; <b>Win+Ctrl+D/←/→/F4</b> virtual desktop; <b>Alt+Tab</b> विंडोज़ बदलना।</li><li><b>Win+तीर</b> Snap, <b>Win+Z</b> Snap Layouts (11), <b>Win+Shift+तीर</b> दूसरा मॉनिटर।</li><li><b>Win+A</b> Quick Settings, <b>Win+N</b> Notifications (11), <b>Win+V</b> clipboard history, <b>Win+H</b> voice typing, <b>Win+.</b> emoji।</li><li><b>Win+Shift+S</b> snip, <b>Win+PrtScn</b> पूरा PNG, <b>Win+G</b> Game Bar/रिकॉर्डिंग।</li><li><b>Ctrl+Shift+Esc</b> Task Manager; <b>Win+Pause</b> System About; <b>Alt+Enter</b> Properties; <b>F2</b> Rename; <b>Shift+Delete</b> स्थायी मिटाना।</li><li>Accessibility: <b>Win+Ctrl+Enter</b> Narrator, <b>Win + +/−</b> Magnifier, <b>Win+Ctrl+L</b> Live captions, <b>Win+Ctrl+O</b> on-screen keyboard, <b>Win+Ctrl+C</b> color filters।</li><li>Run कमांड: <code>devmgmt.msc</code>, <code>diskmgmt.msc</code>, <code>services.msc</code>, <code>taskschd.msc</code>, <code>eventvwr.msc</code>, <code>msconfig</code>, <code>appwiz.cpl</code>, <code>ncpa.cpl</code>, <code>sysdm.cpl</code>, <code>cleanmgr</code>, <code>msinfo32</code>, <code>dxdiag</code>, <code>resmon</code>, <code>rstrui</code>, <code>regedit</code>, <code>gpedit.msc</code> (Pro+)।</li><li>Explorer address bar: <code>shell:startup</code>, <code>shell:sendto</code>, <code>%appdata%</code>, <code>%temp%</code>, <code>\\\\server\\share</code>।</li><li>Extension + Hidden items चालू रखें; Protected OS files छिपे रहने दें।</li></ul>'},

    { type: 'pills', items: [
      { text: 'Win+E · Win+I · Win+R · Win+X', kind: 'info' },
      { text: 'Extension हमेशा दिखाएँ', kind: 'warn' },
      { text: 'Win+Tab = Virtual Desktop', kind: 'tip' },
      { text: 'Win+Shift+S = स्क्रीनशॉट का हिस्सा', kind: 'ok' },
      { text: 'Ctrl+Shift+Esc = Task Manager', kind: 'info' },
      { text: 'Startup apps हल्के रखें', kind: 'tip' },
      { text: 'Registry से पहले Export', kind: 'danger' }
    ]},
  ]
}
]);
