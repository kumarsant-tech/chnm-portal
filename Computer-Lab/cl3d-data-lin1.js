/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-lin1.js
   लिनक्स मास्टरक्लास — भाग 1
     M47 : लिनक्स परिचय, डिस्ट्रो व फ़ाइल संरचना (lin-intro)
     M48 : लिनक्स टर्मिनल व कमांड रिफरेंस (lin-cli)
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   47. लिनक्स परिचय, डिस्ट्रो व फ़ाइल संरचना
   =================================================================== */
{
  id: 'lin-intro', icon: '🐧', group: 'लिनक्स मास्टरक्लास',
  title: 'लिनक्स परिचय, डिस्ट्रो व फ़ाइल संरचना',
  sub: 'इतिहास, kernel बनाम user space, boot क्रम और / directory का नक्शा',
  kicker: 'Linux Masterclass 1 · History, Distros & Filesystem Layout',
  hero: 'यह पेज लिनक्स की <b>नींव</b> है — kernel क्या है, डिस्ट्रो क्या, / के अंदर क्या रहता है, बूट कैसे होता है और फ़ाइलें कहाँ रखी जाती हैं। इसे पढ़ने के बाद कोई भी लिनक्स मशीन (सर्वर, राउटर, पेनड्राइव लाइव, Raspberry Pi) देखकर बता सकेंगे कि <b>कौन-सी डिस्ट्रो है, kernel कौन-सा, और फ़ाइल कहाँ मिलेगी</b>।',
  tags: ['इतिहास व GNU', 'कोर्क बनाम यूज़र स्पेस', 'डिस्ट्रो परिवार', 'बूट चेन व GRUB', 'FHS फ़ोल्डर नक्शा', 'फ़ाइल सिस्टम व लिंक'],
  blocks: [

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.1</span> लिनक्स क्या है — और क्या नहीं है</h3>
      <p>सख़्त अर्थ में <b>लिनक्स (Linux) केवल एक kernel है</b> — वह प्रोग्राम जो RAM में सबसे पहले बैठता है और हार्डवेयर पर सबसे ज़्यादा अधिकार रखता है। इसे 1991 में <b>Linus Torvalds</b> (तब 21 वर्ष, हेलसिंकी यूनिवर्सिटी का छात्र) ने लिखना शुरू किया। बोलचाल में "Linux" से पूरी <b>distribution (डिस्ट्रो)</b> समझी जाती है — यानी kernel + GNU टूल्स + पैकेज मैनेजर + डेस्कटॉप, जैसा कि Ubuntu, Debian, RHEL या Arch देते हैं।</p>
      <p>एक कमांड से यही फ़र्क़ दिख जाता है — <code>uname -a</code> kernel की लाइन दिखाता है (जैसे <code>Linux host 6.1.0-18-amd64 ...</code>), जबकि <code>cat /etc/os-release</code> डिस्ट्रो का नाम (Debian/Ubuntu) दिखाता है। kernel एक ही होता है, डिस्ट्रो सौ से ज़्यादा।</p>
      <h4 class="blk2">लिनक्स क्या नहीं है</h4>
      <ul>
        <li><b>UNIX नहीं:</b> UNIX एक ट्रेडमार्क है (The Open Group का) और उसका कोड लिनक्स में नहीं आया। लिनक्स UNIX-जैसा (Unix-like) है और <b>POSIX</b> नियमों का पालन करता है, बस।</li>
        <li><b>किसी कंपनी की संपत्ति नहीं:</b> "Linux" ट्रेडमार्क Linus Torvalds के नाम पर है, कोर्क GPLv2 लाइसेंस पर है, और इसे Red Hat, Intel, Novell व सैकड़ों स्वतंत्र डेवलपर मिलकर बनाते हैं — कोई "Linux Inc." नहीं है।</li>
        <li><b>सिर्फ़ "मुफ़्त सॉफ़्टवेयर" नहीं:</b> यहाँ free का मतलब <b>आज़ादी</b> (free speech) है, कीमत शून्य (free beer) नहीं। लिनक्स बेचा भी जाता है — RHEL, SLES, Oracle Linux।</li>
        <li><b>macOS/iOS नहीं:</b> Apple का Darwin/BSD-based XNU hybrid kernel है, लिनक्स kernel नहीं — इसलिए Mac पर लिनक्स वाले ड्राइवर/मॉड्यूल नहीं चलते।</li>
        <li><b>पूरा सिस्टम ख़ुद नहीं:</b> kernel अकेले कुछ नहीं दिखाता — शेल (shell), libc, ls/cp/grep जैसे टूल्स और ड्राइवर के बिना वह बेकार है; वे GNU व अन्य प्रोजेक्ट से आते हैं।</li>
      </ul>
      <h4 class="blk2">लिनक्स की चार स्तंभ — एक नज़र में</h4>
      <ul>
        <li>🐧 <b>कोर्क (kernel)</b> — 1991, Linus Torvalds; प्रोसेस, मेमोरी, डिवाइस, FS व नेटवर्क का मालिक; ring 0; GPLv2; मॉड्यूल <code>.ko</code> से बढ़ता है। जाँच: <code>uname -r</code>, <code>dmesg</code>।</li>
        <li>🛠️ <b>GNU टूल्स</b> — 1983 से Stallman का प्रोजेक्ट: bash, coreutils (ls/cp/rm), glibc, gcc, grep/sed/awk, GRUB, Emacs। यही user space की हड्डी है।</li>
        <li>📦 <b>डिस्ट्रो</b> — kernel + GNU टूल्स + पैकेज मैनेजर + डेस्कटॉप + इंस्टॉलर का तैयार पैकेज (Debian, Ubuntu, RHEL, Arch, Alpine, Kali); यही असल में आप इंस्टॉल करते हैं।</li>
        <li>🔓 <b>FOSS लाइसेंस</b> — GPL (copyleft: बदलाव भी खुला), MIT/Apache/BSD (permissive: बंद सॉफ़्टवेयर में भी), CC BY (दस्तावेज़)। इसी वजह से लिनक्स का कोड हर बार फिर मिल जाता है।</li>
      </ul>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.2</span> इतिहास: Multics (1965) से 1991 तक का सफ़र</h3>
      <p><b>1965 — Multics:</b> MIT + Bell Labs + General Electric का महत्वाकांक्षी ऑपरेटिंग सिस्टम (मल्टी-यूज़र, मल्टी-लेवल सुरक्षा)। जटिलता इतनी बढ़ी कि <b>1969 में Bell Labs ने प्रोजेक्ट छोड़ दिया</b>। यहीं से यूनीक्स का जन्म-बीज मिला।</p>
      <p><b>1969 — UNIX:</b> Bell Labs में <b>Ken Thompson</b> ने खाली पड़ी PDP-7 मशीन पर हफ़्तेभर में "Unics" लिखा (उसके बाद <b>Dennis Ritchie</b> जोड़े गए)। मज़ा यह है कि नाम "Unix" Multics के मज़ाकिया संक्षेप से बना।</p>
      <p><b>1971–1973 — C भाषा:</b> Ritchie ने C बनाई और 1973 में यूनीक्स को C में फिर से लिखा। इस एक कदम से ऑपरेटिंग सिस्टम <b>portable</b> हो गया — पहली बार OS को नए हार्डवेयर पर "re-type" किए बिना चलाया जा सका। लिनक्स भी आज C में है (कुछ architecture कोड assembly में, Rust सपोर्ट 6.x से आया)।</p>
      <p><b>1974–1978 — Berkeley BSD:</b> यूनिवर्सिटी ऑफ़ कैलिफ़ोर्निया बर्कले को यूनीक्स का सोर्स license मिला; वहाँ <b>Bill Joy</b> ने vi, csh और बाद में TCP/IP स्टैक बनाकर <b>BSD</b> जारी किया। यही सोर्स बाद में macOS/iOS, FreeBSD, NetBSD का आधार बना।</p>
      <p><b>1979–1983 — बिक्री वाला UNIX:</b> AT&T ने UNIX को व्यापारिक बनाया (System V, 1983) और सोर्स बंद कर दिया → "UNIX wars" (SunOS/Solaris, HP-UX, AIX, IRIX)। सार्वजनिक/मुफ़्त UNIX कोड का रास्ता बंद — यही रिक्तता लिनक्स ने भर दी।</p>
      <p><b>1987 — MINIX:</b> प्रोफ़ेसर <b>Andrew Tanenbaum</b> ने पढ़ाने के लिए छोटा Unix-jैसा OS + किताब लिखा, जो 386 PC पर चलता था। इसी पर बैठकर Torvalds ने अपना OS शुरू किया (मूल मशीन पर MINIX चला रहा था)।</p>
      <p><b>25 अगस्त 1991 — घोषणा:</b> comp.os.minix न्यूज़ग्रुप पर Torvalds ने लिखा कि वह एक "(फ़्री) ऑपरेटिंग सिस्टम (just a hobby, won’t be big and professional like gnu)" बना रहा है। 5 अक्टूबर 1991 को <b>Linux 0.02</b> जारी हुआ, <b>1992 में 0.12 से कोर्क GPLv2 के तहत</b> आया, और <b>मार्च 1994 में Linux 1.0</b> — तब इसमें 386/486 सपोर्ट, minix/ext filesystem, networking था।</p>
      <p><b>1992 का बहस:</b> Tanenbaum ने "लिनक्स पुराना (monolithic) डिज़ाइन है" कहा; Torvalds ने जवाब दिया — यही व्यावहारिकता है। आज भी लिनक्स monolithic (modules के साथ) है, मिक्रो-कर्नेल नहीं।</p>
      <table class="tbl">
        <tr><th>साल</th><th>घटना</th><th>लिनक्स से सीधा संबंध</th></tr>
        <tr><td>1965</td><td>Multics शुरू (MIT + Bell Labs + GE)</td><td>यूनीक्स की प्रेरणा; 1969 में Bell Labs ने छोड़ा</td></tr>
        <tr><td>1969</td><td>यूनीक्स — Ken Thompson, PDP-7 पर</td><td>सारा Unix-jैसा परिवार यहीं से</td></tr>
        <tr><td>1971–73</td><td>Dennis Ritchie C बनाते हैं, UNIX C में फिर से</td><td>portable OS; लिनक्स भी C में</td></tr>
        <tr><td>1977</td><td>BSD (UC Berkeley, Bill Joy)</td><td>vi, csh, TCP/IP स्टैक; macOS/FreeBSD का पूर्वज</td></tr>
        <tr><td>1979–83</td><td>AT&T commercial UNIX (System V)</td><td>सोर्स बंद → फ़्री UNIX की जगह खाली</td></tr>
        <tr><td>1983</td><td>Richard Stallman GNU की घोषणा</td><td>लिनक्स के टूल्स, लाइब्रेरी व शेल</td></tr>
        <tr><td>1985</td><td>Free Software Foundation (FSF) + Emacs GPL</td><td>1989 में GPL v1, 1991 में GPL v2</td></tr>
        <tr><td>1987</td><td>MINIX (Tanenbaum)</td><td>Torvalds की पहली सीख, पहली होस्ट OS</td></tr>
        <tr><td>1988</td><td>POSIX (IEEE 1003)</td><td>लिनक्स को Unix-jैसा मानदंड मिला</td></tr>
        <tr><td>1990</td><td>GNU Hurd (microkernel) अधूरा</td><td>GNU को kernel चाहिए था → लिनक्स मिला</td></tr>
        <tr><td>1991</td><td>Linux 0.01–0.02 (अगस्त/अक्टूबर)</td><td>कोर्क का जन्म, 386 पर</td></tr>
        <tr><td>1992</td><td>0.12 GPLv2 + X11 पोर्ट + ext FS</td><td>आज़ादी का क़ानूनी आधार</td></tr>
        <tr><td>1993</td><td>Debian (Ian Murdock) + Slackware</td><td>पहली सच्ची "डिस्ट्रो" परंपरा</td></tr>
        <tr><td>1994</td><td>Linux 1.0 (मार्च)</td><td>उपयोग-योग्य कोर्क</td></tr>
        <tr><td>1995–96</td><td>Red Hat (1995), SUSE (1994); Tux लॉगो (1996)</td><td>व्यापारिक लिनक्स + पहचान</td></tr>
        <tr><td>1998</td><td>"Open Source" शब्द (OSI) + Apache/PHP/MySQL</td><td>ओपन-सोर्स भाषाएँ और LAMP सर्वर का उदय</td></tr>
        <tr><td>2008</td><td>Android 1.0 (लिनक्स kernel 2.6)</td><td>लिनक्स का सबसे बड़ा install base</td></tr>
        <tr><td>2011</td><td>systemd (Fedora 15/Ubuntu 12.04) + Linux 3.0</td><td>आधुनिक init व वर्ज़न संख्या बदली</td></tr>
      </table>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.3</span> GNU, FSF, POSIX और "GNU/Linux" का नाम-विवाद</h3>
      <p><b>GNU = "GNU's Not Unix"</b> (recursive acronym) — 1983 में Stallman ने घोषणा की कि एक पूरी तरह स्वतंत्र Unix-jैसि सिस्टम बनाया जाएगा। 1985 में <b>FSF</b> (Free Software Foundation) और 1989 में <b>GPL</b> लाइसेंस। GNU ने दिए: <code>gcc</code> (कंपाइलर), <code>bash</code> (शेल), <code>coreutils</code> (ls/cp/mv/rm/cat), <code>glibc</code> (C लाइब्रेरी), <code>grep/sed/awk/gawk</code>, <code>make</code>, <code>tar</code>, <code>GRUB</code> (बूट लोडर), <code>Emacs</code>।</p>
      <p>GNU का अपना kernel (<b>Hurd</b>, microkernel) 1990 से अधूरा रह गया। 1991–92 में लिनक्स kernel मिला और GNU टूल्स + Linux kernel = चलने योग्य सिस्टम। FSF ने कहा इसे <b>"GNU/Linux"</b> बुलाओ; Torvalds ने इनकार किया और आम बोलचाल में "Linux" ही रहा। परीक्षा/इंटरव्यू में दोनों जवाब स्वीकार्य हैं — बस यह तर्क आना चाहिए कि <b>kernel = Linux, बाक़ी उपयोगी हिस्सा बड़ी हद तक GNU</b>।</p>
      <p><b>POSIX (IEEE 1003) / Single UNIX Specification:</b> वह मानक जो तय करता है कि <code>ls -l</code>, pipes, fork/exec, pthreads, regex हर Unix-jैसे OS में एक जैसे चलें। लिनक्स POSIX-अनुरूपी है — इसीलिए macOS (.certified UNIX) से लिखा shell script ज़्यादातर लिनक्स पर चल जाता है। मानक जाँचने के लिए: <code>getconf _POSIX_VERSION</code>।</p>
      <p><b>Free vs Open Source:</b> FSF का "free software" = 4 आज़ादियाँ (चलाने, अध्ययन, बदलने, बाँटने की) — नैतिक भाषा। OSI का "open source" (1998) = व्यावहारिक/बाज़ार भाषा, "सोर्स खुला है इसलिए बेहतर"। तकनीकी रूप से लगभग एक ही कोड; सोच का फ़र्क़।</p>
      <h4 class="blk2">Android लिनक्स-आधारित है, मगर GNU/Linux डिस्ट्रो नहीं</h4>
      <p>Android एक <b>संशोधित Linux kernel</b> चलाता है, पर बाक़ी सब अलग है: C लाइब्रेरी <b>Bionic</b> (glibc नहीं), init <b>Android के अपना</b> (systemd नहीं), UI <b>SurfaceFlinger</b> (X11/Wayland नहीं), रनटाइम <b>ART/Dalvik</b> (Java apps), shell बहुत सीमित (<code>mksh</code> +toybox) और कोई पैकेज मैनेजर नहीं (Play Store)। इसीलिए फ़ोन पर <code>apt</code> या <code>/etc/passwd</code> वाला लिनक्स नहीं मिलता। ChromeOS (Gentoo-आधारित), राउटर का OpenWrt (kernel + BusyBox/uClibc), Raspberry Pi OS, लगभग हर NAS/स्मार्ट TV — ये सब "लिनक्स kernel पर" हैं, पर अलग-अलग डिग्री तक GNU उपयोग करते हैं।</p>
      <table class="tbl">
        <tr><th>लाइसेंस</th><th>प्रकार</th><th>बदला सोर्स देना ज़रूरी?</th><th>बंद (proprietary) सॉफ़्टवेयर में उपयोग</th><th>कहाँ दिखता है</th></tr>
        <tr><td>GPL v2</td><td>copyleft</td><td>हाँ (वितरण पर)</td><td>लिंक नहीं कर सकते</td><td>Linux kernel, GPLv2-only सॉफ़्टवेयर</td></tr>
        <tr><td>GPL v3</td><td>copyleft + anti-Tivoization</td><td>हाँ + बदलने के की/सोर्स</td><td>नहीं</td><td>bash, glibc, GRUB 2</td></tr>
        <tr><td>LGPL v2.1/v3</td><td>weak copyleft</td><td>लाइब्रेरी बदली तो</td><td>हाँ, dynamic link से</td><td>glibc, Qt (आंशिक), FFmpeg libraries</td></tr>
        <tr><td>MIT</td><td>permissive</td><td>नहीं</td><td>हाँ</td><td>Node/JS प्रोजेक्ट, हज़ारों छोटे पैकेज</td></tr>
        <tr><td>Apache-2.0</td><td>permissive + पेटेंट छूट</td><td>नहीं (NOTICE रखें)</td><td>हाँ</td><td>Android का ज़्यादातर user space, Kubernetes</td></tr>
        <tr><td>BSD-2/3-Clause</td><td>permissive</td><td>नहीं</td><td>हाँ</td><td>FreeBSD/NetBSD, X11, nhiều टूल्स</td></tr>
        <tr><td>MPL-2.0</td><td>फ़ाइल-स्तरीय copyleft</td><td>बदली फ़ाइलें हाँ</td><td>मिलकर चल सकता है</td><td>Mozilla/Firefox, LibreOffice का कुछ</td></tr>
        <tr><td>AGPL v3</td><td>स्ट्रॉन्ग copyleft (सर्वर भी)</td><td>हाँ, SaaS पर भी</td><td>नहीं</td><td>MinIO, कुछ वेब ऐप्स</td></tr>
        <tr><td>CC BY / CC0 / CC BY-SA</td><td>कंटेंट (कोड के लिए नहीं)</td><td>साइटेशन/same-share</td><td>लाइसेंस के अनुसार</td><td>दस्तावेज़, वॉलपेपर, ट्यूटोरियल</td></tr>
      </table>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.4</span> ऑपरेटिंग सिस्टम करती क्या है — kernel का हिस्सा</h3>
      <p>kernel RAM में रहता है, CPU का <b>सर्वाधिकार वाली परत (ring 0)</b> चलाता है और हार्डवेयर से सीधे बात करता है। कोई साधारण प्रोग्राम डिस्क/नेटवर्क/स्क्रीन को छू नहीं सकता — उसे <b>syscall</b> भेजना पड़ता है, और kernel तय करता है कि अनुमति है या नहीं। लिनक्स में हर चीज़ इसी पाँच काम के चारों ओर घूमती है:</p>
      <table class="tbl">
        <tr><th>कोर्क का हिस्सा</th><th>क्या करता है</th><th>जाँचने/छूने का तरीक़ा</th></tr>
        <tr><td>प्रोसेस शेड्यूलर (Process scheduler)</td><td>कई सौ प्रोसेस को few millisecond के स्लॉट बाँटकर CPU देना; priority, cgroups (CPU bandwidth सीमा)</td><td><code>ps aux</code>, <code>top</code>, <code>nice -n 10 cmd</code>, <code>/proc/&lt;PID&gt;/sched</code></td></tr>
        <tr><td>मेमोरी मैनेजमेंट</td><td>हर प्रोसेस को अपना virtual पता-स्थान, paging/swapping, OOM killer, cache/buffers</td><td><code>free -h</code>, <code>cat /proc/meminfo</code>, <code>swapon --show</code>, <code>sysctl vm.swappiness</code></td></tr>
        <tr><td>VFS + फ़ाइल सिस्टम</td><td>एक जैसा API हर FS पर (ext4/xfs/btrfs/vfat/nfs) — open/read/write/rename</td><td><code>df -T</code>, <code>cat /proc/mounts</code>, <code>stat file</code></td></tr>
        <tr><td>डिवाइस ड्राइवर + block layer</td><td>NVMe/SATA/USB/GPU/keyboard, I/O scheduler, partition scanning</td><td><code>lsusb</code>, <code>lspci -nnk</code>, <code>lsblk</code>, <code>dmesg | tail</code></td></tr>
        <tr><td>नेटवर्क स्टैक</td><td>TCP/IP, routing, firewall (netfilter/nftables), ब्रिज/VLAN, Wi-Fi</td><td><code>ip a</code>, <code>ss -tunap</code>, <code>nft list ruleset</code></td></tr>
        <tr><td>IPC व सिस्टम कॉल</td><td>pipe, socket, signal, shared memory, futex; POSIX API</td><td><code>strace -f ls</code>, <code>ls -l /proc/self/fd</code></td></tr>
        <tr><td>सुरक्षा परत</td><td>uid/gid मॉडल, file permissions, namespaces + cgroups (container आधार), SELinux/AppArmor, capabilities</td><td><code>id</code>, <code>getenforce</code>, <code>aa-status</code>, <code>unshare --user</code></td></tr>
      </table>
      <p>नोट करें: <b>container (Docker/Podman/LXC) कोई जादू नहीं</b> — kernel के namespaces + cgroups + एक filesystem छवि (image) का मेल है। इसीलिए लिनक्स पर container मूल (native) चलते हैं और विंडोज़ पर Hyper-V लेयर चाहिए।</p>
      <h4 class="blk2">kernel के बाहर — user space की परतें</h4>
      <p>जो चीज़ें आप देखते-छूते हैं, वे सब <b>user space</b> में हैं (ring 3, कम अधिकार)। हर परत अलग प्रोजेक्ट है और डिस्ट्रो बस इनको मिलाकर पैकेज बनाती है। सर्वर इंस्टॉल में इनमें से ऊपर वाली तीन परतें नहीं होतीं — इसीलिए सर्वर कम RAM खाते हैं और पुराने PC पर डेस्कटॉप भारी लगता है।</p>
      <table class="tbl">
        <tr><th>परत</th><th>काम</th><th>पहचानने का तरीक़ा</th></tr>
        <tr><td>शेल (bash/zsh/fish)</td><td>टाइप की कमांड पढ़ना, wildcard खोलना, पाइप लगाना, स्क्रिप्ट चलाना — यह kernel नहीं, एक साधारण प्रोग्राम है</td><td><code>echo $SHELL</code>, <code>cat /etc/shells</code>, <code>ps -p $$</code></td></tr>
        <tr><td>init / systemd (PID 1)</td><td>बूट के बाद सबसे पहला प्रोसेस; सर्विस, माउंट, टाइमर, लॉग, यूज़र-लॉगिन सँभालता है</td><td><code>ps -p 1</code>, <code>systemctl get-default</code></td></tr>
        <tr><td>C लाइब्रेरी (glibc / musl)</td><td>हर ऐप ↔ syscall के बीच का पुल — malloc, printf, open, pthread</td><td><code>ldd /bin/ls</code>, <code>ldd --version</code>, <code>cat /etc/os-release</code> (Alpine = musl)</td></tr>
        <tr><td>विंडोइंग सिस्टम (X11 / Wayland)</td><td>स्क्रीन पर ड्रॉइंग, कीबोर्ड-माउस इनपुट, विंडो मैनेजर</td><td><code>echo $XDG_SESSION_TYPE</code>, <code>loginctl show-session $(loginctl | awk '/$(whoami)/{print $1;exit}') -p Type</code></td></tr>
        <tr><td>डेस्कटॉप एनवायरनमेंट</td><td>पैनल, फ़ाइल मैनेजर, सेटिंग्स, नोटिफ़िकेशन — GNOME/KDE/Xfce…</td><td><code>echo $XDG_CURRENT_DESKTOP</code></td></tr>
        <tr><td>ऐप्स व यूटिलिटीज़</td><td>Firefox, LibreOffice, VLC, coreutils, network-tools</td><td><code>apt list --installed | head</code>, <code>rpm -qa | head</code></td></tr>
        <tr><td>पैकेज मैनेजर</td><td>इंस्टॉल/अपडेट/डिपेंडेंसी/रिमूवल + रिकॉर्ड रखना</td><td><code>apt --version</code>, <code>dnf --version</code>, <code>pacman -Q</code></td></tr>
      </table>
      <h4 class="blk2">कोर्क का डिज़ाइन: monolithic बनाम microkernel</h4>
      <p>1991-92 की बहस का सार। लिनक्स <b>monolithic</b> है — ड्राइवर समेत ज़्यादातर कुछ kernel स्पेस में, इसलिए तेज़ (syscall/copy कम) मगर एक ख़राब ड्राइवर पूरे सिस्टम को गिरा सकता है (kernel panic)। इसे संतुलित करने के लिए लिनक्स में <b>loadable kernel modules (.ko)</b> हैं — ड्राइवर माउंट/अनमाउंट हो सकते हैं बिना रीबूट के।</p>
      <table class="tbl">
        <tr><th>डिज़ाइन</th><th>कहाँ क्या चलता है</th><th>फ़ायदा / जोखिम</th><th>उदाहरण</th></tr>
        <tr><td>Monolithic</td><td>शेडेूलर + मेमोरी + सारे ड्राइवर + FS एक ही पते-स्थान में</td><td>तेज़, कम ओवरहेड; ड्राइवर fault = पूरा OS गिरता है</td><td>Linux, classic UNIX, FreeBSD</td></tr>
        <tr><td>Microkernel</td><td>kernel में सिर्फ़ IPC + बेसिक शेड्यूलिंग; ड्राइवर/FS user space में</td><td>एक सर्विस मरे तो OS बचा रहे, realtime/सुरक्षा; IPC के कारण स्लो</td><td>MINIX 3, QNX, GNU Hurd, seL4</td></tr>
        <tr><td>Hybrid</td><td>microkernel के ऊपर बड़े सर्वर्स kernel में</td><td>संतुलन — व्यावहारिक रूप से monolithic जैसा</td><td>Windows NT (XNU/Darwin भी hybrid: Mach + BSD + IOKit)</td></tr>
        <tr><td>Monolithic + modules</td><td>एक कोर्क, पर ड्राइवर .ko मॉड्यूल के रूप में माउंट होते हैं</td><td>लिनक्स का असली उत्तर — तेज़ + लचीला</td><td>Linux, BSD (kld modules)</td></tr>
      </table>
      <h4 class="blk2">kernel वर्ज़न नंबर कैसे पढ़ें</h4>
      <p>पुरानी परंपरा (4.0 से पहले): <b>X = major, Y = minor, Z = patch</b> — और <b>Y सम (even) = stable, Y विषम (odd) = development/testing</b>। इसलिए 2.4 और 2.6 स्थिर थे, 2.5 सिर्फ़ डेवलपमेंट था (कभी रिलीज़ नहीं हुआ — 2.5 का काम 2.6 में चला गया)। 3.0 2011 में केवल संख्या-बढ़ोत्री था, नया डिज़ाइन नहीं। <b>अप्रैल 2016 को Linux 4.0</b> से यह सम-विषम नियम हट गया; अब X.major, Y.major-revision, Z = stable point। आज LTS (Long Term Support) कोर्क कई साल सुरक्षा पैच पाते हैं — मिसाल के तौर पर <b>5.15 LTS, 6.1 LTS, 6.6 LTS</b>; Debian/Ubuntu/RHEL अपने रिलीज़ में इन्हीं पर आधारित kernel लेते हैं और <b>backporting</b> से पुरानी लाइन पर भी सुरक्षा पैच लगाते हैं — इसीलिए <code>uname -r</code> में kernel पुराना दिखते भी सिस्टम अपडेटेड हो सकता है। Rolling डिस्ट्रो (Arch, openSUSE Tumbleweed) नया mainline kernel जल्दी देती हैं।</p>` },

    { type: 'code', code: `# ---- kernel व मॉड्यूल की पहचान ----
uname -a                      # hostname + kernel वर्ज़न + arch + build
uname -r                      # सिर्फ़ kernel रिलीज़ (जैसे 6.1.0-18-amd64)
uname -m                      # arch: x86_64 / aarch64 / armv7l
cat /proc/version             # kernel + gcc वर्ज़न एक लाइन में
ls /boot                      # vmlinuz-* (kernel) और initrd.img-*

# ---- लोडेड मॉड्यूल (.ko) ----
lsmod | head -20              # चालू मॉड्यूल, use count, निर्भरता
lsmod | grep -i e1000         # नेट ड्राइवर मौजूद?
modinfo nvme                  # मॉड्यूल का विवरण, पैरामीटर, फ़ाइल पथ
sudo modprobe i2c-dev         # निर्भरता समेत लोड (सही तरीक़ा)
sudo modprobe -r i2c-dev      # हटाना
sudo insmod ./hello.ko        # स्थानीय .ko फ़ाइल सीधे लोड (बिना निर्भरता)
sudo rmmod hello              # सीधे हटाना
ls /lib/modules/$(uname -r)/   # सभी उपलब्ध मॉड्यूल यहाँ
sudo depmod -a                 # modules.dep बनाना/बनाना-नवीनीकरण
echo 'options snd-intel-hda power_save=1' | sudo tee /etc/modprobe.d/local.conf
echo 'blacklist nouveau' | sudo tee -a /etc/modprobe.d/blacklist.conf
sudo update-initramfs -u      # (Debian/Ubuntu) initramfs बनाना-नवीनीकरण
sudo dracut -f                # (RHEL/Fedora) initramfs बनाना-नवीनीकरण

# ---- pseudo-filesystem्स (ये डिस्क पर नहीं, RAM में बनती हैं) ----
cat /proc/cpuinfo             # कोर, मॉडल, flags
cat /proc/meminfo             # RAM, cache, swap पूरा ब्योरा
cat /proc/mounts              # kernel का असली माउंट टेबल
cat /proc/cmdline             # बूट के वक़्त kernel को दिए गए पैरामीटर
cat /proc/uptime              # चालू समय + idle समय
sudo ls /sys/class/net        # नेटवर्क इंटरफ़ेस; /sys/class/block = डिस्क
cat /sys/block/sda/queue/scheduler   # I/O scheduler
sudo dmesg -T | tail -40      # बूट कर्नेल लॉग, पढ़ने-योग्य समय के साथ
sudo dmesg -l warn,err        # सिर्फ़ चेतावनी/त्रुटि
watch -n2 'cat /proc/loadavg' # हर 2 सेकंड लोड देखना` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.6</span> डिस्ट्रो परिवार: एक kernel, सौ चेहरे</h3>
      <p>डिस्ट्रो चुनने का मतलब kernel चुनना नहीं — मतलब चुनना है <b>पैकेज मैनेजर</b> (apt/dnf/pacman/apk), <b>रिलीज़ मॉडल</b> (fixed / LTS / rolling), <b>सपोर्ट अवधि</b>, <b>डेस्कटॉप</b> और <b>कम्युनिटी बनाम कॉर्पोरेट मदद</b>। तीन बड़े वंश हैं:</p>
      <ul>
        <li><b>Debian वंश (.deb, dpkg/apt):</b> Debian → Ubuntu → Mint, Pop!_OS, Kali, Parrot, Zorin, elementary, Tails। स्थिर, बड़ा रिपोसिटरी, <code>apt</code>।</li>
        <li><b>Red Hat वंश (.rpm, rpm/yum/dnf):</b> Fedora (upstream) → RHEL (व्यापारिक) → CentOS Stream (midstream) → AlmaLinux/Rocky/Oracle (rebuild)। सर्वर जगत की lingua franca, <code>SELinux</code> डिफ़ॉल्ट ऑन, <code>firewalld</code>।</li>
        <li><b>Arch वंश (.pkg.tar.zst, pacman):</b> Arch → Manjaro/Endeavour/CachyOS। rolling, DIY, <b>Arch Wiki</b> (सबसे अच्छा दस्तावेज़), <code>AUR</code> (सैकड़ों हज़ार community पैकेज)।</li>
        <li>अलग-अलग: <b>SUSE</b> (openSUSE Leap/Tumbleweed, <code>zypper</code> + YaST), <b>Alpine</b> (musl+BusyBox+OpenRC, ~5 MB container image), <b>Gentoo</b> (source-based, <code>emerge</code>), <b>Solus</b> (independent, <code>eopkg</code>, Budgie का घर), <b>Clear Linux</b> (Intel, performance)।</li>
      </ul>
      <p>अपनी मशीन पर डिस्ट्रो पहचानने के तीन आदेश: <code>cat /etc/os-release</code> (मानक, हर जगह), <code>hostnamectl</code> (OS + kernel), <code>lsb_release -a</code> (Debian/Ubuntu टूल)। पैकेज परिवार से शक़ तय होता है — <code>which apt dnf pacman zypper apk</code>।</p>
      <table class="tbl">
        <tr><th>डिस्ट्रो</th><th>आधार (base)</th><th>पैकेज / init</th><th>रिलीज़ मॉडल</th><th>डिफ़ॉल्ट डेस्कटॉप</th><th>सबसे अच्छा उपयोग</th></tr>
        <tr><td>Debian Stable</td><td>स्वतंत्र (1993)</td><td>.deb · apt / systemd</td><td>Fixed (~2 वर्ष, 5+ वर्ष सपोर्ट)</td><td>GNOME</td><td>सर्वर, पुराना/स्थिर PC, "सेट करके भूल जाएँ"</td></tr>
        <tr><td>Ubuntu LTS</td><td>Debian</td><td>.deb · apt / systemd</td><td>Fixed; LTS हर 2 वर्ष, 5 वर्ष + Pro 12 वर्ष</td><td>GNOME (Dock)</td><td>डेस्कटॉप, लैब, डेवलपमेंट, AI/ML वर्कस्टेशन</td></tr>
        <tr><td>Ubuntu (छोटे रिलीज़)</td><td>Debian</td><td>.deb · apt / systemd</td><td>हर 6 माह, 9 माह सपोर्ट</td><td>GNOME</td><td>नया hardware/करनेल जल्दी चाहिए</td></tr>
        <tr><td>Linux Mint</td><td>Ubuntu LTS (LMDE = Debian)</td><td>.deb · apt / systemd</td><td>Fixed</td><td>Cinnamon / Xfce / MATE</td><td>विंडोज़ से पलटने वाले नए यूज़र, स्कूल लैब</td></tr>
        <tr><td>Pop!_OS</td><td>Ubuntu LTS</td><td>.deb · apt + Flatpak / systemd</td><td>Fixed</td><td>GNOME (tiling)</td><td>गेमिंग/NVIDIA ड्राइवर वाला ISO, डेवलपर लैपटॉप</td></tr>
        <tr><td>Kali Linux</td><td>Debian Testing</td><td>.deb · apt / systemd</td><td>Rolling (quarterly images)</td><td>Xfce</td><td>पेन-टेस्टिंग/सिक्योरिटी रिसर्च (सिर्फ़ अनुमतिप्राप्त उपयोग में)</td></tr>
        <tr><td>Parrot OS</td><td>Debian Testing/Stable</td><td>.deb · apt / systemd</td><td>Rolling + Stable</td><td>MATE (KDE विकल्प)</td><td>सिक्योरिटी + रोज़मर्रा हल्का सिस्टम</td></tr>
        <tr><td>Ubuntu Server / Cloud</td><td>Ubuntu</td><td>.deb · apt / systemd</td><td>LTS</td><td>कोई नहीं (text + SSH)</td><td>वेब/Docker सर्वर, cloud VM</td></tr>
        <tr><td>Red Hat Enterprise Linux (RHEL)</td><td>स्वतंत्र (Fedora upstream)</td><td>.rpm · dnf / systemd</td><td>Fixed, 10 वर्ष lifecycle</td><td>GNOME</td><td>कॉर्पोरेट सर्वर, certified ऐप (Oracle/SAP)</td></tr>
        <tr><td>CentOS Stream</td><td>RHEL से आगे (midstream)</td><td>.rpm · dnf / systemd</td><td>Rolling-अगले RHEL की प्रयोगशाला</td><td>GNOME</td><td>RHEL से पहले पैच टेस्ट करना</td></tr>
        <tr><td>AlmaLinux / Rocky Linux</td><td>RHEL rebuild</td><td>.rpm · dnf / systemd</td><td>Fixed, RHEL जितना lifecycle</td><td>GNOME</td><td>मुफ़्त RHEL-जैसा सर्वर (पुरानी CentOS का उत्तर)</td></tr>
        <tr><td>Fedora Workstation</td><td>स्वतंत्र (RHEL का upstream)</td><td>.rpm · dnf + rpm-ostree (Silverblue) / systemd</td><td>~6 माह रिलीज़, 13 माह सपोर्ट</td><td>GNOME</td><td>डेवलपर, नवीनतम kernel/तकनीक सीखना</td></tr>
        <tr><td>openSUSE Leap</td><td>SLES कोड (RHEL-वंश नहीं)</td><td>.rpm · zypper / systemd</td><td>Fixed, लंबा सपोर्ट</td><td>GNOME/KDE</td><td>सर्वर + YaST से GUI सेटिंग</td></tr>
        <tr><td>openSUSE Tumbleweed</td><td>स्वतंत्र rolling</td><td>.rpm · zypper / systemd</td><td>Rolling (snapshot + OpenQA टेस्ट)</td><td>KDE/GNOME</td><td>rolling चाहिए पर परीक्षित पैकेज</td></tr>
        <tr><td>Arch Linux</td><td>स्वतंत्र</td><td>.pkg.tar.zst · pacman / systemd</td><td>Rolling</td><td>कोई (यूज़र चुनता है)</td><td>सीखने/नियंत्रण चाहने वाले, गेमिंग, पर्सनलाइज़ेशन</td></tr>
        <tr><td>Manjaro / EndeavourOS</td><td>Arch</td><td>pacman (+Pamac GUI) / systemd</td><td>Rolling (~2 सप्ताह देरी वाली stable snapshot)</td><td>Xfce/KDE/GNOME</td><td>Arch की ताक़त, आसान इंस्टॉलर</td></tr>
        <tr><td>Gentoo / Alpine</td><td>स्वतंत्र</td><td>Portage (<code>emerge</code>) / OpenRC — और apk / OpenRC</td><td>Rolling / Fixed+rolling</td><td>कोई / कोई</td><td>Gentoo = हर फ़ीचर खुद compile; Alpine = container, राउटर, पुराना/छोटा hardware</td></tr>
        <tr><td>Solus</td><td>स्वतंत्र (2015)</td><td>.rpm (eopkg) / systemd</td><td>Rolling (curated)</td><td>Budgie</td><td>साफ़ डेस्कटॉप, नया kernel जल्दी</td></tr>
        <tr><td>TUXEDO OS / Zorin / elementary OS</td><td>Ubuntu LTS</td><td>.deb · apt / systemd</td><td>Fixed</td><td>KDE / Xfce+GNOME / Pantheon</td><td>लैपटॉप ब्रांड, विंडोज़-जैसा, macOS-जैसा सरल</td></tr>
        <tr><td>Raspberry Pi OS</td><td>Debian</td><td>.deb · apt / systemd</td><td>Fixed (Bullseye/Bookworm लाइनों पर)</td><td>मुफ़्त LXDE/LabWC, Pixel</td><td>single-board, सीखना, IoT/मीडिया सेंटर</td></tr>
      </table>
      <h4 class="blk2">कॉर्पोरेट सपोर्ट — यहीं परीक्षा/इंटरव्यू का सवाल है</h4>
      <p><b>RHEL</b> ख़रीदा जाता है (subscription) — <code>subscription-manager register</code> के बाद ही रिपोसिटरी खुलती हैं; मुफ़्त <b>Developer subscription</b> में 16 सिस्टम तक मिलते हैं। <b>SLES</b> भी subscription-आधारित (YaST + live patching)। <b>Ubuntu Pro (ESM)</b> निजी उपयोग हेतु 5 मशीन तक मुफ़्त, आगे भुगतान पर। <b>Alma/Rocky</b> RHEL के binary-compatible rebuild हैं — सपोर्ट अनुबंध नहीं, इसलिए सस्ता सर्वर। <b>Debian</b> पूरी तरह कम्युनिटी — कोई vendor SLA नहीं, मगर security team पैच देती है। Certification (app/hardware) सिर्फ़ RHEL/SLES/Ubuntu LTS जैसी commercial लाइनों पर मिलता है — इसीलिए बैंक/सरकारी डेटा सेंटर में वही दिखते हैं।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.7</span> डेस्कटॉप एनवायरनमेंट (DE): एक ही डिस्ट्रो, दूसरा चेहरा</h3>
      <p>DE = विंडो मैनेजर + पैनल + फ़ाइल मैनेजर + सेटिंग्स + थीम का पूरा सेट। यह kernel से नहीं, user space से जुड़ा है — इसीलिए Ubuntu पर KDE, Fedora पर Xfce चला सकते हैं (<code>sudo apt install kde-plasma-desktop</code> / <code>sudo dnf groupinstall "Xfce Desktop"</code>)। दो बड़े टूलकिट हैं: <b>GTK</b> (GNOME, Xfce, Cinnamon, MATE, Pantheon, Budgie) और <b>Qt</b> (KDE Plasma, LXQt, deepin DDE)।</p>
      <p>नीचे <b>विंडोइंग सिस्टम</b> है: पुराना <b>X11 (Xorg)</b> — 1987 का डिज़ाइन, नेटवर्क-फ़ॉर्म, हर ड्राइवर/टूल सपोर्ट; आधुनिक <b>Wayland</b> — compositor सीधे ड्रॉइंग करता है, सुरक्षित (एक ऐप दूसरे की keysboard नहीं चुरा सकता), tearing नहीं; नVIDIA व कुछ स्क्रीन-रिकॉर्डिंग/डिजिटल पेपर के मामले में अब बहुत बेहतर। पहचानें: <code>echo $XDG_SESSION_TYPE</code>। लॉगिन स्क्रीन वाला प्रोग्राम <b>display manager</b> कहलाता है — GNOME के साथ <b>GDM</b>, KDE के साथ <b>SDDM</b>, Mint/Lubuntu के साथ <b>LightDM</b>।</p>
      <h4 class="blk2">कॉलेज लैब और पुराने Pentium के लिए सुझाव</h4>
      <ul>
        <li><b>20–40 छात्रों की लैब (4 GB RAM, i3/i5):</b> <b>Xfce या MATE</b> — क्लासिक मेनू, विंडोज़-जैसा अभ्यास, कम RAM, दस साल से स्थिर, लॉक-डाउन आसान (Whisker menu + LightDM)। सरलता + शिक्षक के लिए भविष्य-योग्यता चाहिए तो Linux Mint Cinnamon या Zorin।</li>
        <li><b>पुराना Pentium 4 / 2 GB RAM / HDD:</b> <b>LXQt</b> या Xfce + compositor बंद; इससे भी हल्का — <b>i3/Openbox/Labwc</b> जैसा window manager, या विशेष डिस्ट्रो (antiX, Bunsenlabs, Puppy)। GNOME 40+ यहाँ ठीक नहीं चलेगा।</li>
        <li><b>नया laptop (16 GB, SSD, Wayland):</b> GNOME (टचपैड जेस्चर, हाई-DPI) या KDE Plasma (सर्वोत्तम कस्टमाइज़ेशन)।</li>
        <li><b>टचस्क्रीन/2-इन-1:</b> GNOME (सबसे अच्छा scaling) ; KDE Plasma भी अच्छा।</li>
      </ul>` },

    { type: 'table', head: ['डेस्कटॉप', 'टूलकिट / compositor', 'खाली बैठे RAM (अनुमानित)', 'CPU/GPU भार', 'लुक फ़ील', 'कस्टमाइज़ेशन', 'किसके लिए बेस्ट'],
      rows: [
        ['GNOME 40+', 'GTK4 + libadwaita, Mutter (X11 व Wayland)', '~1.2–1.9 GB', 'मध्यम-भारी (एनिमेशन)', 'अपना — ओवरव्यू/वर्कस्पेस, Dock नहीं', 'कम (ट्वीक्स/themes से थोड़ा)', 'नया लैपटॉप, टच, कॉर्पोरेट स्टैण्डर्ड (Ubuntu/Fedora)'],
        ['KDE Plasma 5/6', 'Qt6, KWin', '~600 MB–1.1 GB', 'हल्का-मध्यम', 'विंडोज़-जैसा डिफ़ॉल्ट', 'सर्वोच्च (हर चीज़ बदलती है)', 'पावर यूज़र, गेमिंग, पुराना-मध्यम PC'],
        ['Xfce 4', 'GTK3, Xfwm4', '~350–550 MB', 'बहुत हल्का', 'क्लासिक Windows 7 जैसा पैनल', 'मध्यम', 'कॉलेज लैब, पुराना PC, स्थिरता'],
        ['LXQt', 'Qt, Openbox/KWin', '~250–420 MB', 'सबसे हल्का पूरा DE', 'सादा, classic', 'मध्यम', '2 GB RAM वाले पुराने मशीन'],
        ['Cinnamon', 'GTK3, Muffin', '~700 MB–1 GB', 'मध्यम', 'Windows जैसा (taskbar + menu)', 'मध्यम-अच्छा', 'Mint यूज़र, नए आए हुए विंडोज़ वाले'],
        ['MATE', 'GTK2/GTK3, Marco', '~400–600 MB', 'हल्का', 'GNOME 2 क्लासिक (पुराना लुक)', 'मध्यम', 'पुराना hardware, पुरानी आदत वाले यूज़र'],
        ['Budgie', 'GTK3, Mutter/GNOME पैनल', '~600–800 MB', 'मध्यम', 'सिंगल पैनल, साफ़-सुथरा', 'कम-मध्यम', 'Solus/Ubuntu Budgie, सुंदर सरलता'],
        ['Pantheon', 'GTK3, Gala', '~600 MB', 'मध्यम', 'macOS-जैसा (Dock + TopBar)', 'बहुत कम (जान-बूझकर सीमित)', 'elementary OS, सिनेमा/क्लासरूम'],
        ['deepin DDE', 'Qt/DTK, kwin-fork', '~700 MB–1 GB', 'मध्यम-भारी (इफ़ेक्ट)', 'macOS + अपना Dock', 'कम', 'Deepin, सुंदर दिखना ज़रूरी हो'],
        ['i3 / Sway (WM)', 'अपना (X11 / Wayland)', '~80–250 MB', 'नगण्य', 'टाइलिंग, कीबोर्ड-चालित, कॉन्फ़िग फ़ाइल से', 'कॉन्फ़िग टेक्स्ट फ़ाइल = कुछ भी', 'डेवलपर, बहुत पुराना PC, सर्वर-ग्राफ़िकल हाइब्रिड']
      ] },

    { type: 'steps', items: [
      { n: 1, title: 'फ़र्मवेयर: UEFI / BIOS (POST)', text: 'पावर बटन → CPU रीसेट वेक्टर → मदरबोर्ड फ़र्मवेयर POST करता है (RAM/CPU/डिस्क जाँच), boot-able खोजता है। UEFI ESP (<code>/boot/efi/EFI/…</code>, FAT32) में रखे <code>.efi</code> लोडर को खोजता/याद रखता है; पुराना BIOS डिस्क के MBR (पहले 440 बाइट) को लोड करता है। Secure Boot चेक करता है कि लोडर MS- या डिस्ट्रो की कुंजी से साइन है। समय: पुराने BIOS पर 3–10 s, UEFI पर 1–4 s (POST skipped/ultra-fast boot से और कम)।', tips: '<code>sudo efibootmgr -v</code> UEFI boot entries दिखाता है; <code>sudo dmidecode -t bios</code> फ़र्मवेयर वर्ज़न। लॉग: फ़र्मवेयर का कोई लॉग नहीं — स्क्रीन पर POST मैसेज/बीप कोड ही सबूत।', warn: 'UEFI + BIOS(Legacy/CSM) मोड मिलकर एक ही डिस्क पर गड़बड़ करते हैं; CSM बंद रखकर GPT + ESP वाली इंस्टॉल सबसे साफ़ होती है।' },
      { n: 2, title: 'बूट लोडर: GRUB2 मेन्यू', text: 'UEFI पर <code>grubx64.efi</code> (या shim → grub), BIOS पर <code>boot.img</code>(MBR) → <code>core.img</code> चलता है। GRUB अपने मॉड्यूल से फ़ाइल सिस्टम पढ़ता है और <code>/boot/grub/grub.cfg</code> से मेन्यू बनाता है; <code>GRUB_TIMEOUT</code> तक मेन्यू दिखता है, फिर डिफ़ॉल्ट प्रविष्टि चलती है। समय: 1–3 s (+ टाइमर)।', tips: "'e' दबाकर प्रविष्टि एडिट करें, Ctrl+X से बूट; 'c' से GRUB कमांड लाइन; Shift/Esc से मेन्यू दिखाएँ। लॉग: <code>/boot/grub/grubenv</code>, <code>journalctl -b</code> में बूट-स्टेज नहीं, पर GRUB के बाद के मैसेज यहीं दिखते हैं।" , warn: 'grub.cfg मैन्युअल न बदलें — <code>/etc/default/grub</code> बदलकर <code>sudo update-grub</code> चलाएँ।' },
      { n: 3, title: 'kernel + initramfs RAM में लोड', text: 'GRUB <code>/boot/vmlinuz-&lt;ver&gt;</code> को decompress करके RAM में रखता है और <code>initrd.img</code> (initramfs) को temporary root बनाता है; साथ में कमांडलाइन भेजता है — <code>root=UUID=… ro quiet splash</code>। समय: 1–4 s (डिस्क पर निर्भर)।', tips: '<code>cat /proc/cmdline</code> वही पैरामीटर दिखाता है जो GRUB ने भेजे; <code>lsinitramfs /boot/initrd.img-$(uname -r)</code> (Debian/Ubuntu) या <code>lsinitrd</code> (RHEL) अंदर की फ़ाइलें गिनता है।' },
      { n: 4, title: 'कोर्क अपना काम शुरू करता है', text: 'kernel CPU/RAM/PCI/ACPI पहचानता है, ड्राइवर लोड करता है (initramfs से आवश्यक storage/network/FS मॉड्यूल), swap चालू करता है, फिर असली root फ़ाइल सिस्टम (<code>root=UUID=…</code>) को माउंट करके <code>switch_root</code> करता है और <b>PID 1</b> के रूप में <code>/sbin/init</code> (→ systemd) चलाता है। समय: 1–6 s।', tips: 'इस स्टेज का पूरा लॉक <code>sudo dmesg -T</code> और <code>journalctl -b -p 3</code> में है; <code>systemd-analyze</code> कुल समय देता है।' },
      { n: 5, title: 'systemd (PID 1) बेस सेटअप', text: 'systemd API फ़ाइल सिस्टम माउंट करता है (<code>/proc /sys /dev /run /tmp</code>), fstab के माउंट, swaps, timers व सॉकेट चालू करता है, default target (<code>/etc/systemd/system/default.target</code> symlink) चुनता है और units को निर्भरता-क्रम (dependency order) में <b>समानांतर</b> शुरू करता है।', tips: '<code>systemctl list-units --type=target</code>, <code>systemd-analyze critical-chain</code> बताते हैं कौन-सी सर्विस बूट धीमा कर रही है।' },
      { n: 6, title: 'सर्विसेज़: नेटवर्क, लॉगिन, SSH', text: 'systemd-networkd या NetworkManager से IP (DHCP), sshd, cron/atd, cups, journald, rsyslog, logind (यूज़र सीटें), auditd आदि चालू होते हैं; लॉग <code>/var/log/journal/</code> व <code>/var/log/syslog</code>/<code>messages</code> में जाते हैं।', tips: '<code>systemctl status ssh</code>, <code>ss -lntp</code> से देखें कौन-सा पोर्ट खुला है; <code>journalctl -b | head -60</code> बूट की पहली लाइनें।' },
      { n: 7, title: 'लॉगिन स्क्रीन: getty या display manager', text: 'text सिस्टम पर <code>getty</code> tty1–tty6 पर login: दिखाता है; डेस्कटॉप सिस्टम पर graphical.target → GDM/SDDM/LightDM चलता है। कंसोल स्विच: Ctrl+Alt+F1–F6 (कई डिस्ट्रो में F3–F6 असली tty, graphical कहीं और)।', tips: '<code>systemctl status getty@tty1</code> / <code>systemctl status gdm</code>; <code>chvt 3</code> से tty3 पर जाएँ।' },
      { n: 8, title: 'यूज़र सेशन: PAM → shell → डेस्कटॉप', text: 'लॉगिन पर PAM (<code>pam_unix</code> पासवर्ड, <code>pam_systemd</code>) जाँचता है, फिर यूज़र के लिए session बनता है, <code>/etc/profile</code> + <code>~/.bashrc</code> पढ़े जाते हैं, और display manager Wayland/X11 सत्र शुरू करता है; साथ में <code>systemctl --user</code> की यूज़र-सर्विसेज़ चलती हैं। समय: पासवर्ड के बाद 2–6 s।', tips: '<code>loginctl</code>, <code>echo $XDG_RUNTIME_DIR</code>, <code>journalctl --user -b</code>। कुल बूट: SSD पर 12–35 s (सामान्यतः), पुराने HDD पर 1–3 min।' }
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.8</span> GRUB2 व्यवहार में: मेन्यू, एडिट, बूट-पैरामीटर, Windows chainload</h3>
      <p>GRUB2 (GNU GRUB) लिनक्स दुनिया का सबसे आम बूट लोडर है — GRUB Legacy की जगह 1.98/2.00 से। फ़ाइलें: <code>/boot/grub/grub.cfg</code> (auto-generated — इसे कभी मैन्युअल न बदलें), <code>/etc/default/grub</code> (आपकी सेटिंग), <code>/etc/grub.d/</code> (स्क्रिप्ट जो cfg बनाते हैं: <code>00_header, 10_linux, 20_linux_xen, 30_os-prober, 40_custom</code>), <code>/boot/grub/x86_64-efi/</code> या <code>/boot/grub/i386-pc/</code> (मॉड्यूल), <code>/boot/grub/grubenv</code> (एक बार का next-entry)।</p>
      <p>सेटिंग बदलने का सही क्रम: <code>/etc/default/grub</code> एडिट करें → <code>sudo update-grub</code> (Debian/Ubuntu) या <code>sudo grub-mkconfig -o /boot/grub/grub.cfg</code> (हर जगह) → रीबूट। <code>30_os-prober</code> दूसरे OS ढूँढता है; नए GRUB/Debian में यह default बंद हो सकता है — तब <code>GRUB_DISABLE_OS_PROBER=false</code> करके <code>update-grub</code> चलाएँ तो Windows मेन्यू में आ जाता है (chainload: UEFI पर <code>chainloader /EFI/Microsoft/Boot/bootmgfw.efi</code>, BIOS पर Windows partition के boot sector पर)।</p>
      <table class="tbl">
        <tr><th>/etc/default/grub का वैल्यू</th><th>मतलब</th><th>टिपिकल मान</th></tr>
        <tr><td><code>GRUB_TIMEOUT</code></td><td>मेन्यू कितने सेकंड दिखे</td><td>5 ( Debian डिफ़ॉल्ट 5; कई ISO 0–10 रखते हैं)</td></tr>
        <tr><td><code>GRUB_TIMEOUT_STYLE</code></td><td>मेन्यू दिखे या छिपे</td><td>menu | hidden | countdown</td></tr>
        <tr><td><code>GRUB_CMDLINE_LINUX_DEFAULT</code></td><td>सिर्फ़ normal boot पर kernel पैरामीटर</td><td>"quiet splash" (डेस्कटॉप), सर्वर पर अक्सर खाली</td></tr>
        <tr><td><code>GRUB_CMDLINE_LINUX</code></td><td>हर boot (recovery भी) पर पैरामीटर</td><td>"net.ifnames=0 biosdevname=0" जैसे</td></tr>
        <tr><td><code>GRUB_DEFAULT</code></td><td>कौन-सी प्रविष्टि पहले चले</td><td>0 | "saved" (with <code>grub-set-default</code>) | मेन्यू का नाम</td></tr>
        <tr><td><code>GRUB_DISABLE_RECOVERY</code></td><td>recovery (single) प्रविष्टि बनाना बंद</td><td>false (रखें — रिपेयर में काम आती है)</td></tr>
        <tr><td><code>GRUB_TERMINAL_OUTPUT</code> / <code>GRUB_GFXMODE</code></td><td>मेन्यू का रूप/रिज़ॉल्यूशन</td><td>gfxterm / 1024x768</td></tr>
        <tr><td><code>GRUB_DISABLE_OS_PROBER</code></td><td>दूसरे OS की खोज</td><td>false करने पर Windows दिखता है</td></tr>
      </table>
      <h4 class="blk2">बूट टूटने पर — GRUB से वसूली (rescue)</h4>
      <ol>
        <li><b>मेन्यू दिख रहा है:</b> 'e' दबाएँ → <code>linux</code> लाइन के अंत में जोड़ें <code>single</code> या <code>systemd.unit=rescue.target</code> या <code>systemd.unit=emergency.target</code> → Ctrl+X। फिर root पासवर्ड माँगेगा (Ubuntu में root लॉक है — तब <code>rw init=/bin/bash</code> वाली तकनीक)।</li>
        <li><b>मेन्यू नहीं, "grub rescue&gt;" प्रॉम्प्ट:</b> <code>ls</code> से partition पहचानें → <code>set root=(hd0,gpt2)</code> → <code>set prefix=(hd0,gpt2)/boot/grub</code> → <code>insmod normal</code> → <code>normal</code>। फिर सिस्टम अंदर जाकर <code>sudo grub-install /dev/sda</code> + <code>sudo update-grub</code>।</li>
        <li><b>बूट डिस्क ही नहीं:</b> Live USB से बूट → partitions माउंट → <code>sudo mount /dev/sda2 /mnt; sudo mount /dev/sda1 /mnt/boot/efi; sudo mount --bind /dev /mnt/dev; sudo mount --bind /proc /mnt/proc; sudo mount --bind /sys /mnt/sys; sudo chroot /mnt</code> → <code>grub-install</code>, <code>update-grub</code>, ज़रूरत हो तो <code>mkinitramfs</code>/<code>dracut</code>। (आसान टूल: <code>boot-repair</code> Live ISO / <code>chroot</code> स्क्रिप्ट)</li>
        <li><b>पासवर्ड भूल गए:</b> recovery प्रविष्टि में <code>rw init=/bin/bash</code> → <code>passwd root</code> (या <code>passwd &lt;user&gt;</code>) → <code>sync</code> → <code>exec /sbin/init</code> / फ़ोर्स रीबूट। SELinux वाली RHEL पर बूट पैरामीटर में <code>enforcing=0</code> ज़रूरी हो सकता है, फिर <code>touch /.autorelabel</code> करके रीबूट।</li>
        <li><b>GRUB को सुरक्षित करें:</b> <code>sudo grub-mkpasswd-pbkdf2</code> से hash → <code>/etc/grub.d/00_header</code> में <code>superusers</code>/<code>password_pbkdf2</code> → <code>update-grub</code> — इससे कोई boot पैरामीटर बदल नहीं पाएगा (लैब/शोरूम के लिए ज़रूरी)।</li>
      </ol>` },

    { type: 'table', head: ['SysVinit runlevel', 'systemd target', 'क्या मिलता है', 'कैसे पहुँचें / सेट करें'],
      rows: [
        ['0', 'poweroff.target', 'तुरंत बंद (सर्विस रोककर पावर ऑफ़)', '<code>systemctl poweroff</code>'],
        ['1', 'rescue.target', 'single-user: root shell + local FS + systemd सर्विसेज़ (नेटवर्क/DE नहीं)', 'बूट में <code>single</code> / <code>systemctl isolate rescue.target</code>'],
        ['2', 'multi-user.target (अलग समकक्ष नहीं)', 'पुराने Debian में "network के बिना multi-user"; systemd इसे 3 जैसा ही मानता है', '— (ऐतिहासिक; नई सेटिंग में उपयोग न करें)'],
        ['3', 'multi-user.target', 'सर्वर स्टैंडर्ड: लॉगिन + नेटवर्क + SSH, कोई ग्राफ़िक्स नहीं', '<code>systemctl set-default multi-user.target</code>'],
        ['4', 'multi-user.target', '"custom/desktop services" के लिए छोड़ा गया — आज कोई उपयोग नहीं', '—'],
        ['5', 'graphical.target', 'display manager + डेस्कटॉप (multi-user के ऊपर)', '<code>systemctl set-default graphical.target</code>'],
        ['6', 'reboot.target', 'रीस्टार्ट', '<code>systemctl reboot</code>'],
        ['—', 'emergency.target', 'सबसे कम: root shell, local FS readonly, सिर्फ़ sysinit — fsck/बचाव के लिए', 'बूट में <code>emergency</code> (<code>systemctl isolate emergency.target</code>)'],
        ['—', 'default.target', 'डिफ़ॉल्ट का symlink (आमतौर पर graphical या multi-user)', '<code>systemctl get-default</code> / <code>systemctl list-dependencies</code>']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.9</span> / का नक्शा — FHS (Filesystem Hierarchy Standard)</h3>
      <p>FHS वह दस्तावेज़ (Linux Foundation/FSF का मानक, वर्ज़न 3.0) तय करता है कि <b>फ़ाइल कहाँ रहेगी</b> — ताकि किसी भी डिस्ट्रो पर <code>/etc/passwd</code>, <code>/var/log</code>, <code>/usr/bin</code> एक जैसे मिलें। पाँच नियम याद रखिए:</p>
      <ul>
        <li><b><code>/usr</code> = सिस्टम के प्रोग्राम</b> — पैकेज मैनेजर से आते हैं, पुराने ज़माने में read-only माउंट हो सकते थे; यहाँ आप हाथ से कुछ न रखें।</li>
        <li><b><code>/usr/local</code> = आपके हाथ से इंस्टॉल किए</b> (<code>./configure &amp;&amp; make &amp;&amp; sudo make install</code> का डिफ़ॉल्ट <code>/usr/local</code>) — अपग्रेड में सुरक्षित।</li>
        <li><b><code>/etc</code> = कॉन्फ़िगरेशन, <code>/var</code> = बढ़ता हुआ डेटा</b> (लॉग, डेटाबेस, कैश, क्यू) — बैकअप यहीं से ज़रूरी।</li>
        <li><b><code>/home</code> = यूज़र का निजी संसार</b>; <code>/root</code> अलग है (root का होम)।</li>
        <li><b> temporaire (अस्थायी) <code>/tmp</code>, <code>/run</code></b> — <code>/run</code> tmpfs (RAM) है, हर बूट पर खाली; <code>/tmp</code> भी साफ़ हो सकता है।</li>
      </ul>
      <p>आधुनिक डिस्ट्रो में <b>usr-merge</b> है — <code>/bin /sbin /lib</code> असल डायरेक्टरी नहीं, <code>/usr</code> के अंदर की symlink हैं (Fedora 17 से, RHEL 7+, Arch, Debian 10+, Ubuntu 20.04+, openSUSE) — इसलिए <code>ls -ld /bin</code> पर <code>/usr/bin</code> दिखेगा। <code>/opt</code> में third-party self-contained सॉफ़्टवेयर, <code>/snap</code>/<code>/var/lib/flatpak</code> में बंडल, <code>/mnt</code>/<code>/media</code> में अटके डिस्क — यही तीन "बाक़ी जगहें" हैं।</p>` },

    { type: 'table', head: ['पथ', 'क्या रहता है', 'कौन लिख सकता है', 'आम फ़ाइल / कमांड'],
      rows: [
        ['<code>/</code>', 'रूट डायरेक्टरी — पूरे पेड़ की जड़; कोई फ़ाइल सीधे यहाँ नहीं रखी जाती', 'सिर्फ़ root', '<code>ls -l /</code>, <code>df -h /</code>'],
        ['<code>/bin</code>', 'ज़रूरी यूज़र कमांड (usr-merge के बाद <code>/usr/bin</code> की symlink)', 'root (पैकेज से)', '<code>ls, cp, bash, grep, tar</code>'],
        ['<code>/sbin</code>', 'सिस्टम/एडमिन कमांड → <code>/usr/sbin</code> symlink', 'root', '<code>fsck, ip, iptables, fdisk, shutdown</code>'],
        ['<code>/usr/bin</code>', 'सबसे बड़ी कमांड लाइब्रेरी — पैकेज से आती प्रोग्राम', 'root (पैकेज मैनेजर)', '<code>python3, firefox, vim, curl</code> — <code>dpkg -S /usr/bin/curl</code>'],
        ['<code>/usr/sbin</code>', 'एडमिन टूल्स (पैकेज वाले)', 'root', '<code>sshd, cron, nft, smartctl</code>'],
        ['<code>/usr/local/bin</code>', 'आपके/थर्ड-पार्टी हाथ-से-इंस्टॉल प्रोग्राम; अपडेट में नहीं छेड़े जाते', 'root (सावधानी से)', '<code>sudo cp mytool /usr/local/bin/</code>, PATH में पहले'],
        ['<code>/usr/share</code>', 'आर्किटेक्चर-निर्भर नहीं डेटा: डॉक, मैनपेज, आइकन, फ़ॉन्ट, लोकलाइज़ेशन', 'root (पैकेज)', '<code>/usr/share/doc, /usr/share/man, /usr/share/applications/*.desktop</code>'],
        ['<code>/usr/lib</code> / <code>/usr/lib64</code>', 'साझा लाइब्रेरी (.so) + प्लगइन + systemd OS units', 'root (पैकेज)', '<code>ldd /bin/ls</code>, <code>/usr/lib/systemd/system/*.service</code>'],
        ['<code>/lib</code>, <code>/lib64</code>', 'बूट के लिए चाहिए मॉड्यूल/लाइब्रेरी (आधुनिक सिस्टम पर <code>/usr/lib*</code> symlink)', 'root', '<code>ls /lib/modules/$(uname -r)</code>'],
        ['<code>/etc</code>', 'सिस्टम-वाइड कॉन्फ़िगरेशन, सब टेक्स्ट फ़ाइलें — कोई बाइनरी नहीं', 'root (कुछ ग्रुप-रीड, जैसे shadow)', '<code>sudo ls /etc</code>, <code>diff -y /etc/ssh/sshd_config …</code>'],
        ['<code>/var</code>', 'बदलता/बढ़ता डेटा — लॉग, डेटाबेस, कैश, क्यू, मेल', 'root + सर्विस यूज़र', '<code>sudo du -sh /var/*</code> (डिस्क भरने का पहला संदिग्ध)'],
        ['<code>/var/log</code>', 'सिस्टम व ऐप लॉग + journald', 'root; सर्विस अपने फ़ाइल बनाती', '<code>syslog, auth.log, dmesg, journal/, dnf.log, dpkg.log, fail2ban.log</code>'],
        ['<code>/var/cache</code>', 'रीजनरेट-होने वाला कैश (हटा सकते हैं, धीमा होगा)', 'root/सर्विस यूज़र', '<code>/var/cache/apt/archives/*.deb</code> — <code>apt clean</code>'],
        ['<code>/var/lib</code>', 'सर्विस का असली डेटा (स्थिर, महत्वपूर्ण)', 'सर्विस यूज़र', '<code>/var/lib/mysql, /var/lib/docker, /var/lib/dpkg/status</code>'],
        ['<code>/var/spool</code>', 'कतार में काम — मेल, prints, cron jobs, at jobs', 'सर्विस यूज़र', '<code>lpq, /var/spool/cron/crontabs</code> (RHEL: <code>/var/spool/cron</code>)'],
        ['<code>/tmp</code>', 'अस्थायी फ़ाइलें, सभी लिख सकते हैं (sticky bit 1777)', 'सब (एक-दूसरे की फ़ाइल डिलीट नहीं)', '<code>ls -ld /tmp</code>; रीबूट/clean-on-boot पर साफ़'],
        ['<code>/run</code>', 'चलते सिस्टम का स्टेट (tmpfs — हर बूट पर खाली)', 'root + सर्विस यूज़र', '<code>/var/run → /run</code> symlink; <code>/run/systemd</code>, <code>/run/user/1000</code>'],
        ['<code>/home</code>', 'लॉगिन यूज़र के डायरेक्टरी (UID ≥ 1000), 0750/0700', 'हर यूज़र अपना', '<code>~/.bashrc, ~/Downloads, /home/student1</code>'],
        ['<code>/root</code>', 'root का होम (0700)', 'सिर्फ़ root', '<code>sudo ls -la /root</code>; यहाँ टेस्ट स्क्रिप्ट न रखें'],
        ['<code>/opt</code>', 'आत्म-निर्भर थर्ड-पार्टी सॉफ़्टवेयर सुइट', 'root', '<code>/opt/google/chrome, /opt/texlive, /opt/microsoft</code>'],
        ['<code>/srv</code>', 'सर्वर का सर्व-किया जाने वाला डेटा (मानक जगह)', 'root/सर्विस', '<code>/srv/www</code> (Apache docroot), <code>/srv/git</code>'],
        ['<code>/media</code>', 'ऑटो-माउंट पॉइंट: यूडिस्क/फ़ाइल-मैनेजर यही माउंट करता है (<code>/media/&lt;user&gt;/&lt;label&gt;</code>)', 'udev/udisks2 + लॉगिन यूज़र', '<code>ls /media</code>, <code>findmnt -T /media</code>'],
        ['<code>/mnt</code>', 'मैनुअल/ स्क्रिप्ट-वाला अस्थायी माउंट पॉइंट', 'root', '<code>sudo mount /dev/sdb1 /mnt</code>'],
        ['<code>/proc</code>', 'pseudo-FS: हर प्रोसेस + kernel स्टेट टेक्स्ट फ़ाइल की तरह (0 बाइट, RAM से)', 'kernel रीड; कुछ sysctl राइट', '<code>cat /proc/cpuinfo</code>, <code>/proc/&lt;PID&gt;/exe</code>, <code>sysctl -w vm.swappiness=10</code>'],
        ['<code>/sys</code>', 'sysfs: डिविसेस, ड्राइवर, क्लास, पावर/नेट ट्यूनिंग', 'root (एट्रिब्यूट लिखना = सेटिंग)', '<code>/sys/block/sda/queue/scheduler</code>, <code>/sys/class/net/eth0/address</code>'],
        ['<code>/dev</code>', 'डिवाइस नोड्स (tmpfs + udev/udev-managed symlinks)', 'udev; यूज़र ग्रुप से (disk/audio)', '<code>/dev/sda3, /dev/nvme0n1p2, /dev/null, /dev/tty1</code>'],
        ['<code>/boot</code>', 'kernel, initramfs, GRUB — छोटी अलग partition बनाना समझदार', 'root', '<code>vmlinuz-*, initrd.img-*, grub/grub.cfg</code>'],
        ['<code>/boot/efi</code>', 'EFI System Partition (FAT32) — UEFI लोडर यहीं', 'root (फ़ाइल सिस्टम FAT, permission नहीं)', '<code>EFI/ubuntu/shimx64.efi, EFI/Boot/BOOTX64.EFI</code>, <code>efibootmgr</code>'],
        ['<code>/snap</code>', 'Snap पैकेज (squashfs रीड-ओन्ली इमेज + symlinks)', 'root/snapd', '<code>snap list</code>, <code>/snap/bin</code> PATH में'],
        ['<code>/etc/fstab</code>', 'माउंट टेबल — कौन-सी डिस्क कहाँ, किस विकल्प से', 'root (0644)', '<code>findmnt --verify</code>, <code>sudo mount -a</code>'],
        ['<code>/etc/hostname</code>', 'सिस्टम का नाम (एक लाइन)', 'root', '<code>hostnamectl set-hostname lab-pc07</code>'],
        ['<code>/etc/hosts</code>', 'लोकल DNS: IP ↔ नाम, <code>127.0.0.1 localhost</code>', 'root', '<code>sudo nano /etc/hosts</code> (ads ब्लॉक/होस्ट मैपिंग)'],
        ['<code>/etc/resolv.conf</code>', 'नाम सुलझाने की सेटिंग (अक्सर symlink → systemd-resolved)', 'root/टूल', '<code>resolvectl status</code>, <code>cat /etc/resolv.conf</code>'],
        ['<code>/etc/passwd</code>', 'हर अकाउंट की 7 फ़ील्ड लाइन — <b>पासवर्ड नहीं</b> (सब पढ़ सकते)', 'root', '<code>getent passwd 1000</code>'],
        ['<code>/etc/shadow</code>', 'एन्क्रिप्टेड पासवर्ड + एक्सपायरी (0640 root:shadow)', 'root', '<code>sudo ls -l /etc/shadow</code>, <code>chage -l student1</code>'],
        ['<code>/etc/group</code>', 'ग्रुप नाम, GID, सदस्य', 'root', '<code>getent group sudo</code>, <code>groupmems -l -g docker</code>'],
        ['<code>/etc/sudoers</code>', 'कौन क्या sudo कर सकता है — सिर्फ़ <code>visudo</code> से', 'root (0440)', '<code>sudo visudo -c</code>, <code>/etc/sudoers.d/lab</code>'],
        ['<code>/etc/crontab</code>', 'सिस्टम cron (6 फ़ील्ड: यूज़र + कमांड)', 'root', '<code>/etc/cron.d/, /etc/cron.daily/</code>'],
        ['<code>/etc/os-release</code>', 'डिस्ट्रो का नाम/वर्ज़न (मानक पहचान)', 'root (पैकेज)', '<code>cat /etc/os-release</code>, <code>hostnamectl</code>'],
        ['<code>/etc/shells</code>', 'मंज़ूरी-प्राप्त लॉगिन शेल की सूची', 'root', '<code>cat /etc/shells</code>, <code>chsh -l</code>'],
        ['<code>/etc/profile.d/</code>', 'हर लॉगिन पर चलने वाली छोटी सेटिंग स्क्रिप्ट', 'root', '<code>ls /etc/profile.d/*.sh</code> (PATH, prompt)']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.10</span> "सब कुछ फ़ाइल है" — inode, लिंक और नाम के नियम</h3>
      <p>लिनक्स का सबसे बड़ा सिद्धांत: हर चीज़ फ़ाइल की तरह दिखती है — डिस्क, कीबोर्ड, सॉकेट, पाइप, यहाँ तक कि चलता प्रोसेस (<code>/proc/&lt;PID&gt;/</code>)। कारण सरल: kernel के पास सिर्फ़ 15–16 syscall चाहिए (<code>open, read, write, close, ioctl, stat…</code>) और हर डिवाइस वही API देता है। इसीलिए <code>cat /dev/sda &gt; disk.img</code>, <code>echo text &gt; /dev/ttyUSB0</code>, <code>ls /proc/self/fd</code> सब हो जाते हैं।</p>
      <table class="tbl">
        <tr><th>फ़ाइल का प्रकार</th><td>पहचान</td><th>क्या है</th></tr>
        <tr><td>नियमित (-)</td><td><code>-rw-r--r--</code></td><td>डेटा — टेक्स्ट, बाइनरी, ISO, वीडियो</td></tr>
        <tr><td>डायरेक्टरी (d)</td><td><code>drwxr-xr-x</code></td><td>नाम → inode की तालिका; " execute" = अंदर जा सकना</td></tr>
        <tr><td>सिंबोलिक लिंक (l)</td><td><code>lrwxrwxrwx … -&gt; target</code></td><td>नाम में दूसरे पथ का reference (target का inode नहीं)</td></tr>
        <tr><td>ब्लॉक डिवाइस (b)</td><td><code>brw-rw----</code> /dev/sda</td><td>512/4096-बाइट ब्लॉक से पढ़ने वाली डिस्क; major/minor नंबर</td></tr>
        <tr><td>कैरेक्टर डिवाइस (c)</td><td><code>crw-rw-rw-</code> /dev/null</td><td>बाइट-दर-बाइट: कीबोर्ड, tty, सीरियल, DRM</td></tr>
        <tr><td>नाम्ड पाइप (p)</td><td><code>prw-r--r--</code></td><td>FIFO — एक प्रोसेस लिखे, दूसरा पढ़े (<code>mkfifo mypipe</code>)</td></tr>
        <tr><td>सॉकेट (s)</td><td><code>srw-rw-rw-</code> /var/run/docker.sock</td><td>लोकल IPC (Unix domain socket) — बंद कर देना सुरक्षित</td></tr>
      </table>
      <h4 class="blk2">inode — फ़ाइल का असली पहचान-पत्र</h4>
      <p>फ़ाइल का नाम सिर्फ़ एक लेबल है; असली जानकारी एक <b>inode</b> (index node) नंबर में रहती है: size, type, permission, owner, links की गिनती, तीन समय, ब्लॉक पॉइंटर, xattr। <code>ls -i</code>, <code>stat</code> से दिखता है; <code>df -i</code> से inode-भराव। फ़ाइल सिस्टम के inode खत्म हो जाएँ तो "No space left on device" आता है भले जगह खाली हो (छोटी-छोटी लाखों फ़ाइलें, ext4 में block size पर निर्भर सीमा)। तीन समय: <b>mtime</b> (कंटेंट बदला), <b>ctime</b> (inode/metadata बदला — permission/owner भी), <b>atime</b> (पढ़ा गया — इसलिए <code>noatime</code>/<code>relatime</code> माउंट विकल्प)।</p>
      <h4 class="blk2">नाम रखने के नियम (Windows से सबसे बड़ा फ़र्क़)</h4>
      <ul>
        <li><b>Case sensitive:</b> <code>Notes.txt</code>, <code>notes.txt</code>, <code>NOTES.TXT</code> = तीन अलग फ़ाइलें।</li>
        <li><b>सिर्फ़ दो वर्जित:</b> <code>/</code> (path separator) और null बाइट। स्पेस, तीव्र विराम (!), कोष्ठक, ₹/ईमोजी सब वैध हैं — पर <code>' " \` $ &amp; ( ) *</code> कमांड में समस्या बनाते हैं, इसलिए उद्धरण (<code>"…"</code>) या escape (<code>\\</code>) आदत डालें।</li>
        <li><b>बैकस्लैश <code>\\</code> separator नहीं है</b> — <code>C:\\Users\\x</code> यहाँ एक फ़ाइल का नाम है, पथ नहीं।</li>
        <li><b>डॉट से शुरू = छिपी फ़ाइल:</b> <code>.bashrc</code>, <code>.config/</code> — <code>ls -a</code> से दिखती हैं; "छिपी" का मतलब गुप्त नहीं, सिर्फ़ डिफ़ॉल्ट लिस्ट से बाहर।</li>
        <li><b>लंबाई:</b> एक नाम 255 बाइट, पूरा पथ (PATH_MAX) आमतौर पर 4096 बाइट — बहुत गहरे tree पर "File name too long"।</li>
        <li><b>आम परंपराएँ:</b> <code>.</code> = यह डायरेक्टरी, <code>..</code> = माँ, <code>~</code> = अपना होम, <code>~root</code> = root का होम; नाम छोटे-केस-वा-with-hyphen (<code>my-report.pdf</code>), स्पेस से बचें, कॉलम/मैप के लिए <code>report_2026-01.csv</code>।</li>
        <li><b>एक्सटेंशन kernel को नहीं, ऐप को बताता है:</b> <code>file</code> कमांड असला प्रकार magic bytes से पहचानता है। <code>cp report.txt report.exe</code> से फ़ाइल exe नहीं बनती। रन करने के लिए एक्सटेंशन नहीं, execute permission + shebang चाहिए (<code>chmod +x script</code>)। मगर <code>.sh .py .c .deb .rpm .tar.gz</code> की परंपरा न छोड़ें — इन्वेन्टरी/डिबगिंग में काम आती है।</li>
      </ul>` },

    { type: 'table', head: ['पहलू', 'Hard link (<code>ln target link</code>)', 'Symbolic/soft link (<code>ln -s target link</code>)'],
      rows: [
        ['क्या बनता है', 'उसी inode का दूसरा नाम', 'नई फ़ाइल जिसका कंटेंट केवल target का पथ है (अलग inode)'],
        ['inode', 'बिल्कुल एक ही', 'अलग; रीड करने पर kernel target को follow करता है'],
        ['लिंक गिनती', 'target के साथ +1 (<code>stat -c %h file</code>)', 'अपनी गिनती अलग; target की नहीं बढ़ती'],
        ['अलग फ़ाइल सिस्टम/पार्टीशन', 'नहीं — केवल उसी FS पर', 'हाँ — कोई भी पथ (<code>/etc/fstab</code> की तरह)'],
        ['डायरेक्टरी पर', 'root पर भी अनुमतियाँ के कारण नहीं बनती', 'हाँ (<code>ln -s /var/www/site /srv/site</code>)'],
        ['target हटाने पर', 'डेटा सुरक्षित — तब तक जब तक एक भी नाम बचा है', 'टूटा लिंक (red) — "No such file or directory"'],
        ['टार्गेट आगे बढ़ने पर', 'दोनों नाम हमेशा वही inode', ' लिंक उसी पथ को follow करता रहेगा (नई फ़ाइल मिलेगी)'],
        ['पहचान', '<code>ls -l</code> में सामान्य permission व link count &gt; 1', '<code>l</code> प्रकार + <code>name -&gt; target</code>'],
        ['कमांड', '<code>ln data.txt backup.txt</code>; हटाना <code>rm backup.txt</code>', '<code>ln -s /usr/bin/python3.11 py3</code>; बदलना <code>ln -sfn</code>; जाँच <code>readlink -f py3</code>'],
        ['व्यवहारिक उपयोग', 'बैकअप/डेडुप (एक डेटा, कई नाम)', '<code>/etc/alternatives</code>, systemd unit enable (symlink), <code>/var/run → /run</code>, वर्ज़न स्विच (current -&gt; release-2026)']
      ] },

    { type: 'code', code: `# ---- inode व लिंक का व्यवहार (खुद करके देखें) ----
mkdir -p /tmp/lintest && cd /tmp/lintest
echo "lab data" > note.txt
ls -li note.txt                 # inode नंबर + link count 1
ln note.txt note-hard.txt       # hard link — वही inode
ln -s note.txt note-sym.txt     # symbolic link — नया inode, पथ स्टोर
ls -li                          # तीनों के inode/तुलना
stat -c '%n inode=%i links=%h' note.txt note-hard.txt note-sym.txt
rm note.txt                     # असली नाम हटाया
cat note-hard.txt               # डेटा अब भी पढ़ता है (inode जीवित)
cat note-sym.txt                # तूटा लिंक -> No such file or directory
readlink note-sym.txt           # target का पथ दिखाता है
readlink -f /var/run            # पूरा असली पथresolve -> /run
ln -sf note.txt latest          # लिंक दोबारा बनाना (नई target के लिए -sfn)
find /etc -xtype l              # टूटे हुए symlink (सिस्टम हेल्थ चेक)
find / -samefile /etc/passwd    # उसी inode वाले सभी नाम

# ---- नाम/एक्सटेंशन का मज़ाक-भरी परीक्षा ----
touch "file with spaces.txt"    ; cat "file with spaces.txt"
touch 'weird$name.txt'          ; cat 'weird$name.txt'
touch note.txt Note.txt NOTE.txt ; ls -l *ote*.txt   # तीनों अलग!
echo "hi" > data.txt ; mv data.txt data.sh ; file data.sh   # अब भी ASCII text
chmod +x /tmp/lintest/note.txt  ; ./note.txt                # execute permission
ls -a ; ls -d .* ; echo ~ ; echo ~root ; pwd -P            # छिपी + home + real path

# ---- फ़ाइल सिस्टम की सैर (सिर्फ़ पढ़ने वाले आदेश) ----
ls -l /                       # रूट के बच्चे + पहला कॉलम:type (d/l/-)
ls -ld /bin /lib /etc /var    # symlink वाले merge दिखेंगे -> /usr/bin
df -hT                        # हर माउंट: FS प्रकार + उपयोग %
df -i                         # inode-भराव (जगह है पर inode खाली नहीं?)
findmnt --verify              # /etc/fstab जाँच — बूट टूटने से बचाव
findmnt -T /home              # /home किस डिस्क/FS पर माउंट है
lsblk -f                      # पेड़ + FS + mountpoint + UUID
sudo fdisk -l /dev/sda        # partition टेबल
stat /etc/passwd              # inode, size, तीन समय (atime/mtime/ctime)
ls -i /etc/passwd             # सिर्फ़ inode नंबर
sudo getfacl /etc/hosts       # ACL (permission से आगे)
type -a ls cd echo            # builtin बनाम फ़ाइल कमांड
file /dev/sda1                # FS पहचान; file photo.jpg = असली प्रकार
getconf PATH ; cat /proc/mounts | column -t   # मानक PATH ; kernel का माउंट रिकॉर्ड` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.11</span> माउंट: डिस्क को फ़ाइल-पेड़ में जोड़ना</h3>
      <p>विंडोज़ में हर डिस्क को एक लेटर मिलता है (C:, D:)। लिनक्स में <b>एक ही पेड़</b> है और बाहरी डिस्क/पार्टीशन को किसी <b>खाली डायरेक्टरी</b> पर <code>mount</code> किया जाता है — उस पथ की सामग्री छिप जाती है जब तक unmount न हो (<code>--bind</code> से आंशिक दृश्य)। unmount से पहले जाँचें कि कोई प्रोसेस उसी पथ पर काम न कर रहा हो, वरना "target is busy"।</p>
      <table class="tbl">
        <tr><th>कमांड</th><th>क्या दिखाता/करता है</th></tr>
        <tr><td><code>df -hT</code></td><td>हर माउंट की जगह %, FS प्रकार, कहाँ से आया (source)</td></tr>
        <tr><td><code>lsblk -f</code> / <code>lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINTS,UUID</code></td><td>डिस्क→partition→mount का पेड़ + FS + UUID</td></tr>
        <tr><td><code>findmnt</code>, <code>findmnt --verify</code>, <code>findmnt -T /var</code></td><td>माउंट टेबल, fstab की जाँच, किसी पथ पर कौन-सा माउंट सबसे गहरा</td></tr>
        <tr><td><code>mount</code> / <code>umount /dev/sdb1</code> / <code>umount -l /mnt</code></td><td>माउंट / unmount; <code>-l</code> lazy (बusy हो तो बाद में हटेगा)</td></tr>
        <tr><td><code>mount /data</code></td><td>fstab से पथ के हिसाब से माउंट (कोई device नाम नहीं)</td></tr>
        <tr><td><code>sudo mount -a</code></td><td>fstab की सारी पंक्तियाँ आजमाकर माउंट — रीबूट से पहले की परीक्षा</td></tr>
        <tr><td><code>sudo umount -R /mnt/chroot</code></td><td>recursive — chroot के bind mounts समेत हटाना</td></tr>
        <tr><td><code>cat /proc/mounts</code>, <code>cat /etc/mtab</code></td><td>kernel का/पुरानी symlink वाला असली माउंट रिकॉर्ड</td></tr>
        <tr><td><code>udisksctl mount -b /dev/sdb1</code> · <code>udisksctl unmount -b …</code></td><td>बिना root फ़ाइल-मैनेजर जैसा माउंट (<code>/media/&lt;user&gt;/&lt;label&gt;</code>)</td></tr>
        <tr><td><code>sudo blkid</code> / <code>ls -l /dev/disk/by-uuid</code></td><td>UUID व LABEL — fstab में यही इस्तेमाल करें</td></tr>
      </table>
      <h4 class="blk2"><code>/etc/fstab</code> की 6 फ़ील्ड (हर पंक्ति = एक माउंट)</h4>
      <p><code>UUID=…  /data  ext4  defaults,noatime  0  2</code></p>
      <ol>
        <li><b>source:</b> <code>UUID=1f2e…</code>, <code>LABEL=data</code>, <code>PARTUUID=…</code>, <code>/dev/sdb1</code>, या नेटवर्क <code>//srv/share</code>, <code>host:/path</code> (nfs/fuse)। <b>device नाम न लिखें</b> — USB/डिस्क क्रम बदलने पर <code>/dev/sdb</code> दूसरी डिस्क बन जाती है और बूट लटक जाता है; <code>blkid</code> से UUID लें।</li>
        <li><b>mountpoint:</b> पथ (<code>/</code>, <code>/boot/efi</code>, <code>/data</code>) या <code>none</code>/<code>swap</code>। पथ पहले बनाएँ (<code>sudo mkdir -p /data</code>) और मालिक सेट करें, वरना root के मालिकाना 0755 पर लिखा नहीं जाएगा।</li>
        <li><b>fs type:</b> ext4, xfs, vfat, ntfs3, btrfs, swap, tmpfs, nfs, cifs, squashfs, iso9660, overlay, auto (पहुँचाने दो)।</li>
        <li><b>options:</b> नीचे की तालिका देखें; गलत विकल्प = माउंट फेल = emergency mode।</li>
        <li><b>dump:</b> पुराने <code>dump</code> बैकअप टूल को 0/1; आज लगभग हर जगह <b>0</b>।</li>
        <li><b>pass (fsck order):</b> 0 = स्किप मत करो, <code>/</code> (रूट) = <b>1</b>, बाक़ी लोडलिंग FS = <b>2</b>। tmpfs/swap/nfs/cdrom पर 0 रखें — fsck उन पर चल ही नहीं सकता।</li>
      </ol>
      <table class="tbl">
        <tr><th>विकल्प</th><th>मतलब / कब रखें</th></tr>
        <tr><td><code>defaults</code></td><td>= <code>rw,suid,dev,exec,auto,nouser,async</code> — सामान्य डेस्कटॉप/सर्वर डेटा</td></tr>
        <tr><td><code>noatime</code> / <code>relatime</code></td><td>हर पढ़ने पर atime न अपडेट करें — SSD/HDD की_mental ऊर्चा बचाएँ; <code>relatime</code> आधुनिक डिस्ट्रो का डिफ़ॉल्ट (26.30 से)</td></tr>
        <tr><td><code>ro</code></td><td>रीड-ओनली — फ़ोरेन्सिक इमेज, पुरानी डिस्क, लाइव ISO का persistence</td></tr>
        <tr><td><code>nosuid,nodev,noexec</code></td><td>अनtrusted डिवाइस/साझा डायरेक्टरी पर — setuid बाइनरी नहीं चलेंगे (/tmp, USB, /var/www upload)</td></tr>
        <tr><td><code>uid=1000,gid=1000,fmask=022,dmask=022</code></td><td>vfat/exFAT के लिए (FAT में permission नहीं होता, इसलिए माउंट-समय पर नकली permission)</td></tr>
        <tr><td><code>discard</code> / <code>nofail</code></td><td>discard = SSD TRIM (चिपकाएँ); <code>nofail</code> = डिस्क न मिले तो बूट न अटके (हटने वाली USB/HDD के लिए ज़रूरी)</td></tr>
        <tr><td><code>x-systemd.automount</code>, <code>x-systemd.mount-timeout=30</code></td><td>systemd ऑटो-माउंट — पहले कैश/नेटवर्क, फिर असली माउंट; NFS में बेहद उपयोगी</td></tr>
        <tr><td><code>nfsvers=4.2</code>, <code>soft/hard</code>, <code>_netdev</code>, <code>iocharset=utf8,sec=ntlmssp</code> (cifs)</td><td>नेटवर्क शेयर के लिए; <code>_netdev</code> भूलें तो बूट पर "A start job is running for…" का फंसाव</td></tr>
      </table>
      <h4 class="blk2">ऑटो-माउंट के तीन तरीके</h4>
      <p><b>(1) desktop:</b> udisks2 + फ़ाइल मैनेजर — पेनड्राइव अपने आप <code>/media/&lt;user&gt;/&lt;label&gt;</code> पर, eject बटन से हटता है। <b>(2) fstab</b> + <code>nofail</code>/<code>x-systemd.automount</code> — स्थायी जगहें। <b>(3) autofs</b> — बड़े नेटवर्क/लिप-सर्वर में demand mounting (जब तक न छुएँ, माउंट नहीं)।</p>` },

    { type: 'code', code: `# ---- पेनड्राइव/डिस्क माउंट का पूरा असली क्रम ----
sudo blkid                                # device + UUID + FS
lsblk -o NAME,SIZE,FSTYPE,LABEL,MOUNTPOINTS UUID
UUID=$(sudo blkid -s UUID -o value /dev/sdb1)
sudo mkdir -p /mnt/usb
sudo mount UUID=$UUID /mnt/usb            # नाम से नहीं, UUID से (सुझाव)
df -hT /mnt/usb ; touch /mnt/usb/test     # लिख-सकता हूँ? (ntfs हो तो ro मिल सकता)
ls /mnt/usb ; sync
sudo umount /mnt/usb                       # busy? -> sudo lsof +D /mnt/usb ; sudo fuser -vm /mnt/usb
sudo umount -l /mnt/usb                    # आख़िरी उपाय (lazy)

# fstab में स्थायी एंट्री (nofail + noatime + users)
echo "UUID=$UUID /mnt/usb ext4 defaults,noatime,nofail 0 2" | sudo tee -a /etc/fstab
sudo findmnt --verify && sudo mount -a     # रीबूट से पहले जाँच — यही सबसे बड़ी गलती बचाता है

# ---- एक नई/बढ़ी हुई डिस्क की तैयारी ----
sudo fdisk -l                              # कौन-सी डिस्क आई (/dev/sdb)
sudo parted /dev/sdb mklabel gpt           # UEFI सिस्टम पर GPT
sudo parted /dev/sdb mkpart primary 0% 100%
sudo mkfs.ext4 -L data /dev/sdb1           # फ़ाइल सिस्टम बनाओ (डेटा मिट जाएगा!)
sudo mkdir -p /data && sudo mount /dev/sdb1 /data
sudo chown root:root /data && sudo chmod 2775 /data   # setgid = नई फ़ाइलें समूह रखती हैं

# ---- swap और tmpfs ----
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile && free -h
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo mount -t tmpfs -o size=512M tmpfs /mnt/ramdisk   # RAM ड्राइव (तेज़, उड़ने वाला)
mount -o remount,rw /                      # readonly रूट को rw बनाएँ (उपयोग: रिकवरी)
sudo swapon --show ; sudo swapoff -a       # swap स्थिति / बंद (RAM पर्याप्त हो तो)` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.12</span> FHS के लिखने-के-नियम (क्या-क्या छूना चाहिए)</h3>
      <table class="tbl">
        <tr><th>किस पर लिखा जा सकता है</th><th>सही तरीक़ा</th><th>ग़लत/ख़तरनाक</th></tr>
        <tr><td>रूट (<code>/</code>) पर फ़ाइल बनाना</td><td>बिल्कुल न बनाएँ; अपने <code>/home/&lt;user&gt;</code> या <code>/data</code> में रखें</td><td><code>cd / ; wget file</code> — SELinux/permission से फेल, शर्म भी</td></tr>
        <tr><td><code>/usr</code>, <code>/lib</code>, <code>/var/lib/dpkg</code>, <code>/var/lib/rpm</code></td><td>केवल पैकेज मैनेजर से — <code>apt install</code>, <code>dnf install</code></td><td>फ़ाइल copy कर देना — DB झूठ बोलेगा, अपडेट पर मिटेगा</td></tr>
        <tr><td><code>/etc</code></td><td>बदलने से पहले बैकअप: <code>sudo cp /etc/fstab /etc/fstab.bak-$(date +%F)</code>, फिर <code>diff</code></td><td> बिना बैकअप/जाँच <code>visudo</code>, fstab, sshd_config बदलना</td></tr>
        <tr><td><code>/boot</code>, initramfs, GRUB</td><td><code>update-initramfs -u</code> / <code>dracut -f</code>, <code>update-grub</code> के बाद जाँच, रीबूट तभी</td><td>vmlinuz मैन्युअल हटाना = बूट ख़त्म</td></tr>
        <tr><td>डिस्क/पार्टीशन (<code>/dev/sdX</code>)</td><td><code>lsblk -f</code> से सत्यापन, फिर <code>dd</code>/<code>mkfs</code>/<code>fdisk</code> ; मशीन बंद करके</td><td> <code>dd if=/dev/zero of=/dev/sda</code> बिना जाँचे, चलती DB पर resize</td></tr>
        <tr><td><code>/var</code> (लॉग/DB)</td><td><code>logrotate</code>, <code>journalctl --vacuum-size=200M</code>, <code>apt clean</code></td><td>चलती mysql की फ़ाइल copy/hard-link से हटाना</td></tr>
        <tr><td><code>/tmp</code>, <code>/dev/shm</code></td><td>अस्थायी काम यहीं; बड़ी फ़ाइलें <code>/var/tmp</code> में</td><td>स्टोर होने योग्य डेटा <code>/tmp</code> में छोड़ना (रिबूट पर उड़ जाएगा)</td></tr>
        <tr><td>मौजूदा system को root पर mount करना</td><td><code>mount --bind</code>, <code>chroot</code>, live USB से repair (अध्याय 1.8 का rescue क्रम)</td><td>अनजान डिस्क पर auto-migrate script चलाना</td></tr>
      </table>
      <h4 class="blk2">डेस्कटॉप बनाम सर्वर का आम partition लेआउट</h4>
      <table class="tbl">
        <tr><th>पार्टीशन</th><th>आकार (सामान्य सुझाव)</th><th>FS</th><th>क्यों</th></tr>
        <tr><td><code>/boot/efi</code> (ESP)</td><td>100–512 MB</td><td>vfat (FAT32)</td><td>UEFI यही पढ़ता है; न हटाएँ, न resize करें</td></tr>
        <tr><td><code>/boot</code></td><td>1–2 GB</td><td>ext4</td><td>पुराने kernel+initrd सँभालने के लिए; LVM/RAID/LUKS पर बूट आसान</td></tr>
        <tr><td><code>/</code> (root)</td><td>डेस्कटॉप 25–60 GB · सर्वर 30–100 GB</td><td>ext4/xfs</td><td><code>/usr</code> + कॉन्फ़िग; यही बढ़ता है जब अपडेट/लॉग आते हैं</td></tr>
        <tr><td>swap</td><td>RAM ≤ 8 GB → RAM जितना (अधिकतम ~2×); 16 GB+ → 2–4 GB या swapfile</td><td>swap</td><td>hibernation चाहिए तो swap ≥ RAM; सर्वर पर कभी-कभी swapfile बेहतर</td></tr>
        <tr><td><code>/home</code></td><td>बाक़ी सारी जगह (डेस्कटॉप पर अलग ज़रूरी)</td><td>ext4/btrfs</td><td>OS बदलें/रीइंस्टॉल करें तो यूज़र डेटा सुरक्षित — लैब में यह सबसे बड़ा फ़ायदा</td></tr>
        <tr><td><code>/var</code> अलग</td><td>सर्वर पर 20–100 GB</td><td>ext4/xfs</td><td>लॉग/DB भर जाएँ तो रूट न भरे; <code>/var</code> पर <code>nosuid,nodev</code> सुरक्षा</td></tr>
        <tr><td><code>/tmp</code> अलग</td><td>2–10 GB या tmpfs</td><td>ext4/tmpfs</td><td><code>nosuid,nodev,noexec</code> + quota → मालवेयर/भराव सीमित</td></tr>
        <tr><td>LVM (<code>/dev/mapper/vg-lv</code>)</td><td>सर्वर/वर्चुअल मशीन पर मानक</td><td>ext4/xfs + LVM</td><td><code>lvextend -r -l +100%FREE /dev/vg/lv</code> से बिना re-format डिस्क बढ़ाएँ; snapshot बैकअप; <code>vgs/lvs/pvs</code></td></tr>
      </table>
      <p>LVM के तीन शब्द: <b>PV</b> (physical volume = डिस्क/partition) → <b>VG</b> (volume group = पूल) → <b>LV</b> (logical volume = असली माउंट होने वाला टुकड़ा)। आदेश: <code>sudo pvs; sudo vgs; sudo lvs</code>, <code>sudo lvcreate -n web -L 20G vg0</code>। बूट डिस्क पर LVM सेटअप करते समय <code>/boot</code> अलग रखना सबसे सुरक्षित है (GRUB को सीधा FS चाहिए)।</p>` },

    { type: 'table', head: ['फ़ाइल सिस्टम', 'अधिकतम FS / फ़ाइल (4K block)', 'journaling', 'checksums', 'snapshots/CoW', 'कब चुनें'],
      rows: [
        ['ext4', '1 EiB FS / 16 TiB फ़ाइल', 'हाँ', 'नहीं (metablock checksum सीमित)', 'नहीं', 'लिनक्स का डिफ़ॉल्ट — डेस्कटॉप, सर्वर, <code>/boot</code>, USB HDD'],
        ['ext3', '2 TiB FS / 2 TiB फ़ाइल', 'हाँ', 'नहीं', 'नहीं', 'सिर्फ़ पुराना सिस्टम/अपग्रेड; <code>debugfs</code> रिकवरी परिचित'],
        ['ext2', '2 TiB / 2 TiB', 'नहीं (journal-less)', 'नहीं', 'नहीं', 'छोटी EFI-जैसी partition, flash जहाँ journal घिसाई करे, FS इमेज बनानी हो'],
        ['xfs', '8 EiB / 8 EiB', 'हाँ (metadata)', 'मेटाडेटा scrub (<code>xfs_scrub</code>)', ' reflink clone (snapshot नहीं)', 'बड़ी डिस्क/बहुत बड़ी फ़ाइलें, RHEL/Fedora डिफ़ॉल्ट, DB व मीडिया स्टोरेज'],
        ['btrfs', '16 EiB / 16 EiB', 'हाँ (log)', 'हाँ — मेटा+डेटा', 'हाँ — सबवॉल्यूम snapshot (<code>btrfs subvolume snapshot</code>)', 'openSUSE/Fedora default, रोलबैक, प्रूफ-फ़ाइल-सिस्टम; RAID पर सावधानी'],
        ['ZFS (OpenZFS)', '16 EiB / 16 EiB', 'TXG-आधारित', 'हाँ, end-to-end + self-heal (mirror/raidz)', 'हाँ — snapshot + clone, send/recv', 'NAS/TrueNAS/Proxmox, जहाँ डेटा-integrity सर्वोच्च; लाइसेंस कारण kernel में नहीं, module'],
        ['JFS', '4 Pb FS / 512 TiB फ़ाइल', 'हाँ', 'नहीं', 'नहीं', 'बहुत पुराना/कमज़ोर hardware पर हल्का ext3-विकल्प'],
        ['ReiserFS', '16 TiB / 1 TiB', 'हाँ', 'नहीं', 'नहीं', 'पुराने रिलीज़ पर भरा हुआ (छोटी फ़ाइलें); नई इंस्टॉल में न चुनें'],
        ['vfat / FAT32', 'FS ~2 TiB (512B sector), फ़ाइल 4 GiB — <code>mkfs.vfat</code> पर फ़ाइल 4 GB की कठोर सीमा', 'नहीं', 'नहीं', 'नहीं', 'EFI System Partition अनिवार्य; पेनड्राइव जो विंडोज़+मैक+लिनक्स पर खुले; permission/softlink नहीं — <code>uid=/fmask=</code> से नकली perm'],
        ['exFAT', '128 PiB FS / 128 PiB फ़ाइल', 'नहीं', 'नहीं', 'नहीं', '64 GB+ पेनड्राइव/SD कैमरा; kernel 5.4 से मूल (native) सपोर्ट; मीडिया एक्सचेंज का सबसे अच्छा'],
        ['NTFS / ntfs3', '16 PiB / 16 TiB', 'हाँ ($logfile)', 'नहीं', 'नहीं', 'विंडोज़ के साथ साझा डिस्क; kernel 5.15+ का <code>ntfs3</code> तेज़ रीड/राइट, पुराने पर <code>ntfs-3g</code> (FUSE, धीमा)'],
        ['swap', '— (FS नहीं)', '—', '—', '—', 'virtual memory; partition या <code>/swapfile</code> — <code>mkswap</code> + <code>swapon</code>'],
        ['tmpfs', 'RAM+swap का आधा (डिफ़ॉल्ट), <code>size=</code> से तय', 'नहीं', '—', '—', '<code>/run /dev/shm</code>, बड़ी temp गणना, secrets (रीबूट पर गायब)'],
        ['squashfs', '— (read-only compressed)', '—', 'हाँ (block)', 'पूरी इमेज ही snapshot', 'Snap/कन्सोल लाइव ISO/मशीन-रीड-ओनली रूट; <code>unsquashfs</code> से खोलें'],
        ['iso9660 (+Joliet/RockRidge)', '—', '—', '—', '—', 'CD/DVD व बूटेबल ISO; <code>mount -o loop file.iso /mnt</code>'],
        ['F2FS', '16 TiB / 256 TiB फ़ाइल', 'हाँ', 'नहीं', 'नहीं', 'flash/Android/eMMC — पहनने को कम, checkpoint आधारित'],
        ['nfs / cifs(smb) / sshfs', 'मूल FS जितना', 'मूल FS जितना', '—', '—', 'नेटवर्क शेयर; <code>_netdev</code> + automount के साथ, DNS/कुंजी पर निर्भर']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.13</span> यूज़र व ग्रुप का दर्शन: कौन कितना मालिक है</h3>
      <p>लिनक्स सुरक्षा तीन सवालों पर खड़ी है — <b>कौन (UID/GID)?</b>, <b>क्या करने को मिलता है (permission/ACL)</b>, <b>कौन-सा काम kernel से माँगा जा सकता है (capabilities, sudo)</b>। हर प्रोसेस किसी यूज़र के UID पर चलता है और वही permission जाँच लागू होती है।</p>
      <ul>
        <li><b><code>root</code> = UID 0, GID 0</b> — यह "सupeरयूज़र" है: permission जाँच इसे छूती है, चमत्कारी नहीं (SELinux/capabilities रोक सकते हैं)। असली पहचान UID है, नाम नहीं।</li>
        <li><b>system accounts (&lt; 1000):</b> <code>bin, daemon, www-data/apache, mysql, postgres, sshd, messagebus</code> — इनका लॉगिन/पासवर्ड नहीं होता (shell <code>/usr/sbin/nologin</code> या <code>/bin/false</code>), इनका काम सिर्फ़ सर्विस को कम-अधिकार से चलाना है।</li>
        <li><b>login users (≥ 1000):</b> आप और छात्र। पुराने RHEL 6 तक पहला यूज़र UID 500 से शुरू होता था; RHEL 7+ व Debian/Ubuntu दोनों 1000 से शुरू करते हैं। systemd-journald आदि 201–999 के बीच "system users" रखते हैं।</li>
        <li><b>ग्रुप = अधिकार का बंडल:</b> <code>sudo</code> (Debian) / <code>wheel</code> (RHEL) = प्रशासन; <code>audio, video, cdrom, floppy</code> = हार्डवेयर; <code>docker, lxd, kvm</code> = <b>अप्रत्यक्ष root</b> — docker ग्रुप में सदस्यता = मशीन पर root (volume माउंट करके /etc छू सकते हैं)।</li>
        <li><b>कॉन्फ़िगरेशन फ़ाइलें:</b> <code>/etc/passwd</code> (सब पढ़ सकते, 0644), <code>/etc/shadow</code> (0640 root:shadow — hash + expires), <code>/etc/group</code>, <code>/etc/sudoers</code> (0440, सिर्फ़ <code>visudo</code>)।</li>
        <li><b>Ubuntu का नियम:</b> root का पासवर्ड सेट ही नहीं होता (अकाउंट locked), इसलिए <code>su -</code> डिफ़ॉल्ट फेल; सब कुछ <code>sudo</code> से — पहला यूज़र अपने आप <code>sudo</code> ग्रुप में, पहले 15 मिनट टोकन कैश (छोटे-छोटी कमांड पर दोबारा पासवर्ड नहीं)। RHEL/Fedora में <code>root</code> का पासवर्ड इंस्टॉल के समय सेट होता है और <code>wheel</code> ग्रुप को sudo देता है। SSH पर <code>PermitRootLogin</code> आधुनिक सिस्टम पर default बंद/prohibit-password है।</li>
        <li><b>सही आदत:</b> रोज़ का काम साधारण अकाउंट से, केवल ज़रूरी कमांड पर <code>sudo</code> — इससे लॉग में रहता है, ग़लती पर तबाही सीमित, और पासवर्ड बाँटना नहीं पड़ता (इंस्टिट्यूट में यही कारण है कि 20 PC पर एक-सा root पासवर्ड नहीं रखा जाता)।</li>
      </ul>
      <h4 class="blk2">su बनाम sudo — परीक्षा का पसंदीदा फ़र्क़</h4>
      <table class="tbl">
        <tr><th>पहलू</th><th><code>su -</code></th><th><code>sudo &lt;कमांड&gt;</code></th></tr>
        <tr><td>कौन-सा पासवर्ड</td><td>जिस बनना है (root) का पासवर्ड</td><td>अपना पासवर्ड</td></tr>
        <tr><td>कौन कर सकता है</td><td>जिसे root पासवर्ड पता है</td><td><code>/etc/sudoers</code> में अनुमति वाला (sudo/wheel ग्रुप)</td></tr>
        <tr><td>लॉग व जवाबदेही</td><td>सिर्फ़ "su: SUCCESS/FAILED" — असली कमांड रिकॉर्ड नहीं</td><td>हर कमांड auth.log/secure में यूज़र के नाम से दर्ज</td></tr>
        <tr><td>environment</td><td>लॉगिन शेल — पूरा root का environment</td><td>चुनी हुई कमांड; env_reset से साफ़ environment</td></tr>
        <tr><td>बारीक़ नियंत्रण</td><td>नहीं — या सब या कुछ नहीं</td><td>हाँ — <code>%labadmins ALL=(ALL) /usr/bin/systemctl restart nginx, /usr/bin/journalctl</code></td></tr>
        <tr><td>पासवर्ड-रहित</td><td>root पासवर्ड लॉक हो तो असंभव</td><td><code>NOPASSWD:</code> से (सिर्फ़ तय स्क्रिप्ट हेतु, लैब में उपयोगी)</td></tr>
        <tr><td>समय-सीमा</td><td>जब तक शेल खुला है</td><td>15 मिनट टोकन (<code>timestamp_timeout</code>), फिर पासवर्ड</td></tr>
        <tr><td>डिस्ट्रो डिफ़ॉल्ट</td><td>RHEL/Fedora/SUSE (root पासवर्ड सेट होता है)</td><td>Ubuntu/Debian/Mint (root लॉक, sudo ग्रुप)</td></tr>
        <tr><td>root शेल में जाना</td><td><code>su -</code> → root shell, काम खत्म होते ही <code>exit</code></td><td><code>sudo -i</code> / <code>sudo -s</code> — मगर <code>sudo su</code> से लॉग ख़राब बनता है</td></tr>
        <tr><td>नाम का अर्थ</td><td>"switch user" (Super User का पासवर्ड चाहिए)</td><td>"superuser do" (अपना पासवर्ड, नियंत्रण व लॉग साथ)</td></tr>
      </table>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.14</span> पैकेज प्रबंधन: परिवार, रिपोसिटरी व बंडल</h3>
      <p>दो स्तर के टूल होते हैं: <b>निचला</b> — एक .deb/.rpm फ़ाइल से काम (<code>dpkg</code>, <code>rpm</code>), और <b>ऊपरी</b> — रिपोसिटरी से निर्भरता (dependencies) समेत इंस्टॉल (<code>apt</code>, <code>dnf</code>, <code>pacman</code>, <code>zypper</code>, <code>apk</code>)। डिस्ट्रो परिवार पहचानने का सबसे भरोसेमंद तरीक़ा यही है — कौन-सा पैकेज टूल है।</p>
      <table class="tbl">
        <tr><th>परिवार</th><th>ऊपरी टूल</th><th>निचला टूल</th><th>रिपोसिटरी फ़ाइल</th><th>बंडल/GUI</th></tr>
        <tr><td>Debian/Ubuntu</td><td><code>apt</code> (apt-get/apt-cache का wrapper)</td><td><code>dpkg</code></td><td><code>/etc/apt/sources.list</code> + <code>/etc/apt/sources.list.d/*.list|.sources</code></td><td>Synaptic, GNOME Software, snap, flatpak</td></tr>
        <tr><td>Red Hat/Fedora</td><td><code>dnf</code> (पुराना <code>yum</code>)</td><td><code>rpm</code></td><td><code>/etc/yum.repos.d/*.repo</code> + <code>/etc/pki/rpm-gpg/</code></td><td>GNOME Software, dnf-plugins-core, AppImage</td></tr>
        <tr><td>Arch</td><td><code>pacman</code> (+ AUR helper <code>yay</code>/<code>paru</code>)</td><td>— (pacman खुद)</td><td><code>/etc/pacman.conf</code>, mirrors</td><td>Pamac, Octopi</td></tr>
        <tr><td>SUSE</td><td><code>zypper</code> + <b>YaST</b> GUI</td><td><code>rpm</code></td><td><code>/etc/zypp/repos.d/</code></td><td>YaST Software Management</td></tr>
        <tr><td>Alpine</td><td><code>apk</code></td><td>— (musl+BusyBox)</td><td><code>/etc/apk/repositories</code></td><td>container image में ही</td></tr>
        <tr><td>Gentoo</td><td><code>emerge</code> (Portage) — source compile, USE flags</td><td>—</td><td><code>/etc/portage/make.conf</code>, ebuilds</td><td>—</td></tr>
        <tr><td>Solus / Clear Linux</td><td><code>eopkg</code> / <code>swupd</code></td><td>—</td><td>ब्रैंड-अप</td><td>—</td></tr>
        <tr><td>क्रॉस-डिस्ट्रो</td><td colspan="4"><code>snap</code> (Canonical, squashfs+AppArmor), <code>flatpak</code> (Flathub, portals), <code>AppImage</code> (एक फ़ाइल = ऐप), <code>Nix</code>/<code>guix</code> (pure functional, reproducible)</td></tr>
      </table>
      <h4 class="blk2">रिपोसिटरी व GPG कुंजी — भरोसे का सवाल</h4>
      <p>हर रिपोसिटरी पर कुंजी से साइन मेटाडेटा + पैकेज होता है; टूल उनसे जाँचते हैं (<code>/etc/apt/keyrings/*.gpg</code> + <code>signed-by=</code>, RHEL में <code>gpgcheck=1</code> + <code>/etc/pki/rpm-gpg/RPM-GPG-KEY-…</code>)। <code>apt-key</code> अब deprecated है — <code>curl -fsSL … | sudo gpg --dearmor -o /etc/apt/keyrings/x.gpg</code> वाला तरीक़ा अपनाएँ। <b>POTD (personal package threat):</b> कोई भी रैंडम PPA/repo जोड़ना = उस व्यक्ति को अपने सिस्टम पर सॉफ़्टवेयर चलाने की अनुमति। केवल ऑफ़िशियल repo, डिस्ट्रो-सत्यापित third-party, या सोर्स देखकर बनाएँ। जोड़ने का सही क्रम: <code>sudo add-apt-repository ppa:ondrej/php</code> (Debian/Ubuntu) या <code>sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm</code> (EPEL — RHEL/Alma/Rocky का सबसे ज़रूरी अतिरिक्त repo) → फिर <code>apt update</code>/<code>dnf makecache</code>।</p>
      <h4 class="blk2">बंडल vs पैकेज — कौन-सा कब</h4>
      <table class="tbl">
        <tr><th>विधि</th><th>फ़ायदे</th><th>नुकसान</th><th>कब उपयोग करें</th></tr>
        <tr><td>पैकेज (<code>apt/dnf</code>)</td><td>OS की लाइब्रेरी साझा, कम जगह, security पैच डिस्ट्रो से, integration (udev/D-Bus)</td><td>डिस्ट्रो पर निर्भर वर्ज़न; पुराना हो सकता है</td><td>डिफ़ॉल्ट विकल्प — सर्वर/लैब/डेवलपर</td></tr>
        <tr><td>snap</td><td>हर डिस्ट्रो पर एक जैसा, auto-refresh, बंडल्ड libr, strict confinement</td><td>बड़ी डाउनलोड, start धीमा, loop-device जमा, केंद्रीकृत (Canonical) store</td><td>नया ऐप जो डिस्ट्रो में नहीं (Spotify, IntelliJ), भिन्न वर्ज़न चाहिए</td></tr>
        <tr><td>flatpak</td><td>Flathub बड़ा, portals से सुरक्षित फ़ाइल/नेट access, sandbox, desktop integration अच्छा</td><td>थीम/CLI ऐप कमज़ोर, जगह ज़्यादा, यूज़र-वाइज़ install</td><td>डेस्कटॉप ऐप — GIMP, LibreOffice, Steam, OBS</td></tr>
        <tr><td>AppImage</td><td>एक फ़ाइल, कहीं भी चलती है, कोई इंस्टॉल नहीं, पेनड्राइव पर ले जाएँ</td><td>auto-update सँभालना पड़ता है, desktop integration नहीं, execute permission चाहिए</td><td>टेस्ट/पोर्टेबिलिटी, छात्रों को देना, बिना root वाले PC</td></tr>
        <tr><td>Nix / Guix</td><td>reproducible, rollback, एक मशीन पर कई वर्ज़न, declarative (<code>shell.nix</code>)</td><td>सीखने का ढलान, FHS-ऐप के पैच, धीमा पहला सेटअप</td><td>डेवलपमेंट एनवायरनमेंट, टीम में "मेरे पे चलता है" ख़त्म करना</td></tr>
        <tr><td>Docker/Podman image</td><td>पूरा सॉफ़्टवेयर-वातावरण ले जाते हैं, सर्वर ऐप का मानक</td><td>GPU/डेस्कटॉप ऐप के लिए नहीं, kernel साझा</td><td>सर्वर डायरेक्ट्री (L4), सीआई/सीडी</td></tr>
        <tr><td>Pip/npm/cargo…</td><td>भाषा-विशिष्ट, नवीनतम वर्ज़न</td><td>सिस्टम टूल्स से टकराव; OS सुरक्षा पैच नहीं आता</td><td>केवल virtualenv — <code>python3 -m venv venv &amp;&amp; source venv/bin/activate</code></td></tr>
      </table>` },

    { type: 'code', code: `# ---- Debian/Ubuntu परिवार ----
sudo apt update && sudo apt upgrade -y     # लिस्ट ताज़ा, फिर पैकेज
sudo apt full-upgrade                      # डिपेंडेंसी बदलकर अपग्रेड
sudo do-release-upgrade                    # 22.04 -> 24.04 जैसी रिलीज़-अपग्रेड
sudo apt install vlc ; sudo apt remove vlc ; sudo apt purge vlc ; sudo apt autoremove -y
apt list --installed | wc -l ; apt search nginx ; apt show nginx
apt-cache policy firefox-esr firefox       # कौन-सा वर्ज़न कहाँ से आएगा
sudo dpkg -i package.deb ; sudo apt -f install     # .deb + टूटी डिपेंडेंसी ठीक
dpkg -l | grep -i openssh ; dpkg -L nginx ; dpkg -S /usr/bin/convert
sudo add-apt-repository 'deb [signed-by=/etc/apt/keyrings/x.gpg] https://repo/x stable main'
sudo apt clean && sudo apt autoclean

# ---- Red Hat/Fedora परिवार ----
sudo dnf check-update ; sudo dnf upgrade --refresh -y
sudo dnf install -y nginx ; sudo dnf remove -y nginx ; sudo dnf history ; sudo dnf history undo 12
dnf search nginx ; dnf info nginx ; dnf provides '*/iptables' ; rpm -ql nginx | head
sudo rpm -ivh package.rpm ; sudo rpm -Uvh kernel-*.rpm ; rpm -qa | sort | wc -l
rpm -qf /usr/sbin/sshd ; rpm -qi filesystem ; sudo dnf -y install epel-release
sudo dnf module list nginx ; sudo dnf module enable nginx:1.26 ; sudo dnf install nginx
sudo dnf install 'dnf-command(config-manager)' ; sudo dnf config-manager --set-enabled crb
sudo update-alternatives --config python   # कई वर्ज़न में से एक चुनें

# ---- बाक़ी परिवार ----
sudo pacman -Syu ; sudo pacman -S firefox ; pacman -Qe          # Arch
sudo zypper refresh ; sudo zypper in vim ; sudo zypper ps -s    # SUSE (reboot ज़रूरी?)
sudo apk add --no-cache curl ; apk info -a                      # Alpine
sudo emerge -av www-servers/nginx                               # Gentoo
sudo snap install code --classic ; snap refresh ; sudo snap remove code
flatpak install flathub org.gimp.GIMP ; flatpak run org.gimp.GIMP ; flatpak update
curl -L -o AppImage.appimage https://…/AppImage ; chmod +x AppImage.appimage && ./AppImage.appimage` },

    { type: 'table', head: ['लिनक्स का यह पक्ष', 'आपके सर्विस/CCC बिज़नेस में सीधा फ़ायदा', 'जाँच/आँकड़ा'],
      rows: [
        ['कीमत शून्य (कोई OS/CAL लाइसेंस नहीं)', '30 PC की लैब पर ₹3–5 लाख की बचत; ग्राहक को सस्ती मशीन', '<code>cat /etc/os-release</code> — कोई product key नहीं'],
        ['सर्वर बाज़ार पर क़रीबी क़ब्ज़ा', 'होस्टिंग/स्कूल सर्वर/लैब DNS-प्रिंट-Bacula सर्वर बनाना सिखाएँ', 'TOP500 सुपरकम्प्यूटर 100% लिनक्स; पब्लिक वेब सर्वर का बहुमत'],
        ['Android = लिनक्स kernel', 'मोबाइल रिपेयर ग्राहक का परिचित वातावरण; फ़ाइल सिस्टम/पार्टीशन समझ', 'एंड्रॉइड वर्ज़न: <code>adb shell getprop ro.build.version.release</code>'],
        ['Embedded/IoT हर जगह', 'राउटर (OpenWrt), CCTV NVR, स्मार्ट TV, कार, मीडिया प्लेयर — सब लिनक्स; नया रेवेन्यू', 'Raspberry Pi = Debian आधारित Raspberry Pi OS'],
        ['पुराने PC की जान', 'i3/2 GB पर Xfce/LXQt — ऑफ़िस/ब्राउज़िंग तेज़; e-waste बचाव', 'ChromeOS Flex/antiX/Mint Xfce से तुलना करके दिखाएँ'],
        ['सुरक्षा व पैच', 'रैंसमवेयर/एडवेयर के शिकायत कम; कमांड-लाइन से पूरी जाँच', '<code>unattended-upgrades</code>, <code>dnf auto-update</code>, <code>chkrootkit</code>/<code>rkhunter</code>'],
        ['कोई "एktivेशन/लाइसेंस" फ़ोन कॉल नहीं', 'ग्राहक को भरोसा; कोई KMSPico/ crack नहीं = कानूनी सुरक्षा', 'ग्राहक बिल पर "FOSS, no licence cost" लिख सकते हैं'],
        ['प्रदर्शन व सर्वर टूलिंग', 'SMB/CIFS, प्रिंट, डेटाबेस, वेब — एक ही पुरानी मशीन पर', '<code>testparm -s</code>, <code>cupsctl</code>, <code>mysql --version</code>'],
        ['ड्राइवर/हार्डवेयर अनुभव', 'GPU/NVIDIA, वेबकैम, प्रिंटर — पहले <code>lspci -k</code> से मेल खाँचें', 'Ubuntu Certified Hardware लिस्ट, Syslinux/PXE/Clonezilla लैब इमेज'],
        ['सीखने की माँग', 'चैम्बर्स/स्कूल में लिनक्स-ट्रेन्ड सर्वर व नेटवर्क टेक चाहिए', 'RHCSA/LPIC-1/CCNA-जैसी सर्टिफ़िकेशन की तैयारी का हिस्सा'],
        ['नियंत्रण व ऑटोमेशन', '50 PC एक जैसा बनाना (Ansible/Script), मॉनिटरिंग (Nagios/Zabbix)', '<code>ansible all -m ping</code>, <code>crontab -e</code>'],
        ['RTL/हिंदी सपोर्ट', 'हिंदी टाइपिंग व फ़ॉन्ट पहले से; CCC छात्रों के लिए अनुकूल', '<code>fc-list | grep -i noto</code>, IBus/Fcitx5']
      ] },

    { type: 'table', head: ['पहलू', 'लिनक्स', 'विंडोज़', 'छात्र/टेक्नीशियन का फ़ैसला'],
      rows: [
        ['कीमत', 'मुफ़्त; सपोर्ट ख़रीदें तो RHEL/SLES शुल्क', 'Home/Pro एडिशन + CAL लाइसेंस', 'बजट सीमित = लिनक्स; कॉर्पोरेट SLA = RHEL/SLES'],
        ['सॉफ़्टवेयर', 'LibreOffice/GIMP/Blender/VLC/Firefox + native डेवलपर टूल', 'MS Office, Photoshop, AutoCAD, Tally Prime,CorelDRAW', 'पहले ग्राहक के ज़रूरी ऐप <code>wine</code> के विकल्प सहित लिखिए'],
        ['गेमिंग', 'Steam+Proton से अच्छा, फिर भी anti-cheat/कुछ शीर्षक नहीं', 'DirectX 12/UGC के साथ सबसे अच्छा', 'ग्राहक गेमिंग बताए तो विंडोज़ पर ही रहने दें'],
        ['ड्राइवर', 'ज्यादातर kernel/फ़र्मवेयर में; NVIDIA व some Wi-Fi extra work', 'OEM पूरा ड्राइवर सपोर्ट (कभी-कभी बंडल)', 'नया laptop हों तो पहले Ubuntu certified लिस्ट देखें'],
        ['प्रबंधन', 'SSH + एक स्क्रिप्ट से 100 PC; कोई रिबूट नहीं ज़्यादातर अपडेट पर', 'GPO/SCCM/Active Directory परिपक्व', 'स्कूल/ऑफ़िस में AD चाहिए → विंडोज़ सर्वर; लैब/वर्कशॉप → लिनक्स'],
        ['सुरक्षा', 'permission मॉडल + repo signing; रूट-लेवल खतरा कम', 'Defender अच्छा, पर एडवेयर/फ़िशिंग का बड़ा लक्ष्य', 'दोनों में backup व updates ही असली सुरक्षा'],
        ['रिकवरी', '<code>TestDisk/PhotoRec</code> मुफ़्त, chroot/live USB से रिपेयर', "Rufus/WinPE/Hiren's आसान, BitLocker से एन्क्रिप्टेड ड्राइव कठिन", 'NTFS+FAT दोनों एक साथ माउंट कर पाना = लिनक्स का असली सर्विस-फ़ायदा'],
        ['सीखने का समय', 'कमांड-लाइन शुरुआत में भारी; परCCC/ITI syllabus से मेल खाती है', 'GUI-परिचित छात्रों को तुरंत समझ', 'पहले GUI (Mint), फिर टर्मिनल की आदत — यही क्रम सबसे कामयाब'],
        ['अपडेट व्यवहार', 'एक कमांड सब कुछ अपडेट; kernel बदलने पर रीबूट', 'Windows Update अक्सर रीबूट/रिकॉवरी पर जमा', 'लैब के लिए LTS + <code>unattended-upgrades</code>'],
        ['मशीन की उम्र', '2 GB RAM पर भी काम; SSD पर फुर्तीला', 'आधुनिक build 4–8 GB माँगता है', 'पुरानी मशीन = लिनक्स, नई = ग्राहक की पसंद'],
        ['करियर', 'सर्वर/क्लाउड/DevOps/साइबर security में अनिवार्य', 'डेस्कटॉप + एंटरप्राइज़ AD/एक्सचेंज', 'दोनों चाहिए — विंडोज़ से रोज़ी, लिनक्स से सैलरी'],
        ['फ़ाइल सिस्टम/टूल्स', 'ext4/xfs/btrfs, journal, LVM, ZFS, rsync, tar, grep', 'NTFS/ReFS, VSS, PowerShell', 'दोनों के कमांड एक साथ याद रखिए — परीक्षा दोनों माँगती है']
      ] },

    { type: 'steps', items: [
      { n: 'सप्ताह 1', title: 'टर्मिनल व फ़ाइल बेसिक', text: 'Live USB से चलाएँ या VM (VirtualBox) में Ubuntu LTS; <code>pwd, ls -l, cd, mkdir, cp, mv, rm, cat, less, head, tail, man, Tab</code> completion। रोज़ 20 मिनट सिर्फ़ टाइप करना।', tips: '<code>ls /etc | head</code> जैसे छोटे-छोटे लक्ष्य रखें।', warn: 'इस हफ़्ते <code>sudo rm</code> से बिल्कुल दूर रहें।' },
      { n: 'सप्ताह 2', title: 'फ़ोल्डर संरचना व permission', text: '<code>/etc /var /home /usr</code> की सैर — हर फ़ोल्डर में 5 मिनट; <code>chmod/chown/umask</code>, execute bit, <code>ln -s</code>, <code>findmnt/df -hT</code>।', tips: '<code>tree -L 2 /etc | head -40</code> से नक्शा दिखता है।' },
      { n: 'सप्ताह 3', title: 'यूज़र, ग्रुप व पैकेज', text: 'दो छात्र अकाउंट बनाएँ (<code>sudo useradd -m -s /bin/bash student2</code>), ग्रुप में जोड़ें, sudo दें, एक .deb/.rpm इंस्टॉल/पurge करके देखें, <code>dpkg -l | wc -l</code>।', tips: '<code>/etc/passwd</code> व <code>/etc/group</code> की नई लाइन खोजिए।' },
      { n: 'सप्ताह 4', title: 'पहला shell script', text: '<code>#!/bin/bash</code> + वेरियबल + if/for + पाइप; स्क्रिप्ट लिखें जो /home का backup लेकर <code>tar czf</code> बनाए और लॉग लिखे; <code>chmod +x</code> करके cron में डालें।', tips: 'सबसे पहले <code>bash -n script.sh</code> सिंटैक्स जाँचें, फिर <code>bash -x</code> trace।' },
      { n: 'सप्ताह 5', title: 'सर्विस व नेटवर्क', text: '<code>systemctl status/start/enable ssh</code>, Apache/Nginx सर्वर चलाएँ, <code>ip a</code>, <code>ss -lntp</code>, <code>ufw enable + allow 22,80</code>, दूसरी मशीन से <code>ssh</code>/<code>scp</code>।', tips: 'दो VM — एक सर्वर, एक क्लाइंट; यही असली इंटर्नशिप का काम है।' },
      { n: 'सप्ताह 6', title: 'एक पूरा सर्वर प्रोजेक्ट', text: 'लैब के लिए चुनें: Samba फ़ाइल शेयर / DNS + प्रिंट / Nextcloud / Glances+Grafana मॉनिटरिंग। बैकअप नीति + रिस्टोर ड्रिल + 1 पेज का सर्टिफ़िकेशन नोट लिखें।', tips: 'प्रोजेक्ट का नक्शा (/etc/fstab, systemctl enable, cron backup) फ़ोटो खींचकर रखें — पोर्टफ़ोलियो बनेगा।', warn: 'प्रोजेक्ट ऑनलाइन खुला रखें तो सिर्फ़ एक रिसर्च/टेस्ट नेटवर्क में।' }
    ] },

    { type: 'acc', items: [
      { q: 'लिनक्स kernel और distribution में अंतर क्या है?', a: 'kernel = Linus Torvalds का कोर जो hardware, process, memory, FS व network सँभालता है (GPLv2)। distribution = वही kernel + GNU टूल्स + पैकेज मैनेजर + डेस्कटॉप + इंस्टॉलर + सपोर्ट (Ubuntu, Debian, RHEL…)। <code>uname -r</code> पहला दिखाता है, <code>cat /etc/os-release</code> दूसरा।' },
      { q: 'क्या लिनक्स UNIX है?', a: 'नहीं। लिनक्स <b>Unix-like</b> है — POSIX मानक का पालन करता है मगर UNIX का कोड उसमें नहीं है और The Open Group से certified UNIX नहीं (macOS certified है)। इसीलिए "UNIX" नाम का ट्रेडमार्क लिनक्स पर नहीं चलता।' },
      { q: 'GNU/Linux शब्द क्यों कहा जाता है?', a: 'क्योंकि kernel तो Linux है, पर shell (bash), कॉर टूल्स (coreutils), libc (glibc), कंपाइलर (gcc) व बूट लोडर (GRUB) GNU प्रोजेक्ट से आते हैं — 1983 में Stallman ने शुरू किया था। FSF का अनुरोध यही है; आम उपयोग "Linux" ही करता है।' },
      { q: 'एंड्रॉइड लिनक्स है तो Play Store पर apt क्यों नहीं?', a: 'एंड्रॉइड में संशोधित Linux kernel है पर user space अलग — Bionic libc, अपना init, SurfaceFlinger, ART रनटाइम, कोई GNU coreutils/systemd/repo नहीं। यह "Linux-based" है, GNU/Linux डिस्ट्रो नहीं।' },
      { q: '/proc और /sys असली फ़ाइलें हैं?', a: 'नहीं — ये pseudo-filesystem हैं जो RAM में kernel के स्टेट को टेक्स्ट फ़ाइलों जैसा दिखाते हैं। साइज़ 0 दिखता है, रीबूट पर कुछ नहीं बचता; इनमें लिखना यानी kernel को सेटिंग देना (जैसे <code>sysctl -w vm.swappiness=10</code> या echo to /sys/…)।' },
      { q: 'ext4 ही क्यों चुना जाए? XFS/btrfs नहीं?', a: 'ext4 = परिपक्व, छोटे-मंज़ूरे सिस्टम पर कम overhead, बूट/डिबग/रिकवरी टूल (<code>e2fsck, debugfs, tune2fs</code>) सर्वभौमिक, snapshot ज़रूरत नहीं वाली डेस्कटॉप/छोटे सर्वर के लिए सही। बड़ी डिस्क/ज़्यादा फ़ाइलें → XFS (RHEL default), snapshot/रोलबैक/integrity → btrfs या ZFS, पेनड्राइव जो विंडोज़ पर भी खुले → vfat/exFAT।' },
      { q: 'runlevel 1, 3, 5 का मतलब?', a: '1 = single-user/rescue (root shell, maintenance), 3 = multi-user text + network (सर्वर डिफ़ॉल्ट), 5 = graphical (डेस्कटॉप)। 0 = poweroff, 6 = reboot, 2/4 ऐतिहासिक/unused। systemd में समकक्ष: rescue.target, multi-user.target, graphical.target — <code>systemctl get-default</code> से मौजूदा सेटिंग दिखती है।' },
      { q: '~ , . , .. और /dev/null क्या हैं?', a: '<code>~</code> = वर्तमान यूज़र का होम (<code>/home/student</code>), <code>~root</code> = root का होम, <code>.</code> = वर्तमान डायरेक्टरी, <code>..</code> = पैरेंट। <code>/dev/null</code> कैरेक्टर डिवाइस है — जो लिखा जाए वह नष्ट कर देता है और पढ़ने पर EOF; इसलिए <code>cmd 2&gt;/dev/null</code> एरर छिपाता है, <code>&gt;/dev/null</code> आउटपुट फेंकता है। <code>/dev/zero</code> unlimited zero देता है, <code>/dev/random</code> एन्क्रॉप्टी रैंडम।' },
      { q: 'absolute और relative path में फ़र्क़?', a: 'absolute = <code>/</code> से शुरू (<code>/home/student/notes.txt</code>, कोई दो राय नहीं), relative = वर्तमान डायरेक्टरी से (<code>./notes.txt</code>, <code>../img/a.png</code>)। <code>cd /var/log</code> के बाद <code>cat syslog</code> काम करेगा, पर <code>cat /etc/hosts</code> हर जगह। स्क्रिप्ट में relative path तबाही का कारण बनता है — cron/सिस्टम स्क्रिप्ट हमेशा absolute लिखें।' },
      { q: 'क्या सारा डिस्ट्रो knowledge रटने जैसा है?', a: 'नहीं — 3 परिवार (Debian, RHEL, Arch) + 2 पैकेज टूल (apt/dnf) + 2 init (systemd/OpenRC) याद रखिए, बाक़ी इनके ऊपर बना है। किसी नई डिस्ट्रो पर <code>cat /etc/os-release</code> + <code>ps -p 1 -o comm=</code> + <code>which apt dnf pacman</code> से 15 सेकंड में रास्ता मिल जाता है।' }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा व इंटरव्यू — यहाँ से प्रश्न पक्के', html: `<ol>
      <li><b>लिनक्स kernel किसने बनाया?</b> Linus Torvalds, 1991, हेलसिंकी (FINLAND)। <b>UNIX?</b> Ken Thompson + Dennis Ritchie, 1969, Bell Labs। <b>C भाषा?</b> Ritchie, ताकि UNIX portable हो।</li>
      <li><b>GNU का पूरा नाम?</b> "GNU's Not Unix" (recursive) — Richard Stallman, 1983; FSF 1985; GPL 1989।</li>
      <li><b>Kernel बनाम Shell:</b> kernel = hardware व resource का मालिक (ring 0); shell = कमांड पढ़ने वाला user-space प्रोग्राम (bash/zsh)। kernel अकेला कोई कमांड नहीं समझता।' '</li>
      <li><b>POSIX?</b> IEEE 1003 मानक जो Unix-jैसे OS का common API तय करता है — लिनक्स POSIX-अनुरूपी है।</li>
      <li><b>/dev/null?</b> null कैरेक्टर डिवाइस — अनदेखा करने वाला गड्ढा; <code>cmd &gt;/dev/null 2&gt;&amp;1</code> का मतलब आउटपुट व एरर दोनों फेंक दो।</li>
      <li><b>root का UID और home?</b> UID/GID 0, home <code>/root</code>, shell आमतौर पर <code>/bin/bash</code>; passवर्ड <code>/etc/shadow</code> में (passwd में नहीं)।' '</li>
      <li><b>runlevel 1 vs 3 vs 5?</b> 1=single/rescue, 3=text+network, 5=graphical; systemd: rescue/multi-user/graphical.target।' '</li>
      <li><b>फ़ाइल सिस्टम का एक-लाइन नक्शा?</b> /boot = kernel, /etc = कॉन्फ़िग, /var = बढ़ता डेटा/लॉग, /usr = प्रोग्राम, /home = यूज़र, /tmp = अस्थायी, /dev = डिवाइस नोड, /proc-/sys = स्टेट।' '</li>
      <li><b>hard vs symbolic link?</b> hard = उसी inode का दूसरा नाम (अलग FS पर नहीं, डायरेक्टरी पर नहीं); symlink = पथ की फ़ाइल (टूट सकता है, कोई भी पथ)।' '</li>
      <li><b>एक लिनक्स मशीन की पहचान 15 सेकंड में?</b> <code>cat /etc/os-release</code>, <code>uname -a</code>, <code>ps -p 1 -o comm=</code>, <code>which apt dnf pacman zypper apk</code>।' '</li>
      <li><b>हार्ड लिंक हटाने पर डेटा क्यों बचा रहता है?</b> क्योंकि inode का link count > 0 है; डेटा तब हटता है जब link count 0 हो और कोई प्रोसेस open न रखे।' '</li>
    </ol>` },

    /* @@T1@@ */
  ]
},

/* ===================================================================
   48. लिनक्स टर्मिनल व कमांड रिफरेंस
   =================================================================== */
{
  id: 'lin-cli', icon: '👣', group: 'लिनक्स मास्टरक्लास',
  title: 'लिनक्स टर्मिनल व कमांड रिफरेंस',
  sub: 'शेल, फ़ाइल ops, perm, grep/sed/awk, पाइप, cron व systemd रोज़ का काम',
  kicker: 'Linux Masterclass 2 · Terminal & Command Reference',
  hero: 'यह पेज आपका <b>टर्मिनल हाथ-से-हाथ चलाते हुए नोटबुक</b> है — हर कमांड ऐसी ही लिखी है जैसे टाइप करनी है (बाक़ी भाषा हिंदी)। ऊपर की तालिकाएँ छापकर मॉनिटर के नीचे रखिए; नीचे की स्क्रिप्ट अपने लैप पर चलाइए।',
  tags: ['शेल व प्रॉम्प्ट', 'कमांड रिफरेंस', 'grep/sed/awk', 'पाइप व wildcard', 'cron/systemd', 'vim व स्क्रिप्ट'],
  blocks: [

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.1</span> टर्मिनल व शेल — असल में चलता क्या है?</h3>
      <p>आप जो काली खिड़की खोलते हैं वह <b>टर्मिनल एमुलेटर</b> (gnome-terminal, Konsole, xterm) है — यह एक प्रोग्राम है जो कीबोर्ड से टेक्स्ट लेकर एक <b>शेल</b> को देता है और उसका आउटपुट दिखाता है। शेल (<code>bash</code>) फिर कमांड पढ़ता है: पहला शब्द कमांड, बाक़ी पैरामीटर; wildcard खोलता है; पाइप जोड़ता है; <code>cmd &gt; file</code> से आउटपुट भेजता है। <b>कमांड स्वयं शेल का हिस्सा नहीं हैं</b> — <code>ls</code> असल में <code>/usr/bin/ls</code> है (coreutils पैकेज से), जबकि <code>cd, echo, export, alias, jobs</code> शेल के builtin हैं। जाँचिए: <code>type -a ls cd</code>।</p>
      <p>हर कमांड दो धाराएँ (streams) देती/लेती है — <b>stdout (fd 1)</b> सामान्य आउटपुट, <b>stderr (fd 2)</b> एरर, और stdin (fd 0) इनपुट। यही 0/1/2 नंबर <code>2&gt;</code>, <code>&gt;&amp;1</code> में इस्तेमाल होते हैं। एक्ज़िट कोड <code>$?</code> में मिलता है — 0 = सफल, ग़ैर-शून्य = असफल; यह <code>&amp;&amp;</code> / <code>||</code> और <code>if</code> की नींव है।</p>
      <table class="tbl">
        <tr><th>शेल</th><th>कहाँ डिफ़ॉल्ट / कैसे पाएँ</th><th>खासियत</th><th>कब उपयोग करें</th></tr>
        <tr><td><code>sh</code> (POSIX/bourne)</td><td>स्क्रिप्ट की पहली लाइन <code>#!/bin/sh</code>; Debian/Ubuntu पर <code>/bin/sh → dash</code></td><td>सबसे छोटा, केवल मानक सुविधाएँ; arrays/function keywords नहीं</td><td>पोर्टेबल bootstrap स्क्रिप्ट, init स्क्रिप्ट</td></tr>
        <tr><td><code>dash</code></td><td>Ubuntu/Debian में <code>/bin/sh</code> का वास्तविक निशान; तेज़, POSIX</td><td>ख़ूब छोटा व तेज़; इंटरैक्टिव फ़ीचर नहीं</td><td>स्क्रिप्ट रनटाइम — इसीलिए <code>#!/bin/bash</code> लिखें अगर bash-isms हैं</td></tr>
        <tr><td><code>bash</code></td><td>RHEL/Fedora/Ubuntu/most का login shell; <code>echo $SHELL</code></td><td>array, <code>[[ ]]</code>, history, completion, programmable completion, process substitution</td><td>रोज़ का काम व स्क्रिप्टिंग — पहली पसंद,CCC syllabus का मुख्य</td></tr>
        <tr><td><code>zsh</code></td><td>macOS/iTerm/Powerlevel10k इंटरैक्टिव; <code>chsh -s /bin/zsh</code></td><td>बेहतर globbing (<code>**</code>), स्पेलिंग-सुधार, plugin थीम (oh-my-zsh)</td><td>डेवलपर इंटरैक्टिव शेल</td></tr>
        <tr><td><code>fish</code></td><td><code>sudo apt install fish</code></td><td>बाहरी स्क्रिप्ट के बिना autosuggestion व syntax highlight</td><td>नए यूज़र जो POSIX syntax नहीं जानते</td></tr>
        <tr><td><code>ksh</code> / <code>mksh</code></td><td>AIX/Solaris legacy, Android का shell</td><td>POSIX + बड़े फ़ीचर, छोटा footprint</td><td>पुराने UNIX सर्वर, एंड्रॉइड शेल</td></tr>
        <tr><td><code>csh</code>/<code>tcsh</code></td><td>कुछ एकेडमिक/पुराने UNIX</td><td>History editing, alias syntax अलग (<code>alias x 'y'</code>), <code>where</code> builtin</td><td>नई स्क्रिप्ट में न लिखें — खराब error handling</td></tr>
        <tr><td><code>scponly</code>/<code>nologin</code>/<code>/bin/false</code></td><td>सर्विस अकाउंट व restrict किए यूज़र</td><td>लॉगिन-रोकने या सिर्फ़ SFTP देने वाला shell</td><td><code>/etc/passwd</code> में sftp-only यूज़र बनाना</td></tr>
        <tr><td><code>tmux</code>/<code>screen</code> (शेल नहीं, multiplexer)</td><td>SSH सेशन ज़िंदा रखने वाला टूल</td><td>एक ही सेशन में कई windows, detach/reattach</td><td>सर्वर पर लंबे काम — <code>tmux new -s work</code></td></tr>
      </table>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.2</span> bash क्या पढ़ती है — startup फ़ाइलें, prompt व history</h3>
      <p>लॉगिन पर bash फ़ाइलें इस क्रम में पढ़ती है। <b>Login shell</b> (SSH, tty लॉगिन, <code>su -</code>): <code>/etc/profile</code> → फिर पहली मिली फ़ाइल <code>~/.bash_profile</code> → <code>~/.bash_login</code> → <code>~/.profile</code> ; नॉन-लॉगिन के बाद logout पर <code>~/.bash_logout</code>। <b>Non-login interactive shell</b> (terminal emulator window): <code>/etc/bash.bashrc</code> → <code>~/.bashrc</code>। इसलिए Ubuntu/GNOME terminal में <code>~/.bashrc</code> ही असली जगह है; मगर कई डिस्ट्रो का <code>~/.profile</code> पहले <code>~/.bashrc</code> को source करता है — इसीलिए दोनों में सेटिंग ठीक रहती हैं। <b>हर स्क्रिप्ट नई bash</b> (subshell) है और startup फ़ाइलें नहीं पढ़ती — इसलिए स्क्रिप्ट में alias पर निर्भर न रहें।</p>
      <table class="tbl">
        <tr><th>फ़ाइल</th><th>कौन पढ़ता है</th><th>क्या रखें</th></tr>
        <tr><td><code>/etc/profile</code>, <code>/etc/profile.d/*.sh</code></td><td>सबके login shell</td><td>system-wide PATH, प्रॉम्प्ट पैच, मॉड्यूल लोड (module use)</td></tr>
        <tr><td><code>~/.bashrc</code></td><td>हर interactive non-login shell</td><td>alias, PS1, completion, history सेटिंग, PATH जोड़</td></tr>
        <tr><td><code>~/.bash_profile</code> / <code>~/.profile</code></td><td>login shell (पहली जो मिले)</td><td>एक बार के काम: PATH export, ssh-agent, pyenv init</td></tr>
        <tr><td><code>~/.bash_logout</code></td><td>login shell बंद पर</td><td><code>clear</code>, टूल-chain unset</td></tr>
        <tr><td><code>/etc/environment</code>, <code>~/.pam_environment</code></td><td>PAM (GUI लॉगिन सहित)</td><td>LANG/LC_*, proxy — desktop session के लिए</td></tr>
        <tr><td><code>~/.inputrc</code>, <code>/etc/inputrc</code></td><td>readline (bash/zsh का इंटरैक्टिव engine)</td><td>की-बाइंडिंग, <code>set completion-ignore-case on</code>, <code>history-size</code></td></tr>
      </table>
      <h4 class="blk2">प्रॉम्प्ट (PS1) और history</h4>
      <p><code>PS1</code> primary prompt, <code>PS2</code> continuation prompt (आधा कमांड छोड़ें तो दिखता है <code>&gt;</code>)। आम escapes: <code>\\u</code> यूज़र, <code>\\h</code> host, <code>\\w</code> पूरा path, <code>\\W</code> सिर्फ़ डायरेक्टरी, <code>\\$</code> (root पर #), <code>\\d \\t</code> तारीख/समय, <code>\\n</code> नई लाइन, <code>\\[ \\]</code> रंग कोड (non-printing marker)। रंग ANSI से: <code>\\[\\e[32m\\]</code> हरा।</p>
      <p>History: <code>~/.bash_history</code>, <code>HISTSIZE</code> (मेमोरी में) व <code>HISTFILESIZE</code> (फ़ाइल में), <code>HISTTIMEFORMAT</code> (समय के साथ), <code>HISTCONTROL=ignoreboth</code> (space-start व डुप्लिकेट छोड़ें), <code>HISTIGNORE</code>। याद रखने योग्य घटनाएँ: <code>!!</code> (पिछली कमांड — <code>sudo !!</code> सबसे उपयोगी), <code>!$</code> या <code>$_</code> (आख़िरी argument), <code>!n</code> nवीं एंट्री, <code>!ssh</code> ssh से शुरू होने वाली आख़िरी, <code>^old^new</code> तुरंत सुधारकर रन, <code>Ctrl+R</code> reverse search, <code>history | tail -20</code>, <code>fc</code> संपादक में खोलता है।</p>
      <p class="note">सेटिंग <code>~/.bashrc</code> में लिखने के बाद तुरंत लागू करने के लिए: <code>source ~/.bashrc</code> (नई window खोलना भी चलता है)।</p>` },

    { type: 'code', code: `# ---- कौन-सा शेल/OS चल रहा है ----
echo "$SHELL" ; echo "$0" ; ps -p $$ -o pid=,comm=      # current shell
cat /etc/shells                                          # मंज़ूर शेल की सूची
chsh -s /bin/bash                                        # डिफ़ॉल्ट शेल बदलें (logout+login)
chsh -s /usr/bin/fish                                    # /etc/shells में होना चाहिए
getent passwd "$USER" | cut -d: -f7                      # आपका लॉगिन shell
grep -E 'bash|zsh' /etc/passwd | cut -d: -f1-2           # कौन-कौन bash से लॉगिन करते हैं
cat /etc/os-release ; uname -a ; echo "$OSTYPE $MACHTYPE"
bash --version ; echo "$BASH_VERSION"

# ---- prompt (PS1) को काम की बनाना ----
PS1='[\\u@\\h \\W]\\$ '                       # पुराना POSIX-सादा
PS1='\\n\\[\\e[1;32m\\]\\u@\\h\\[\\e[0m\\]:\\[\\e[1;34m\\]\\w\\[\\e[0m\\] \\$ '   # रंगीन
PS1='\\d \\t \\w \\$ '                        # तारीख + समय + path (लैब रिकॉर्ड के लिए)
PS2='... > '                                # continuation prompt
PROMPT_COMMAND='history -a'                 # हर कमांड तुरंत history फ़ाइल में
export PS1 ; echo "$PS1"
alias la='ls -Alh' ; alias ll='ls -alF' ; alias ..='cd ..' ; alias grep='grep --color=auto'
alias duh='du -sh * | sort -h'
unalias la ; type -a ll ; alias | sort      # alias दिखें/हटें
myip() { curl -s ifconfig.me; echo; }       # फ़ंक्शन भी alias जैसा चलेगा
export -f myip                              # subroutine को shell में दिखाना
declare -f myip | less

# ---- history व्यवस्था ----
export HISTSIZE=5000 HISTFILESIZE=10000
export HISTTIMEFORMAT='%F %T  '             # तारीख-समय के साथ
export HISTCONTROL=ignoreboth ; export HISTIGNORE='ls:pwd:exit:clear'
history -c ; history -w ; history | tail -30
history 100-120 ; fc -l -20 ; !! ; !$ ; !73 ; !!:p ; ^typo^typo^
set -o history ; getent passwd | head -1 ; echo $? ; set +o history   # अस्थायी रूप से रोकें
tail -5 ~/.bash_history ; wc -l ~/.bash_history
bind -p | grep -i 'search-history'          # readline bindings जाँच
echo 'set completion-ignore-case on' >> ~/.inputrc` },

    { type: 'table', head: ['कीज़', 'क्या करती है', 'ध्यान रखने योग्य'],
      rows: [
        ['<code>Ctrl</code>+<code>A</code> / <code>E</code>', 'लाइन की शुरू / अंत तक jump', 'arrow keys से तेज़; readline का मानक (Emacs-style)'],
        ['<code>Ctrl</code>+<code>U</code>', 'कर्सर से पहले का सब काटो (cut-buffer में)', 'paste: <code>Ctrl</code>+<code>Y</code> — पासवर्ड गलत टाइप किया हो तो साफ़ करने का तरीक़ा'],
        ['<code>Ctrl</code>+<code>K</code>', 'कर्सर से लाइन के अंत तक काटो', 'बार-बार दबाएँ तो सब कट होता है'],
        ['<code>Ctrl</code>+<code>W</code>', 'पिछला शब्द (path हिस्सा) काटो', 'ग़लत path सुधारने में सबसे तेज़'],
        ['<code>Alt</code>+<code>B</code> / <code>F</code> या <code>Ctrl</code>+<code>←/→</code>', 'शब्द-दर-शब्द पीछे/आगे', 'टर्मिनल emulator में Alt दबाना सेटिंग चाहिए'],
        ['<code>Ctrl</code>+<code>L</code>', 'स्क्रीन साफ़ (clear जैसा)', 'prompt व history सुरक्षित रहती है'],
        ['<code>Ctrl</code>+<code>C</code>', 'चलती कमांड पर SIGINT (रोको)', 'फँसी कमांड पर पहला प्रयास'],
        ['<code>Ctrl</code>+<code>D</code>', 'EOF — खाली लाइन पर शेल/कमांड बंद', 'terminal गलती से बंद न हो, logout से पहले सोचें'],
        ['<code>Ctrl</code>+<code>Z</code>', 'रोककर background में भेजो (SIGTSTP)', 'वापस लाने को <code>fg</code>; असली kill नहीं — <code>kill %1</code>'],
        ['<code>Ctrl</code>+<code>S</code> / <code>Q</code>', 'स्क्रीन फ़्रीज़ / अनफ़्रीज़ (XOFF/XON)', 'आउटपुट "जम" जाए तो यही कारण — <code>stty -ixon</code> से बंद करें'],
        ['<code>Tab</code>', 'completion (नाम/विकल्प)', 'दो बार Tab = विकल्प सूची; long-option completion के लिए bash-completion पैकेज'],
        ['<code>Ctrl</code>+<code>Alt</code>+<code>T</code> (आम)', 'नई terminal window (DE-निर्भर)', 'आसान: फ़ाइल मैनेजर के address bar में <code>F4</code> (Thunar/Dolphin)'],
        ['<code>Ctrl</code>+<code>Shift</code>+<code>C</code> / <code>V</code>', 'terminal में copy/paste', 'Ctrl+C से अलग — यहाँ Clipboard; middle-click paste भी चलता है'],
        ['<code>Ctrl</code>+<code>R</code>', 'history में reverse search', 'एक बार और <code>Ctrl</code>+<code>R</code> = पिछला match'],
        ['<code>PageUp</code>/<code>PageDown</code> (scrollback)', 'ऊपर/नीचे स्क्रॉल', 'tmux/screen में copy-mode के बटन अलग'],
        ['<code>Alt</code>+<code>↑/↓</code> या <code>↑</code>/<code>↓</code>', 'history browse', 'टाइप करके <code>↑</code> दबाएँ तो उसी से शुरू होने वाली कमांड मिलती है'],
        ['<code>Ctrl</code>+<code>←</code>/<code>→</code> (zsh/fish)', 'word jump (bash में Alt+B/F)', 'readline में <code>\\e[1;5C</code> bindings से सक्रिय होता है'],
        ['<code>Ctrl</code>+<code>_</code> / <code>Ctrl</code>+<code>Shift</code>+<code>Z</code>', 'undo (readline)', 'ग़लती से कमांड मिटाई तो पहले यही आजमाएँ'],
        ['<code>Ctrl</code>+<code>Alt</code>+<code>F1…F6</code>', 'virtual console (tty1–tty6) पर switch', 'graphical session कहीं और (F1/F2/F7); वापसी के लिए अक्सर <code>Ctrl</code>+<code>Alt</code>+<code>F2</code>'],
        ['<code>Ctrl</code>+<code>Alt</code>+<code>Del</code>', 'systemd पर तुरंत reboot (SIGINT handler)', '<code>systemctl reboot</code> जैसा; रोकें: <code>systemctl mask ctrl-alt-del.target</code>'],
        ['<code>jobs</code> / <code>fg %1</code> / <code>bg %1</code> / <code>kill %1</code>', 'background सेशन देखना/लाना/चलाना/मारना', '<code>%1</code> job number है, PID नहीं; <code>disown</code> से parent से अलग'],
        ['<code>&amp;</code> / <code>nohup … &amp;</code> / <code>screen -r</code>', 'कमांड को background / सेशन-मुक्त चलाना', 'SSH छूटने पर काम न रुके — इसके लिए tmux सबसे भरोसेमंद'],
        ['<code>Ctrl</code>+<code>O</code> (readline)', 'accept-line — लाइन को स्वीकार कर रन', 'हर शेल में नहीं; Emacs-like bindings का हिस्सा']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.3</span> टर्मिनल एमुलेटर, वर्चुअल कंसोल व X/Wayland नोट</h3>
      <p>आम emulator: <b>GNOME Terminal</b> (VTE engine, टैब + split), <b>Konsole</b> (KDE, split + profiles), <b>XFCE Terminal</b>, <b>xterm</b> (सबसे पुराना, हर जगह), <b>Alacritty/kitty/WezTerm</b> (GPU-तेज़, कॉन्फ़िग फ़ाइल से), <b>tilix</b> (tiling)। टैब: <code>Ctrl+Shift+T</code>, नई window <code>Ctrl+Shift+N</code>, टैब बंद <code>Ctrl+Shift+W</code>, ज़ूम <code>Ctrl++ / Ctrl+-</code>।</p>
      <p><b>वर्चुअल कंसोल (tty):</b> <code>Ctrl+Alt+F1…F6</code> असली text कंसोल हैं — GUI जाम हो जाए तो यहीं से लॉगिन करके <code>systemctl isolate multi-user.target</code> या service रोकें। कहाँ graphical चलता है, डिस्ट्रो के हिसाब से बदलता है (Ubuntu पर अक्सर F1/F2, फ़ेडोरा/पुराने सिस्टम पर F7); वापसी के लिए वही key दबाएँ या <code>chvt 7</code>। कंसोल पर टाइप दिखने में देर/अधूरा हो तो emulator का font/encoding जाँचें; tty पर <code>setfont /usr/share/consolefonts/Lat-Gr2-16.psf.gz</code> से फ़ॉन्ट बदलते हैं (देवनागरी tty पर सीधे नहीं दिखती — इसलिए हिंदी के लिए GUI terminal इस्तेमाल करें)।</p>
      <p><b>X11 बनाम Wayland:</b> X11 में कमांड <code>xhost, xrandr, xdotool, xclip, scrot, xbacklight</code> आज़ादी से काम करते हैं; Wayland पर security के कारण कई नहीं चलते — स्क्रीनशॉट <code>grim</code>, रिकॉर्ड <code>wayland-scrcpy/wl-mirror</code>, क्लिपबोर्ड <code>wl-copy/wl-paste</code>, resolution <code>kscreen-randr/xdg</code> से। <code>echo $XDG_SESSION_TYPE</code> से पहचानें। X11 ऐप Wayland पर <code>xwayland-run – app</code> या अपने आप चलते हैं; NVIDIA + Wayland पुराने driver पर परेशानी देती थी (आधुनिक 555+ में ठीक)।</p>
      <p class="note">सर्वर/SSH के लिए असली "terminal" ज़रूरत नहीं — <code>ssh user@host</code> के बाद हर tty कमांड वही काम करती है। लैब में पुराने PC पर कंसोल-टूल <code>tmux</code> से कई सेशन एक ही स्क्रीन पर रखें।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.4</span> यह कमांड रिफरेंस कैसे पढ़ें</h3>
      <p>नीचे की तालिकाएँ रोज़ के काम के हिसाब से बँटी हैं — हर पंक्ति में <b>कमांड</b> (विकल्पों सहित), <b>क्या करती है</b>, <b>उदाहरण</b> जैसा टाइप करना है। कुल मिलाकर 200 से ज़्यादा रियल कमांड हैं; कम-से-कम 90 को बिना देखे टाइप करना CCC/ITI की तैयारी है।</p>
      <ul>
        <li><b>विकल्प याद रखने का तरीक़ा:</b> <code>-l</code> long listing, <code>-a</code> all (छिपी भी), <code>-h</code> human-readable, <code>-r</code> reverse/recursive (संदर्भ से), <code>-f</code> force/follow, <code>-v</code> verbose, <code>-n</code> number/new, <code>-i</code> interactive/inode, <code>-q</code> quiet। GNU "<code>--</code>" वाले long option हमेशा ज़्यादा स्पष्ट होते हैं — स्क्रिप्ट में इन्हें रखें।</li>
        <li><b>मदद चार जगह से:</b> <code>cmd --help</code> (तेज़), <code>man cmd</code> (पूरा), <code>man -k keyword</code>/<code>apropos keyword</code> (खोज), <code>tldr cmd</code> (अगर इंस्टॉल हो, उदाहरण-आधारित) और <code>info cmd</code> (GNU का मैनुअल)।</li>
        <li><b>कमांड कहाँ से आती है</b> पहचानें: <code>which cmd</code> / <code>command -v cmd</code>, फिर <code>dpkg -S</code> या <code>rpm -qf</code> से पैकेज नाम।</li>
        <li><b>जो खतरनाक हैं</b> उन्हें दोबारा सोचकर टाइप करें: <code>rm -rf</code>, <code>mkfs</code>, <code>dd</code>, <code>chmod -R 777</code>, <code>chown -R</code>, <code>userdel -r</code>, <code>kill -9</code>, <code>Parted resize</code>, <code>iptables -F</code>।</li>
      </ul>` },

    { type: 'table', head: ['कमांड', 'क्या करती है', 'उदाहरण'],
      rows: [
        ['<code>pwd</code>', 'वर्तमान डायरेक्टरी का पूरा पथ', '<code>pwd</code> · <code>pwd -P</code> (symlink resolve करके)'],
        ['<code>ls -l -a -h -t -S -i -F -1 --color</code>', 'long / all / human / time-sort / size-sort / inode / type-marker / एक-कॉलम / रंग', '<code>ls -lAh</code> · <code>ls -lt | head</code> · <code>ls -1 --color=always</code>'],
        ['<code>ls -X --group-directories-first</code>', 'एक्सटेंशन से समूह, फ़ोल्डर पहले', '<code>ls -X --group-directories-first ~/Downloads</code>'],
        ['<code>cd</code> / <code>cd -</code> / <code>cd ~user</code>', 'जाना / पिछली जगह वापस / किसी और के होम', '<code>cd /var/log && cd -</code>'],
        ['<code>pushd</code> / <code>popd</code> / <code>dirs</code>', 'डायरेक्टरी-स्टैक से कई जगहों में quick switch', '<code>pushd /etc</code> · <code>pushd /var/www</code> · <code>popd</code>'],
        ['<code>tree -L 2 -d</code>', 'पेड़ दिखाना (2 लेवल, सिर्फ़ डायरेक्टरी)', '<code>tree -L 2 /etc | less</code> · <code>tree -a -I \'.git\'</code>'],
        ['<code>echo</code> / <code>printf</code>', 'लाइन छापना / format के साथ (C-जैसा)', '<code>printf \u0027%03d %s\\n\u0027 7 file</code> · <code>echo -e \u0027a\\tb\u0027</code>'],
        ['<code>which</code> / <code>command -v</code>', 'कमांड का बाइनरी पथ', '<code>which python3</code> · <code>command -v rsync || echo \u0027no rsync\u0027</code>'],
        ['<code>whereis</code>', 'बाइनरी + man + सोर्स की जगह', '<code>whereis nginx</code>'],
        ['<code>type -a</code>', 'builtin/filename/alias — कमांड की असल पहचान', '<code>type -a ls cd echo</code>'],
        ['<code>alias</code> / <code>unalias</code>', 'छोटा नाम बनाना/हटाना', '<code>alias ll=\u0027ls -Alh\u0027</code> · <code>alias | sort</code>'],
        ['<code>man</code> / <code>man -k</code> / <code>man 5 passwd</code>', 'मैनुअल / कीवर्ड खोज / section (1 कमांड, 5 फ़ाइल, 8 सिस्टम कॉल)', '<code>man tar</code> · <code>man -k compress</code> · <code>apropos firewall</code>'],
        ['<code>info</code> / <code>help</code> / <code>bzless</code>', 'GNU का मैनुअल / builtin की मदद / gzip का दस्तावेज़', '<code>info coreutils \u0027ls invocation\u0027</code> · <code>help cd</code>'],
        ['<code>date</code> + format', 'तारीख-समय; फ़ाइल नाम में उपयोगी', '<code>date +%F_%H-%M</code> · <code>date -d \u00272 hours ago\u0027</code> · <code>date -s \u00272026-01-01 09:00\u0027</code>'],
        ['<code>cal 2026</code> / <code>cal 03 2026</code>', 'महीने/साल का कैलेंडर', '<code>cal -3</code> (पिछला-अगला महीने)'],
        ['<code>uptime</code> / <code>w</code> / <code>who</code> / <code>last</code> / <code>lastb</code>', 'चालू समय+load / कौन-क्या कर रहा / लॉगिन सूची / पिछले लॉगिन / फेल लॉगिन', '<code>uptime</code> · <code>last -n 10 -a</code> · <code>sudo lastb</code>'],
        ['<code>whoami</code> / <code>id</code> / <code>id -u nginx</code>', 'नाम / UID-GID-ग्रुप पूरा', '<code>id student1</code> · <code>id -nG</code>'],
        ['<code>hostname</code> / <code>hostnamectl</code>', 'सिस्टम नाम देखना/सेट करना', '<code>hostnamectl set-hostname lab-pc07</code> · <code>hostname -I</code>'],
        ['<code>uname -a / -r / -m / -n</code>', 'kernel सब / release / arch / nodename', '<code>uname -mrs</code> (जैसे Linux 6.1 x86_64)'],
        ['<code>lsb_release -a</code> / <code>cat /etc/os-release</code>', 'डिस्ट्रो का नाम व वर्ज़न', '<code>cat /etc/os-release | head -5</code>'],
        ['<code>env</code> / <code>printenv PATH</code> / <code>export -p</code>', 'environment सूची / एक वैल्यू / export दिखें', '<code>printenv | sort | less</code> · <code>env | grep -i proxy</code>'],
        ['<code>tty</code> / <code>mesg n</code>', 'कौन-सा terminal / wall मैसेज बंद', '<code>tty</code> → /dev/pts/2'],
        ['<code>basename</code> / <code>dirname</code> / <code>realpath</code>', 'पथ से नाम / डायरेक्टरी / असली पूर्ण पथ', '<code>basename /a/b/file.txt</code> → file.txt'],
        ['<code>stat -c \u0027%n %i %a %U %s %y\u0027</code>', 'inode, perm, मालिक, साइज़, समय एक लाइन में', '<code>stat -c \u0027%s bytes, %y\u0027 report.pdf</code>'],
        ['<code>file</code> / <code>file -z</code>', 'असला प्रकार (magic bytes), MIME,संपीड़न (compression) जानकारी', '<code>file /dev/sda1</code> · <code>file image.jpg | cut -d: -f2</code>'],
        ['<code>du -sh *</code> / <code>du -ah --max-depth=1</code>', 'हर आइटम का साइज़ (space कौन खा रहा)', '<code>sudo du -sh /var/* | sort -h</code> · <code>ncdu /</code>'],
        ['<code>df -hT</code> / <code>df -i</code>', 'माउंट की जगह % + FS / inode उपयोग', '<code>df -hT | grep -v tmpfs</code>'],
        ['<code>free -h</code> / <code>vmstat 1 5</code>', 'RAM/swap/buffer-cache / प्रति सेकंड स्टेट', '<code>free -m</code> · <code>vmstat 1</code>'],
        ['<code>lsblk -f</code> / <code>sudo blkid</code>', 'डिस्क पेड़ + FS + UUID / partition पहचान', '<code>lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS</code>'],
        ['<code>lscpu</code> / <code>lsmem</code> / <code>lscpu -p</code>', 'CPU कोर/आर्किटेक्चर / मेमोरी ब्लॉक', '<code>lscpu | grep -E \u0027^CPU\\(s\\)|Thread\u0027</code>'],
        ['<code>lsusb -t</code> / <code>lspci -nnk</code>', 'USB पेड़ / PCI कार्ड + kernel driver', '<code>lspci -nnk | grep -A3 -i vga</code>'],
        ['<code>sudo dmidecode -t 2 -t 13</code>', 'बोर्ड/BIOS/सीरियल (SMBIOS) — पहचान का सबसे पक्का तरीक़ा', '<code>sudo dmidecode -s system-product-name</code>'],
        ['<code>inxi -Fxz</code> / <code>hardinfo</code>', 'एक पेज की पूरी हार्डवेयर रिपोर्ट (Repo से install)', '<code>inxi -Fxz | head -40</code>'],
        ['<code>top</code> / <code>htop</code> / <code>btop</code>', 'लाइव प्रोसेस/लोड/मेमोरी (इंटरैक्टिव)', '<code>htop -u nginx</code> · <code>top -o %MEM</code>'],
        ['<code>iostat -xz 1</code> / <code>sar 1 5</code>', 'डिस्क I/O व CPU नेटवर्क स्टैटिस्टिक्स (sysstat)', '<code>iostat -xz 1 3</code> · <code>sar -n DEV 1</code>'],
        ['<code>dmesg -T --level=err,warn</code>', 'kernel बफ़र लॉग — बूट/hotplug/ड्राइवर एरर', '<code>sudo dmesg -w</code> (लाइव) · <code>dmesg | grep -i firmware</code>']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.5</span> फ़ाइल व डायरेक्टरी के काम — बनाना, कॉपी, मूव, मिटाना</h3>
      <p>लिनक्स में फ़ाइल "मिटाना" असल में <b>unlink</b> है — नाम हटता है, inode का link count 1 कम होता है, और count 0 होने पर ब्लॉक खाली मान लिए जाते हैं। डेटा उसी क्षण नहीं मिटता, पर अगला लिखना उसे कहीं भी दबा सकता है। यही कारण है कि (क) <code>rm</code> के बाद रिकवरी भरोसेमंद नहीं और (ख) खुली फ़ाइल को <code>rm</code> करने पर डिस्क स्पेस तब तक वापस नहीं आता जब तक प्रोसेस बंद न हो — ऐसी "ग़ायब" फ़ाइलें <code>sudo lsof +L1</code> या <code>lsof | grep deleted</code> से दिखती हैं।</p>
      <ul>
        <li><b>मिटाने का सुरक्षित तरीक़ा:</b> पहले <code>ls -l</code> या <code>echo rm *.tmp</code> से दिखिए, फिर चलाइए। <code>rm -i</code> हर बार पूछता है, <code>rm -I</code> सिर्फ़ बड़े ऑपरेशन पर, और डिफ़ॉल्ट <code>--preserve-root</code> <code>rm -rf /</code> को रोकता है (इसलिए <code>sudo rm -rf /*</code> पर भी अलग से <code>--no-preserve-root</code> चाहिए — कभी न लिखें)। बल्क डिलीट के लिए <code>find . -name \u0027*.tmp\u0027 -print</code> → संतोष → <code>… -delete</code>।</li>
        <li><b>बैकअप-कॉपी:</b> <code>cp -a</code> archive मोड है — permission, मालिकी, timestamp व symlink बचाता है; रोज़ के सिंक के लिए <code>rsync -avh --delete source/ dest/</code>। <b>नोट:</b> source के बाद <code>/</code> मतलब "अंदर का कंटेंट", बिना <code>/</code> मतलब "फ़ोल्डर भी" — यही ग़लती सबसे ज़्यादा टूट-फूट करवाती है।</li>
        <li><b><code>mv</code> का असली स्वभाव:</b> एक ही partition पर यह केवल rename कॉल है — 40 GB का फ़ोल्डर भी सेकंड-भर में; दूसरे partition पर copy + delete होता है, इसलिए समय व जगह दोनों चाहिए।</li>
        <li><b>Windows से आई फ़ाइल का रोग:</b> लाइन-एंड <code>\\r\\n</code> की वजह से स्क्रिप्ट नहीं चलती (<code>/bin/bash^M: bad interpreter</code>)। सुधार: <code>dos2unix f</code> या <code>tr -d \u0027\\r\u0027 &lt; f &gt; f2</code> या <code>sed -i \u0027s/\\r$//\u0027 f</code>; जाँच <code>file f</code> / <code>cat -A f | head</code>।</li>
        <li><b>असली प्रकार नाम से नहीं:</b> <code>file</code>, <code>stat</code>, <code>lsblk -f</code>, <code>blkid</code> magic bytes पढ़ते हैं; इसलिए <code>docx</code> असल में zip, <code>.exe</code> लिनक्स पर न चले तो <code>file</code> से पहचान (Wine/PE को दिखाना)।</li>
        <li><b>एक साथ कई रिनेम:</b> Debian/Ubuntu का <code>rename</code> Perl-आधारित (<code>rename \u0027y/ /_/\u0027 *.txt</code>), RHEL/Fedora का <code>rename</code> util-linux का (<code>rename .txt .md *.txt</code>) — syntax अलग है, पहले <code>man rename</code> देखें; हर जगह चलने वाला तरीक़ा for-लूप (<code>for f in *.JPG; do mv "$f" "\${f%.JPG}.jpg"; done</code>)।</li>
      </ul>
      <table class="tbl">
        <tr><th>काम</th><th>सही टूल</th><th>ध्यान रखें</th></tr>
        <tr><td>एक जगह से दूसरी जगह पूरी कॉपी</td><td><code>cp -a src/ dst/</code></td><td>हर बार फिर से पूरी कॉपी; बड़े डेटा पर धीमा</td></tr>
        <tr><td>बढ़ता/आवर्ती (incremental) बैकअप</td><td><code>rsync -avh --delete --progress src/ dst/</code></td><td>केवल बदली फ़ाइलें जाती हैं; <code>--delete</code> dst से अतिरिक्त हटाता है — पहले <code>-n</code> (dry run)</td></tr>
        <tr><td>नेटवर्क पर फ़ाइल भेजो/लाओ</td><td><code>scp -r user@host:/path .</code> · <code>rsync -avh -e ssh src/ user@host:dst/</code></td><td>scp में port <code>-P 2222</code> (बड़ा P); rsyncresume करने में बेहतर</td></tr>
        <tr><td>Pendrive/HDD की पूरी image</td><td><code>sudo dd if=/dev/sdb of=sdb.img bs=4M status=progress conv=fsync</code></td><td>if/of उलटने पर डिस्क मिट जाती है; रिस्टोर में <code>if=sdb.img of=/dev/sdb</code></td></tr>
        <tr><td>खराब/बैड-सेक्टर डिस्क से इमेज</td><td><code>sudo ddrescue -d -f -r3 /dev/sda sda.img sda.log</code></td><td>रुककर फिर वही कमांड चलाएँ तो resume होता है (लॉग फ़ाइल ज़रूरी)</td></tr>
        <tr><td>टेस्ट के लिए बड़ी पर हल्की फ़ाइल</td><td><code>truncate -s 5G big.bin</code> · <code>dd if=/dev/urandom of=k.bin bs=1M count=512</code></td><td>truncate sparse बनाता है (<code>du</code> छोटा, <code>ls -l</code> बड़ा); urandom असली डेटा</td></tr>
        <tr><td>सुरक्षित अस्थायी फ़ाइल/फ़ोल्डर</td><td><code>t=$(mktemp)</code> · <code>d=$(mktemp -d)</code></td><td>स्क्रिप्ट में_fixed_</td></tr>
        <tr><td>स्क्रिप्ट को bin में install करना</td><td><code>sudo install -m 755 mytool.sh /usr/local/bin/mytool</code></td><td><code>install -d</code> डायरेक्टरी भी बना देता है (<code>install -d -m 770 /srv/app</code>)</td></tr>
      </table>` },

    { type: 'table', head: ['कमांड', 'क्या करती है', 'उदाहरण (जैसे टाइप करें)'],
      rows: [
        ['<code>touch</code>', 'नई खाली फ़ाइल / mtime-atime बदलना', '<code>touch notes.txt</code> · <code>touch -d "2026-01-05 09:30" a.txt</code> · <code>touch -r ref.txt new.txt</code>'],
        ['<code>mkdir -p -m -v</code>', 'डायरेक्टरी, पैरेंट भी बना दे (-p)', '<code>mkdir -p ~/lab/{day1,day2}</code> · <code>mkdir -m 750 /srv/shared</code>'],
        ['<code>rmdir</code>', 'केवल खाली डायरेक्टरी हटाता है (सुरक्षित)', '<code>rmdir ~/lab/temp</code> · <code>rmdir -p a/b/c</code>'],
        ['<code>rm -i -I -v -rf --one-file-system</code>', 'हटाना; <code>-r</code> डायरेक्टरी; <code>-f</code> पूछे बिना', '<code>rm -i *.tmp</code> · <code>rm -rf ./build</code> · <code>sudo rm -rf /mnt/usb/.Trash*1</code>'],
        ['<code>shred -u -n -z</code>', 'बार-बार लिखकर मिटाओ (रिकवरी रोको)', '<code>shred -u -n 3 secret.tar</code> · SSD पर भरोसा मत रखिए — crypto-erase बेहतर'],
        ['<code>truncate -s +/-</code>', 'फ़ाइल का साइज़ सेट/घटाओ/बढ़ाओ (sparse)', '<code>truncate -s 1G disk.img</code> · <code>truncate -s -10M file</code>'],
        ['<code>cp -a/-i/-u/-n/-v/--reflink</code>', 'कॉपी; <code>-a</code> बैकअप-मोड, <code>-u</code> सिर्फ़ नई', '<code>cp -a /etc /etc-backup</code> · <code>cp -vu *.pdf ~/docs/</code>'],
        ['<code>mv -i/-u/-n/-t/-v</code>', 'मूव + रिनेम; <code>-t</code> से target डायरेक्टरी', '<code>mv report.odt ~/Documents/</code> · <code>mv -t ~/Pictures *.jpg</code>'],
        ['<code>rename</code> (Perl / util-linux)', 'एक साथ कई रिनेम — डिस्ट्रो पर syntax बदलता है', '<code>rename \u0027y/ /_/\u0027 *.mp3</code> · <code>rename .txt .md *.txt</code> · पहले <code>rename -n</code> (देखो)'],
        ['<code>ln -s / ln (hard) / ln -f -b</code>', 'symlink बनाओ / hard link / मौजूदा को बदलो-बैकअप', '<code>ln -s /mnt/data/project ~/Desktop/project</code> · <code>ln -sfv target link</code>'],
        ['<code>cat</code> / <code>cat -n -A -T -s</code>', 'पूरी फ़ाइल छापो / नंबर / <code>$</code>-TAB दिखाओ / खाली लाइनें दबाओ', '<code>cat a.txt b.txt &gt; all.txt</code> · <code>cat -A windows.txt</code> · <code>cat &gt; note.txt</code> (Ctrl+D)'],
        ['<code>tac</code>', 'उल्टे क्रम में (आख़िरी लाइन पहले)', '<code>tac /var/log/syslog | head</code>'],
        ['<code>less</code> / <code>more</code>', 'पेज-दर-पेज पढ़ो (less आगे-पीछे दोनों) — keys: <code>Space /b /q /G /g</code>, <code>/शब्द</code>, <code>n</code>', '<code>less -N notes.txt</code> · <code>less +F app.log</code> (tail -f जैसा) · <code>less -S wide.csv</code>'],
        ['<code>head -n -c</code>', 'शुरू की लाइनें/बाइट', '<code>head -n 20 big.csv</code> · <code>head -c 64 dump.bin | xxd</code>'],
        ['<code>tail -f -F -n +N</code>', 'अंत दिखाओ / लाइव फ़ॉलो / Nवीं लाइन से', '<code>tail -f /var/log/syslog</code> · <code>tail -F -n 100 access.log</code> (रोटेट होने पर भी) · <code>tail -n +2 data.csv</code>'],
        ['<code>nl</code> / <code>fold -w</code> / <code>fmt</code>', 'लाइन नंबर / लाइनें मोड़ो / पैराग्राफ़ भरो', '<code>nl script.sh</code> · <code>fold -w 70 long.txt</code> · <code>fmt -w 80 notes.md</code>'],
        ['<code>od -c -x</code> / <code>hexdump -C</code> / <code>xxd -r</code>', 'बाइनरी को hex/char में देखो / वापस बनाओ', '<code>xxd /etc/shadow | head -3</code> · <code>hexdump -C boot.bin | grep -i efi</code> · <code>xxd -r hex.txt out.bin</code>'],
        ['<code>strings -a -n 6</code>', 'बाइनरी से पठनीय टेक्स्ट निकालो', '<code>strings firmware.bin | grep -i version</code> · <code>strings core | tail -20</code>'],
        ['<code>md5sum / sha256sum / sha1sum / b2sum</code>', 'checksum (फ़ाइल की उँगली-छाप)', '<code>sha256sum ubuntu-24.04.iso</code> · <code>sha256sum -c SHA256SUMS.txt</code> · <code>md5sum * &gt; sums.md5</code>'],
        ['<code>split -b -l -C</code> + जोड़ना', 'बड़ी फ़ाइल के टुकड़े / बाँटकर वापस जोड़ो', '<code>split -b 100M big.zip part_</code> · <code>cat part_* &gt; big.zip</code> · <code>split -l 1000 numbers.csv chunk_</code>'],
        ['<code>wc -l -w -c -m -L</code>', 'लाइनें / शब्द / बाइट / अक्षर / सबसे लंबी लाइन', '<code>wc -l *.c | tail -1</code> · <code>grep -c "" f</code> (लाइन गिनती का दूसरा तरीक़ा)'],
        ['<code>cut -d -f -c --complement</code>', 'कॉलम/चिह्न काटकर निकालो', '<code>cut -d: -f1,7 /etc/passwd</code> · <code>cut -c1-10 f</code> · <code>ifconfig | grep -m1 inet | awk \u0027{print $2}\u0027</code>'],
        ['<code>tr -d -s -c -t A-Z a-z</code>', 'अक्षर बदलो/हटाओ/दबाओ (stdin only)', '<code>tr -d \u0027\\r\u0027 &lt; win.txt &gt; unix.txt</code> · <code>tr A-Z a-z &lt; f</code> · <code>tr -s \u0027 \u0027 &lt; f</code> · <code>tr -dc \u0027a-z\\n\u0027 &lt; f</code>'],
        ['<code>rev</code>', 'हर लाइन उलटी क्रम में', '<code>rev f</code> · एक्सटेंशन निकालो: <code>ls | rev | cut -d. -f1 | rev</code>'],
        ['<code>sort -k -n -h -u -r -t -V -M</code>', 'क्रम लगाना — numeric/human/unique/reverse/field/ver', '<code>sort -t: -k3 -n /etc/passwd | tail</code> · <code>du -sh * | sort -h</code> · <code>sort -V list.txt</code>'],
        ['<code>uniq -c -d -u -i</code>', 'बगल-बगल डुप्लिकेट गिनो/निकालो (पहले sort)', '<code>cut -d: -f7 /etc/passwd | sort | uniq -c | sort -rn</code> · <code>sort f | uniq -d</code>'],
        ['<code>paste -d -s</code> / <code>join -t -1 -2</code>', 'फ़ाइलों को कॉलम में जोड़ो / common key से जोड़ो', '<code>paste names.txt marks.txt &gt; report.txt</code> · <code>join -t: id.txt name.txt</code>'],
        ['<code>comm -1 -2 -3</code>', 'दो sorted फ़ाइलों का मिलान/अंतर (3 कॉलम)', '<code>comm -12 &lt;(sort a.txt) &lt;(sort b.txt)</code> · <code>comm -23 old new</code> = सिर्फ़ old में'],
        ['<code>diff -u -r -q --side-by-side</code> / <code>sdiff</code> / <code>colordiff</code>', 'तुलना; patch बनाना; डायरेक्टरी तुलना', '<code>diff -u old.conf new.conf &gt; fix.patch</code> · <code>diff -rq /etc /etc-backup</code>'],
        ['<code>patch -p1 -R</code>', 'diff/patch लागू करना / वापस खींचना', '<code>cd /usr/src/app &amp;&amp; sudo patch -p1 &lt; fix.patch</code> · <code>patch -R -p1 &lt; fix.patch</code>'],
        ['<code>tee -a</code>', 'आउटपुट स्क्रीन पर भी, फ़ाइल में भी', '<code>dmesg | tee boot.log</code> · <code>echo "PATH=$PATH" | sudo tee -a /etc/profile</code>'],
        ['<code>rsync -avh --delete --progress -e ssh</code>', 'स्मार्ट सिंक/बैकअप (केवल बदलाव भेजता है)', '<code>rsync -avh --delete ~/Documents/ /mnt/backup/docs/</code> · <code>rsync -avh -e "ssh -p 2222" ./ user@host:/srv/app/</code>'],
        ['<code>install -m -d -D -o -g</code>', 'perm+मालिकी के साथ copy (पैकेजिंग जैसा)', '<code>sudo install -m 755 mytool.sh /usr/local/bin/mytool</code> · <code>install -d -m 770 /srv/app</code>'],
        ['<code>mktemp -d --suffix</code>', 'नाम-टक्कर-रहित अस्थायी फ़ाइल/फ़ोल्डर', '<code>t=$(mktemp); echo hi &gt; "$t"; rm "$t"</code> · <code>d=$(mktemp -d); cd "$d"</code>'],
        ['<code>scp -r -P -C</code> / <code>sftp</code> / <code>rclone</code>', 'SSH पर फ़ाइल भेजो/लाओ / interactive / क्लाउड', '<code>scp -r student@192.168.1.10:/home/student/project .</code> · <code>scp -P 2222 file user@host:/tmp/</code>'],
        ['<code>dd if= of= bs= count= status=progress conv=</code>', 'बाइट-दर-बाइट कॉपी/इमेज; <code>if=/dev/zero</code> से भरना', '<code>sudo dd if=/dev/zero of=/dev/sdX bs=4M status=progress</code> (सावधान!) · <code>dd if=floppy of=img.img conv=noerror,sync</code>']
      ] },

    /* @@T2@@ */

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.6</span> Pipe, Redirection और Wildcard — टर्मिनल की असली ताक़त</h3>
      <p>लिनक्स का हर प्रोग्राम तीन धाराएँ (streams) रखता है: <b>stdin (0)</b> = अंदर आता डेटा, <b>stdout (1)</b> = सामान्य नतीजा, <b>stderr (2)</b> = त्रुटि संदेश। <b>Pipe (<code>|</code>)</b> एक कमांड के stdout को दूसरे के stdin में डाल देता है — यही "छोटे औज़ारों को जोड़कर बड़ा काम" वाला Unix दर्शन है। <b>Redirection (<code>&gt;</code>, <code>&gt;&gt;</code>, <code>&lt;</code>)</b> धारा को फ़ाइल में भेजता है।</p>
      <p>सबसे आम भूल: <code>&gt;</code> फ़ाइल को <b>मिटाकर नया लिखता है</b>, <code>&gt;&gt;</code> <b>जोड़ता (append)</b> है। और <code>2&gt;&amp;1</code> का मतलब है "stderr को भी उसी जगह भेजो जहाँ stdout जा रहा है" — क्रम मायने रखता है: <code>cmd &gt; log.txt 2&gt;&amp;1</code> सही है, <code>cmd 2&gt;&amp;1 &gt; log.txt</code> में stderr स्क्रीन पर ही रह जाएगा।</p>
      <p><b>Wildcard (glob)</b> शेल फैलाता है, कमांड नहीं: <code>*</code> = कोई भी कितने ही अक्षर, <code>?</code> = ठीक एक अक्षर, <code>[abc]</code> = इनमें से एक, <code>[0-9]</code> = श्रेणी, <code>{a,b}</code> = brace expansion (अल्पविराम से विकल्प)। <b>छिपी फ़ाइलें (डॉट से शुरू) <code>*</code> से नहीं मिलतीं</b> — उन्हें <code>.*</code> या <code>ls -A</code> से देखें। और जोखिम भरी आदत: <code>rm *</code> चलाने से पहले हमेशा <code>ls</code> या <code>echo</code> से वही pattern जाँच लें।</p>` },

    { type: 'table', head: ['चिह्न / रूप', 'नाम', 'क्या करता है', 'उदाहरण'], rows: [
      ['<code>|</code>', 'pipe', 'पहले का stdout → दूसरे का stdin', '<code>ps aux | grep nginx</code>'],
      ['<code>&gt;</code>', 'redirect (overwrite)', 'stdout को फ़ाइल में — पुरानी मिटती है', '<code>ls -l &gt; suchi.txt</code>'],
      ['<code>&gt;&gt;</code>', 'append', 'stdout को फ़ाइल के अंत में जोड़े', '<code>date &gt;&gt; log.txt</code>'],
      ['<code>&lt;</code>', 'input redirect', 'फ़ाइल को stdin बनाए', '<code>mysql db &lt; backup.sql</code>'],
      ['<code>2&gt;</code>', 'stderr redirect', 'केवल त्रुटि संदेश फ़ाइल में', '<code>cmd 2&gt; err.txt</code>'],
      ['<code>2&gt;&amp;1</code>', 'stderr → stdout', 'दोनों एक ही जगह', '<code>cmd &gt; sab.txt 2&gt;&amp;1</code>'],
      ['<code>&amp;&gt;</code> / <code>&gt;&amp;</code>', 'दोनों redirect (bash)', 'ऊपर वाला छोटा रूप', '<code>cmd &amp;&gt; sab.txt</code>'],
      ['<code>/dev/null</code>', 'शून्य-उपकरण', 'जो भेजो सब गायब', '<code>cmd 2&gt;/dev/null</code> — त्रुटि चुप'],
      ['<code>&lt;&lt;EOF … EOF</code>', 'here-document', 'कई पंक्तियाँ stdin में', '<code>cat &lt;&lt;EOF</code> … सामग्री … <code>EOF</code>'],
      ['<code>&lt;&lt;&lt;</code>', 'here-string', 'एक स्ट्रिंग stdin में', '<code>grep "राम" &lt;&lt;&lt; "$namelist"</code>'],
      ['<code>tee</code>', 'T-जंक्शन', 'स्क्रीन पर भी दिखाए और फ़ाइल में भी लिखे', '<code>make 2&gt;&amp;1 | tee build.log</code>'],
      ['<code>*</code>', 'glob — कई अक्षर', 'कोई भी नाम', '<code>ls *.log</code>'],
      ['<code>?</code>', 'glob — एक अक्षर', 'ठीक एक अक्षर', '<code>ls file?.txt</code>'],
      ['<code>[abc]</code> / <code>[0-9]</code>', 'glob — वर्ग/श्रेणी', 'इनमें से एक', '<code>ls report[1-3].pdf</code>'],
      ['<code>{a,b,c}</code>', 'brace expansion', 'विकल्पों की सूची फैलाता है', '<code>mkdir -p dir/{src,bin,doc}</code>'],
      ['<code>~</code>', 'home', 'वर्तमान उपयोगकर्ता का घर', '<code>cd ~/Documents</code>'],
      ['<code>"…"</code> बनाम <code>\'…\'</code>', 'double बनाम single quote', 'double में <code>$VAR</code> फैलता है, single में सब literal', '<code>echo "$HOME"</code> बनाम <code>echo \'$HOME\'</code>'],
      ['<code>\\</code>', 'escape', 'अगले अक्षर का विशेष अर्थ हटाता है', '<code>ls my\\ file.txt</code>']
    ]},

    { type: 'code', code: `# ---- pipe की सीढ़ी: कच्चे डेटा से रिपोर्ट तक ----
ps aux | grep nginx | grep -v grep | awk '{print $2, $11}'
#  ↑ प्रोग्राम   ↑ नाम छाँटा  ↑ खुद grep हटाया  ↑ केवल PID और कमांड

# ---- लॉग में से सबसे ज़्यादा दोहराए IP ----
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -10
#  पहला कॉलम      क्रम में    गिनती      घटते क्रम   ऊपर के 10

# ---- redirection के चार रूप ----
ls -l  >  suchi.txt        # stdout फ़ाइल में (पुरानी मिटी)
ls -l  >> suchi.txt        # अंत में जुड़ी
ls -l  2> err.txt          # केवल त्रुटि
ls -l  >  sab.txt 2>&1     # दोनों एक फ़ाइल में (सही क्रम)
ls -l  &> sab.txt          # वही, bash का छोटा रूप

# ---- tee: देखते हुए सहेजना ----
sudo apt update 2>&1 | tee update.log

# ---- wildcard जाँचने की सुरक्षित आदत ----
echo *.log          # पहले देखो कि क्या-क्या फैल रहा है
rm   *.log          # फिर मिटाओ

# ---- brace expansion से एक ही कमांड में ढाँचा ----
mkdir -p project/{src,bin,doc,test}
cp app.conf{,.bak}          # app.conf -> app.conf.bak

# ---- find + xargs: सुरक्षित सामूहिक काम ----
find . -name "*.tmp" -print0 | xargs -0 rm -f
#  -print0 / -0 स्पेस वाले नामों को भी सही सँभालते हैं

# ---- here-document से फ़ाइल बनाना ----
cat > notes.txt <<'EOF'
यह पंक्ति ज्यों-की-त्यों लिखी जाएगी।
$HOME यहाँ फैलेगा नहीं क्योंकि EOF कोट में है।
EOF` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.7</span> grep, sed, awk — पाठ पर काम करने वाले तीन मुख्य औज़ार</h3>
      <p><b>grep</b> = ढूँढ़ना/छाँटना (filter)। <b>sed</b> = धारा-संपादक (stream editor), पंक्ति-दर-पंक्ति बदलना/मिटाना/छापना। <b>awk</b> = कॉलम-आधारित भाषा, जहाँ हर पंक्ति के फ़ील्ड (fields) <code>$1, $2, … $NF</code> होते हैं और आप गणना/रिपोर्ट बना सकते हैं। तीनों को pipe से जोड़ना लिनक्स प्रबंधन का आधा काम है।</p>
      <p>याद रखने का सरल नियम: <b>ढूँढ़ना हो → grep</b>; <b>बदलना/हटाना हो → sed</b>; <b>कॉलम से हिसाब/रिपोर्ट बनानी हो → awk</b>। आधुनिक सिस्टम में <code>grep -P</code> (Perl regex) और <code>rg</code> (ripgrep, बहुत तेज़) भी मिलते हैं, पर परीक्षा और सर्वर पर मूल तीनों ही पूछे जाते हैं।</p>` },

    { type: 'table', head: ['कमांड / विकल्प', 'क्या करती है', 'उदाहरण', 'नोट'], rows: [
      ['<code>grep "पैटर्न" file</code>', 'मेल खाती पंक्तियाँ दिखाए', '<code>grep "error" app.log</code>', 'case-sensitive'],
      ['<code>grep -i</code>', 'case अनदेखा', '<code>grep -i "error" app.log</code>', 'ERROR/Error/error सब'],
      ['<code>grep -v</code>', 'उल्टा — मेल न खाती पंक्तियाँ', '<code>ps aux | grep -v grep</code>', 'खुद को हटाने में'],
      ['<code>grep -n</code> / <code>-c</code>', 'पंक्ति-नंबर / गिनती', '<code>grep -c "fail" log</code>', 'गिनती तेज़ जाँच'],
      ['<code>grep -r</code> / <code>-R</code>', 'फ़ोल्डर में पुनरावर्ती (recursive)', '<code>grep -r "TODO" src/</code>', '-R symlink भी follow करता है'],
      ['<code>grep -E</code> (या <code>egrep</code>)', 'extended regex — <code>+ ? | ( )</code>', '<code>grep -E "error|warn" log</code>', 'साधारण grep में इन्हें escape करना पड़ता है'],
      ['<code>grep -w</code> / <code>-x</code>', 'पूरा शब्द / पूरी पंक्ति', '<code>grep -w "ram" names.txt</code>', '"रामचंद्र" नहीं मिलेगा'],
      ['<code>grep -A3 -B2</code>', 'मेल के बाद/पहले की पंक्तियाँ', '<code>grep -A3 "Exception" log</code>', '-C3 = दोनों तरफ़ 3'],
      ['<code>grep -o</code>', 'केवल मेल खाता हिस्सा', '<code>grep -oE "[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+" log</code>', 'IP निकालने में'],
      ['<code>grep -l</code> / <code>-L</code>', 'मेल वाली/न वाली फ़ाइलों के नाम', '<code>grep -rl "password" .</code>', 'सामग्री नहीं, केवल नाम'],
      ['<code>sed \'s/purana/naya/\' f</code>', 'प्रति पंक्ति पहला बदलाव', '<code>sed \'s/http/https/\' sites.txt</code>', 'मूल फ़ाइल नहीं बदलती — स्क्रीन पर नतीजा'],
      ['<code>sed \'s/…/…/g\'</code>', 'पंक्ति के सभी बदलाव', '<code>sed \'s/ //g\' f</code>', 'g = global'],
      ['<code>sed -i</code>', 'फ़ाइल में सीधे बदले (in-place)', '<code>sed -i.bak \'s/a/b/g\' f</code>', '<b>.bak backup ज़रूर रखें</b>'],
      ['<code>sed -n \'5,10p\'</code>', 'केवल पंक्ति 5–10 छापीं', '<code>sed -n \'1p\' f</code> = head -1', '-n = default छपाई बंद'],
      ['<code>sed \'3d\'</code> / <code>\'/pattern/d\'</code>', 'पंक्ति मिटाए', '<code>sed \'/^#/d\' conf</code>', 'comment पंक्तियाँ हटाना'],
      ['<code>awk \'{print $1,$3}\' f</code>', 'कॉलम 1 और 3', '<code>df -h | awk \'{print $1,$5}\'</code>', 'डिफ़ॉल्ट separator = स्पेस/tab'],
      ['<code>awk -F: \'{print $1}\' /etc/passwd</code>', 'separator बदले', '<code>awk -F: \'{print $1,$7}\' /etc/passwd</code>', 'उपयोगकर्ता + शेल'],
      ['<code>awk \'$3 &gt; 100 {print}\'</code>', 'शर्त पर छाँट', '<code>awk \'$5+0 &gt; 80 {print $1,$5}\'</code>', '80% से भरी drives'],
      ['<code>awk \'{s+=$3} END{print s}\'</code>', 'जोड़/औसत', '<code>awk \'{s+=$1} END{print "कुल",s}\' nums.txt</code>', 'END = अंत में एक बार'],
      ['<code>awk \'NR==5\'</code> / <code>NF</code>', 'पंक्ति-नंबर / field-गिनती', '<code>awk \'NR&gt;1\' f</code> = header छोड़ें', '<code>$NF</code> = आख़िरी कॉलम'],
      ['<code>awk \'BEGIN{print "शीर्षक"} …\'</code>', 'शुरू/अंत में कुछ छापें', 'रिपोर्ट का header/footer', 'BEGIN, main, END तीन खंड']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.8</span> find, locate और फ़ाइल खोज — सही औज़ार, सही समय</h3>
      <p><b>find</b> अभी, इसी समय, फ़ाइल-सिस्टम घूमकर ढूँढ़ता है — नाम, आकार, समय, अनुमति, मालिक, प्रकार किसी भी आधार पर। <b>locate</b> पहले से बने database (<code>mlocate</code>/<code>plocate</code>) से ढूँढ़ता है — बहुत तेज़, पर नई फ़ाइलें तभी दिखतीं जब <code>sudo updatedb</code> चला हो। इसलिए <b>ताज़ा/सटीक काम = find</b>, <b>तेज़ अंदाज़ा = locate</b>।</p>
      <p><code>find</code> का सबसे शक्तिशाली हिस्सा है <b>-exec</b> और <b>xargs के साथ जोड़</b>। पर यही सबसे जोखिम भरा भी है — <code>find … -exec rm {} \\;</code> बिना जाँचे चलाना फ़ाइलें उड़ा सकता है। सुरक्षित आदत: पहले वही find केवल <code>-print</code> के साथ चलाकर सूची देखें, फिर <code>-exec</code> जोड़ें। स्पेस वाले नामों के लिए हमेशा <code>-print0 | xargs -0</code> अपनाएँ।</p>` },

    { type: 'table', head: ['find का रूप', 'क्या ढूँढ़ता/करता है', 'उदाहरण'], rows: [
      ['<code>-name</code> / <code>-iname</code>', 'नाम से (case-sensitive / नहीं)', '<code>find . -iname "*.pdf"</code>'],
      ['<code>-type f</code> / <code>d</code> / <code>l</code>', 'फ़ाइल / डायरेक्टरी / symlink', '<code>find /var -type d -name "log*"</code>'],
      ['<code>-size +100M</code>', 'आकार से (+ बड़ा, − छोटा)', '<code>find / -type f -size +500M 2&gt;/dev/null</code>'],
      ['<code>-mtime -7</code> / <code>+30</code>', 'बदलाव का समय (दिन)', '<code>find . -mtime -1</code> = पिछले 24 घंटे'],
      ['<code>-mmin -60</code>', 'मिनट में', '<code>find . -mmin -10</code> = अभी-अभी बदली'],
      ['<code>-newer file</code>', 'इस फ़ाइल से नई', '<code>find . -newer /tmp/stamp</code>'],
      ['<code>-user</code> / <code>-group</code>', 'मालिक से', '<code>find /home -user ram</code>'],
      ['<code>-perm 777</code> / <code>-perm /u+x</code>', 'अनुमति से', '<code>find . -type f -perm -002</code> = सबको लिखने की अनुमति (जोखिम)'],
      ['<code>-empty</code>', 'ख़ाली फ़ाइल/फ़ोल्डर', '<code>find . -type d -empty</code>'],
      ['<code>-maxdepth 2</code>', 'गहराई सीमित', '<code>find . -maxdepth 1 -name "*.conf"</code>'],
      ['<code>-not</code> / <code>!</code> और <code>-o</code>', 'NOT / OR', '<code>find . -name "*.log" -o -name "*.tmp"</code>'],
      ['<code>-exec cmd {} \\;</code>', 'हर नतीजे पर कमांड', '<code>find . -name "*.bak" -exec rm {} \\;</code>'],
      ['<code>-exec cmd {} +</code>', 'एक ही कमांड में कई नतीजे (तेज़)', '<code>find . -name "*.txt" -exec chmod 644 {} +</code>'],
      ['<code>-print0 | xargs -0</code>', 'स्पेस-सुरक्षित सामूहिक काम', '<code>find . -name "*.tmp" -print0 | xargs -0 rm -f</code>'],
      ['<code>-delete</code>', 'सीधे मिटाना (सोच-समझकर)', '<code>find /tmp -name "sess_*" -mtime +1 -delete</code>'],
      ['<code>locate</code> / <code>updatedb</code>', 'database से तेज़ खोज', '<code>locate nginx.conf</code>; ताज़ा करने = <code>sudo updatedb</code>'],
      ['<code>which</code> / <code>whereis</code> / <code>type</code>', 'कमांड कहाँ है', '<code>which python3</code>; <code>type cd</code> = builtin बताएगा']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.9</span> अनुमति (permissions) और मालिकाना — chmod, chown, umask</h3>
      <p><code>ls -l</code> की पहली पंक्ति जैसी <code>-rwxr-xr--</code> दिखती है। पहला अक्षर प्रकार बताता है (<code>-</code> फ़ाइल, <code>d</code> डायरेक्टरी, <code>l</code> symlink), फिर <b>तीन-तीन अक्षरों के तीन समूह</b>: मालिक (user), समूह (group), बाक़ी सब (others)। हर समूह में <code>r</code>=पढ़ना(4), <code>w</code>=लिखना(2), <code>x</code>=चलाना/फ़ोल्डर में घुसना(1)। इन्हें जोड़कर octal बनता है: <code>rwx = 7</code>, <code>rw- = 6</code>, <code>r-x = 5</code>, <code>r-- = 4</code>।</p>
      <p>इसलिए <code>chmod 755 script.sh</code> = मालिक को सब, बाक़ी को पढ़ना+चलाना। <code>chmod 644 file.txt</code> = मालिक पढ़/लिख, बाक़ी केवल पढ़। <b>डायरेक्टरी पर <code>x</code> का मतलब "अंदर जा सकना" है</b> — बिना x के आप उस फ़ोल्डर की फ़ाइलें नहीं खोल सकते, भले ही r हो। <code>777</code> सबको सब कुछ — यह लगभग हमेशा ग़लत और असुरक्षित है; वेब सर्वर पर तो ख़ास तौर पर नहीं।</p>
      <p><b>chown</b> मालिक/समूह बदलता है (<code>chown ram:students file</code>), <b>chgrp</b> केवल समूह। <b>umask</b> नई फ़ाइल/फ़ोल्डर की डिफ़ॉल्ट अनुमति से क्या-क्या <i>घटाना</i> है यह बताता है — umask 022 का मतलब नई फ़ाइल 644 और नया फ़ोल्डर 755। विशेष bits: <b>setuid (4000)</b>, <b>setgid (2000)</b>, <b>sticky (1000)</b> — sticky वाला <code>/tmp</code> (1777) इसीलिए है ताकि सब लिख सकें पर कोई दूसरे की फ़ाइल न मिटा सके।</p>` },

    { type: 'table', head: ['अंक / रूप', 'अर्थ (rwx)', 'किसके लिए सही', 'उदाहरण'], rows: [
      ['<code>7</code> = rwx', 'पढ़+लिख+चला', 'मालिक को स्क्रिप्ट/फ़ोल्डर', '<code>chmod 755 run.sh</code>'],
      ['<code>6</code> = rw-', 'पढ़+लिख', 'साधारण डेटा फ़ाइल का मालिक', '<code>chmod 644 notes.txt</code>'],
      ['<code>5</code> = r-x', 'पढ़+चला', 'स्क्रिप्ट/फ़ोल्डर बाक़ी लोगों के लिए', '<code>chmod 555 readonly.sh</code>'],
      ['<code>4</code> = r--', 'केवल पढ़', 'गोपनीय नहीं, सार्वजनिक पाठ', '<code>chmod 444 LICENSE</code>'],
      ['<code>0</code> = ---', 'कुछ नहीं', 'किसी वर्ग को पूरा रोकना', '<code>chmod 640 secret</code> = others को कुछ नहीं'],
      ['<code>600</code>', 'केवल मालिक पढ़/लिख', '<b>निजी key, पासवर्ड फ़ाइल</b>', '<code>chmod 600 ~/.ssh/id_rsa</code>'],
      ['<code>700</code>', 'केवल मालिक, फ़ोल्डर', '<code>~/.ssh</code>', 'SSH इससे ज़्यादा ढीली अनुमति पर key अस्वीकार करता है'],
      ['<code>755</code>', 'मालिक सब, बाक़ी पढ़+चला', 'सार्वजनिक फ़ोल्डर/स्क्रिप्ट', 'वेब root की आम अनुमति'],
      ['<code>644</code>', 'मालिक पढ़/लिख, बाक़ी पढ़', 'वेब फ़ाइलें, कॉन्फ़िग', 'सबसे आम सुरक्षित डिफ़ॉल्ट'],
      ['<code>775</code> / <code>664</code>', 'समूह को भी लिखना', 'साझा टीम फ़ोल्डर', 'समूह सही सेट होना चाहिए'],
      ['<code>777</code>', 'सबको सब', '<b>लगभग कभी नहीं</b>', 'सुरक्षा छेद; वेब सर्वर पर घातक'],
      ['<code>1777</code> (sticky)', 'सब लिखें, पर अपनी ही मिटाएँ', '<code>/tmp</code>', 'sticky bit = आख़िरी 1'],
      ['<code>4755</code> (setuid)', 'चलाने पर मालिक की शक्ति', '<code>/usr/bin/passwd</code>', 'ग़लत जगह लगा तो privilege escalation'],
      ['<code>2755</code> (setgid)', 'फ़ोल्डर में नई फ़ाइल को वही समूह', 'साझा प्रोजेक्ट फ़ोल्डर', 'टीम काम में उपयोगी'],
      ['<code>chmod u+x</code>', 'प्रतीकात्मक — मालिक को x जोड़े', '<code>chmod u+x script.sh</code>', 'u/g/o/a और +/−/= के साथ r/w/x'],
      ['<code>chmod -R</code>', 'recursive — अंदर तक', '<code>chmod -R 755 site/</code>', '<b>फ़ाइल और फ़ोल्डर दोनों एक जैसी हो जाती हैं</b> — सावधानी'],
      ['<code>chown user:group</code>', 'मालिक और समूह बदले', '<code>sudo chown -R www-data:www-data /var/www</code>', 'वेब सर्वर का मालिकाना'],
      ['<code>umask 022</code>', 'नई फ़ाइल 644, फ़ोल्डर 755', 'डिफ़ॉल्ट सुरक्षित', '<code>umask</code> से वर्तमान देखें']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.10</span> प्रोसेस, जॉब और सेवाएँ — ps, top, kill, systemctl</h3>
      <p>चलता हुआ प्रोग्राम <b>process</b> कहलाता है और उसका एक नंबर होता है <b>PID</b>। <code>ps</code> एक तस्वीर (snapshot) देता है, <code>top</code>/<code>htop</code> जीवित दृश्य। <code>kill</code> नाम के बावजूद प्रोग्राम को "मारता" नहीं — <b>सिग्नल भेजता</b> है। डिफ़ॉल्ट <code>SIGTERM (15)</code> विनम्र निवेदन है ("सहेजकर बंद हो जाओ"); <code>SIGKILL (9)</code> ज़बरदस्ती है और प्रोग्राम को सफ़ाई का मौक़ा नहीं देता — इसलिए <b>पहले हमेशा 15, आख़िरी सहारा 9</b>।</p>
      <p>टर्मिनल में चलाया प्रोग्राम बंद करने = <code>Ctrl+C</code> (SIGINT), रोकने = <code>Ctrl+Z</code> (SIGTSTP, फिर <code>bg</code>/<code>fg</code>)। <code>&amp;</code> लगाकर कमांड पीछे (background) चला सकते हैं; <code>nohup</code> या <code>disown</code> से टर्मिनल बंद होने पर भी चलता रहेगा। लंबे काम के लिए <b>tmux</b>/<b>screen</b> सबसे भरोसेमंद हैं — सत्र टूट जाए तो दोबारा जुड़कर काम देख सकते हैं।</p>
      <p>आधुनिक लिनक्स में सेवाएँ <b>systemd</b> सँभालता है: <code>systemctl start/stop/restart/status/enable/disable</code>। <b>start</b> = अभी चालू, <b>enable</b> = हर boot पर अपने आप चालू — दोनों अलग हैं, अक्सर दोनों करने पड़ते हैं। पुराने SysV init वाले सिस्टम पर <code>service</code> और <code>chkconfig</code> चलते हैं। लॉग देखने के लिए <code>journalctl -u nginx -f</code> (f = follow, जीवित)।</p>` },

    { type: 'table', head: ['कमांड', 'क्या करती है', 'उदाहरण / नोट'], rows: [
      ['<code>ps aux</code>', 'सारे प्रोसेस, पूरा ब्योरा', 'a = सब टर्मिनल, u = उपयोगकर्ता-रूप, x = बिना टर्मिनल वाले भी'],
      ['<code>ps -ef</code>', 'System-V रूप, PPID सहित', 'parent PID देखने में'],
      ['<code>pgrep nginx</code> / <code>pidof</code>', 'नाम से PID', '<code>pgrep -u ram</code> = ram के प्रोसेस'],
      ['<code>top</code> / <code>htop</code>', 'जीवित CPU/RAM दृश्य', 'top में <code>P</code>=CPU क्रम, <code>M</code>=RAM क्रम, <code>k</code>=kill, <code>q</code>=बाहर'],
      ['<code>kill 1234</code>', 'SIGTERM (15) — विनम्र बंद', 'पहले यही आज़माएँ'],
      ['<code>kill -9 1234</code>', 'SIGKILL — ज़बरदस्ती', 'डेटा हानि हो सकती है; आख़िरी सहारा'],
      ['<code>kill -HUP</code> / <code>-1</code>', 'कॉन्फ़िग दोबारा पढ़ो', '<code>kill -HUP $(cat /run/nginx.pid)</code>'],
      ['<code>pkill nginx</code> / <code>killall</code>', 'नाम से सब मारना', '<code>pkill -u ram</code> — सोच-समझकर'],
      ['<code>Ctrl+C</code> / <code>Ctrl+Z</code>', 'SIGINT / SIGTSTP', 'रोका हुआ जॉब <code>jobs</code> में दिखेगा'],
      ['<code>bg</code> / <code>fg</code> / <code>jobs</code>', 'पीछे चलाओ / आगे लाओ / सूची', '<code>fg %1</code>'],
      ['<code>cmd &amp;</code>', 'पीछे शुरू करो', '<code>longjob &gt; log.txt 2&gt;&amp;1 &amp;</code>'],
      ['<code>nohup cmd &amp;</code>', 'टर्मिनल बंद होने पर भी चले', 'नतीजा nohup.out में'],
      ['<code>nice -n 10</code> / <code>renice</code>', 'प्राथमिकता घटाओ/बढ़ाओ', 'nice −20 (सबसे तेज़) … 19 (सबसे धीमा); केवल root घटा सकता है'],
      ['<code>systemctl status nginx</code>', 'सेवा की स्थिति + हाल के लॉग', 'active (running) / failed देखें'],
      ['<code>systemctl start/stop/restart</code>', 'अभी चालू/बंद/दोबारा', 'restart = बंद करके चालू'],
      ['<code>systemctl reload nginx</code>', 'बिना रोके कॉन्फ़िग लागू', 'सेवा समर्थन करे तभी'],
      ['<code>systemctl enable --now nginx</code>', 'boot पर चालू + अभी भी चालू', '--now दोनों एक साथ'],
      ['<code>systemctl disable nginx</code>', 'boot पर बंद', 'अभी चल रही हो तो चलती रहेगी'],
      ['<code>systemctl list-units --type=service</code>', 'सारी सेवाएँ', '--failed = केवल विफल'],
      ['<code>journalctl -u nginx -f</code>', 'उस सेवा का जीवित लॉग', '-b = इस boot का, --since "1 hour ago"'],
      ['<code>uptime</code> / <code>free -h</code> / <code>df -h</code>', 'भार / RAM / डिस्क', 'तीन पहली जाँच'],
      ['<code>lsof -i :80</code>', 'कौन-सा प्रोसेस port 80 पर है', '"port already in use" का निदान'],
      ['<code>ss -tulpn</code>', 'खुले ports और प्रोसेस', 'पुराना netstat की जगह; root चाहिए PID के लिए']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.11</span> पैकेज प्रबंधन — apt, dnf, pacman और स्रोत</h3>
      <p>लिनक्स में सॉफ़्टवेयर वेबसाइट से .exe डाउनलोड करके नहीं, <b>पैकेज मैनेजर</b> से आता है — जो निर्भरताएँ (dependencies) अपने आप सुलझाता है, हस्ताक्षर जाँचता है और अपडेट एक कमांड में देता है। परिवार के हिसाब से औज़ार अलग है: <b>Debian/Ubuntu = apt (.deb)</b>, <b>Fedora/RHEL = dnf (.rpm)</b>, <b>Arch = pacman</b>, <b>openSUSE = zypper</b>। ऊपर एक सार्वभौमिक परत भी है — <b>snap</b> और <b>flatpak</b> — जो हर डिस्ट्रो पर चलती है पर अधिक जगह लेती है।</p>
      <p>सबसे ज़रूरी आदत: <b>स्थापित करने से पहले <code>update</code></b> (सूची ताज़ा) और फिर <code>install</code>। <code>upgrade</code> स्थापित पैकेज नए संस्करण पर ले जाता है। हटाते समय <code>remove</code> केवल प्रोग्राम हटाता है, <code>purge</code> उसकी कॉन्फ़िग फ़ाइलें भी — इसलिए पूरी सफ़ाई चाहिए तो purge। किसी फ़ाइल का मालिक पैकेज ढूँढ़ना हो तो <code>dpkg -S /path</code> (Debian) या <code>rpm -qf /path</code> (RHEL)।</p>` },

    { type: 'table', head: ['काम', 'Debian / Ubuntu (apt)', 'Fedora / RHEL (dnf)', 'Arch (pacman)'], rows: [
      ['सूची ताज़ा करना', '<code>sudo apt update</code>', '<code>sudo dnf check-update</code>', '<code>sudo pacman -Sy</code>'],
      ['सब अपडेट', '<code>sudo apt upgrade</code>', '<code>sudo dnf upgrade</code>', '<code>sudo pacman -Syu</code>'],
      ['स्थापित करना', '<code>sudo apt install nginx</code>', '<code>sudo dnf install nginx</code>', '<code>sudo pacman -S nginx</code>'],
      ['हटाना', '<code>sudo apt remove nginx</code>', '<code>sudo dnf remove nginx</code>', '<code>sudo pacman -R nginx</code>'],
      ['कॉन्फ़िग सहित हटाना', '<code>sudo apt purge nginx</code>', 'कॉन्फ़िग अलग हटानी पड़ती है', '<code>sudo pacman -Rns nginx</code>'],
      ['खोजना', '<code>apt search nginx</code>', '<code>dnf search nginx</code>', '<code>pacman -Ss nginx</code>'],
      ['जानकारी', '<code>apt show nginx</code>', '<code>dnf info nginx</code>', '<code>pacman -Si nginx</code>'],
      ['स्थापित सूची', '<code>dpkg -l</code> / <code>apt list --installed</code>', '<code>dnf list installed</code>', '<code>pacman -Q</code>'],
      ['फ़ाइल किस पैकेज की', '<code>dpkg -S /usr/sbin/nginx</code>', '<code>rpm -qf /usr/sbin/nginx</code>', '<code>pacman -Qo /usr/bin/nginx</code>'],
      ['स्थानीय .deb/.rpm लगाना', '<code>sudo dpkg -i file.deb</code> फिर <code>apt -f install</code>', '<code>sudo dnf install ./file.rpm</code>', '<code>sudo pacman -U file.pkg.tar.zst</code>'],
      ['अनाथ निर्भरताएँ हटाना', '<code>sudo apt autoremove</code>', '<code>sudo dnf autoremove</code>', '<code>pacman -Qtdq | pacman -Rns -</code>'],
      ['कैश सफ़ाई', '<code>sudo apt clean</code>', '<code>sudo dnf clean all</code>', '<code>sudo pacman -Scc</code>'],
      ['स्रोत (repository) कहाँ', '<code>/etc/apt/sources.list</code> व <code>sources.list.d/</code>', '<code>/etc/yum.repos.d/</code>', '<code>/etc/pacman.conf</code> व mirrorlist'],
      ['PPA / बाहरी स्रोत जोड़ना', '<code>sudo add-apt-repository ppa:…</code>', '<code>sudo dnf config-manager --add-repo …</code>', 'AUR (Helper जैसे <code>yay</code>) — <b>अविश्वसनीय स्रोत जोखिम</b>'],
      ['सार्वभौमिक पैकेज', '<code>sudo snap install code --classic</code>', '<code>flatpak install flathub org.…</code>', 'दोनों चलते हैं; जगह ज़्यादा लेते हैं']
    ]},

    { type: 'callout', kind: 'danger', title: 'sudo, rm और पाइप — तीन जगह जहाँ रुककर सोचें', html: '<ol><li><b><code>sudo</code></b> का मतलब है "पूरे सिस्टम की शक्ति"। कमांड टाइप करने के बाद Enter दबाने से पहले <b>पूरी पंक्ति दोबारा पढ़ें</b> — विशेषकर पथ और wildcard। <code>sudo rm -rf /</code> जैसी पंक्ति सिस्टम मिटा सकती है; आधुनिक rm इस एक मामले में रोकता है, पर <code>sudo rm -rf / --no-preserve-root</code> या <code>rm -rf "$खाली_चर"/</code> नहीं रुकते।</li><li><b>चर (variable) हमेशा कोट करें</b>: <code>rm -rf "$DIR"/</code> — अगर DIR ख़ाली हुआ तो बिना कोट वाली पंक्ति <code>rm -rf /</code> बन जाती है। स्क्रिप्ट में <code>set -u</code> लगाएँ ताकि ख़ाली चर पर त्रुटि मिले।</li><li><b>इंटरनेट से स्क्रिप्ट सीधे शेल में पाइप न करें</b> (<code>curl … | sudo bash</code>)। पहले फ़ाइल में उतारें, पढ़ें, फिर चलाएँ। यही supply-chain हमलों का आम रास्ता है।</li><li><b>अनजान PPA/AUR/repository</b> जोड़ना = अनजान कोड को root शक्ति देना। केवल भरोसेमंद स्रोत।</li></ol>'},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.12</span> नेटवर्क कमांड — ip, ss, ping, curl, dig, ssh</h3>
      <p>पुराने <code>ifconfig</code>, <code>netstat</code>, <code>route</code>, <code>arp</code> अब <b>iproute2</b> परिवार (<code>ip</code>, <code>ss</code>) से बदल दिए गए हैं और कई डिस्ट्रो में स्थापित ही नहीं होते। इसलिए नए सिस्टम पर <code>ip a</code> (पते), <code>ip r</code> (रास्ते), <code>ss -tulpn</code> (ports) सीखें। <code>ping</code> पहुँच जाँचता है, <code>traceroute</code>/<code>mtr</code> रास्ता, <code>dig</code>/<code>nslookup</code> DNS, <code>curl</code>/<code>wget</code> HTTP, और <code>ssh</code>/<code>scp</code>/<code>rsync</code> दूर का काम व फ़ाइल।</p>
      <p>निदान का क्रम हमेशा यही रखें: <b>link → IP → gateway → DNS → बाहरी IP → नाम → सेवा</b>। यानी पहले <code>ip a</code> में interface UP है और IP मिला या नहीं, फिर <code>ip r</code> में default gateway, फिर <code>ping 8.8.8.8</code> (नाम के बिना), फिर <code>dig example.com</code>, और अंत में <code>curl -I https://example.com</code>। इस क्रम से आप बता सकते हैं कि गड़बड़ी केबल में है, IP में, DNS में या वेब सर्वर में।</p>` },

    { type: 'table', head: ['कमांड', 'क्या करती है', 'उदाहरण', 'पुराना समकक्ष'], rows: [
      ['<code>ip a</code> / <code>ip addr</code>', 'सारे interface व IP पते', '<code>ip -br a</code> = संक्षिप्त', '<code>ifconfig</code>'],
      ['<code>ip r</code> / <code>ip route</code>', 'routing तालिका, default gateway', '<code>ip r get 8.8.8.8</code>', '<code>route -n</code>'],
      ['<code>ip link set eth0 up/down</code>', 'interface चालू/बंद', '<code>sudo ip link set eth0 down</code>', '<code>ifconfig eth0 down</code>'],
      ['<code>ip neigh</code>', 'ARP/पड़ोसी तालिका (IP↔MAC)', '<code>ip neigh show</code>', '<code>arp -a</code>'],
      ['<code>ss -tulpn</code>', 'TCP/UDP listening ports + PID', '<code>sudo ss -tulpn | grep :80</code>', '<code>netstat -tulpn</code>'],
      ['<code>ping -c 4 8.8.8.8</code>', 'ICMP पहुँच व विलंब', '<code>-c</code> = गिनती (लिनक्स में अनिवार्य वरना अनंत)', '—'],
      ['<code>traceroute</code> / <code>mtr</code>', 'रास्ते के हर hop', '<code>mtr example.com</code> = जीवित + आँकड़े', '—'],
      ['<code>dig example.com</code>', 'DNS query का पूरा ब्योरा', '<code>dig +short MX example.com</code>', '<code>nslookup</code>'],
      ['<code>dig @8.8.8.8 example.com</code>', 'किसी विशेष DNS सर्वर से पूछें', 'स्थानीय DNS बनाम सार्वजनिक तुलना', '—'],
      ['<code>host</code> / <code>getent hosts</code>', 'तेज़ नाम→IP', '<code>getent hosts example.com</code> = /etc/hosts भी देखता है', '—'],
      ['<code>curl -I https://…</code>', 'केवल HTTP headers', 'स्थिति कोड, redirect, content-type', '—'],
      ['<code>curl -O</code> / <code>-o name</code>', 'फ़ाइल उतारना', '<code>curl -LO https://…/file.iso</code> (-L redirect follow)', '<code>wget</code>'],
      ['<code>curl -X POST -d \'…\'</code>', 'POST भेजना', 'API जाँच में', '—'],
      ['<code>wget -c URL</code>', 'टूटी डाउनलोड जारी रखना', 'बड़ी ISO में उपयोगी', '—'],
      ['<code>ssh user@host</code>', 'दूर का सुरक्षित शेल', '<code>ssh -p 2222 ram@192.168.1.10</code>', 'telnet (असुरक्षित — न उपयोग करें)'],
      ['<code>ssh-keygen</code> / <code>ssh-copy-id</code>', 'key बनाना / सर्वर पर चढ़ाना', '<code>ssh-copy-id user@host</code> → फिर बिना पासवर्ड', '—'],
      ['<code>scp file user@host:/path</code>', 'सुरक्षित कॉपी', '<code>scp -r dir/ user@host:/tmp/</code>', 'rcp'],
      ['<code>rsync -avz src/ user@host:/dst/</code>', 'केवल बदलाव भेजना (तेज़, जारी रखने योग्य)', '<code>--dry-run</code> पहले चलाकर देखें; आख़िरी <code>/</code> का अर्थ समझें', '—'],
      ['<code>nmcli</code> / <code>nmtui</code>', 'NetworkManager से Wi-Fi/IP', '<code>nmcli dev wifi</code>; <code>nmtui</code> = मेन्यू रूप', '—'],
      ['<code>hostnamectl</code>', 'नाम व OS जानकारी', '<code>sudo hostnamectl set-hostname lab-pc1</code>', '<code>hostname</code>']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.13</span> डिस्क, आर्काइव और संपीड़न — df, du, tar, gzip</h3>
      <p><b>df</b> बताता है कौन-सी filesystem कितनी भरी है (<code>df -h</code> = पढ़ने योग्य इकाई), <b>du</b> बताता है कौन-सा फ़ोल्डर कितनी जगह खा रहा है (<code>du -sh *</code>)। "डिस्क भर गई" की शिकायत पर पहले <code>df -h</code>, फिर भरी हुई filesystem पर <code>du -xh --max-depth=1 / | sort -h</code> — इससे एक ही कमांड में सबसे भारी फ़ोल्डर दिख जाता है। ध्यान दें: <b>मिटाई हुई फ़ाइल की जगह तभी छूटती है जब उसे खोलने वाला प्रोसेस बंद हो</b>; वरना <code>df</code> भरी दिखाता रहेगा जबकि <code>du</code> कम — ऐसे में <code>lsof | grep deleted</code> से पकड़ें।</p>
      <p><b>tar</b> असल में "जोड़कर एक फ़ाइल बनाने" वाला औज़ार है (tape archiver), संपीड़न अलग से जुड़ता है: <code>-z</code> = gzip (.tar.gz), <code>-j</code> = bzip2, <code>-J</code> = xz (.tar.xz, सबसे छोटा पर धीमा), <code>--zstd</code> = तेज़ व अच्छा। याद रखने का मंत्र: <b>c</b>=create, <b>x</b>=extract, <b>t</b>=list, <b>v</b>=verbose, <b>f</b>=file (हमेशा आख़िर में, उसके तुरंत बाद फ़ाइल का नाम)। इसलिए <code>tar -czvf backup.tar.gz folder/</code> बनाता है और <code>tar -xzvf backup.tar.gz</code> खोलता है। खोलने से पहले <code>-t</code> से सूची देख लेना अच्छी आदत है — कुछ आर्काइव absolute पथ या <code>../</code> रखकर बाहर लिख सकते हैं (यह "tar slip" जोखिम है)।</p>` },

    { type: 'table', head: ['कमांड', 'क्या करती है', 'उदाहरण / नोट'], rows: [
      ['<code>df -h</code>', 'filesystem-वार भराव', '<code>df -hT</code> = प्रकार भी; <code>-i</code> = inode भराव (छोटी फ़ाइलों की बाढ़)'],
      ['<code>du -sh folder/</code>', 'फ़ोल्डर का कुल आकार', '<code>du -sh *</code> = यहाँ के हर आइटम का'],
      ['<code>du -xh --max-depth=1 / | sort -h</code>', 'सबसे भारी फ़ोल्डर ढूँढ़ना', '-x = दूसरी filesystem पर न जाए'],
      ['<code>lsblk</code>', 'डिस्क/partition का पेड़', '<code>lsblk -f</code> = filesystem व UUID'],
      ['<code>blkid</code>', 'UUID व प्रकार', '/etc/fstab में UUID से जोड़ना सुरक्षित'],
      ['<code>mount</code> / <code>umount</code>', 'जोड़ना / अलग करना', '<code>sudo mount /dev/sdb1 /mnt</code>; व्यस्त हो तो <code>lsof +f -- /mnt</code>'],
      ['<code>fdisk -l</code> / <code>parted -l</code>', 'partition तालिका', 'बदलाव जोखिम भरा — पहले backup'],
      ['<code>fsck</code>', 'filesystem जाँच/मरम्मत', '<b>जुड़ी (mounted) हुई fs पर न चलाएँ</b>; live USB से करें'],
      ['<code>tar -czvf out.tar.gz dir/</code>', 'बनाओ + gzip + verbose', 'c=create, z=gzip, v=दिखाओ, f=फ़ाइल'],
      ['<code>tar -xzvf out.tar.gz</code>', 'खोलो', 'x=extract; <code>-C /path</code> = कहाँ खोलें'],
      ['<code>tar -tzvf out.tar.gz</code>', 'केवल सूची देखो', 'खोलने से पहले जाँच — tar slip से बचाव'],
      ['<code>tar -cJvf out.tar.xz dir/</code>', 'xz संपीड़न (सबसे छोटा)', 'धीमा; बैकअप भेजने में अच्छा'],
      ['<code>gzip file</code> / <code>gunzip</code>', 'एक फ़ाइल संपीड़ित/खोलो', 'मूल फ़ाइल .gz बन जाती है (हट जाती है)'],
      ['<code>zip -r out.zip dir/</code> / <code>unzip</code>', 'Windows-अनुकूल आर्काइव', '<code>unzip -l</code> = सूची'],
      ['<code>7z a out.7z dir/</code>', 'उच्च संपीड़न (p7zip)', 'पासवर्ड भी: <code>-p</code>'],
      ['<code>rsync -av --delete src/ dst/</code>', 'दर्पण (mirror) बनाना', '<b>--delete गंतव्य की अतिरिक्त फ़ाइलें मिटाता है</b> — पहले --dry-run'],
      ['<code>dd if=… of=… bs=4M status=progress</code>', 'कच्ची कॉपी / bootable USB', '<b>of= ग़लत डिस्क हुआ तो सब मिट जाएगा</b> — lsblk से पुष्टि करें'],
      ['<code>sync</code>', 'बफ़र डिस्क पर लिखवाएँ', 'USB निकालने से पहले'],
      ['<code>ln -s target name</code>', 'soft (symbolic) link', '<code>ln target name</code> = hard link; डायरेक्टरी का hard link नहीं बनता'],
      ['<code>stat file</code>', 'आकार, inode, अनुमति, समय', 'mtime/ctime/atime का फ़र्क़ यहीं दिखता है']
    ]},

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.14</span> vim/nano और cron/systemd timer — संपादन व समय-पालन</h3>
      <p>सर्वर पर GUI नहीं होता, इसलिए टर्मिनल संपादक अनिवार्य हैं। <b>nano</b> सीधा है — नीचे शॉर्टकट लिखे रहते हैं (<code>Ctrl+O</code> सहेजें, <code>Ctrl+X</code> बाहर)। <b>vim</b> शक्तिशाली पर इसका "mode" समझना पड़ता है: <b>Normal</b> (घूमना/कमांड), <b>Insert</b> (टाइप करना, <code>i</code> से), <b>Command</b> (<code>:</code> से)। नया उपयोगकर्ता अक्सर vim में फँस जाता है — बाहर निकलने का मंत्र: <code>Esc</code> दबाकर <code>:q!</code> (बिना सहेजे बाहर) या <code>:wq</code> (सहेजकर बाहर)।</p>
      <p>समय पर काम चलाने के दो तरीक़े: पुराना और सरल <b>cron</b> (<code>crontab -e</code>), और आधुनिक <b>systemd timer</b> (unit फ़ाइल + timer, लॉग journalctl में)। cron की पाँच घड़ी-फ़ील्ड हैं: <b>मिनट घंटा दिन-महीना महीना दिन-सप्ताह</b>, फिर कमांड। <code>*</code> = हर, <code>*/5</code> = हर पाँचवाँ, <code>0</code> = शून्य पर। याद रखें — <b>दिन-महीना और दिन-सप्ताह दोनों दिए हों तो cron OR लगाता है</b> (दोनों में से कोई एक मेल खाए तो चलेगा), यह आम भ्रम है। cron का वातावरण बहुत छोटा होता है (PATH सीमित), इसलिए <b>पूरा पथ लिखें</b> और नतीजा फ़ाइल में भेजें।</p>` },

    { type: 'table', head: ['vim कमांड (Normal mode)', 'क्या करती है', 'nano में समकक्ष'], rows: [
      ['<code>i</code> / <code>a</code> / <code>o</code>', 'Insert: कर्सर पर / बाद / नई पंक्ति नीचे', 'सीधे टाइप करना'],
      ['<code>Esc</code>', 'Normal mode में लौटें', '—'],
      ['<code>:w</code> / <code>:q</code> / <code>:wq</code> / <code>:q!</code>', 'सहेजें / बाहर / दोनों / बिना सहेजे बाहर', 'Ctrl+O / Ctrl+X'],
      ['<code>dd</code> / <code>yy</code> / <code>p</code>', 'पंक्ति काटें / कॉपी / पेस्ट', 'Ctrl+K / Ctrl+U'],
      ['<code>u</code> / <code>Ctrl+R</code>', 'undo / redo', 'Alt+U / Alt+E'],
      ['<code>/शब्द</code> फिर <code>n</code>/<code>N</code>', 'खोजें / अगला / पिछला', 'Ctrl+W'],
      ['<code>:%s/purana/naya/g</code>', 'पूरी फ़ाइल में बदलें', 'Ctrl+\\'],
      ['<code>gg</code> / <code>G</code> / <code>5G</code>', 'शुरू / अंत / पंक्ति 5', 'Ctrl+Home / Ctrl+End'],
      ['<code>0</code> / <code>$</code> / <code>w</code> / <code>b</code>', 'पंक्ति-प्रारंभ / अंत / अगला शब्द / पिछला', 'Home / End'],
      ['<code>:set number</code>', 'पंक्ति-नंबर दिखाएँ', 'Alt+#'],
      ['<code>:e file</code> / <code>:sp file</code>', 'दूसरी फ़ाइल / split में', 'Ctrl+R पढ़ने के लिए']
    ]},

    { type: 'table', head: ['cron पंक्ति', 'कब चलेगी', 'नोट'], rows: [
      ['<code>* * * * * cmd</code>', 'हर मिनट', 'पाँचों * = हर मिनट'],
      ['<code>*/5 * * * * cmd</code>', 'हर 5 मिनट', '0,5,10,…'],
      ['<code>0 * * * * cmd</code>', 'हर घंटे के 0वें मिनट', 'घंटे-वार'],
      ['<code>30 6 * * * cmd</code>', 'रोज़ सुबह 6:30', 'सबसे आम बैकअप समय'],
      ['<code>0 2 * * 0 cmd</code>', 'हर रविवार रात 2:00', 'सप्ताह: 0=रवि … 6=शनि (7 भी रवि)'],
      ['<code>0 0 1 * * cmd</code>', 'हर महीने की 1 तारीख़ को आधी रात', 'मासिक'],
      ['<code>0 9-18 * * 1-5 cmd</code>', 'सोम–शुक्र, 9 से 18 बजे हर घंटे', 'श्रेणी (range)'],
      ['<code>@reboot cmd</code>', 'हर boot पर एक बार', 'विशेष कीवर्ड'],
      ['<code>@daily</code> / <code>@weekly</code> / <code>@monthly</code>', 'रोज़/हफ़्ते/महीने', 'क्रन के छोटे नाम'],
      ['<code>0 2 1 * 1 cmd</code>', '<b>OR</b> — महीने की 1 तारीख़ <i>या</i> हर सोमवार', 'दोनों दिन-फ़ील्ड दिए हों तो OR लगता है (आम भ्रम)'],
      ['<code>crontab -e</code> / <code>-l</code> / <code>-r</code>', 'संपादित / सूची / <b>पूरा मिटाना</b>', '-r सावधानी से; उपयोगकर्ता-वार crontab'],
      ['<code>/etc/crontab</code> व <code>/etc/cron.d/</code>', 'सिस्टम cron — इसमें <b>उपयोगकर्ता का कॉलम भी</b> होता है', 'यहाँ 6 फ़ील्ड + कमांड'],
      ['<code>/etc/cron.daily/</code> आदि', 'फ़ोल्डर में रखी स्क्रिप्ट अपने आप', 'anacron भी इन्हें चलाता है (बंद PC के लिए)'],
      ['<code>0 3 * * * /usr/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1</code>', 'रोज़ 3 बजे, लॉग सहित', '<b>पूरा पथ + redirection</b> — cron का PATH सीमित है'],
      ['<code>systemd timer</code>', '<code>OnCalendar=Mon *-*-* 03:00:00</code> + <code>Persistent=true</code>', 'छूटा हुआ काम अगली बार चला देता है; लॉग <code>journalctl -u name</code>']
    ]},

    { type: 'labs', items: [
      { n: 84, title: 'Pipe व redirection से लॉग रिपोर्ट बनाना', aim: 'कच्चे लॉग से सबसे ज़्यादा दोहराए IP, त्रुटि-गिनती और सारांश फ़ाइल बनाना — सब pipe से।', tools: ['लिनक्स टर्मिनल', 'grep/awk/sort/uniq', 'tee'], steps: [
        'एक नक़ली access.log बनाएँ: <code>for i in $(seq 1 200); do echo "192.168.1.$((i%7+1)) - - [date] GET /page$i $((i%3==0?500:200))"; done &gt; access.log</code>',
        'कुल पंक्तियाँ गिनें: <code>wc -l access.log</code>। केवल 500 वाली: <code>grep -c " 500 " access.log</code>।',
        'सबसे ज़्यादा दोहराए IP: <code>awk \'{print $1}\' access.log | sort | uniq -c | sort -nr | head -5</code>',
        'प्रति IP त्रुटि-गिनती: <code>grep " 500 " access.log | awk \'{print $1}\' | sort | uniq -c | sort -nr</code>',
        'पूरी रिपोर्ट एक फ़ाइल में: ऊपर की कमांडों को <code>{ … } &gt; report.txt</code> में लपेटें, या <code>tee report.txt</code> लगाएँ।',
        'त्रुटियाँ अलग फ़ाइल में: कोई ग़लत कमांड चलाकर <code>2&gt; err.txt</code> और फिर <code>&gt; sab.txt 2&gt;&amp;1</code> का फ़र्क़ देखें।',
        'अंत में <code>sed -n \'1,10p\' report.txt</code> से ऊपर की 10 पंक्तियाँ और <code>sed -i.bak \'s/192.168.1./10.0.0./g\' report.txt</code> से बदलाव करें; .bak से मूल मिलाएँ।'
      ], result: 'एक report.txt जिसमें IP-वार गिनती और त्रुटि-सारांश हो; आप pipe, redirection, grep/sed/awk का फ़र्क़ बता सकते हैं।' },

      { n: 85, title: 'अनुमति व मालिकाना — सुरक्षित साझा फ़ोल्डर बनाना', aim: 'octal अनुमति पढ़ना-लगाना, chown से समूह सेट करना, और setgid/sticky का असर देखना।', tools: ['लिनक्स', 'दो उपयोगकर्ता या sudo -u', 'chmod/chown/umask'], steps: [
        '<code>mkdir -p ~/perm-lab &amp;&amp; cd ~/perm-lab</code>; एक फ़ाइल और एक फ़ोल्डर बनाएँ।',
        '<code>ls -l</code> से डिफ़ॉल्ट अनुमति पढ़ें; <code>umask</code> देखें और 022 से 644/755 का हिसाब मिलाएँ।',
        '<code>chmod 755 script.sh</code> और <code>chmod 644 notes.txt</code> लगाकर <code>ls -l</code> से पुष्टि करें; फिर प्रतीकात्मक रूप <code>chmod u+x,g-w notes.txt</code> आज़माएँ।',
        '<code>chmod 600 secret.txt</code> करें और दूसरे उपयोगकर्ता से पढ़ने की कोशिश करें: <code>sudo -u nobody cat secret.txt</code> → Permission denied।',
        'एक फ़ोल्डर से <code>x</code> हटाएँ (<code>chmod 644 dir</code>) और उसके अंदर <code>cd</code>/<code>ls</code> करके देखें कि r होने पर भी क्यों नहीं घुस पाते।',
        '<code>sudo chown -R $USER:$(id -gn) shared/</code> और <code>sudo chmod 2775 shared/</code> (setgid) करें; अंदर नई फ़ाइल बनाकर उसका समूह जाँचें।',
        '<code>/tmp</code> की अनुमति देखें (<code>ls -ld /tmp</code> → 1777) और sticky bit का अर्थ लिखें।',
        'अंत में <code>find ~/perm-lab -type f -perm -002 -ls</code> चलाकर "सबको लिखने योग्य" फ़ाइलें ढूँढ़ें (सुरक्षा जाँच)।'
      ], result: 'आप ls -l की पंक्ति पढ़कर बता सकते हैं कि कौन क्या कर सकता है; 600/644/755/2775/1777 का अर्थ और उपयोग स्पष्ट है।' },

      { n: 86, title: 'प्रोसेस, सेवा और नेटवर्क निदान — "इंटरनेट नहीं चल रहा"', aim: 'ps/top/kill, systemctl और ip/ss/ping/dig/curl से क्रमबद्ध निदान करना।', tools: ['लिनक्स (systemd)', 'ip/ss/ping/dig/curl', 'journalctl'], steps: [
        '<code>uptime; free -h; df -h</code> से भार, RAM और डिस्क देखें।',
        '<code>ps aux --sort=-%cpu | head</code> और <code>top</code> (P दबाकर CPU क्रम) से सबसे भारी प्रोसेस पहचानें; <code>q</code> से बाहर।',
        'एक नक़ली लंबा काम चलाएँ: <code>sleep 300 &amp;</code>; <code>jobs</code>, <code>pgrep sleep</code> से PID लें, पहले <code>kill PID</code> (15) आज़माएँ, न रुके तो <code>kill -9</code>।',
        '<code>systemctl status ssh</code> (या nginx) देखें; <code>sudo systemctl restart</code> करें और <code>journalctl -u ssh -n 20</code> से लॉग पढ़ें।',
        'नेटवर्क क्रम से जाँचें: <code>ip -br a</code> (interface UP + IP?) → <code>ip r</code> (default gateway?) → <code>ping -c4 gateway IP</code> → <code>ping -c4 8.8.8.8</code>।',
        'नाम की जाँच: <code>dig +short example.com</code> और <code>dig @8.8.8.8 +short example.com</code> — दोनों का नतीजा मिलाएँ (स्थानीय DNS बनाम सार्वजनिक)।',
        'सेवा की जाँच: <code>sudo ss -tulpn | grep -E ":22|:80"</code> और <code>curl -I https://example.com</code>।',
        'एक पन्ने का निदान-लॉग बनाएँ: हर कमांड का नतीजा <code>&gt;&gt; ~/net-diagnose.txt</code> में जोड़ते जाएँ और अंत में लिखें कि गड़बड़ी किस स्तर पर थी।'
      ], result: 'link → IP → gateway → DNS → बाहरी IP → नाम → सेवा का पूरा क्रम हाथ में; एक लिखित निदान-रिपोर्ट तैयार।' }
    ]},

    { type: 'acc', title: 'FAQ — लिनक्स टर्मिनल', items: [
      { q: '> और >> में क्या फ़र्क़ है?', a: '<code>&gt;</code> फ़ाइल को मिटाकर नया लिखता है (overwrite), <code>&gt;&gt;</code> अंत में जोड़ता है (append)। लॉग में जोड़ते जाना हो तो हमेशा >>; एक बार की रिपोर्ट बनानी हो तो >।' },
      { q: '2>&1 का मतलब और सही क्रम क्या है?', a: 'इसका अर्थ है "stderr (2) को stdout (1) की जगह भेजो"। सही क्रम <code>cmd &gt; log.txt 2&gt;&amp;1</code> — पहले stdout फ़ाइल में, फिर stderr को उसी जगह। उल्टा लिखा (<code>2&gt;&amp;1 &gt; log.txt</code>) तो stderr स्क्रीन पर ही रह जाएगा क्योंकि उस समय stdout अभी स्क्रीन था।' },
      { q: 'Ctrl+C, Ctrl+Z और Ctrl+D में फ़र्क़?', a: 'Ctrl+C = SIGINT, चलते प्रोग्राम को रोकने का निवेदन। Ctrl+Z = SIGTSTP, प्रोग्राम को रोककर पीछे डालता है (फिर bg/fg से चलाएँ)। Ctrl+D = EOF, यानी stdin बंद — खाली शेल पर यह logout कर देता है।' },
      { q: 'kill -9 क्यों आख़िरी सहारा है?', a: 'SIGKILL (9) प्रोग्राम को पकड़कर तुरंत समाप्त करता है — उसे न फ़ाइल सहेजने का मौक़ा मिलता है न सफ़ाई का। इससे डेटा अधूरा/भ्रष्ट हो सकता है। पहले SIGTERM (15, डिफ़ॉल्ट kill) दें; न माने तभी 9।' },
      { q: 'systemctl start और enable में फ़र्क़?', a: '<b>start</b> = सेवा अभी चालू करो (इस boot तक)। <b>enable</b> = हर boot पर अपने आप चालू हो। दोनों अलग हैं; स्थायी सेवा के लिए <code>sudo systemctl enable --now name</code> से दोनों एक साथ होते हैं।' },
      { q: 'chmod 755 और 644 का अर्थ?', a: '755 = मालिक rwx(7), समूह r-x(5), others r-x(5) — स्क्रिप्ट/फ़ोल्डर के लिए। 644 = मालिक rw-(6), समूह r--(4), others r--(4) — साधारण फ़ाइल के लिए। r=4, w=2, x=1 जोड़कर अंक बनते हैं।' },
      { q: 'डायरेक्टरी पर x का क्या मतलब है?', a: 'फ़ोल्डर पर <b>x = अंदर घुसने/पहुँचने की अनुमति</b>। केवल r हो तो आप नामों की सूची देख सकते हैं पर फ़ाइलें नहीं खोल सकते; केवल x हो तो नाम नहीं दिखेंगे पर सही नाम से फ़ाइल खुल सकती है। इसलिए फ़ोल्डर के लिए आम तौर पर 755 या 700।' },
      { q: '777 क्यों नहीं लगाना चाहिए?', a: 'यह किसी को भी पढ़ने, लिखने और मिटाने की शक्ति देता है — वेब सर्वर पर तो हमलावर स्क्रिप्ट डाल सकता है। साझा फ़ोल्डर चाहिए तो सही समूह बनाकर 775/2775 दें, या /tmp जैसा sticky (1777) रखें ताकि कोई दूसरे की फ़ाइल न मिटा सके।' },
      { q: 'grep, sed, awk — कब कौन?', a: 'ढूँढ़ना/छाँटना = grep। पंक्ति में बदलना/मिटाना/छापना = sed। कॉलम से हिसाब, शर्त, जोड़, रिपोर्ट = awk। तीनों pipe से जुड़ते हैं: <code>awk \'{print $1}\' log | sort | uniq -c | sort -nr</code>।' },
      { q: 'find और locate में फ़र्क़?', a: 'find अभी filesystem घूमकर ढूँढ़ता है — सटीक और ताज़ा, पर धीमा; आकार/समय/अनुमति से भी छाँट सकता है। locate पहले बने database से ढूँढ़ता है — बहुत तेज़, पर नई फ़ाइलें <code>sudo updatedb</code> के बाद ही दिखतीं।' },
      { q: 'cron में पूरा पथ क्यों लिखना पड़ता है?', a: 'cron का वातावरण न्यूनतम होता है — PATH बहुत सीमित, कोई .profile नहीं लोड होता। इसलिए <code>/usr/bin/python3</code> जैसे पूरे पथ लिखें, ज़रूरी चर स्क्रिप्ट के अंदर सेट करें, और नतीजा <code>&gt;&gt; log 2&gt;&amp;1</code> से सहेजें ताकि विफलता दिखे।' },
      { q: 'df भरी दिखाता है पर du कम — क्यों?', a: 'कोई फ़ाइल मिटा दी गई है पर उसे खोलने वाला प्रोसेस अभी चल रहा है, इसलिए जगह नहीं छूटी। <code>lsof | grep deleted</code> से पकड़ें और उस प्रोसेस को restart करें। दूसरा कारण inode समाप्त होना — <code>df -i</code> से देखें (लाखों छोटी फ़ाइलें)।' },
      { q: 'tar में c, x, t, v, f का क्रम क्यों मायने रखता है?', a: 'f का मतलब "अगला तर्क फ़ाइल का नाम है", इसलिए f हमेशा आख़िर में और उसके तुरंत बाद फ़ाइल का नाम आना चाहिए। सही: <code>tar -czvf backup.tar.gz dir/</code>। ग़लत: <code>tar -cfzv …</code> — यह z को फ़ाइल नाम समझ लेगा।' },
      { q: 'ifconfig/netstat नहीं मिल रहे, क्या करें?', a: 'ये पुराने net-tools के हिस्से हैं और कई नए डिस्ट्रो में स्थापित नहीं होते। समकक्ष: <code>ip a</code> (ifconfig), <code>ip r</code> (route), <code>ss -tulpn</code> (netstat), <code>ip neigh</code> (arp)। यही iproute2 परिवार अब मानक है।' },
      { q: 'vim से बाहर कैसे निकलें?', a: '<code>Esc</code> दबाएँ (Normal mode), फिर <code>:q!</code> Enter = बिना सहेजे बाहर; <code>:wq</code> या <code>:x</code> = सहेजकर बाहर; <code>:w filename</code> = नए नाम से सहेजें। टाइप करने के लिए पहले <code>i</code> दबाकर Insert mode में जाना पड़ता है।' }
    ]},

    { type: 'quiz', store: 'lin-cli', items: [
      { q: 'एक कमांड का stdout दूसरे के stdin में भेजने वाला चिह्न कौन-सा है?', o: ['>', '|', '&', '>>'], a: 1, ex: '| = pipe। > फ़ाइल में भेजता है, >> फ़ाइल में जोड़ता है, & background में चलाता है।' },
      { q: 'फ़ाइल के अंत में जोड़ने (append) वाला चिह्न?', o: ['>', '>>', '<', '|'], a: 1, ex: '>> append करता है; > पुरानी सामग्री मिटाकर नया लिखता है।' },
      { q: 'stderr को भी stdout वाली फ़ाइल में भेजने का सही रूप?', o: ['cmd 2>&1 > log', 'cmd > log 2>&1', 'cmd 2>1 > log', 'cmd > log 2>1'], a: 1, ex: 'पहले stdout फ़ाइल में, फिर 2>&1 से stderr उसी जगह। क्रम उल्टा होने पर stderr स्क्रीन पर रह जाता है।' },
      { q: 'सारी त्रुटियाँ चुपचाप फेंक देने का पथ?', o: ['/dev/zero', '/dev/null', '/dev/random', '/tmp'], a: 1, ex: '/dev/null शून्य-उपकरण है — जो भेजो सब गायब। cmd 2>/dev/null से त्रुटि संदेश छिप जाते हैं।' },
      { q: 'grep -v क्या करता है?', o: ['verbose दिखाता है', 'मेल न खाती पंक्तियाँ दिखाता है', 'version बताता है', 'फ़ाइल में बदलता है'], a: 1, ex: '-v = invert match। ps aux | grep -v grep से खुद grep वाली पंक्ति हट जाती है।' },
      { q: 'पूरी फ़ाइल में सभी जगह पाठ बदलने वाला sed रूप?', o: ["sed 's/a/b/' f", "sed 's/a/b/g' f", "sed 's/a/b/1' f", "sed -n 's/a/b/p' f"], a: 1, ex: 'g = global (पंक्ति के सभी मेल)। -i जोड़ने पर फ़ाइल में सीधे बदलता है; -i.bak से backup भी रखें।' },
      { q: 'awk में आख़िरी कॉलम कैसे लिखते हैं?', o: ['$0', '$NF', '$LAST', '$END'], a: 1, ex: 'NF = number of fields, इसलिए $NF = आख़िरी कॉलम। $0 = पूरी पंक्ति।' },
      { q: 'स्पेस वाले फ़ाइल-नामों के साथ सुरक्षित सामूहिक काम का तरीक़ा?', o: ['find … | xargs rm', 'find … -print0 | xargs -0 rm', 'find … -exec rm *', 'rm $(find …)'], a: 1, ex: '-print0 और -0 शून्य-अक्षर से अलग करते हैं, जिससे स्पेस/newline वाले नाम भी सही रहते हैं।' },
      { q: 'chmod 644 का अर्थ क्या है?', o: ['सबको सब', 'मालिक rw-, समूह r--, others r--', 'मालिक rwx, बाक़ी r-x', 'केवल मालिक rw-'], a: 1, ex: '6=rw-, 4=r--। यह साधारण डेटा फ़ाइल की सबसे आम सुरक्षित अनुमति है।' },
      { q: 'निजी SSH key की सही अनुमति क्या होनी चाहिए?', o: ['777', '644', '600', '755'], a: 2, ex: 'chmod 600 ~/.ssh/id_rsa — केवल मालिक पढ़/लिख सके। इससे ढीली अनुमति पर SSH key अस्वीकार कर देता है।' },
      { q: 'डायरेक्टरी पर x बिट का अर्थ?', o: ['फ़ाइल चलाना', 'फ़ोल्डर के अंदर घुसने/पहुँचने की अनुमति', 'फ़ोल्डर मिटाना', 'कुछ नहीं'], a: 1, ex: 'फ़ोल्डर पर x = traverse। बिना x के अंदर की फ़ाइलें नहीं खुलतीं, भले ही r हो।' },
      { q: '/tmp की अनुमति 1777 में आख़िरी 1 क्या है?', o: ['setuid', 'setgid', 'sticky bit', 'immutable'], a: 2, ex: 'sticky bit = सब लिख सकते हैं पर केवल अपनी फ़ाइल मिटा सकते हैं। इसीलिए /tmp सुरक्षित रहता है।' },
      { q: 'SIGTERM और SIGKILL के नंबर क्या हैं?', o: ['1 और 2', '15 और 9', '9 और 15', '2 और 1'], a: 1, ex: 'SIGTERM=15 (विनम्र, डिफ़ॉल्ट kill), SIGKILL=9 (ज़बरदस्ती, पकड़ा नहीं जा सकता), SIGINT=2 (Ctrl+C)।' },
      { q: 'सेवा को हर boot पर अपने आप चालू करने वाला systemctl विकल्प?', o: ['start', 'enable', 'reload', 'status'], a: 1, ex: 'enable = boot पर स्वतः; start = अभी। दोनों के लिए enable --now।' },
      { q: 'systemd सेवा का जीवित लॉग देखने की कमांड?', o: ['tail /var/log/syslog', 'journalctl -u nginx -f', 'dmesg', 'systemctl log nginx'], a: 1, ex: 'journalctl -u इकाई -f (follow)। -b = इस boot का, --since से समय सीमा।' },
      { q: 'Ubuntu/Debian में पैकेज सूची ताज़ा करने की कमांड?', o: ['sudo apt upgrade', 'sudo apt update', 'sudo apt install', 'sudo apt refresh'], a: 1, ex: 'update = सूची ताज़ा; upgrade = स्थापित पैकेज नए संस्करण पर। install से पहले update करना अच्छी आदत है।' },
      { q: 'Debian में प्रोग्राम के साथ उसकी कॉन्फ़िग फ़ाइलें भी हटाने वाला विकल्प?', o: ['remove', 'purge', 'delete', 'clean'], a: 1, ex: 'apt purge = प्रोग्राम + कॉन्फ़िग। remove केवल प्रोग्राम हटाता है, कॉन्फ़िग रह जाती है।' },
      { q: 'ifconfig का आधुनिक समकक्ष कौन-सा है?', o: ['ip a', 'ss -tulpn', 'nmcli', 'netstat'], a: 0, ex: 'ip a (ip addr) पते दिखाता है; ip r रास्ते; ss ports; ip neigh ARP।' },
      { q: 'खुले listening ports और उनके PID देखने की कमांड?', o: ['ps aux', 'sudo ss -tulpn', 'df -h', 'ip r'], a: 1, ex: 'ss -tulpn = TCP/UDP listening + process। यह पुराने netstat -tulpn का समकक्ष है।' },
      { q: 'DNS रिकॉर्ड की पूरी जाँच के लिए कौन-सा औज़ार सबसे विस्तृत है?', o: ['ping', 'dig', 'curl', 'traceroute'], a: 1, ex: 'dig query का पूरा ब्योरा देता है; dig +short संक्षिप्त। dig @8.8.8.8 से किसी विशेष DNS सर्वर से पूछ सकते हैं।' },
      { q: 'tar में आर्काइव बनाने और gzip संपीड़न के अक्षर कौन-से हैं?', o: ['x और z', 'c और z', 't और j', 'c और J'], a: 1, ex: 'c=create, x=extract, t=list; z=gzip, j=bzip2, J=xz; v=verbose, f=file (आख़िर में)।' },
      { q: 'cron पंक्ति "30 6 * * *" कब चलेगी?', o: ['हर 6 घंटे 30 मिनट पर', 'रोज़ सुबह 6:30', 'हर सोमवार 6:30', 'महीने की 6 तारीख़ को 30 मिनट पर'], a: 1, ex: 'क्रम = मिनट घंटा दिन-महीना महीना दिन-सप्ताह। 30 6 * * * = रोज़ 06:30।' },
      { q: 'cron में कमांड का पूरा पथ क्यों लिखते हैं?', o: ['नियम नहीं है', 'cron का PATH बहुत सीमित होता है', 'तेज़ चलता है', 'लॉग बनता है'], a: 1, ex: 'cron न्यूनतम वातावरण में चलता है, उपयोगकर्ता का .profile नहीं लोड होता — इसलिए /usr/bin/… पूरा पथ और redirection ज़रूरी।' },
      { q: 'df भरी दिखाए पर du कम बताए तो सबसे संभावित कारण?', o: ['डिस्क ख़राब', 'मिटाई फ़ाइल अभी किसी प्रोसेस में खुली है', 'RAM कम', 'inode ख़त्म'], a: 1, ex: 'deleted-but-open फ़ाइल की जगह प्रोसेस बंद होने तक नहीं छूटती। lsof | grep deleted से पकड़ें। inode के लिए df -i देखें।' },
      { q: 'vim में बिना सहेजे बाहर निकलने की कमांड?', o: [':wq', ':q!', ':x', ':w'], a: 1, ex: 'Esc के बाद :q! = बिना सहेजे बाहर; :wq या :x = सहेजकर बाहर।' },
      { q: 'rsync में --delete क्या करता है?', o: ['स्रोत मिटाता है', 'गंतव्य की वे फ़ाइलें मिटाता है जो स्रोत में नहीं हैं', 'सब मिटाता है', 'कुछ नहीं'], a: 1, ex: '--delete गंतव्य को स्रोत का दर्पण बनाता है — अतिरिक्त फ़ाइलें मिटती हैं। पहले हमेशा --dry-run चलाएँ।' }
    ]},

    { type: 'callout', kind: 'exam', title: 'परीक्षा/इंटरव्यू — लिनक्स टर्मिनल के पक्के बिंदु', html: '<ul><li><b>streams</b>: stdin 0, stdout 1, stderr 2। <code>|</code> pipe, <code>&gt;</code> overwrite, <code>&gt;&gt;</code> append, <code>2&gt;&amp;1</code> दोनों एक जगह, <code>/dev/null</code> शून्य।</li><li><b>glob</b>: <code>*</code> कई अक्षर, <code>?</code> एक, <code>[a-z]</code> श्रेणी, <code>{a,b}</code> brace; छिपी (डॉट) फ़ाइलें <code>*</code> से नहीं मिलतीं।</li><li><b>grep</b> ढूँढ़े (-i case, -v उल्टा, -r recursive, -n नंबर, -c गिनती, -E extended regex, -A/-B/-C संदर्भ)। <b>sed</b> बदले (<code>s/…/…/g</code>, <code>-i</code>, <code>-n \'5,10p\'</code>)। <b>awk</b> कॉलम (<code>$1…$NF</code>, <code>-F:</code>, BEGIN/END)।</li><li><b>अनुमति</b>: r=4, w=2, x=1; 600 निजी key, 644 फ़ाइल, 755 स्क्रिप्ट/फ़ोल्डर, 1777 /tmp (sticky), 2775 साझा (setgid)। फ़ोल्डर पर x = अंदर घुसना।</li><li><b>प्रोसेस</b>: ps aux, top/htop, pgrep, kill 15 (पहले) → kill -9 (आख़िरी), Ctrl+C=SIGINT, Ctrl+Z=SIGTSTP, jobs/bg/fg, nohup, nice/renice।</li><li><b>systemd</b>: start ≠ enable; <code>enable --now</code> दोनों; status/reload/restart; <code>journalctl -u name -f</code>।</li><li><b>पैकेज</b>: apt (Debian/Ubuntu) — update → install → upgrade; remove बनाम <b>purge</b>; autoremove। dnf (Fedora/RHEL), pacman (Arch)।</li><li><b>नेटवर्क</b>: ip a / ip r / ip neigh / ss -tulpn (पुराने ifconfig, route, arp, netstat की जगह)। निदान क्रम: link → IP → gateway → DNS → बाहरी IP → नाम → सेवा।</li><li><b>डिस्क</b>: df -h (भराव), df -i (inode), du -sh (फ़ोल्डर), lsblk, blkid। <b>tar</b>: c/x/t + z/j/J + v + f (f आख़िर में)।</li><li><b>cron</b>: मिनट घंटा दिन-महीना महीना दिन-सप्ताह; दोनों दिन-फ़ील्ड दिए हों तो <b>OR</b>; पूरा पथ + <code>&gt;&gt; log 2&gt;&amp;1</code>; @reboot/@daily।</li><li><b>vim</b>: i = Insert, Esc = Normal, :wq सहेजकर बाहर, :q! बिना सहेजे, dd/yy/p, /खोज, :%s/…/…/g।</li><li><b>सुरक्षा</b>: sudo वाली पंक्ति Enter से पहले दोबारा पढ़ें; चर कोट करें (<code>"$DIR"</code>); <code>curl … | sudo bash</code> न करें; 777 न दें।</li></ul>'},

    { type: 'pills', items: [
      { text: '| जोड़ता है, > लिखता है, >> जोड़ता है', kind: 'info' },
      { text: '2>&1 का क्रम मायने रखता है', kind: 'warn' },
      { text: 'grep ढूँढ़े · sed बदले · awk हिसाब', kind: 'tip' },
      { text: '600 key · 644 फ़ाइल · 755 फ़ोल्डर', kind: 'ok' },
      { text: 'पहले kill 15, फिर -9', kind: 'warn' },
      { text: 'start ≠ enable', kind: 'info' },
      { text: 'apt update → install', kind: 'tip' },
      { text: 'ip/ss ने ifconfig/netstat की जगह ली', kind: 'info' },
      { text: 'rm से पहले echo/ls से जाँचें', kind: 'danger' }
    ]},
  ]
}
]);
