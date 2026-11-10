/* =====================================================================
   कंप्यूटर लैब  ·  data-lin2.js
   लिनक्स मास्टरक्लास — भाग 3 · 4 · 5 (सर्वर नेटवर्क · इंस्टॉल/WSL · बाश स्क्रिप्टिंग)
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   लिनक्स मास्टरक्लास 3 · सर्वर व नेटवर्क प्रशासन
   =================================================================== */
{
  id:"lin-admin", icon:"🖧", group:"लिनक्स मास्टरक्लास", title:"लिनक्स सर्वर व नेटवर्क प्रशासन",
  sub:"SSH, फ़ायरवॉल, LVM, लॉग, LAMP, Samba, बैकअप, मॉनिटरिंग",
  kicker:"Linux Masterclass 3 · Server & Network Administration",
  hero:"यह अध्याय एक छोटे लैब/ऑफ़िस सर्वर को चलाकर सुरक्षित रखने की पूरी प्रक्रिया है — नेटवर्क (network), SSH, फ़ायरवॉल (firewall), डिस्क (LVM), सेवाएँ (systemd), वेक (LAMP), फ़ाइल शेयर (Samba/NFS), बैकअप व मॉनिटरिंग। हर कमांड असली व चलाने-योग्य है; production में बदलाव से पहले बैकअप ज़रूर लें।",
  tags:["नेटवर्क सेटअप","SSH व सुरक्षा","LVM व RAID","LAMP स्टैक","फ़ायरवॉल","बैकअप व मॉनिटरिंग"],
  blocks:[

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.1</span> स्थैतिक IP विन्यास — तीन तरीके (netplan / ifupdown / NetworkManager)</h3><p>लैब सर्वर का IP <b>स्थैतिक (static)</b> होना चाहिए ताकि DNS, SSH और शेयर हमेशा एक ही पते पर मिलें। Debian/Ubuntu <b>two</b> रास्ते रखते हैं — <b>netplan</b> (Ubuntu) और <b>ifupdown</b> (Debian) — जबकि RHEL/Fedora <b>NetworkManager (nmcli)</b> उपयोग करते हैं। गलत file बदलने पर भी IP नहीं बदलेगा, इसलिए पहले पता लगाएँ कौन-सा backend चल रहा है: <code>cat /etc/os-release</code> और <code>systemctl is-active NetworkManager netplan</code>।</p>"},
    {type:"table", head:["वितरण / संस्करण","विधि (method)","मुख्य फ़ाइल / टूल","लागू करने का कमांड"],
      rows:[
        ["Ubuntu Server 18.04+","netplan (systemd-networkd)","/etc/netplan/*.yaml","sudo netplan apply"],
        ["Ubuntu Desktop (नई)","NetworkManager","nmcli / GUI / /etc/NetworkManager","sudo nmcli con up <name>"],
        ["Debian 11/12","ifupdown","/etc/network/interfaces","sudo systemctl restart networking"],
        ["RHEL/Fedora","NetworkManager","nmcli (ifcfg-<int> फ़ाइलें)","sudo nmcli con reload; nmcli con up"],
        ["RHEL 7/8 legacy","network-scripts","/etc/sysconfig/network-scripts/ifcfg-*","sudo systemctl restart NetworkManager"]
      ]},
    {type:"html", html:"<h4 class=\"blk2\">(अ) Ubuntu — netplan YAML</h4><p>netplan YAML <b>indentation-संवेदी</b> है (Tab नहीं, स्पेस) और file पर <code>0600</code> permission होनी चाहिए।</p>"},
    {type:"code", lang:"yaml", code:"# /etc/netplan/01-static.yaml\nnetwork:\n  version: 2\n  renderer: networkd\n  ethernets:\n    ens33:\n      dhcp4: no\n      addresses: [192.168.1.10/24]\n      routes:\n        - to: default\n          via: 192.168.1.1\n      nameservers:\n        addresses: [192.168.1.1, 8.8.8.8]\n        search: [lab.local]\n\n# लागू करें:\nsudo chmod 600 /etc/netplan/01-static.yaml\nsudo netplan try      # 120 सेकंड का auto-rollback — lockout से बचाता है\nsudo netplan apply\nip -br addr ; ping -c 2 192.168.1.1"},
    {type:"html", html:"<h4 class=\"blk2\">(ब) Debian — ifupdown; (स) NetworkManager; (द) RHEL network-scripts</h4>"},
    {type:"code", lang:"bash", code:"# --- Debian ifupdown (/etc/network/interfaces) ---\nauto lo\niface lo inet loopback\nauto ens33\niface ens33 inet static\n    address 192.168.1.20/24\n    gateway 192.168.1.1\n    dns-nameservers 8.8.8.8 1.1.1.1\nsudo systemctl restart networking\n\n# --- NetworkManager nmcli (किसी भी RHEL/Ubuntu) ---\nnmcli con add type ethernet con-name static ifname ens33 \\\n  ipv4.method manual ipv4.addresses 192.168.1.30/24 ipv4.gateway 192.168.1.1 \\\n  ipv4.dns \"192.168.1.1 8.8.8.8\"\nnmcli con mod static +ipv4.dns 1.1.1.1     # DNS जोड़ें\nnmcli con mod static ipv4.dns \"8.8.8.8\"    # DNS बदलें (replace)\nnmcli con up static ; nmcli -p con show active\n# ग्राफ़िकल (console) विकल्प:\nsudo nmtui     # Text User Interface — Edit a connection\n\n# --- RHEL legacy network-scripts ---\n# /etc/sysconfig/network-scripts/ifcfg-ens33\n# BOOTPROTO=static  IPADDR=192.168.1.40  NETMASK=255.255.255.0\n# GATEWAY=192.168.1.1  DNS1=8.8.8.8  ONBOOT=yes\nsudo systemctl restart NetworkManager"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.2</span> DNS, होस्टनेम और /etc/hosts</h3><p>नाम हल करने का क्रम (glibc): पहले <b>/etc/hosts</b>, फिर DNS। <b>systemd-resolved</b> (Ubuntu) स्थानीय स्तब्ध श्रृंखलाकारक <code>stub</code> चलाता है, इसलिए <code>/etc/resolv.conf</code> अक्सर <code>127.0.0.53</code> की ओर symlink होता है — उसमें सीधे लिखना ठीक नहीं। होस्टनेम <code>hostnamectl</code> से बदलें (reboot-मुक्त) और हमेशा <b>/etc/hosts</b> में भी दर्ज करें।</p>"},
    {type:"code", lang:"bash", code:"sudo hostnamectl set-hostname srv01.lab.local\nhostnamectl status\n\n# /etc/hosts — नाम->IP (DNS से पहले चेक होता है)\n127.0.0.1   localhost\n127.0.1.1   srv01.lab.local srv01\n192.168.1.10 srv01.lab.local\n\n# resolved की DNS सेटिंग\nresolvectl status\nresolvectl dns ens33 1.1.1.1 8.8.8.8\nresolvectl query lab.local\n# nmcli से (NetworkManager हो पर):\nnmcli con mod ens33 ipv4.dns \"192.168.1.1 8.8.8.8\" ; nmcli con up ens33\n\n# जाँच के टूल\ngetent hosts srv01.lab.local    # hosts + DNS दोनों मिलाकर\nnslookup lab.local 8.8.8.8\ndig lab.local\ndig +trace lab.local            # root->TLD->authoritative पूरी चेन"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.3</span> इंटरफ़ेस, रूटिंग, bonding व VLAN</h3><p>आधुनिक कमांड <code>ip</code> (iproute2) है — <code>ifconfig/route</code> पुराने हैं। <b>आपके-परीक्षण</b> के लिए <code>ip addr/link/route</code> केवल तत्काल बदलाव करते हैं; रिबूट पर टिकाने के लिए ऊपर की विधि (netplan/nmcli) में लिखें। <b>bonding</b> दो NIC जोड़कर उपलब्धता/थ्रूपुट देता है, <b>VLAN</b> एक तार पर कई लॉजिकल नेटवर्क।</p>"},
    {type:"code", lang:"bash", code:"ip -br addr                         # सभी interface एक नज़र में\nip addr add 192.168.1.50/24 dev ens33     # तत्काल IP जोड़ें\nip addr del 192.168.1.50/24 dev ens33\nip link set dev ens33 up\nip link set dev ens33 down\nip -s link show ens33               # RX/TX packets, errors\n\nip route add default via 192.168.1.1\nip route add 10.10.0.0/16 via 192.168.1.254\nip route show ; ip route get 8.8.8.8\n\ncat /proc/net/dev                   # interface-level bytes/packets\nsudo ethtool ens33                  # negotiated speed/duplex\nsudo ethtool -i ens33               # driver + firmware\nsudo ethtool -s ens33 speed 1000 duplex full autoneg on\n\n# VLAN (802.1q)\nsudo ip link add link ens33 name ens33.100 type vlan id 100\nsudo ip addr add 10.0.100.1/24 dev ens33.100 ; sudo ip link set ens33.100 up\nsudo nmcli con add type vlan ifname ens33.100 dev ens33 id 100 \\\n  ipv4.method manual ipv4.addresses 10.0.100.1/24\n\n# Bonding (mode 4 = LACP)\nsudo ip link add bond0 type bond mode 802.3ad\nsudo ip link set ens33 down ; sudo ip link set ens33 master bond0\nsudo ip link set ens34 down ; sudo ip link set ens34 master bond0\nsudo ip addr add 192.168.1.60/24 dev bond0 ; sudo ip link set bond0 up"},
    {type:"table", head:["Bond mode","नाम","क्या करता है / आवश्यकता"],
      rows:[
        ["0","balance-rr","राउंड-रॉबिन पैकेट; थ्रूपुट बढ़ता है पर एक TCP session को एक ही link चाहिए; स्विच पर LACP/etherchannel सेट करें"],
        ["1","active-backup","एक सक्रिय, बाकी स्टैंडबाय (failover); स्विच बदलाव नहीं चाहिए; सबसे सरल व सुरक्षित"],
        ["2","balance-xor","स्रोत+गंतव्य MAC/IP से hash; एक ही गंतव्य एक ही link से; स्विच स्थिरता चाहिए"],
        ["4","802.3ad (LACP)","स्विच के साथ dynamic link aggregation; दोनों तरफ LACP चालू; तेज़ व मानक"],
        ["6","balance-alb","adaptive load-balancing; स्विच बदलाव नहीं चाहिए (Linux-side)"]
      ]},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.4</span> SSH सर्वर — सुरक्षित दूर-प्रवेश</h3><p>SSH (<b>22/tcp</b> डिफ़ॉल्ट) लिनक्स सर्वर चलाने की रीढ़ है। <code>sshd_config</code> में बदलाव से पहले हमेशा कॉपी रखें और <code>sshd -t</code> से syntax जाँचें, फिर reload करें — reload पुराने session को नहीं काटता, इसलिए आपका मौजूदा खिड़की बचाव रहती है।</p>"},
    {type:"table", head:["निर्देश (directive)","अर्थ","सुझाई मान (सर्वर)"],
      rows:[
        ["Port","SSH का सुनने वाला पोर्ट","22 या 2222 (SELinux/ufw साथ खोलें)"],
        ["PermitRootLogin","क्या सीधे root लॉगिन मिले","no (या prohibit-password)"],
        ["PasswordAuthentication","पासवर्ड से लॉगिन","no (key-आधारित होने पर)"],
        ["PubkeyAuthentication","पब्लिक-की से लॉगिन","yes"],
        ["MaxAuthTries","एक कनेक्शन में अधिकतम प्रयास","3"],
        ["AllowUsers","कौन-कौन लॉगिन करे (whitelist)","admin @192.168.1.0/24"],
        ["ClientAliveInterval","निष्क्रिय सत्र कितने सेकंड पर जाँचे","300"],
        ["Banner","लॉगिन-से पहले दिखने वाली चेतावनी","/etc/issue.net"]
      ]},
    {type:"html", html:"<h4 class=\"blk2\">की-आधारित प्रमाणीकरण (key-based auth)</h4><p>सिद्धांत: क्लाइंट पर <code>ssh-keygen</code> से जोड़ी बनती है — <b>private key</b> (~/.ssh/id_*) कभी बाहर नहीं जाती; <b>public key</b> सर्वर की <code>~/.ssh/authorized_keys</code> में जाती है। सर्वर public मिलाकर challenge करता है, private से हल करना होता है — पासवर्ड नेटवर्क पर कभी नहीं जाता।</p>"},
    {type:"code", lang:"bash", code:"# --- सर्वर पर SSH स्थापित करें ---\nsudo apt install openssh-server      # Debian/Ubuntu\nsudo dnf install openssh-server      # RHEL/Fedora\nsudo systemctl enable --now ssh      # Ubuntu (सेवा का नाम 'ssh')\nsudo systemctl enable --now sshd     # RHEL (सेवा 'sshd')\n\n# --- क्लाइंट पर key बनाएँ ---\nssh-keygen -t ed25519 -C \"admin@lab\"   # ~/.ssh/id_ed25519 (.pub)\n# RSA चाहिए तो: ssh-keygen -t rsa -b 4096 -C \"admin@lab\"\n\n# --- public key सर्वर पर भेजें (एक बार) ---\nssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.1.10\n# मैन्युअल: cat.pub -> सर्वर की ~/.ssh/authorized_keys में append करें\n\n# --- परमिशन ज़रूरी (सर्वर पर उसी user के तहत) ---\nchmod 755 ~\nchmod 700 ~/.ssh\nchmod 600 ~/.ssh/authorized_keys     # या 644\nchown -R user:user ~/.ssh\nssh user@192.168.1.10     # अब passphrase के अलावा पासवर्ड नहीं\n\n# --- ssh-agent (passphrase एक बार मुक्त) ---\neval \"$(ssh-agent -s)\"\nssh-add ~/.ssh/id_ed25519 ; ssh-add -l\n\n# --- Windows क्लाइंट ---\n# PuTTYgen: .ppk बनाएँ -> Public key 'Allow public-key auth in OpenSSH' कॉपी\n#   करके authorized_keys में डालें। Pageant चलाकर .ppk लोड करें (sessioneeopen)\n# Win10+ OpenSSH: type key.pub | ssh user@srv \"cat >> ~/.ssh/authorized_keys\""},
    {type:"html", html:"<h4 class=\"blk2\">पोर्ट फ़ॉरवर्डिंग, X-फ़ॉरवर्डिंग व फ़ाइल-स्थानांतरण</h4><p>SSH एक एन्क्रिप्टed टनेल में दूसरे पोर्ट भी ले जा सकता है — <b>-L</b> लोकल (आप->सर्वर), <b>-R</b> रिमोट (सर्वर->आप), <b>-D</b> SOCKS proxy।</p>"},
    {type:"code", lang:"bash", code:"# -L लोकल: सर्वर पर बंद service को अपने PC पर लाएँ\nssh -L 8080:localhost:80 user@srv     # अब browser में http://localhost:8080\nssh -L 5432:db.internal:5432 user@jump   # jump-host से DB पोर्ट\n\n# -R रिमोट: अपने लोकल service को सर्वर के पोर्ट पर दिखाएँ\nssh -R 9000:localhost:3000 user@srv  # srv पर localhost:9000 -> आपके 3000\n\n# -D डायनामिक SOCKS (सारा ट्रैफ़िक srv से बाहर)\nssh -D 1080 -C -N user@srv           # browser proxy: 127.0.0.1:1080\n\n# -X / -Y: रिमोट GUI ऐप स्थानीय screen पर\nssh -X user@srv ; xcalc\nssh -Y user@srv                      # trusted forwarding\n\n# फ़ाइलें\nscp -P 22 file.txt user@srv:/srv/backups/\nsftp -P 22 user@srv\nrsync -avz -e \"ssh -p 22\" /data/ user@srv:/backup/data/"},
    {type:"html", html:"<h4 class=\"blk2\">सख्त (harden) sshd + fail2ban</h4><p>पासवर्ड लॉगिन बंद करने से पहले <b>कम से कम एक</b> key लॉगिन ज़रूर परख लें — वरना lockout। fail2ban फेल लॉगिन गिनकर IP को बॉन करता है (systemd backend)।</p>"},
    {type:"code", lang:"bash", code:"sudo cp -a /etc/ssh/sshd_config /etc/ssh/sshd_config.bak\n# /etc/ssh/sshd_config (या sshd_config.d/99-hardening.conf) में:\n#   PermitRootLogin no\n#   PasswordAuthentication no\n#   PubkeyAuthentication yes\n#   MaxAuthTries 3\n#   ClientAliveInterval 300\n#   AllowUsers admin backup\n#   Port 2222      # बदलें तो SELinux + firewall भी:\n#     RHEL: sudo semanage port -a -t ssh_port_t -p tcp 2222\n#     firewall-cmd --permanent --add-port=2222/tcp\n\nsudo sshd -t                        # syntax जाँच (खाली = OK)\nsudo systemctl reload ssh           # Ubuntu ; RHEL: systemctl restart sshd\n# ध्यान: नया SSH खिड़की खोलकर key लॉगिन परखें, तभी पुरानी बंद करें\n\n# fail2ban\nsudo apt install fail2ban\nsudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local\n# /etc/fail2ban/jail.d/sshd.local\n[sshd]\nenabled  = true\nport     = 22\nbackend  = systemd\nmaxretry = 5\nfindtime = 10m\nbantime  = 1h\nsudo systemctl enable --now fail2ban\nsudo fail2ban-client status sshd"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.5</span> फ़ायरवॉल — ufw, firewalld और iptables/nftables</h3><p>तीनों एक ही काम के अलग-अलग स्तर हैं: <b>ufw</b> (Ubuntu) सरल CLI है जो पीछे nft/iptables चलाता है; <b>firewalld</b> (RHEL) <b>zone</b> मॉडल पर काम करता है; <b>iptables/nftables</b> असली कोरुल हैं। पहचानें: <code>which ufw firewall-cmd nft iptables</code> और <code>systemctl is-active firewalld ufw nftables</code>।</p>"},
    {type:"table", head:["कमांड","क्या करता है"],
      rows:[
        ["sudo ufw default deny incoming","सभी इनकमिंग ब्लॉक (आउटगोइंग allow)"],
        ["sudo ufw allow 22/tcp","SSH खुला रखें"],
        ["sudo ufw allow from 192.168.1.0/24 to any port 3306 proto tcp","सिर्फ़ subnet से MySQL"],
        ["sudo ufw allow 80,443/tcp","Web + HTTPS"],
        ["sudo ufw allow 10000:20000/tcp","पोर्ट रेंज खोलें"],
        ["sudo ufw status numbered","नंबर सहित नियम (delete के लिए)"],
        ["sudo ufw delete 3","नंबर से नियम हटाएँ"],
        ["sudo ufw logging low|medium|on","लॉगिंग स्तर (kern.log में)"],
        ["sudo ufw enable / disable","फ़ायरवॉल चालू/बंद"]
      ]},
    {type:"table", head:["firewalld zone","भरोसा स्तर","डिफ़ॉल्ट व्यवहार"],
      rows:[
        ["block","सबसे सख्त","सभी इनकमिंग reject, सिर्फ़ outgoing"],
        ["drop","कड़ा","बिना-जवाब ड्रॉप (निरुत्तर → timeout)"],
        ["public","अविश्वसनीय नेट (डिफ़ॉल्ट)","SSH आदि चुनिंदा सेवाएँ"],
        ["dmz","पब्लिक सर्वर","कड़ी छानबीन, सीमित सेवाएँ"],
        ["work","ऑफ़िस LAN","प्रिंटर/फ़ाइल शेयर छूट"],
        ["internal","भीतरी भरोसा नेट","ज़्यादा सेवाएँ allow"],
        ["home","घरेलू LAN","भरोसा, मशीन खोज चालू"],
        ["trusted","पूर्ण","कोई फ़िल्टर नहीं (केवल विश्वसनीय नेट)"]
      ]},
    {type:"code", lang:"bash", code:"# ===== firewalld (RHEL/Fedora) =====\nsudo firewall-cmd --get-default-zone ; --get-active-zones\nsudo firewall-cmd --zone=public --add-service=http --permanent\nsudo firewall-cmd --zone=public --add-port=8080/tcp --permanent\nsudo firewall-cmd --reload              # --permanent के बाद अनिवार्य\nsudo firewall-cmd --zone=public --list-all\nsudo firewall-cmd --state\n\n# ===== raw iptables (chain: filter/nat/mangle) =====\nsudo iptables -P INPUT DROP ; sudo iptables -P FORWARD DROP   # खतरा: पहले allow रखें\nsudo iptables -A INPUT -i lo -j ACCEPT\nsudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT\nsudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT\nsudo iptables -A INPUT -j DROP\n\n# NAT / internet साझा (राउटर बॉक्स)\necho 1 | sudo tee /proc/sys/net/ipv4/ip_forward\nsudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\nsudo iptables -A FORWARD -i eth1 -o eth0 -m state --state NEW -j ACCEPT\n# port forwarding (DNAT): eth0:8080 -> 192.168.1.20:80\nsudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 \\\n  -j DNAT --to-destination 192.168.1.20:80\n\n# नियम सहेजें (रिबूट पर टिकें)\nsudo apt install iptables-persistent ; sudo netfilter-persistent save\n# RHEL (iptables-services): sudo service iptables save\n# Debian raw: sudo sh -c 'iptables-save > /etc/iptables/rules.v4'\n\n# ===== nftables (आधुनिक; Debian 11+/RHEL 8+ डिफ़ॉल्ट) =====\nsudo nft list ruleset\nsudo nft add table inet myfw\nsudo nft 'add chain inet myfw input { type filter hook input priority 0; policy drop; }'\nsudo nft add rule inet myfw input iif lo accept\nsudo nft add rule inet myfw input ct state established,related accept\nsudo nft add rule inet myfw input tcp dport { 22, 80, 443 } accept\n# सहेजें: sudo nft list ruleset > /etc/nftables.conf  और enable nftables.service"},
    {type:"callout", kind:"danger", title:"खुद को बाहर न निकालें (lockout)", html:"<p>INPUT policy <code>DROP</code> करने से पहले SSH (22) नियम ज़रूर रखें, वरना अगला कनेक्शन कट जाएगा और सुधार कठिन। बचाव तैयार रखें:</p><ul><li>फ़िज़िकल/VM कंसोल (KVM/VM console) से लॉगिन — SSH से आज़ाद।</li><li>netplan बदलते समय <code>netplan try</code> (120s rollback)।</li><li>emergency सुधार: <code>sudo ufw disable</code>, <code>sudo iptables -P INPUT ACCEPT</code>, <code>sudo nft flush ruleset</code>, या <code>firewall-cmd --panic-off</code>।</li></ul>"},
    {type:"steps", items:[
      {n:1, title:"सिस्टम अपडेट + ऑटो-सिक्योरिटी-अपडेट", text:"<code>sudo apt update && sudo apt upgrade -y</code> (या <code>dnf -y update</code>), फिर <code>sudo apt install unattended-upgrades && sudo dpkg-reconfigure -plow unattended-upgrades</code>। kernel अपडेट के बाद reboot करें (libpam/vmware जैसी सेवाएँ रीस्टार्ट: <code>sudo needrestart</code>)।", tips:"cron में रोज़ <code>apt-get update</code> रखें।"},
      {n:2, title:"SSH सिर्फ़ key पर, root व पासवर्ड बंद", text:"ऊपर 1.4 अनुसार key डालें, फिर <code>PermitRootLogin no</code> + <code>PasswordAuthentication no</code> सेट कर <code>sshd -t</code> → reload। पहले दूसरी खिड़की में key लॉगिन परखें।", warn:"बिना key परखे पासवर्ड बंद करना lockout देता है।"},
      {n:3, title:"fail2ban sshd jail", text:"<code>fail2ban</code> + sshd jail चालू करें (<code>fail2ban-client status sshd</code>) ताकि brute-force IP बॉन हों।", tips:"bantime/maxretry अपने लैब के अनुसार रखें।"},
      {n:4, title:"ufw default deny + सिर्फ़ ज़रूरी पोर्ट", text:"<code>sudo ufw default deny incoming</code>, फिर <code>ufw allow 22,80,443</code> (और subnet-सीमित 3306), <code>ufw enable</code>। बाक़ी सब बंद।", tips:"<code>ufw status numbered</code> से नियम देखें।"},
      {n:5, title:"अनचाही सेवाएँ बंद/हटाएँ", text:"<code>ss -lntp</code> से देखें किस पोर्ट पर कौन-सा प्रोसेस है; बिना-काम सेवाएँ <code>systemctl disable --now avahi-daemon cups</code> आदि बंद करें। हर खुला पोर्ट = आक्रमण-सतह।"},
      {n:6, title:"मज़बूत पासवर्ड + PAM पॉलिसी", text:"<code>libpam-pwquality</code> इंस्टॉल करें; <code>/etc/security/pwquality.conf</code> में <code>minlen=10 ucredit=-1 lcredit=-1 dcredit=-1 ocredit=-1</code>। root पासवर्ड लॉक करें <code>sudo passwd -l root</code> (key login पर)।"},
      {n:7, title:"पासवर्ड एजिंग (/etc/login.defs)", text:"<code>PASS_MAX_DAYS 90</code>, <code>PASS_MIN_DAYS 1</code>, <code>PASS_WARN_AGE 7</code> जोड़ें ताकि पासवर्ड समय पर बदलें।", tips:"व्यक्तिगत यूज़र के लिए <code>chage -M 90 user</code>।"},
      {n:8, title:"auditd से फ़ाइल-पर्यवेक्षण", text:"<code>sudo apt install auditd</code>; <code>sudo auditctl -w /etc/passwd -p wa -k users</code>, <code>sudo auditctl -w /etc/shadow -p wa -k shadow</code>; जाँच <code>sudo ausearch -k users</code>।", tips:"रूल <code>/etc/audit/rules.d/</code> मेंpermanent रखें।"},
      {n:9, title:"logwatch / apt-listchanges", text:"<code>sudo apt install logwatch apt-listchanges</code> — रोज़ सारांश ईमेल + अपग्रेड चैन्ज-नोट, ताकि असामान्यता दिखे।"},
      {n:10, title:"USB स्टोरेज प्रतिबंध", text:"<code>/etc/modprobe.d/blacklist-usbstorage.conf</code> में <code>blacklist usb-storage</code> + <code>options usb-storage modprobe=0</code>, फिर <code>sudo update-initramfs -u</code> (RHEL: <code>dracut -f</code>)। मालवेयर-फ़्लैश रोकता है।"},
      {n:11, title:"रूटकिट स्कैन + cron जाँच", text:"<code>sudo apt install rkhunter chkrootkit</code>; <code>sudo rkhunter --update && sudo rkhunter --check</code>; <code>sudo chkrootkit</code>। root crontab में अनजान जॉब न रखें (<code>sudo crontab -l</code>)।"},
      {n:12, title:"बैकअप व restore टेस्ट", text:"कम-से-कम दैनिक मेटाडेटा + साप्ताहिक फुल बैकअप; महीने में एक बार <b>restore</b> करके परखें। restore बिना टेस्ट का बैकअप बैकअप नहीं।", tips:"Timeshift (system) + rsnapshot/borg (data) अच्छा संयोजन।"}
    ]},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.6</span> यूज़र, AD/LDAP, पासवर्ड पॉलिसी व डिस्क कोटा</h3><p>सर्वर पर एक-एक <code>useradd</code> से बड़े नेटवर्क में <b>केंद्रीय पहचान (central identity)</b> ज़रूरी होती है — Windows AD में <code>realmd + sssd</code>, Linux LDAP में <code>sssd</code>/<code>pam_ldap</code>। पासवर्ड <code>/etc/shadow</code> में रहता है, इसलिए उसकी मज़बूत परमिशन अनिवार्य।</p>"},
    {type:"code", lang:"bash", code:"# --- पासवर्ड फ़ाइलों की परमिशन ---\nls -l /etc/passwd /etc/shadow     # passwd 644, shadow 640 root:shadow\nsudo chmod 644 /etc/passwd ; sudo chmod 640 /etc/shadow\nsudo chown root:shadow /etc/shadow   # Debian\n\n# --- su vs sudo ---\nsu -                 # root बनें (root का पासवर्ड चाहिए)\nsu - user            # कोई user बनें\nsudo -i              # root शेल, अपना पासवर्ड\ncat /etc/sudoers     # visudo से ही संपादित करें\nsudo groupadd wheel ; sudo usermod -aG sudo user    # Ubuntu का admin समूह 'sudo'\nsudo usermod -aG wheel user                          # RHEL का 'wheel'\nsudo visudo           # 'sudo visudo -c' से जाँच\n\n# --- Windows AD में join (realmd + sssd) ---\nsudo apt install realmd sssd sssd-tools adjoin libnss-sss libpam-sss\nsudo realm discover ad.example.com\nsudo realm join -U Administrator ad.example.com\nsudo realm list\ngrep use_fully_qualified_names /etc/sssd/sssd.conf   # true -> user@domain\nid user@ad.example.com ; getent passwd | tail\n\n# --- ext4 पर disk quota ---\n# /etc/fstab:  UUID=...  /home  ext4  defaults,usrquota,grpquota  0 2\nsudo mount -o remount /home\nsudo quotacheck -cug /home ; sudo quotaon -a\nsudo edquota -u user            # ब्लॉक/इनोड soft/hard limit\necho \"user soft 512000 hard 716800\" | sudo edquota -u user -f -\nsudo repquota -as /home         # सभी यूज़र की रिपोर्ट"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.7</span> डिस्क और LVM — पार्टीशन, फ़ाइलसिस्टम, RAID, एन्क्रिप्शन</h3><p>LVM (<b>Logical Volume Manager</b>) तीन परत है: भौतिक डिस्क/भाग = <b>PV</b>, PV का समूह = <b>VG</b>, VG से बना लचीला भाग = <b>LV</b>। LV को बिना-रीस्टार्ट बढ़ा सकते हैं, स्नैपशॉट ले सकते हैं। नीचे PV/VG/LV शब्दावली और कमांड।</p>"},
    {type:"table", head:["परत / पद","अर्थ","मुख्य कमांड"],
      rows:[
        ["PV (Physical Volume)","डिस्क या पार्टीशन जो pool में जुड़ती है","pvcreate / pvs / pvdisplay"],
        ["VG (Volume Group)","एक या अधिक PV का pool (free extents बचाता)","vgcreate / vgextend / vgs"],
        ["LV (Logical Volume)","VG से बना फॉर्मेट-योग्य वॉल्यूम","lvcreate / lvextend / lvs"],
        ["PE (Physical Extent)","VG की छोटी इकाई (डिफ़ॉल्ट 4 MiB)","lvcreate -l 100 = 100 extents"],
        ["Snapshot","LV की पल-छवि (copy-on-write)","lvcreate -s -L 2G ..."],
        ["Thin provisioning","बिना पहले से जगह घटे LV (over-commit)","--thinpool ..."]
      ]},
    {type:"code", lang:"bash", code:"===== (क) पार्टीशन + फ़ाइलसिस्टम + माउंट =====\nsudo fdisk /dev/sdb           # n=नया t=type w=लिखें ; GPT के लिए 'g'\nsudo parted /dev/sdb -- mklabel gpt\nsudo parted /dev/sdb -- mkpart data 0% 100%\nsudo partprobe /dev/sdb\nsudo mkfs.ext4 /dev/sdb1       # RHEL डिफ़ॉल्ट: mkfs.xfs\nsudo mkdir /data\nsudo blkid /dev/sdb1           # UUID निकालें\n# /etc/fstab (UUID से लिखें, नाम-बदलाव पर भी टिके):\n# UUID=1a2b3c4d  /data  ext4  defaults,noatime  0 2\nsudo systemctl daemon-reload ; sudo mount -a ; findmnt /data\n\n# swap फ़ाइल (पार्टीशन से आसान, आधुनिक डिफ़ॉल्ट)\nsudo fallocate -l 4G /swapfile ; sudo chmod 600 /swapfile\nsudo mkswap /swapfile ; sudo swapon /swapfile\n# fstab में जोड़ें: /swapfile  none  swap  sw  0  0\nsudo swapon --show ; free -h\n\n===== (ख) LVM विस्तार =====\nsudo pvcreate /dev/sdb1 ; sudo vgcreate vgdata /dev/sdb1\nsudo lvcreate -n lvweb -l 50 vgdata\nsudo mkfs.ext4 /dev/vgdata/lvweb ; sudo mkdir /web\nsudo mount /dev/vgdata/lvweb /web\n# एक नई PV जोड़कर VG बढ़ाएँ\nsudo pvcreate /dev/sdc1 ; sudo vgextend vgdata /dev/sdc1\n# LV बढ़ाएँ — ext4:\nsudo lvextend -l +100%FREE --resizefs /dev/vgdata/lvweb\n# मैन्युअल ext4: lvextend -L+5G /dev/vgdata/lvweb && resize2fs /dev/vgdata/lvweb\n# xfs (RHEL) बढ़ाएँ: lvextend -L+5G ... && xfs_growfs /data   # growfs सिर्फ़ बढ़ाता, घटाता नहीं\n\n# स्नैपशॉट + रोलबैक\nsudo lvcreate -s -n snap1 -L 2G /dev/vgdata/lvweb   # COW snapshot\n# डेटा बिगड़ने पर: sudo umount /web ; sudo lvconvert --merge /dev/vgdata/snap1\n# घटाना खतरनाक: ext4 पहले FS घटाएँ (umount+e2fsck+resize2fs), फिर lvreduce; xfs घटता नहीं\nsudo lvs ; sudo pvs ; sudo vgs ; sudo lvdisplay /dev/vgdata/lvweb"},
    {type:"code", lang:"bash", code:"===== (ग) सॉफ़्टवेयर RAID (mdadm) =====\nsudo apt install mdadm\n# RAID1 (mirror) दो डिस्क\nsudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdc1 /dev/sdd1\nsudo mkfs.ext4 /dev/md0\nsudo mdadm --detail /dev/md0 ; cat /proc/mdstat\nsudo mdadm --examine --scan | sudo tee -a /etc/mdadm/mdadm.conf   # Debian\nsudo update-initramfs -u ; sudo mount -a\n# RAID0 --level=0 ; RAID5 --level=5 --raid-devices=3 ; RAID6 --level=6 --raid-devices=4\n# डिस्क जोड़ें/निकालें: mdadm /dev/md0 --add /dev/sde1 ; mdadm /dev/md0 --fail /dev/sdc1 --remove /dev/sdc1\n\n===== (घ) पूरी डिस्क एन्क्रिप्शन (LUKS / dm-crypt) =====\nsudo cryptsetup luksFormat /dev/sdb1      # चुनौती पूछे, डेटा मिटेगा\nsudo cryptsetup open /dev/sdb1 secret     # -> /dev/mapper/secret\nsudo mkfs.ext4 /dev/mapper/secret ; sudo mount /dev/mapper/secret /mnt/enc\nsudo cryptsetup luksClose secret\nsudo cryptsetup luksDump /dev/sdb1        # header जाँच\n\n===== (ङ) स्वास्थ्य, SMART व खराब ब्लॉक =====\nsudo apt install smartmontools\nsudo smartctl -a /dev/sda                 # पूरी रिपोर्ट\nsudo smartctl -H /dev/sda                 # SMART overall: PASSED/FAILED\nsudo smartctl -t short /dev/sda           # ~2 min self-test\nsudo smartctl -l selftest /dev/sda\nsudo smartctl -t long /dev/sda            # गहरा (घंटे)\nsudo hdparm -Tt /dev/sda                   # cached/timed read speed\nsudo badblocks -sv /dev/sda1               # unmounted; खराब ब्लॉक गिनती\n# fsck सिर्फ़ unmounted/offline (root पर live-USB/recovery से)!\nsudo fsck -y /dev/sdb1\n# डिस्क फेल प्रक्रिया: LVM/मैपिंग चेक -> डेटा बैकअप -> SMART/realloc -> प्रतिस्थापन -> RAID rebuild"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.8</span> सेवाएँ (systemd) — unit फ़ाइल, journalctl व टाइमर</h3><p>systemd सब कुछ <b>unit</b> से चलाता है (<code>.service</code>, <code>.timer</code>, <code>.mount</code> आदि)। अपने-आप बदली सेवाएँ <code>/lib/systemd/system/</code> में होती हैं (अपडेट पर बदल जाती हैं); अपना बदलाव हमेशा <code>systemctl edit</code> या <code>/etc/systemd/system/</code> में रखें।</p>"},
    {type:"table", head:["सेक्शन / निर्देश","क्या करता है","नमूना मान"],
      rows:[
        ["[Unit] Description/After","वर्णन + क्रम (किसके बाद चले)","After=network-online.target"],
        ["[Service] Type","प्रक्रिया का प्रकार","simple | forking | oneshot | notify"],
        ["ExecStart / ExecStop","चालू/बंद करने की कमांड","/usr/local/bin/watchdog.sh"],
        ["Restart / RestartSec","क्रैश पर फिर चलाएँ","on-failure , 5"],
        ["User / Group","किस यूज़र के तहत चले","www-data"],
        ["WorkingDirectory / EnvironmentFile","काम-स्थान व चर-फ़ाइल","/srv/app , /etc/default/app"],
        ["[Install] WantedBy","enable किस target से लिंक बनाए","multi-user.target"]
      ]},
    {type:"code", lang:"bash", code:"# --- .service unit (एक स्क्रिप्ट के लिए) ---\n# /etc/systemd/system/watchdog.service\n[Unit]\nDescription=SSHD वॉचडॉग\nAfter=network-online.target\n[Service]\nType=simple\nExecStart=/usr/local/bin/service-watchdog.sh\nRestart=on-failure\nRestartSec=10\nUser=root\n[Install]\nWantedBy=multi-user.target\n\nsudo systemctl daemon-reload\nsudo systemctl enable --now watchdog.service\nsystemctl status watchdog.service -l\njournalctl -u watchdog.service --since today\n\n# --- ओवरराइड (पैकेज फ़ाइल बिना छुए) ---\nsudo systemctl edit apache2.service\n#   [Service]\n#   LimitNOFILE=65536\n#   Environment=\"APACHE_START_TIMEOUT=60\"\nsudo systemctl daemon-reload && sudo systemctl restart apache2\n\n# --- cron बनाम systemd timer ---\n# backup.timer (रोज़ 02:00, छूटा एक बार चलाए)\n# [Unit] Description=रोज़ रात 2 बजे बैकअप\n# [Timer] OnCalendar=*-*-* 02:00:00 ; Persistent=true\n# [Install] WantedBy=timers.target\nsudo systemctl enable --now backup.timer\nsystemctl list-timers --all"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.9</span> LAMP स्टैक — Apache/Nginx + PHP + MariaDB/MySQL</h3><p>LAMP = <b>L</b>inux + <b>A</b>pache + <b>M</b>ariaDB/MySQL + <b>P</b>HP। Ubuntu <code>www-data</code> यूज़र/समूह और <code>a2ensite</code> टूल रखता है; RHEL <code>apache</code> यूज़र, <code>httpd</code> सेवा और <b>SELinux</b> रखता है — यहीं सबसे ज़्यादा 403/502 होते हैं।</p>"},
    {type:"code", lang:"bash", code:"===== (क) स्थापना — Ubuntu 22.04/24.04 =====\nsudo apt update\nsudo apt install apache2 php php-mysql mariadb-server -y\n# Nginx चाहें तो: sudo apt install nginx php-fpm php-mysql\nsudo systemctl enable --now apache2 mariadb\nsudo ufw allow 'Apache Full'    # 80 + 443 (app profile)\nphp -v ; a2query -s\nsudo a2dissite 000-default.conf && sudo systemctl reload apache2\n\n===== (ख) स्थापना — RHEL / AlmaLinux 9 =====\nsudo dnf install httpd php php-fpm php-mysqlnd mariadb-server -y\nsudo systemctl enable --now httpd php-fpm mariadb\nsudo firewall-cmd --permanent --add-service=http --add-service=https\nsudo firewall-cmd --reload\n# (Nginx विकल्प: sudo dnf install nginx)\n\n# --- वेब-रूट का स्वामित्व ---\nsudo chown -R www-data:www-data /var/www/html   # Ubuntu\nsudo chown -R apache:apache /var/www/html        # RHEL\nsudo find /var/www/html -type d -exec chmod 755 {} \\;\nsudo find /var/www/html -type f -exec chmod 644 {} \\;"},
    {type:"code", lang:"bash", code:"===== (ग) Apache Virtual Host =====\n# /etc/apache2/sites-available/lab.conf\n<VirtualHost *:80>\n    ServerName lab.example.com\n    ServerAdmin webmaster@example.com\n    DocumentRoot /var/www/lab\n    ErrorLog ${APACHE_LOG_DIR}/lab_error.log\n    CustomLog ${APACHE_LOG_DIR}/lab_access.log combined\n    <Directory /var/www/lab>\n        AllowOverride All          # .htaccess को अनुमति\n        Require all granted\n    </Directory>\n</VirtualHost>\nsudo mkdir -p /var/www/lab && echo 'OK' | sudo tee /var/www/lab/index.html\nsudo a2ensite lab.conf && sudo apache2ctl configtest && sudo systemctl reload apache2\n# mod_rewrite + friendly URL:\nsudo a2enmod rewrite\n# /var/www/lab/.htaccess\n#   RewriteEngine On\n#   RewriteCond %{REQUEST_FILENAME} !-f\n#   RewriteCond %{REQUEST_FILENAME} !-d\n#   RewriteRule ^ index.php [QSA,L]\n\n===== (घ) Nginx Server Block =====\n# /etc/nginx/sites-available/lab.conf\nserver {\n    listen 80;\n    listen [::]:80;\n    server_name lab.example.com;\n    root /var/www/lab;\n    index index.php index.html;\n    location / { try_files $uri $uri/ =404; }\n    location ~ \\.php$ {\n        include snippets/fastcgi-php.conf;\n        fastcgi_pass unix:/run/php/php8.2-fpm.sock;   # PHP वर्ज़न से मिलान\n    }\n}\nsudo ln -s /etc/nginx/sites-available/lab.conf /etc/nginx/sites-enabled/\nsudo rm -f /etc/nginx/sites-enabled/default\nsudo nginx -t && sudo systemctl reload nginx\n\n===== (ङ) SELinux (RHEL) — 403/503/502 का सबसे आम कारण =====\nsudo getenforce                          # Enforcing/permissive/disabled\nsudo chcon -R -t httpd_sys_content_t /var/www/lab   # फ़ाइल कॉन्टेक्स्ट\nsudo restorecon -RFv /var/www/lab                     # डिफ़ॉल्ट पर लौटाएँ\nsudo setsebool -P httpd_can_network_connect 1         # PHP->DB/back-end (502 हल)\nsudo setsebool -P httpd_enable_homedirs 1\nsudo semanage port -a -t http_port_t -p tcp 8080      # नॉन-स्टैंडर्ड पोर्ट\n# ब्लॉक का कारण: sudo ausearch -c httpd --raw | sudo audit2allow -P myhttpd"},
    {type:"table", head:["php.ini सेटिंग","डिफ़ॉल्ट","कब/क्यों बदलें"],
      rows:[
        ["memory_limit","128M","भारी CMS/report के लिए 256M; वर्कर × यह RAM खाता है"],
        ["upload_max_filesize","2M","फ़ाइल-अपलोड बढ़ाने पर 64M"],
        ["post_max_size","8M","upload से बड़ा रखें (पूरा POST बॉडी)"],
        ["max_execution_time","30","लंबे import/आउटपुट के लिए 120"],
        ["date.timezone","( unset / UTC )","Asia/Kolkata सेट करें"],
        ["display_errors","Off (prod)","dev पर On; prod हमेशा Off + log_errors On"],
        ["max_input_vars","1000","बड़े फ़ॉर्म/वुडमार्ट में 5000"],
        ["expose_php","On","Off (वर्ज़न छिपाएँ)"]
      ]},
    {type:"code", lang:"bash", code:"===== (च) HTTPS — Let's Encrypt (certbot) =====\nsudo apt install certbot python3-certbot-nginx -y    # Nginx\nsudo certbot --nginx -d lab.example.com -d www.lab.example.com\nsudo apt install certbot python3-certbot-apache -y   # Apache\nsudo certbot --apache -d lab.example.com --redirect\nsudo certbot renew --dry-run     # renewal परीक्षण\nsystemctl list-timers | grep -i certbot   # रोज़ अपने-आप नवीनीकरण\nsudo ufw allow 80/tcp && sudo ufw allow 443/tcp   # certbot से पहले खुले हों\n# डोमेन का A रिकॉर्ड सर्वर के पब्लिक IP पर होना चाहिए\n\n===== (छ) php-fpm pool (RHEL/आधुनिक) =====\n# /etc/php-fpm.d/www.conf\n#   pm = dynamic ; pm.max_children = 25 ; pm.start_servers = 5\n#   listen = /run/php-fpm/www.sock\nsudo systemctl restart php-fpm"},
    {type:"code", lang:"bash", code:"===== (ज) MariaDB/MySQL सुरक्षित स्थापना + DB/यूज़र =====\nsudo mysql_secure_installation   # root पासवर्ड, anonymous ख़त्म, test DB हटाएँ\nsudo mariadb -u root -p          # (या mysql)\nCREATE DATABASE labdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nCREATE USER 'labuser'@'localhost' IDENTIFIED BY 'Strong#Pass1';\nGRANT ALL PRIVILEGES ON labdb.* TO 'labuser'@'localhost';\nFLUSH PRIVILEGES;\nSHOW GRANTS FOR 'labuser'@'localhost';\n\n# auth: Debian अक्सर Unix socket से root देता है (sudo mysql बिना पासवर्ड)\n#   पासवर्ड/remote चाहिए तो plugin बदलें:\nALTER USER 'labuser'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('Strong#Pass1');\n\n# --- बैकअप व रिस्टोर ---\nsudo mysqldump -u root -p --single-transaction --routines --triggers \\\n  --all-databases > /srv/backups/all.sql\nmysqldump -u labuser -p labdb labdb > /srv/backups/labdb.sql\nmysql -u labuser -p labdb < /srv/backups/labdb.sql    # रिस्टोर\n\n# --- remote bind (default सुरक्षित रखें) ---\n# /etc/mysql/mariadb.conf.d/50-server.cnf : bind-address = 127.0.0.1 (सिर्फ़ लोकल)\n# बाहरी नेट के लिए: bind-address = 0.0.0.0 + फ़ायरवॉल subnet + SSL:\nrequire_secure_transport = ON\nsudo ufw allow from 192.168.1.0/24 to any port 3306 proto tcp"},
    {type:"callout", kind:"tip", title:"phpMyAdmin/Adminer भी सुरक्षित रखें", html:"<p>डेटाबेस UI इंटरनेट पर खुला रखना = DB पासवर्ड brute-force का आम निशाना। <b>phpMyAdmin</b> subnet/IP पर सीमित करें या HTTP-auth लगाएँ, config में blowfish secret सेट करें, और उपयोग के बाद <b>Adminer</b> एकल-फ़ाइल हटा दें। SSH टनेल (<code>ssh -L 8888:localhost:80 srv</code>) से पहुँचना सबसे सुरक्षित है।</p>"},
    {type:"code", lang:"bash", code:"===== (ट) WordPress पूरा deploy (wp-cli) =====\nsudo apt install php-curl php-mbstring php-xml php-zip php-gd -y\ncurl -sSLo wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar\nsudo install -m 0755 wp-cli.phar /usr/local/bin/wp\n# DB ऊपर (ज) से बना चुके हैं\nsudo -u www-data wp core download --path=/var/www/lab\nsudo -u www-data wp config create --dbname=labdb --dbuser=labuser \\\n  --dbpass='Strong#Pass1' --path=/var/www/lab\nsudo -u www-data wp core install --url=https://lab.example.com --title=Lab \\\n  --admin_user=admin --admin_password='Adm!n#1' --admin_email=a@lab.example.com \\\n  --skip-email --path=/var/www/lab\nsudo -u www-data wp rewrite structure '/%postname%/' --path=/var/www/lab   # permalinks\n# फ़ाइल परमिशन\nsudo chown -R www-data:www-data /var/www/lab\nsudo find /var/www/lab -type d -exec chmod 755 {} \\;\nsudo find /var/www/lab -type f -exec chmod 644 {} \\;\nsudo chmod 440 /var/www/lab/wp-config.php\n# अपडेट + बैकअप\nsudo -u www-data wp core update ; sudo -u www-data wp plugin update --all\n# .htaccess में permalinks के लिए AllowOverride All ज़रूरी (Apache)"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.10</span> फ़ाइल सेवाएँ — FTP/SFTP/NFS/Samba</h3><p>आधुनिक सिद्धांत: <b>SFTP</b> (SSH पर, 22/tcp) फ़ाइल भेजने का सुरक्षित ढंग है, पुराना FTP (21/tcp, सादा-पाठ/plaintext) कमज़ोर है — <b>vsftpd</b> में TLS + chroot ज़रूर लगाएँ। नेटवर्क-फ़ोल्डर के लिए Linux↔Linux = <b>NFS</b> (2049), Linux↔Windows = <b>Samba</b> (139/445)।</p>"},
    {type:"code", lang:"bash", code:"===== (क) vsftpd (FTP, TLS + chroot) =====\nsudo apt install vsftpd ; sudo systemctl enable --now vsftpd\n# /etc/vsftpd.conf\n#   anonymous_enable=NO\n#   local_enable=YES\n#   write_enable=YES\n#   chroot_local_user=YES\n#   allow_writeable_chroot=YES\n#   ssl_enable=YES\nsudo systemctl restart vsftpd\nsudo ufw allow 21/tcp ; sudo ufw allow 40000:50000/tcp   # passive ports\n\n===== (ख) SFTP-only यूज़र समूह (SSH पर, पोर्ट 22) =====\nsudo groupadd sftpusers\n# /etc/ssh/sshd_config\n#   Subsystem sftp internal-sftp\n#   Match Group sftpusers\n#       ChrootDirectory /srv/sftp/%u\n#       ForceCommand internal-sftp\n#       AllowTcpForwarding no\nsudo usermod -aG sftpusers alice\nsudo mkdir -p /srv/sftp/alice && sudo chown root:root /srv/sftp/alice && sudo chmod 755 /srv/sftp/alice\nsudo mkdir /srv/sftp/alice/upload && sudo chown alice:sftpusers /srv/sftp/alice/upload\nsudo sshd -t && sudo systemctl reload ssh\n\n===== (ग) NFS शेयर (Linux↔Linux) =====\nsudo apt install nfs-kernel-server     # RHEL: dnf install nfs-utils\n# /etc/exports\n/srv/nfs  192.168.1.0/24(rw,sync,no_subtree_check,no_root_squash)\nsudo mkdir -p /srv/nfs && sudo chown nobody:nogroup /srv/nfs\nsudo exportfs -ra ; sudo systemctl restart nfs-server\nshowmount -e localhost\n# क्लाइंट माउंट:\nsudo mkdir -p /mnt/nfsshare\nsudo mount -t nfs srv:/srv/nfs /mnt/nfsshare\n# fstab में जोड़ें फिर: sudo mount -a\n# जाँच: sudo umount /mnt/nfsshare && sudo mount -a\n\n===== (घ) Samba शेयर (Windows से \\srv01\\share) =====\nsudo apt install samba ; sudo systemctl enable --now smbd\n# /etc/samba/smb.conf [share]\n#   path=/srv/samba/share\n#   browseable=yes\n#   writable=yes\n#   valid users=@staff\n#   create mask=0664  directory mask=0775\nsudo testparm                 # config जाँच\nsudo smbpasswd -a alice       # Samba का अपना पासवर्ड (Linux पासवर्ड से अलग)\nsudo mkdir -p /srv/samba/share && sudo chgrp staff /srv/samba/share && sudo chmod 2775 /srv/samba/share\n# Windows: Explorer में \\srv01\share (कभी \\srv01\\share सही), या Map Network Drive\n# guest बनाने: map to guest=Bad User + guest ok=yes\n# AD डोमेन member: winbind/join (ऊपर 1.6 realmd भी देखें)"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.11</span> मेल, DNS, DHCP व प्रॉक्सी (संक्षिप्त पर असली)</h3><p>छोटे नेटवर्क में भी <b>समय</b> ज़रूरी है — Kerberos ticket और TLS प्रमाणन घड़ी-अंतर पर फेल होते हैं, इसलिए <code>timedatectl set-ntp true</code>/<code>chronyd</code> रखें। DNS/DHCP/mailing के लिए हल्के विकल्प (<code>dnsmasq</code>, <code>bind9</code>, <code>isc-dhcp-server</code>, <code>postfix</code>) नीचे दिए हैं।</p>"},
    {type:"table", head:["तंत्र","क्या करता है","कहाँ सेट होता है / टूल"],
      rows:[
        ["SPF (TXT)","कौन-से IP आपके डोमेन से मेल भेज सकते हैं","TXT: v=spf1 ip4:... -all ; जाँच: dig TXT"],
        ["DKIM","मेल में साइन-किया गया क्रिप्टो हस्ताक्षर","postfix + opendkim; DNS TXT selector._domainkey"],
        ["DMARC (TXT)","SPF/DKIM फेल पर नीति + रिपोर्ट","TXT: v=DMARC1; p=quarantine; rua=..."],
        ["Postfix/dovecot","MTA (भेजना) / MDA (पढ़ना)","/etc/postfix/main.cf ; dovecot.conf"],
        ["bind9","पूरा DNS सर्वर (zone फ़ाइल)","/etc/bind/named.conf.local, zone file"],
        ["dnsmasq","छोटा LAN DNS + DHCP + TFTP","/etc/dnsmasq.conf"],
        ["ISC dhcpd","बड़ा DHCP (pool/lease)","/etc/dhcp/dhcpd.conf"],
        ["Squid","HTTP प्रॉक्सी/कैश (3128)","/etc/squid/squid.conf"]
      ]},
    {type:"code", lang:"bash", code:"===== (क) मेल — postfix + dovecot =====\nsudo apt install postfix dovecot-imapd -y     # type: Internet Site\n# /etc/aliases में:  root: admin@lab.example.com  ; sudo newaliases\ntimeout 5 sh -c 'cat <<EOF | sendmail -t\nTo: admin@lab.example.com\nSubject: test\nhello\nEOF'\nmailq                 # कतार ; mail -s 'hi' bob@lab.local\nsudo tail -f /var/log/mail.log   # RHEL: /var/log/maillog\n\n===== (ख) bind9 zone फ़ाइल =====\n# /etc/bind/named.conf.local\n# zone \"lab.local\" { type master; file \"/etc/bind/db.lab.local\"; };\n# /etc/bind/db.lab.local\n@   IN  SOA  ns1.lab.local. admin.lab.local. (\n        2025010101 ; serial (yyyymmddNN)\n        3600       ; refresh\n        600        ; retry\n        604800     ; expire\n        600 )      ; minimum\n    IN  NS   ns1.lab.local.\nns1 IN  A    192.168.1.10\n@   IN  MX 10 mail.lab.local.\nsrv01 IN A 192.168.1.10\nsudo named-checkzone lab.local /etc/bind/db.lab.local   # syntax जाँच\nsudo rndc reload ; dig @192.168.1.10 srv01.lab.local\n\n===== (ग) ISC DHCP server =====\n# /etc/dhcp/dhcpd.conf\nsubnet 192.168.1.0 netmask 255.255.255.0 {\n  range 192.168.1.100 192.168.1.200;\n  option routers 192.168.1.1;\n  option domain-name-servers 192.168.1.10, 8.8.8.8;\n  default-lease-time 600 ; max-lease-time 7200;\n  host printer1 { hardware ethernet 00:11:22:33:44:55; fixed-address 192.168.1.50; }\n}\nsudo dhcpd -cf /etc/dhcp/dhcpd.conf            # syntax परीक्षण\nsudo systemctl restart isc-dhcp-server\n# RHEL 9: ISC धीरे-धीरे हट रहा है — systemd-networkd का DHCP-server या dnsmasq\n# dnsmasq (छोटा LAN DNS+DHCP):\n#   interface=ens33 ; dhcp-range=192.168.1.100,192.168.1.200,12h\n\n===== (घ) समय व प्रॉक्सी =====\nsudo apt install chrony -y ; sudo systemctl enable --now chronyd\ntimedatectl status ; timedatectl set-timezone Asia/Kolkata\ntimedatectl set-ntp true\n# Squid प्रॉक्सी (3128)\nsudo apt install squid -y ; # /etc/squid/squid.conf: http_access allow LAN\nsudo ufw allow from 192.168.1.0/24 to any port 3128"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.12</span> मॉनिटरिंग, लॉग व ट्रबलशूटिंग</h3><p>लक्षण पहचान -> एक-एक परत जाँच। लिनक्स का सिद्धांत: <b>हर चीज़ या तो फ़ाइल है या proc/sysfs में</b> — <code>/var/log</code>, <code>/proc/net/dev</code>, journalctl। नीचे उपकरण, लॉग, triage क्रम व SELinux/GRUB/पासवर्ड-रिसेट।</p>"},
    {type:"table", head:["फ़ाइल/स्रोत","क्या दर्ज होता है"],
      rows:[
        ["/var/log/syslog","मुखी रोजनामा (Ubuntu; auth included)"],
        ["/var/log/auth.log","लॉगिन/SSH/sudo (Ubuntu; RHEL: secure)"],
        ["/var/log/kern.log","करनेल संदेश, USB/ड्राइवर"],
        ["/var/log/dmesg","बूट-समय kernel buffer"],
        ["/var/log/mail.log","postfix/dovecot मेल"],
        ["/var/log/apache2/*","access + error (RHEL: /var/log/httpd)"],
        ["/var/log/nginx/*","Nginx access/error"],
        ["/var/log/mysql/ या error.log","DB त्रुटियाँ"],
        ["journalctl","systemd रोजनामा (सभी सेवाएँ एक जगह)"]
      ]},
    {type:"code", lang:"bash", code:"# ===== उपकरण =====\ntop        ; htop      # CPU/mem/process (F9 filter)\nvmstat 1   # r/b sw si so us sy id ; 1-sec\niostat -xz 1   # %util await (disks stats; pkg sysstat)\nsar -u ALL 1   # CPU ; iotop / pidstat -d\nfree -h    ;  slabtop -o -sc\nss -lntp   # listening TCP+PID ; ss -s stats\nss -tnp    # established ; netstat -tulpn (पुराना)\ndf -hT ; df -i ; du -xh --max-depth=1 / | sort -h | tail\n\njournalctl --since '2 hours ago' ; journalctl -u nginx -f\njournalctl -k --since today        # kernel\njournalctl -p err -b               # इस बूट की गलतियाँ\n\n# ===== logrotate =====\n# /etc/logrotate.d/app\n/var/log/app/*.log {\n  daily\n  rotate 7\n  compress\n  delaycompress\n  missingok\n  notifempty\n  copytruncate\n}\nsudo logrotate -d /etc/logrotate.d/app     # dry-run\nsudo logrotate -f /etc/logrotate.conf      # force\n\n# ===== cron housekeeping =====\n# /etc/cron.d/clean -> 15 3 * * * root find /tmp -type f -mtime +7 -delete\n\n# ===== triage क्रम =====\n# --- डिस्क-फुल ---\ndf -h ; df -i (inode खत्म?) ; du -xh --max-depth=1 / ; journalctl --disk-usage\ndu -xh /var/log | sort -h | tail ; : > /var/log/big.log (truncate)\nsudo journalctl --vacuum-size=200M ; apt clean ; docker system prune -af\n# --- high load ---\nuptime (load avg vs nproc: nproc)\nps aux --sort=-%cpu | head ; ps aux --sort=-%mem | head\nvmstat 1 5 (r/b us wa) ; iostat -xz 1 ; pidstat -d 1\nkill -TERM <pid> ; kill -9 <pid> ; renice +10 -p <pid> (नरम)\n# --- memory ---\nfree -h (buffers+cache reclaimable) ; swap use\n# OOM: journalctl -k | grep -i 'out of memory' (oom-killer किसे मारा)\n# --- service fail ---\nsystemctl status nginx -l ; journalctl -u nginx -n 50\nnginx -t ; apache2ctl configtest ; sshd -t ; named-checkconf\n# --- boot/initramfs ---\nupdate-initramfs -u -k all ; dracut -f (RHEL) ; grub-mkconfig -o /boot/grub/grub.cfg\n# --- GRUB rescue (बूट न मिलने पर) ---\n# ls ; set root=(hd0,msdos1) ; set prefix=(hd0,msdos1)/boot/grub\n# insmod normal ; normal ; फिर live-USB: grub-install + update-grub\n# --- root पासवर्ड reset (single-user) ---\n# GRUB पर e -> linux लाइन में: init=/bin/bash या systemd.unit=rescue.target\n# Ctrl-x ; mount -o remount,rw / ; passwd root ; exec /sbin/init\n\n# ===== SELinux =====\nsudo getenforce ; sudo setenforce 0   # permissive (अस्थायी)\nsudo ausearch -m avc -ts recent ; sudo audit2allow -a   # क्या ब्लॉक हुआ\n\n# ===== network triage flow =====\nip -br a -> ping -c2 <gateway> -> ping -c2 1.1.1.1 -> dig lab.local +short\n-> curl -v http://site -> ss -lntp -> ufw status / iptables -S -> upstream/provider"},

    {type:"html", html:"<h3 class=\"blk\"><span class=\"blk-n\">1.13</span> बैकअप रणनीति व प्रदर्शन ट्यूनिंग</h3><p>बैकअप का असली परीक्षण <b>restore</b> है। स्तर (level) का पुराना विचार: <b>level 0</b> = फुल, <b>level 1</b> = चेंज के बाद फुल, <b>level 2/3…</b> = incremental। आधुनिक प्रैक्टिस में <b>rsync</b> (delta) और <b>Borg/restic</b> (dedup+encrypt) इसे आसान करते हैं। नीचे retention और ट्यूनिंग।</p>"},
    {type:"code", lang:"bash", code:"# ===== tar -> दूरस्थ (SSH पर) =====\nsudo tar --aflag -czf - /home | ssh backup@192.168.1.9 'cat > /srv/bk/home-$(date +%F).tgz'\n# ===== rsync (incremental, delta, --delete mirror) =====\nsudo rsync -aAXv --delete /etc/ /home/ /srv/backups/mirror/ -e ssh\n# rsync daemon mode (/etc/rsyncd.conf) बड़े मिरर के लिए\n# ===== rsnapshot जैसा retention (hardlink) =====\nsudo rsnapshot hourly ; sudo rsnapshot daily ; sudo rsnapshot weekly\n# ===== Borg/restic (encrypted + dedup + prune) =====\nsudo apt install borgbackup ; borg init -e keyfile ssh://bk/srv/repo\nborg create --stats ssh://bk/srv/repo::'{now}' /home\nborg prune --keep-daily=7 --keep-weekly=4 --keep-monthly=12 ssh://bk/srv/repo::\nrestic -r sftp:bk@srv:/repo backup /data ; restic forget --keep-daily 7 --keep-monthly 12 --prune\n\n# ===== DR प्लान =====\n# 3-2-1: 3 कॉपी, 2 मीडिया, 1 ऑफ़साइट/क्लाउड ; हर महीने restore drill\n# /var/backups (apt preinst बकाया) ; offline boot USB (Timeshift/Clonezilla)\n# retention: दैनिक 30 दिन, साप्ताहिक 8 हफ़्ता, मासिक 12 महीने\n# apt mirror (offline pkg): sudo apt install apt-ftparchive"},
    {type:"table", head:["ट्यून","कमांड/फ़ाइल","कब/क्यों"],
      rows:[
        ["swappiness","/proc/sys/vm/swappiness (sysctl) , 10","कम swap use; DB/कैश सर्वर"],
        ["vm.dirty_ratio / background","sysctl 10/5","बड़ा लिखते समय बफ़र ब्लॉक न हो"],
        ["noatime माउंट","/etc/fstab: defaults,noatime","कम मेटाडेटा writes"],
        ["SSD scheduler","udev/echo mq-deadline|none","NVMe='none', SATA SSD='mq-deadline'"],
        ["readahead","blockdev --setra 4096 /dev/sda","seq-read DB"],
        ["CPU governor","cpupower frequency-set -g performance","बेंच/लोड सर्वर"],
        ["network offload","ethtool -K ens33 gro on tso on","थ्रूपुट बढ़ाएँ"],
        ["ulimit nofile","systemd LimitNOFILE=65536","बहु-कनेक्शन वेब/प्रॉक्सी"]
      ]},
    {type:"acc", title:"सर्वर प्रशासन — अक्सर पूछे जाने वाले प्रश्न", items:[
      {q:"netplan apply से पहले try क्यों?", a:"<code>netplan try</code> 120 सेकंड का auto-rollback रखता है — बुरा static IP गिरने पर भी SSH वापस आ जाता है।"},
      {q:"ifconfig/route के बजाय ip?", a:"iproute2 (<code>ip</code>) आधुनिक और बेहतर है; <code>ifconfig</code> deprecated, net-tools अलग install करना पड़ता है।"},
      {q:"SSH lockout हो गया, क्या करूँ?", a:"फ़िज़िकल/VM कंसोल से login -> <code>sshd -t</code> -> ग़लत directive सुधारें -> reload; known_hosts बदलने पर <code>ssh-keygen -R host</code>।"},
      {q:"ufw allow 22 vs 'OpenSSH'?", a:"ufw में <code>'OpenSSH'</code> प्रोफ़ाइल 22 खोलती है; <code>allow 22/tcp</code> भी वही। बदलते Port पर 22 की जगह नंबर खोलें।"},
      {q:"iptables बनाम nftables?", a:"आधुनिक वितरण nftables पर स्विच कर रहे हैं; ufw/firewalld अंत में इसे ही drive करते हैं। सीधे नियम लिखें तो नए वितरण पर nft बेहतर।"},
      {q:"403 का सबसे आम कारण?", a:"Apache पर <code>Require all granted</code>/<code>AllowOverride</code>, DocumentRoot permission; RHEL पर SELinux <code>httpd_sys_content_t</code> और <code>restorecon</code>।"},
      {q:"LVM LV बढ़ाने के बाद FS बढ़ाएँ?", a:"हाँ — LV बढ़ाना केवल block देता है; FS बढ़ाने के लिए ext4 पर <code>resize2fs</code>/<code>--resizefs</code> और xfs पर <code>xfs_growfs</code> जरूरी।"},
      {q:"swap file बनाम partition?", a:"आधुनिक (विशेषकर क्लाउड/आसान resize के लिए) swap file सामान्य; हबरनेशन में swap = RAM से बड़ा चाहिए।"},
      {q:"mysqldump में --single-transaction?", a:"InnoDB को बिना lock की consistency देता है; routines/triggers भी dump करे, इसलिए बैकअप में रखें।"},
      {q:"NFS vs Samba vs SFTP?", a:"Linux↔Linux=NFS; Windows↔Linux=Samba(SMB); सुरक्षित कमांड-line फ़ाइल=SFTP (22) — plain FTP से बचें।"}
    ]},
    {type:"callout", kind:"exam", title:"परीक्षा में पूछा जाता है", html:"<ul><li><b>netplan apply</b> YAML के लिए; <b>systemctl restart networking</b> ifupdown; <b>nmcli con up</b> NetworkManager।</li><li>SSH की <b>private</b> key क्लाइंट पर, <b>public</b> सर्वर की <code>authorized_keys</code> में; परमिशन <b>700/600</b>।</li><li>ufw <b>default deny incoming</b>; firewalld में <code>--permanent</code> के बाद <code>--reload</code> ज़रूरी।</li><li><b>LVM</b>: PV->VG->LV; बढ़ाएँ <code>lvextend --resizefs</code> (ext4) / <code>xfs_growfs</code> (xfs)।</li><li><b>SELinux Enforcing</b> पर 403/503; समाधान <code>restorecon</code> / <code>setsebool httpd_can_network_connect 1</code>।</li><li>certbot renewal अपने-आप systemd <b>timer</b> से; firewall में <b>80/443</b> खुला हो।</li><li><b>load average</b> को <b>nproc</b> से तुलना करें; inode फुल हो तो <code>df -i</code>।</li></ul>"}

  ]
}
,

/* ===================================================================
   लिनक्स मास्टरक्लास 4 · इंस्टॉल, डुअल बुट व WSL
   =================================================================== */
{
  id:"lin-install", icon:"💽", group:"लिनक्स मास्टरक्लास", title:"लिनक्स इंस्टॉल, डुअल बुट व WSL",
  sub:"Ubuntu/Debian step-by-step, partitioning, live USB, GRUB रिपेयर, WSL2",
  kicker:"Linux Masterclass 4 · Installation, Dual Boot & WSL",
  hero:"यहाँ एक खाली PC पर लिनक्स उतारने से लेकर Windows के साथ dual boot, GRUB मरम्मत और Windows के अंदर WSL2 चलाने तक — सब स्टेप-बाय-स्टेप। हर स्क्रीन, हर विकल्प और हर खतरा (जैसे <b>dd से डेटा मिटाना</b>) स्पष्ट है। इंस्टॉल से पहले हमेशा <b>डेटा का बैकअप</b> लें।",
  tags:["वितरण चुनें","बूटेबल USB","पार्टीशनिंग","डुअल बुट","GRUB रिपेयर","WSL2 व पाई"],
  blocks:[

    {type:"html", html:`<h3 class="blk"><span class="blk-n">2.1</span> क्या इंस्टॉल करें — desktop vs server, वितरण व ISO</h3>
      <p><b>Desktop</b> = रोज़ का काम (GNOME/KDE/Xfce), <b>Server</b> = बिना-GUI, कम RAM, सब-24×7 सेवा, <b>Minimal/netinst</b> = केवल base, खुद चुनकर भरो। ITI लैब के लिए <b>Ubuntu LTS desktop</b> (आसान ड्राइवर), पुराने PC (2–4GB RAM) के लिए <b>Linux Mint Xfce / Debian / antiX</b>, नए हार्डवेयर व latest kernel के लिए <b>Fedora</b>। <b>32-बिट x86 desktop ISO लगभग ख़त्म</b> हो चुका है — आधुनिक installer 64-bit हैं; 32-bit के लिए हल्के विशेष विकल्प ही बचे हैं।</p>`},
    {type:"table", head:["वितरण + संस्करण","न्यूनतम RAM","सुझाई RAM","खाली डिस्क (सुझाई)"],
      rows:[
        ["Ubuntu Desktop 24.04 LTS","4 GB","8 GB","25 GB (→ 60 GB बेहतर)"],
        ["Ubuntu Server 24.04 LTS","1 GB","2–4 GB","4.5 GB (→ 25 GB)"],
        ["Debian 12 Bookworm / 13 Trixie","1 GB","4 GB","10 GB (→ 20 GB)"],
        ["Fedora 40 / 41 (Workstation)","2 GB","4–8 GB","20 GB (→ 40 GB)"],
        ["Linux Mint 22 (Xfce/Cinnamon)","2 GB","4 GB","20 GB (→ 60 GB)"],
        ["Alpine Linux","512 MB","1 GB","~5 GB (base 0.5 GB)"],
        ["Kali Linux (Desktop)","2 GB","4 GB","20 GB"]
      ]},
    {type:"table", head:["ISO प्रकार","अंदर क्या","कब चुनें"],
      rows:[
        ["Desktop / Live","ट्राई + इंस्टॉल, पूरे ऐप्स (~3–5 GB)","रोज़ लैब/डेस्कटॉप"],
        ["Server / Minimal","कमांड-लाइन इंस्टॉलर (subiquity/d-i), हल्का","सर्वर, विरचुअलाइज़ेशन"],
        ["netinst (छोटी)","+~600 MB–1.7 GB, बाक़ी इंटरनेट से","तेज़/ऑनलाइन इंस्टॉल"],
        ["DVD / Everything","ऑफ़लाइन पूरे पैकेज सेट","बिना-नेट लैब"],
        ["GPU / OEM","NVIDIA proprietary ड्राइवर पहले से","गेमिंग/AI PC"],
        ["Minimal / Docker / cloud-init","सबसे छोटा (~100–300 MB), VM/क्लाउड के लिए","क्लाउड/मशीनबूट"]
      ]},
    {type:"html", html:`<h4 class="blk2">डाउनलोड सत्यापन (checksum)</h4><p>ISO को हमेशा वितरण की आधिकारिक <code>SHA256SUMS</code> से मिलाएँ — मेल न खाए तो फ़ाइल भ्रष्ट/छेड़छाड़ है।</p>`},
    {type:"code", lang:"bash", code:`# Linux / macOS
sha256sum ubuntu-24.04-desktop-amd64.iso
sha256sum -c ubuntu-24.04-desktop-amd64.iso.sha256     # OK आना चाहिए
# Windows PowerShell
Get-FileHash .\\ubuntu-24.04-desktop-amd64.iso -Algorithm SHA256
# मिलान: आउटपुट हैश = वितरण की वेबसाइट का हैश (https से ही डाउनलोड करें)`},

    {type:"html", html:`<h3 class="blk"><span class="blk-n">2.2</span> बूटेबल USB बनाना व सुरक्षित-बूट</h3>
      <p>ISO को <b>कॉपी नहीं</b> — USB पर <b>राइट (write/image)</b> करनी होती है। Rufus में दो मोड हैं: <b>ISO</b> (persistent आदि) व <b>DD image</b> (exact byte-by-byte; सबसे reliability वाला)। <b>Ventoy</b> में USB एक बार फ़ॉर्मेट करके बाद में ISO सिर्फ़ <b>कॉपी</b> करना है (मल्टी-ISO के लिए बेस्ट)।</p>`},
    {type:"table", head:["टूल","प्लेटफ़ॉर्म","खासियत"],
      rows:[
        ["Rufus","Windows","GPT+UEFI / MBR+Legacy, ISO या DD मोड, very fast"],
        ["balenaEtcher","Win/mac/Linux","सबसे सरल — चुनो→फ़्लैश; DD जैसा"],
        ["Ventoy","Win/Linux","एक USB कई ISO, कॉपी से जोड़ें, Secure Boot समर्थित"],
        ["dd","Linux/macOS","कमांड-लाइन, exact image — खतरनाक (ग़लत डिस्क)"],
        ["Fedora Media Writer","Win/mac/Linux","Fedora के लिए आधिकारिक"],
        ["Raspberry Pi Imager","Win/mac/Linux","Pi OS + OS Customization (headless)"]
      ]},
    {type:"code", lang:"bash", code:`# Linux/macOS से DD लिखना
lsblk -f                 # USB पहचानें (जैसे /dev/sdb) — सावधान!
sudo umount /dev/sdb1 2>/dev/null
sudo dd if=debian-12-netinst.iso of=/dev/sdb bs=4M status=progress oflag=sync
sync
# macOS पर diskutil eject; Linux पर USB खींचने से पहले sync अनिवार्य`},
    {type:"callout", kind:"danger", title:"dd से डेटा मिटा न दें", html:`<p><b>of=</b> वह डिस्क है जो पूरी मिट जाएगी। ग़लती से <code>of=/dev/sda</code> (हार्ड डिस्क) दे दिया तो सिस्टम नष्ट। हमेशा: (1) <code>lsblk</code>/<code>df -h</code> से USB का letter कन्फ़र्म करें, (2) <code>of=/dev/sdX</code> में <b>partition नहीं, पूरी disk</b> लिखें, (3) पहले <code>umount</code> करें। शक हो तो balenaEtcher/Rufus (GUI) इस्तेमाल करें।</p>`},
    {type:"table", head:["ब्रांड / फ़र्मवेयर","Boot Menu (एक बार)","BIOS/UEFI Setup","TIP"],
      rows:[
        ["Dell","F12","F2","Legacy में F12; UEFI entry चुनें"],
        ["HP","Esc → F9","F10","कभी F12 सीधे; CSM enable कर सकते हैं"],
        ["Lenovo (IdeaPad/ThinkPad)","F12 / Fn+F12","F2 / Fn+F2","Novo button (साइड) से भी"],
        ["Acer","F12","F2","सबसे पहले F2 → Secure Boot = Disabled, फिर F12"],
        ["ASUS","Esc / F8","Del / F2","Boot → CSM/Secure Boot"],
        ["MSI / Gigabyte","F11 / F12","Del","BIOS में USB-first"]
      ]},
    {type:"callout", kind:"info", title:"Secure Boot व shim/GRUB", html:`<p>Secure Boot सिर्फ़ <b>signed</b> boot loader चलाता है। <b>Ubuntu व Fedora</b> का shim/GRUB Microsoft के CA से साइन है — इसलिए Secure Boot <b>on</b> रहते भी इंस्टॉल चलता है। पर third-party kernel modules (NVIDIA DKMS, VirtualBox) साइन नहीं होते तो लोड नहीं होंगे। विकल्प: BIOS में Secure Boot <b>off</b>, या key enrol करके मॉड्यूल साइन करें (<code>sudo mokutil --import key</code> → reboot में MOK पासफ़्रेज़)। Secure Boot <b>on</b> करने के लिए <code>sudo mokutil --enable-validation</code>, बंद/disable हेतु <code>sudo mokutil --disable-validation</code>।</p>`},
    {type:"table", head:["VM सेटिंग (परीक्षण हेतु)","सुझाई मान","क्यों"],
      rows:[
        ["RAM","4 GB (आसान) / 8 GB (ग्राफ़िकल)","installer + desktop चले"],
        ["CPU","2–4 core","तेज़ इंस्टॉल"],
        ["Virtual disk","25–40 GB, VDI (dynamically)","जगह बचे; fixed तेज़"],
        ["Firmware","EFI + Secure Boot (UEFI ISO)","आधुनिक बूट समझ"],
        ["Network — NAT","आसान, host के पीछे IP","बाहरी इंटरनेट काफ़ी"],
        ["Network — Bridged","LAN पर असली IP","सर्वर/SSH नेटवर्क प्रैक्टिकल"]
      ]},

    {type:"steps", items:[
      {n:1, title:"USB से बूट → 'Install Ubuntu'", text:"बूट मेनू में UEFI USB entry चुनें; पहली स्क्रीन 'Try or Install Ubuntu' — <b>Install</b> चुनें।", warn:"अगर बूट न हो तो BIOS में USB-first/Secure Boot जाँचें।"},
      {n:2, title:"भाषा व कीबोर्ड", text:"Display language → अगला; Keyboard layout (English (US) या हिन्दी) चुनें।"},
      {n:3, title:"Install type: Normal vs Minimal + Other software", text:"<b>Normal</b> = ब्राउज़र, ऑफ़िस, गेम्स; <b>Minimal</b> = सिर्फ़ ब्राउज़र+बेस। टिक करें: <b>Install multimedia codecs</b> (MP3/ codecs), <b>Third-party drivers</b> (Wi-Fi/NVIDIA), कभी-कभी <b>updates</b>।", tips:"छोटा इंस्टॉल बाद में ऐप जोड़ना आसान रहता है।"},
      {n:4, title:"Installation type (एक या कई OS)", text:"<b>Erase disk & install</b> (पूरी डी) / <b>Install alongside</b> (Windows रहेगा, installer NTFS shrink करेगा) / <b>Manual partitioning</b> ('Something else') / Advanced में <b>LVM</b> व <b>full-disk encryption</b> (24.04 में ecryptfs हटा — अब इंस्टॉल पर LUKS चुनें)।", warn:"Erase = सारा डेटा जाता है; पहले बैकअप।"},
      {n:5, title:"Timezone व user", text:"Map पर city चुनें। फिर Your name, Computer name (hostname), Username, Password — स्ट्रेंथ मीटर देखें। <b>Automatic login</b> टॉगल (single-user desktop पर) या सिर्फ़ password माँगे रखें।"},
      {n:6, title:"इंस्टॉल व reboot", text:"Slide देखते रहें; ख़त्म पर <b>Restart Now</b>, 'Please remove installation media' पर USB निकालें, Enter। पहली बार desktop खुलेगा।", tips:"Day-1: Software Updater चलाकर पूरा अपडेट करें।"}
    ]},

    {type:"steps", items:[
      {n:1, title:"Debian netinst → Graphical install", text:"USB बूट → <b>Graphical install</b> चुनें (CLI installer भी उपलब्ध)।"},
      {n:2, title:"Region व keyboard", text:"भाषा→देश→कीबोर्ड; network hostname व domain सेट करें।"},
      {n:3, title:"Mirror चुनें", text:"क़रीबी Debian mirror (country) चुनें — तेज़ डाउनलोड; proxy हो भरें।"},
      {n:4, title:"Root व user सेटअप", text:"Root password, फिर सामान्य user+password। (सूचना: अब Debian installer <b>sudo</b> समूह में user अपने-आप जोड़ता है; root login सिफ़ारिश नहीं।)"},
      {n:5, title:"Partition व Software selection", text:"Guided partitioning या manual; फिर <b>tasksel</b> desktop चुनें — GNOME/Xfce + <b>standard system utilities</b> + <b>Debian desktop environment</b>।", tips:"12+ में <b>non-free firmware</b> डिफ़ॉल्ट ISO में आता है (Wi-Fi आदि चलें)।"},
      {n:6, title:"GRUB व finish", text:"<b>Install the GRUB boot loader</b> को main disk (/dev/sda) पर स्वीकारें; ख़त्म पर reboot।"}
    ]},
    {type:"table", head:["पक्ष","Debian","Ubuntu"],
      rows:[
        ["रिलीज़ चक्र","Stable — धीमा, अत्यंत स्थिर, पुराने पैकेज","6-माह फिक्स्ड + 2-वर्ष LTS, नए पैकेज"],
        ["इंस्टॉलर","d-i (text/graphical), netinst छोटा","subiquity (server), Ubiquity/GNOME installer (desktop)"],
        ["Codec/proprietary","अब non-free-firmware ISO, पर media codec बाद में","in-built codecs + 'Additional Drivers'"],
        ["Snap","डिफ़ॉल्ट नहीं","Snap पहले से (Firefox आदि)"],
        ["प्रशासन टूल","systemd + manual","systemd + Ubuntu-विशिष्ट (software-properties)"],
        ["सर्वर डिफ़ॉल्ट","उपयोग-विशेष मशहूर","LTS सर्वर/क्लाउड व्यापक"],
        ["सपोर्ट","समुदायाध्यक्ष, 3 साल stable","काॅन्ोनिकल LTS 5 साल (ESM तक)"]
      ]},

    {type:"steps", items:[
      {n:1, title:"Fedora installer (Anaconda) — भाषा व destination", text:"Fedora Workstation/Server ISO बूट → भाषा → <b>Installation Destination</b>: disk चुनें, या तो <b>Automatic</b> partitioning या <b>I will configure partitioning</b> (custom)। 'Reclaim space' से पहले से भरी partition घटाएँ।"},
      {n:2, title:"Software Selection", text:"Environment चुनें: KDE/GNOME/Server with GUI/Minimal + <b>Add-ons</b>।"},
      {n:3, title:"Root password व user", text:"<b>Root password</b> सेट करें; <b>Create user</b> → <b>Make this user administrator</b> (wheel group) टिक करें।", warn:"Fedora में root पासवर्ड पॉलिसी कमज़ोर होने पर चेतावनी देता है — मज़बूत रखें।"},
      {n:4, title:"Begin → reboot → First Boot", text:"<b>Begin Installation</b>, फिर reboot। Server में <b>First Boot Service Configuration Agent</b> चालू (काम/सेवा/समझौते तय)।"}
    ]},
    {type:"steps", items:[
      {n:1, title:"Subiquity — भाषा व keyboard, install type", text:"'Try/Install Ubuntu Server' → भाषा → keyboard → <b>type</b>: Ubuntu Server / minimised / with HWE (नया kernel)।"},
      {n:2, title:"Network (NIC naming व static)", text:"Interface नाम (enp0s3 जैसा) देखें; <b>Edit IPv4</b> से static IP/gateway/DNS (systemd-networkd)।"},
      {n:3, title:"Mirror व proxy", text:"Archive mirror (देश) व proxy (अगर LAN पर फ़ाइरवॉल है)।"},
      {n:4, title:"Storage — layout", text:"बूट डिस्क चुनें; <b>Use as ext4</b>, make boot device; ऑप्शनल <b>guided LVM</b> व <b>LUKS encryption</b>, swap।"},
      {n:5, title:"Profile — non-root sudo user", text:"Your name, server name, username, password — <b>यही non-root user बनाता है जो sudo में</b> (root login पासवर्ड नहीं)।"},
      {n:6, title:"SSH + snaps", text:"<b>Enable OpenSSH server</b>, user+key import (GitHub/Launchpad) चुन सकते हैं; फिर <b>Featured server snaps</b> (Docker, Nextcloud, PostgreSQL, OSUM) से चुनें; reboot।"}
    ]},

    {type:"html", html:`<h3 class="blk"><span class="blk-n">2.3</span> पार्टीशनिंग — लेआउट व UEFI/BIOS फ़र्क़</h3>
      <p>लैब/डेस्कटॉप पर सरल: एक <code>/</code> (ext4) + swap। रीइंस्टॉल डेटा-सुरक्षा के लिए <code>/home</code> अलग रखें। सर्वर पर <code>/var</code> (लॉग/स्पूल) अलग ताकि फुल होकर रूट न मारे।</p>`},
    {type:"table", head:["परिदृश्य","बूट (UEFI)","/ (root)","swap","/home व /var"],
      rows:[
        ["लैब PC","ESP 512 MB fat32 boot/esp","पूरी बची ext4","4 GB","एक ही / में"],
        ["रीइंस्टॉल-सुरक्षित","ESP 512 MB","50–80 GB ext4","4 GB या 2×RAM","/home अलग ext4"],
        ["सर्वर","ESP 512 MB","/ 50 GB","4 GB (2×RAM हबरनेशन)","/var 30 GB, /home बाक़ी"],
        ["Legacy BIOS (MBR)","कोई ESP नहीं","ext4","swap","MBR: अधिकतम 4 primary / logical"]
      ]},
    {type:"table", head:["विषय","UEFI","Legacy BIOS (MBR)"],
      rows:[
        ["boot partition","<b>ESP</b> 100–512 MB FAT32, flags: boot/esp","नहीं; MBR में boot code"],
        ["boot loader package","grub-efi-amd64","grub-pc"],
        ["GPT + BIOS","<b>BIOS Boot partition</b> ~1–2 MB (flag bios_grub)","—"],
        ["/boot (LVM/encryption पर)","अलग, unencrypted /boot (या सही initramfs)","same"],
        ["partition limit","बहुत सारे (GPT)","4 primary (logical से बढ़ाएँ)"]
      ]},
    {type:"callout", kind:"tip", title:"फ़ाइलसिस्टम व swap चुनाव", html:`<p><b>ext4</b> = डिफ़ॉल्ट (journal, भरोसा); <b>xfs</b> = RHEL डिफ़ॉल्ट, बड़े फ़ाइल, केवल बढ़ाता (घटाता नहीं); <b>btrfs</b>/<b>ZFS</b> = snapshot/raid; <b>F2FS</b> = flash/Pi SD। Swap: अब <b>swap file</b> partition से बेहतर (आसान resize) — हबरनेशन के लिए swap ≥ RAM। ज़्यादा RAM/SSD पर <b>zram</b> भी विकल्प।</p>`},

    {type:"html", html:`<h3 class="blk"><span class="blk-n">2.4</span> Windows के साथ Dual Boot</h3>
      <p>नियम: <b>पहले Windows, फिर Linux</b> — ताकि GRUB दोनों पहचाने। Windows अपडेट कभी GRUB मिटा देता है; नीचे मरम्मत दी है।</p>`},
    {type:"steps", items:[
      {n:1, title:"बैकअप व बिटलॉकर", text:"पहले सारा डेटा बैकअप + System Restore point। अगर <b>BitLocker</b> है तो <b>suspend</b> करें या recovery key संभालें (वरना resize/BSOD पर लॉक)।", warn:"BitLocker on + partition बदलने पर recovery key माँगा जाता है — तैयार रखें।"},
      {n:2, title:"Fast Startup व hibernation बंद", text:"Control Panel → Power → <b>Turn off fast startup</b>; और <code>powercfg /h off</code> (hibernation बंद) — ताकि NTFS पूरी तरह unmount हो, Linux सुरक्षित shrink कर सके।"},
      {n:3, title:"SATA मोड = AHCI", text:"BIOS में SATA <b>AHCI</b> पर (Intel RST/Optane/RAID off)। पहले से RST पर चला Windows हो तो registry trick/recovery से AHCI पर लाएँ, वरना Linux को डिस्क नहीं दिखेगी।"},
      {n:4, title:"NTFS shrink (unallocated बनाएँ)", text:"Windows <b>Disk Management</b> → C: पर <b>Shrink Volume</b> → जितना Linux को दें उतना unallocated; साइज़ नोट करें।"},
      {n:5, title:"Linux इंस्टॉल ('Install alongside'/manual)", text:" installer में unallocated space चुनकर / (+ optional /home) बनाएँ। 'Install alongside Windows Boot Manager' विकल्प सबसे आसान।"}
    ]},
    {type:"code", lang:"bash", code:`# --- GRUB में Windows दिखे (Ubuntu 22.04+ os-prober default off) ---
echo 'GRUB_DISABLE_OS_PROBER=false' | sudo tee -a /etc/default/grub
sudo os-prober            # '/dev/sda1: Windows Boot Manager' दिखे
sudo update-grub          # (RHEL: sudo grub2-mkconfig -o /boot/grub2/grub.cfg)

# --- default entry व timeout (/etc/default/grub में) ---
#   GRUB_DEFAULT=saved
#   GRUB_SAVEDEFAULT=true     # जो चुना वो अगली बार default
#   GRUB_TIMEOUT=5
#   GRUB_TIMEOUT_STYLE=menu
sudo update-grub

# --- Windows घड़ी ग़लत (Linux=UTC, Windows=local) समाधान ---
# रास्ता A: Linux को local time बताएँ
sudo timedatectl set-local-rtc 1 --adjust-system-clock
# रास्ता B: Windows को UTC पर लाएँ (पसंदीदा)
#   reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation \\
#       /v RealTimeIsUniversal /t REG_DWORD /d 1

# --- UEFI boot entries देखें/क्रम बदलें ---
sudo efibootmgr -v
sudo efibootmgr -o 0001,0000     # पहला Linux, दूसरा Windows`},
    {type:"steps", items:[
      {n:1, title:"Windows अपडेट ने GRUB मिटाया → Live USB से चढ़ाएँ", text:"'Try Ubuntu' से बूट। डिस्क पहचानें: <code>lsblk -f</code>। Linux root (<code>/dev/sdaX</code>) को <code>/mnt</code> पर, और अलग हों तो <code>/boot</code>, <code>/boot/efi</code> भी mount करें।"},
      {n:2, title:"Virtual filesystems bind करें", text:"<code>for d in /dev /dev/pts /proc /sys; do sudo mount --bind \$d /mnt\$d; done</code>"},
      {n:3, title:"chroot → reinstall GRUB", text:"<code>sudo chroot /mnt</code> → UEFI: <code>grub-install --target=x86_64-efi --efi-directory=/boot/efi</code>; Legacy: <code>grub-install /dev/sda</code>। फिर <code>update-grub</code>, exit, reboot।", tips:"विकल्प GUI टूल: <code>sudo apt install boot-repair; boot-repair</code> (Recommended repair)।"},
      {n:4, title:"बूट ऑर्डर", text:"BIOS/UEFI में 'ubuntu' (या grub) entry पहले करें; फिर GRUB मेनू में Windows दिखेगा।"}
    ]},
    {type:"callout", kind:"warn", title:"NTFS साझा व Linux हटाना", html:`<p><b>डेटा साझा:</b> अलग NTFS डेटा partition को Linux में mount करते समय <code>/etc/fstab</code> में <code>ntfs3</code>/<code>ntfs-3g</code> पर <code>uid=1000,gid=1000</code> व सुरक्षा हेतु <code>noexec,nosuid</code> रखें। <b>/home या पाकिट कैश कभी NTFS पर न रखें</b> — Linux permission/lock टूटते हैं।</p><p><b>Linux हटाना:</b> Windows Disk Management में ext4 partitions डिलीट → NTFS Extend → फिर Legacy पर <code>bootrec /fixmbr</code>, UEFI पर efibootmgr/BIOS से Windows entry first।</p>`},

    {type:"steps", items:[
      {n:1, title:"अपडेट व अपग्रेड", text:"<code>sudo apt update && sudo apt upgrade -y</code> (या <code>dnf -y upgrade</code>) — इंस्टॉल-तुरंत ज़रूरी।"},
      {n:2, title:"ड्राइवर व firmware", text:"'Additional Drivers' GUI खोलें (Wi-Fi/NVIDIA), या <code>sudo ubuntu-drivers autoinstall</code>। firmware: <code>sudo apt install linux-firmware</code>।"},
      {n:3, title:"Codecs व media", text:"Ubuntu: <code>sudo apt install ubuntu-restricted-extras</code> (MP3, fonts); GStreamer plugins; VLC।"},
      {n:4, title:"Snap/Flatpak + Flathub", text:"<code>sudo apt install flatpak</code>; <code>flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo</code>।"},
      {n:5, title:"Timeshift (system rollback) install + schedule", text:"<code>sudo apt install timeshift</code>; रोज़/साप्ताहिक rsync snapshot + <b>boot</b> पर — हर प्रयोग से पहले snapshot।"},
      {n:6, title:"फ़ायरवॉल व SSH (सर्वर)", text:"डेस्कटॉप पर <code>sudo ufw enable</code>; दूर-काम हेतु <code>openssh-server</code> + key auth, ufw में 22।"},
      {n:7, title:"भाषा/इनपुट (हिन्दी)", text:"Settings → Region & Language → Hindi जोड़ें; input source <b>ibus/Inscript</b> या <b>fcitx</b>; <code>sudo apt install fonts-lohit-deva fonts-noto</code>।"},
      {n:8, title:"प्रिंटर/स्केनर + Samba शेयर", text:"<code>system-config-printer</code> (CUPS), स्कैनर sane; Windows को फ़ाइल देने samba share बनाएँ।"},
      {n:9, title:"hostname, time, telemetry", text:"<code>hostnamectl set-hostname</code>; <code>timedatectl set-ntp true</code>; ज़रूरत हो तो <code>sudo systemctl disable --now</code> अनावश्यक सर्विस; GNOME tweaks से कस्टमाइज़।"},
      {n:10, title:"बैकअप नीति + हर प्रयोग से पहले Timeshift", text:"सिस्टम Timeshift + फ़ाइल rsync/Borg; महीने में restore-drill।", warn:"कोई बड़ा बदलाव (kernel/driver/repo) से पहले snapshot ज़रूर।"}
    ]},

    {type:"html", html:`<h3 class="blk"><span class="blk-n">2.5</span> ड्राइवर व firmware (GPU, Wi-Fi, Sound)</h3>
      <p>लिनक्स में kernel में इन-बिल्ट ड्राइवर + अलग <b>firmware</b> blobs होते हैं। proprietary GPU/Wi-Fi के लिए <b>DKMS</b> (Dynamic Kernel Module Support) हर kernel अपडेट पर ड्राइवर दोबारा compile करता है — पर अपडेट से पहले <b>secure boot</b>/signed module ध्यान रखें।</p>`},
    {type:"code", lang:"bash", code:`# --- हार्डवेयर ID पहचानें ---
lspci -nnk | grep -A3 -i -E 'vga|3d|display|network'   # PCI: device + 'Kernel driver in use'
lsusb
sudo dmesg | grep -iE 'firmware|failed|not found|devid'   # missing firmware यहाँ दिखता
# --- firmware पैकेज (Debian/Ubuntu) ---
sudo apt install linux-firmware firmware-linux firmware-linux-nonfree firmware-misc-nonfree
# --- proprietary driver ---
sudo ubuntu-drivers devices        # सिफारिश दिखाएँ
sudo ubuntu-drivers autoinstall    # NVIDIA/Wi-Fi चुनकर लगाएँ
# --- Broadcom wl ---
sudo apt install bcmwl-kernel-source
# --- DKMS से Realtek आदि (package नाम हार्डवेयर/वितरण से भिन्न) ---
sudo apt install dkms
# --- kernel अपडेट पर driver टूटे ---
sudo dkms status
sudo dkms autoinstall              # modules दोबारा बनाएँ
# NVIDIA + Secure Boot: mokutil से key enrol करके module साइन करें
#   sudo mokutil --import /var/lib/shim-signed/mok/MOK.der  (reboot में MOK पासफ़्रेज़)`},

    {type:"html", html:`<h3 class="blk"><span class="blk-n">2.6</span> WSL2 — Windows के अंदर असली लिनक्स</h3>
      <p><b>WSL2</b> हल्के VM (lightweight utility VM) में असली <b>Linux kernel</b> चलाता है (WSL1 translation नहीं) — इसलिए Docker, systemd, ब्राउनफ़ील्ड टूल चलते हैं। ज़रूरत: <b>Windows 10 2004 (build 19041+)</b> या Windows 11, और BIOS में Virtualization (VT-x/AMD-V) चालू।</p>`},
    {type:"code", lang:"powershell", code:`# --- आधुनिक एक-कमांड install (Admin PowerShell) ---
wsl --install -d Ubuntu-24.04
wsl --list --online
wsl --update
wsl --set-default-version 2
# --- legacy feature enable (अगर --install न चले) ---
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
# reboot -> फिर:
wsl --list --verbose            # v1 या v2?
wsl --set-version Ubuntu-24.04 2    # v1 -> v2 convert
wsl -d Ubuntu-24.04             # चलाएँ (पहली बार user/pw बनाएँ)`},
    {type:"code", lang:"bash", code:`# --- Linux अंदर /etc/wsl.conf ---
[boot]
systemd=true
[automount]
enabled=true
options=metadata,umask=22,fmask=11
# (metadata = Windows से Linux permission रखें)

# --- Windows पर %UserProfile%\\.wslconfig (वैश्विक संसाधन नेटवर्क) ---
[wsl2]
memory=6GB
processors=4
swap=4
localhostForwarding=true
networkingMode=mirrored        # Win11: Windows जैसी network + shared localhost
dnsTunneling=true
autoProxy=true
[experimental]
autoMemoryReclaim=gradual

# --- फ़ाइल पहुँच ---
# Linux -> Windows : /mnt/c/Users/you/...
# Windows -> Linux : \\\\wsl.localhost\\Ubuntu-24.04\\home\\user  (या \\\\wsl$\\Ubuntu-24.04\\)
# GUI ऐप (WSLg, Win10 21H2+/Win11): wslg — xcalc, gedit, VS Code 'Remote-WSL'

# --- DNS टूटे तो (9.x/localhost resolver) ---
# /etc/wsl.conf में:
#   [network]
#   generateResolvConf=false
# फिर manual /etc/resolv.conf: nameserver 8.8.8.8
# कभी: PowerShell -> netsh winsock reset -> wsl --shutdown

# --- ext4.vhdx बड़ा हो गया: compact ---
wsl --shutdown
# diskpart (Admin):
#   select vdisk file="C:\\Users\\you\\AppData\\Local\\Packages\\...\\ext4.vhdx"
#   attach vdisk readonly ; compact vdisk ; detach vdisk
# आसान: नए WSL पर sparse file
wsl --manage Ubuntu-24.04 --set-sparse true

# --- backup / move / delete ---
wsl --export Ubuntu-24.04 C:\\wslbackup\\ubuntu.tar
wsl --import MyUbuntu D:\\wsl\\C:\\wslbackup\\ubuntu.tar
wsl --unregister Ubuntu-24.04      # पूरी distro मिटाएँ (वापसी नहीं)`},
    {type:"table", head:["WSL2 समस्या","समाधान"],
      rows:[
        ["systemd सर्विस न चले","/etc/wsl.conf में <b>[boot] systemd=true</b> फिर <code>wsl --shutdown</code> व <code>wsl --update</code>"],
        ["इंटरनेट/DNS न चले","generateResolvConf=false + manual resolv.conf; <code>netsh winsock reset</code>; mirrored_mode"],
        ["समय (clock) पीछे","mirror/dnsTunneling रखें; <code>wsl --shutdown</code>; नई WSL पर <code>clockAdjInterval</code>"],
        ["localhost नहीं मिली","Win11 mirrored mode, या NAT पर distro का IP (hostname -I)"],
        ["ext4.vhdx बहुत बड़ा","--set-sparse true या diskpart compact (ऊपर)"],
        ["GUI ऐप न दिखे","WSLg के लिए WSL अपडेट + Win10 21H2+/Win11; <code>wsl --update</code>"],
        ["Docker न चले","Docker Desktop WSL2 backend, या distro में systemd docker service"]
      ]},

    {type:"html", html:`<h3 class="blk"><span class="blk-n">2.7</span> Raspberry Pi — तेज़ शुरुआत</h3>
      <p>Pi में <b>Raspberry Pi Imager</b> सबसे आसान है: OS चुनें (अब डिफ़ॉल्ट <b>64-bit</b>) → SD चुनें → फ़्लैश से पहले <b>Advanced Options (Ctrl+Shift+X)</b> में hostname, user+password, SSH enable, WiFi, locale भर दें → <b>headless</b> (बिना मॉनिटर) चालू।</p>`},
    {type:"steps", items:[
      {n:1, title:"Imager से OS फ्लैश", text:"Raspberry Pi OS (64-bit) चुनें; SD/USB चुनें; OS Customization में hostname='raspberrypi', user बनाएँ, SSH=On, WiFi SSID/key + country।"},
      {n:2, title:"पुराना manual headless (वैकल्पिक)", text:"FAT boot partition में खाली फ़ाइल <code>ssh</code> बनाएँ और <code>userconf.txt</code> में <code>pi:passwd-hash</code>, फिर <code>cmdline.txt</code> के अंत में <code> init=/usr/bin/raspi-config</code> जोड़ें।"},
      {n:3, title:"पहला SSH व अपडेट", text:"<code>ssh pi@raspberrypi.local</code> → <code>sudo apt update && sudo apt full-upgrade -y</code>।"},
      {n:4, title:"raspi-config सेटिंग", text:"<code>sudo raspi-config</code> → Interface (SSH/VNC/I2C/SPI), Localisation (locale/keyboard/timezone/Wi-Fi country), Performance (GPU memory, overlayfs), Boot (auto-login)。"},
      {n:5, title:"प्रोजेक्ट", text:"एक SD पर चलें: <b>Pi-hole</b> (DNS ad-block), <b>Nextcloud</b> (private cloud), <b>web server</b> (nginx+PHP), <b>Samba</b> file share, या home-automation (MQTT)।", warn:"Overclock/वोल्टेज Pi 4/5 पर केवल अच्छे कूलर/पावर के साथ; ओवरहीट पर थ्रॉटल होगा।"}
    ]},
    {type:"table", head:["raspi-config मेन्यू","उपयोग"],
      rows:[
        ["System Options","Boot (auto-login), Wait for Network, Audio out, Power"],
        ["Display Options","Resolution, overscan, rotation (पुराने Pi)"],
        ["Interface Options","SSH, VNC, I2C, SPI, Serial, Camera, 1-Wire"],
        ["Localisation Options","Locale, Keyboard, Timezone, Wi-Fi country"],
        ["Performance Options","GPU memory split, Overlay FS, PWM, CAN"],
        ["Overclocking","Pi Zero2/4/5 clocks (केवल अच्छे cooling के साथ)"]
      ]},

    {type:"html", html:`<h3 class="blk"><span class="blk-n">2.8</span> अन्य इंस्टॉल — Arch, Alpine, openSUSE, Chromebook व क्लाउड</h3>
      <p>हर वितरण का अपना दर्शन व installer है। नीचे एक-एक नज़र — परीक्षा/इंटरव्यू में अक्सर पूछे जाते हैं।</p>`},
    {type:"code", lang:"bash", code:`# --- Arch: DIY, rolling, सिर्फ़ जो आप रखें; अब guided installer ---
sudo archinstall         # disk, filesystem, bootloader, profile, user — menu से
# (मैन्युअल: partition -> mkfs -> pacstrap -> genfstab -> chroot -> grub -> user)
# --- Alpine: अत्यंत हल्का, musl libc + OpenRC ---
setup-alpine             # disk/time/network/root-user wizard; फिर setup-xorg-base
# --- openSUSE: यस्ट प्रशासन केंद्र ---
sudo yast2               # graphical/ncurses admin center
# --- Chromebook: Crouton (Linux chroot, ChromeOS kernel पर) या 'Linux development environment' (VM) ---
sudo edit-chroot -all    # chroot प्रबंधन (Crouton)
# --- Cloud image: pre-installed, first-boot पर cloud-init user-data लगाता है ---
#   AWS/GCP/Azure Ubuntu image -> seed user-data (cloud-config):
#     hostname, users[name, ssh_authorized_keys, sudo], packages[], runcmd[]
cloud-init status --wait`},
    {type:"callout", kind:"ok", title:"क्लाउड-इमेज का सार", html:`<p>क्लाउड वितरण <b>cloud-init</b> से config करते हैं — VM पहली बार उठते ही hostname, users, SSH keys, packages, scripts लगा देता है। इसलिए image एक जैसे रखकर <b>user-data</b> बदलते हैं; desktop installer जैसा मैन्युअल क्लिक नहीं करना पड़ता।</p>`},

    {type:"acc", title:"इंस्टॉल/WSL — अक्सर पूछे प्रश्न", items:[
      {q:"Debian ISO पर firmware चाहिए, पर download न हो रहा?", a:"12+ के official ISO में अब <b>non-free-firmware</b> शामिल है। ऑफ़लाइन इंस्टॉल के लिए पहले से firmware packages डाउनलोड कर रखें या Ethernet का उपयोग करें।"},
      {q:"Secure Boot पर रहकर NVIDIA driver नहीं चला?", a:"proprietary module unsigned होने से लोड नहीं होता — mokutil से key enrol कर साइन करें या Secure Boot temporarily off रखें।"},
      {q:"GRUB में Windows क्यों नहीं आया?", a:"Ubuntu 22.04+ ने os-prober default बंद किया — <code>GRUB_DISABLE_OS_PROBER=false</code> करके <code>update-grub</code> चलाना है।"},
      {q:"Windows घड़ी ग़लत दिखती है (dual boot)?", a:"Linux RTC=UTC, Windows local time मानता है। Linux पर <code>timedatectl set-local-rtc 1</code> या Windows पर <code>RealTimeIsUniversal=1</code>।"},
      {q:"WSL1 बनाम WSL2?", a:"WSL1 = system-call translation (कम RAM), WSL2 = असली Linux kernel VM (Docker/systemd फुल, पर भारी)। नए सब WSL2 डिफ़ॉल्ट।"},
      {q:"WSL में systemd नहीं चला?", a:"/etc/wsl.conf में <code>[boot] systemd=true</code>, फिर <code>wsl --shutdown</code> व WSL अपडेट करें।"},
      {q:"WSL .vhdx घटाएँ कैसे?", a:"<code>wsl --manage <distro> --set-sparse true</code> (नया) या <code>wsl --shutdown</code> + diskpart <code>compact vdisk</code>।"},
      {q:"Pi पर headless SSH कौन-सा यूज़र?", a:"नई Imager में आप खुद user बनाते हैं; पुराने default user <code>pi</code> था (पासवर्ड raspbian)। अब कस्टम user सिफ़ारिश।"},
      {q:"32-bit पुराने PC पर क्या डालूँ?", a:"हल्का 32/64: antiX, Puppy, Debian (i386 अब सीमित) — पर नई apps/ब्राउज़र के लिए 64-bit हार्डवेयर बेहतर।"},
      {q:"LVM/Erase checkbox इंस्टॉल में क्या करे?", a:"LVM = बाद में LV बढ़ाना आसान; Erase पूरा डिस्क = सारी partition मिटा नया लेआउट। दोनों से पहले बैकअप ज़रूरी।"}
    ]},
    {type:"callout", kind:"exam", title:"परीक्षा में पूछा जाता है", html:`<ul><li>ISO सिर्फ़ कॉपी नहीं — <b>write/dd</b> करना है; dd में <code>of=/dev/sdX</code> ग़लत = डेटा नष्ट।</li><li>Secure Boot चलता है क्योंकि Ubuntu/Fedora का <b>shim</b> Microsoft CA से <b>signed</b>।</li><li>UEFI में <b>ESP (FAT32, boot/esp)</b> चाहिए; Legacy MBR में नहीं; GPT+BIOS में <b>bios_grub</b> छोटा part।</li><li>WSL2 की न्यूनतम शर्त: <b>Win10 19041+/Win11 + Virtualization on</b>।</li><li>dual boot में <b>Windows पहले, Linux बाद</b> में GRUB os-prober से Windows जोड़ता है।</li><li>सबसे पहले डेटा <b>बैकअप + Timeshift snapshot</b>; हर बड़े बदलाव से पहले snapshot।</li><li>cloud image <b>cloud-init user-data</b> से config होते हैं (manual क्लिक नहीं)।</li></ul>`}

  ]
}
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id:'lin-script', icon:'📜', group:'लिनक्स मास्टरक्लास',
  title:'प्रैक्टिकल Bash Scripting',
  sub:'shebang, quoting, test, loops, functions, set -euo pipefail, cron और असली रखरखाव स्क्रिप्ट',
  kicker:'Linux Masterclass 5 · Practical Bash Scripting',
  hero:'कमांड आना आधा काम है; असली सिस्टम-प्रशासन तब शुरू होता है जब आप वही काम रोज़ अपने आप कराने के लिए स्क्रिप्ट लिखते हैं। यह पृष्ठ शून्य से शुरू करता है — shebang और chmod +x, चर व quoting का सही नियम, exit code और test, if/case, तीनों loop, array व function, फिर सुरक्षित स्क्रिप्ट की रीढ़ <code>set -euo pipefail</code>, trap, logging और debugging। अंत में पाँच पूरी, चलने लायक स्क्रिप्ट — backup, log rotate, disk-space अलर्ट, सेवा-जाँच और bulk user बनाना — जिन्हें आप लैब में चलाकर देख सकते हैं।',
  tags:['shebang व chmod','quoting व exit code','test, if व case','for/while व array','functions व getopts','set -euo pipefail, cron'],
  blocks:[

  { type:'callout', kind:'info', title:'इस पृष्ठ के बाद आप क्या कर पाएँगे', html:'<p>1) एक नई स्क्रिप्ट बनाकर उसे चला सकेंगे और समझा सकेंगे कि shebang क्या करता है। 2) <code>"$var"</code> और <code>$var</code> का फ़र्क़ बताकर सबसे आम bug से बच सकेंगे। 3) exit code पढ़कर शर्त लगा सकेंगे। 4) if/case/for/while/select लिख सकेंगे। 5) function, array और getopts से विकल्प वाली स्क्रिप्ट बना सकेंगे। 6) <code>set -euo pipefail</code>, trap और logging से स्क्रिप्ट को भरोसेमंद बना सकेंगे। 7) <code>bash -x</code> और shellcheck से अपनी ग़लती ख़ुद पकड़ सकेंगे। 8) cron/systemd timer से उसे रोज़ चला सकेंगे।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.1</span> पहली स्क्रिप्ट — shebang, अनुमति और PATH</h3><p>स्क्रिप्ट केवल एक text file है जिसमें वे कमांड हैं जो आप हाथ से टाइप करते। पहली पंक्ति <b>shebang</b> (<code>#!</code>) kernel को बताती है कि इसे कौन-सा interpreter चलाए। <code>#!/bin/bash</code> सबसे आम है; <code>#!/usr/bin/env bash</code> बेहतर portability देता है क्योंकि यह PATH से bash ढूँढ़ता है (macOS/BSD पर bash /bin में नहीं होता)।</p>' },
  { type:'code', code: '# --- पहली स्क्रिप्ट: तीन कदम ---\nnano hello.sh\n\n#!/usr/bin/env bash\n# hello.sh — पहली स्क्रिप्ट\necho "नमस्ते, $(whoami)! आज $(date +%F) है।"\n\n# सेव करके बाहर आएँ, फिर:\nchmod +x hello.sh        # चलाने की अनुमति\n./hello.sh               # चलाना (./ ज़रूरी है)\n\n# बिना chmod के भी चल सकती है (interpreter को file देकर)\nbash hello.sh\n\n# कहाँ से चलती है?\nwhich bash; type -a bash\necho $PATH\nmkdir -p ~/bin && mv hello.sh ~/bin/hello\n# ~/.bashrc में जोड़ें (Ubuntu में ~/bin अपने आप PATH में आता है यदि मौजूद हो)\nexport PATH="$HOME/bin:$PATH"\nhello                    # अब कहीं से भी\n\n# --- file किस प्रकार की है ---\nfile hello.sh\nhead -1 hello.sh         # shebang जाँचें\nbash -n hello.sh         # केवल syntax जाँच, चलाए बिना' },
  { type:'table', head:['बात','सही','ग़लत / जोखिम'], rows:[
    ['shebang पहली पंक्ति में','#!/usr/bin/env bash','बीच में लिखना — केवल comment बन जाएगा'],
    ['शे चुनना','bash सुविधाएँ चाहिए तो bash; POSIX चाहिए तो sh','#!/bin/sh लिखकर bash-only [[ ]] चलाना'],
    ['चलाने की अनुमति','chmod +x file (या chmod 755)','chmod 777 — सबको लिखने का अधिकार, सुरक्षा जोखिम'],
    ['चलाना','./file.sh या पूरा पथ','केवल file.sh — . आम तौर पर PATH में नहीं होता (जान-बूझकर)'],
    ['Line ending','Linux में LF','Windows का CRLF — “bad interpreter: ^M” त्रुटि'],
    ['CRLF ठीक करना','dos2unix file.sh या sed -i "s/\\r$//" file.sh','अनदेखा करना'],
    ['नाम','छोटा, अर्थपूर्ण, .sh','स्पेस वाला नाम'],
  ] },
  { type:'callout', kind:'warn', title:'“bad interpreter: No such file or directory” के तीन कारण', html:'<p>1) <b>CRLF line endings</b> — Windows पर लिखी file में shebang के अंत में <code>\\r</code> रह जाता है; <code>dos2unix</code> चलाएँ। 2) <b>ग़लत पथ</b> — <code>#!/bin/bash</code> लिखा पर bash कहीं और है; <code>#!/usr/bin/env bash</code> इस्तेमाल करें। 3) <b>फ़ाइल में BOM</b> — कुछ editor UTF-8 BOM जोड़ देते हैं; “UTF-8 without BOM” में सेव करें।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.2</span> चर और Quoting — सबसे बड़ा bug-स्रोत</h3><p>bash में चर बनाते समय <code>=</code> के दोनों ओर <b>स्पेस नहीं</b> होता। मान हमेशा string होता है; गणना के लिए <code>$(( ))</code> चाहिए। सबसे ज़रूरी नियम: <b>चर को हमेशा दोहरे अवतरण में रखें</b> — <code>"$var"</code>। बिना अवतरण bash उसे स्पेस पर तोड़कर कई तर्क बना देता है (word splitting) और <code>*</code> को फ़ाइलों से बदल देता है (globbing)।</p>' },
  { type:'table', head:['रूप','क्या होता है','कब इस्तेमाल'], rows:[
    ['$var','word splitting + globbing होता है','लगभग कभी नहीं — जोखिम'],
    ['"$var"','पूरा मान एक तर्क; अंदर $ और \\ काम करते हैं','डिफ़ॉल्ट — हमेशा यही'],
    ["'$var'",'कुछ नहीं बदलता — literally $var','जब बिलकुल कच्चा पाठ चाहिए'],
    ['${var}','साफ़ सीमा — ${var}_bak सही','नाम के तुरंत बाद अक्षर जोड़ना हो'],
    ['${var:-default}','खाली/अनुपस्थित हो तो default','वैकल्पिक मान'],
    ['${var:=default}','खाली हो तो default सेट भी कर दे','एक बार तय करना'],
    ['${var:?message}','खाली हो तो message के साथ रुक जाए','अनिवार्य चर की जाँच'],
    ['${#var}','लंबाई','गिनती'],
    ['${var%.ext} / ${var##*/}','अंत/शुरू से काटना (extension, basename)','फ़ाइल-नाम से भाग निकालना'],
    ['${var/old/new} / ${var//old/new}','पहला/सब बदलना','सरल प्रतिस्थापन'],
    ['$(command)','command का output','backtick से बेहतर — नेस्ट होता है, पढ़ने में साफ़'],
    ['$(( expr ))','पूर्णांक गणना','जोड़/घटाव/भाग'],
  ] },
  { type:'code', code: '#!/usr/bin/env bash\n# quoting का असर — इसे चलाकर देखें\nname="मेरी फ़ाइल.txt"\n\nmkdir -p /tmp/qtest && cd /tmp/qtest\ntouch a.txt b.txt\n\necho $name        # दो तर्क बन गए: मेरी और फ़ाइल.txt\necho "$name"      # एक तर्क: पूरा नाम सुरक्षित\n\nfiles="*"\necho $files       # a.txt b.txt  <- glob फैल गया\necho "$files"     # *          <- literal\n\n# सीमा और काट-छाँट\nf="/home/student/report.final.pdf"\necho "${f##*/}"     # report.final.pdf   (basename)\necho "${f%.*}"      # /home/student/report.final\necho "${f##*.}"     # pdf                (extension)\necho "${#f}"        # लंबाई\n\n# default और अनिवार्य जाँच\necho "${EDITOR:-nano}"\n: "${BACKUP_DIR:?BACKUP_DIR सेट करें}"   # न हो तो यहीं रुक जाएगा\n\n# गणना और command substitution\nn=$(( 6 * 7 ))\ntoday=$(date +%F)\nusers=$(who | wc -l)\nprintf "%s -> %d, आज %s, लॉगिन %s\\n" "6*7" "$n" "$today" "$users"' },
  { type:'table', head:['विशेष चर','अर्थ','उदाहरण'], rows:[
    ['$0','स्क्रिप्ट का नाम','usage दिखाने में'],
    ['$1 … $9','पहला…नौवाँ तर्क','$1 = input file'],
    ['${10}','दसवाँ और आगे (ब्रेस ज़रूरी)','बिना ब्रेस $10 = $1 के बाद 0'],
    ['$#','तर्कों की संख्या','जाँच: [ $# -lt 2 ] && usage'],
    ['$@','सारे तर्क, अलग-अलग ("$@" सही रूप)','for f in "$@"'],
    ['$*','सारे तर्क एक string','कम उपयोगी'],
    ['$?','पिछले कमांड का exit code','0 = सफल'],
    ['$$','इस shell का PID','अस्थायी फ़ाइल का नाम'],
    ['$!','पिछले background काम का PID','wait के लिए'],
    ['$_','पिछले कमांड का अंतिम तर्क','जल्दी काम में'],
    ['$RANDOM','0–32767 यादृच्छिक','अस्थायी नाम/अभ्यास'],
    ['$LINENO','वर्तमान पंक्ति संख्या','log/debug में'],
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.3</span> Exit code और शर्त — test, [ ] व [[ ]]</h3><p>हर लिनक्स कमांड लौटते समय एक संख्या देती है — <b>0 = सफल, 1–255 = कोई समस्या</b>। यही पूरी shell-तर्क की नींव है। <code>if</code> सच/झूठ नहीं देखता, वह <b>exit code</b> देखता है: 0 आया तो then चलेगा। <code>test</code> और उसका छोटा रूप <code>[ ]</code> भी यही करते हैं — वे शर्त सही होने पर 0 लौटाते हैं।</p>' },
  { type:'table', head:['जाँच','अर्थ','उदाहरण'], rows:[
    ['-e file','मौजूद है','[ -e "$f" ]'],
    ['-f file','साधारण फ़ाइल है','[ -f "$f" ]'],
    ['-d dir','directory है','[ -d "$dir" ]'],
    ['-s file','मौजूद और खाली नहीं','[ -s "$log" ]'],
    ['-r / -w / -x','पढ़ने/लिखने/चलाने की अनुमति','[ -x "$script" ]'],
    ['-L file','symlink है','[ -L "$link" ]'],
    ['-z "$s"','string खाली है','[ -z "$1" ]'],
    ['-n "$s"','string खाली नहीं','[ -n "$name" ]'],
    ['"$a" = "$b"','string बराबर (POSIX में एक =)','[ "$ans" = "y" ]'],
    ['-eq -ne -lt -le -gt -ge','संख्या तुलना','[ "$n" -gt 10 ]'],
    ['f1 -nt f2 / -ot','नया/पुराना (mtime)','[ "$src" -nt "$dst" ]'],
    ['! , -a , -o','NOT, AND, OR ([ ] के अंदर)','[ -f "$f" -a -r "$f" ]'],
    ['&& , ||','बाहर AND/OR (सबसे साफ़)','[ -f "$f" ] && [ -r "$f" ]'],
    ['[[ … ]]','bash का उन्नत रूप — splitting नहीं, pattern/regex','[[ $name == *.txt ]]'],
    ['(( … ))','अंकगणितीय शर्त','(( n > 10 ))'],
  ] },
  { type:'callout', kind:'tip', title:'[ ] बनाम [[ ]] — कब कौन', html:'<p><code>[ ]</code> POSIX है और हर shell में चलेगा, पर इसमें चर हमेशा <code>"$var"</code> लिखना पड़ता है और AND/OR के लिए <code>-a/-o</code>। <code>[[ ]]</code> bash/zsh/ksh का है — इसमें word splitting नहीं होता, <code>&amp;&amp;</code>/<code>||</code> सीधे चलते हैं, और <code>==</code> के दाईं ओर pattern (<code>*.txt</code>) तथा <code>=~</code> से regex लिख सकते हैं। स्क्रिप्ट bash की है तो <code>[[ ]]</code> चुनें; <code>#!/bin/sh</code> लिखा है तो <code>[ ]</code> ही।</p>' },
  { type:'code', code: '#!/usr/bin/env bash\n# exit code और शर्त\nls /etc/hostname > /dev/null 2>&1\necho "exit code = $?"        # 0\n\nls /नहीं-है > /dev/null 2>&1\necho "exit code = $?"        # 2\n\n# if — शर्त का exit code देखा जाता है\nfile="${1:-/etc/passwd}"\nif [[ -f "$file" && -r "$file" ]]; then\n  echo "पढ़ सकते हैं: $file ($(wc -l < "$file") पंक्तियाँ)"\nelif [[ -d "$file" ]]; then\n  echo "यह directory है"\nelse\n  echo "नहीं मिला या पढ़ नहीं सकते" >&2\n  exit 1\nfi\n\n# संख्या और pattern\nn=$(( RANDOM % 100 ))\nif (( n > 50 )); then echo "$n बड़ा"; else echo "$n छोटा"; fi\n[[ "$file" == *.conf ]] && echo "config फ़ाइल"\n[[ "$file" =~ ^/etc/ ]] && echo "/etc के अंदर है"\n\n# case — मेनू और extension के लिए सबसे साफ़\ncase "${1##*.}" in\n  jpg|jpeg|png) echo "चित्र" ;;\n  txt|md)       echo "पाठ" ;;\n  sh)           echo "स्क्रिप्ट" ;;\n  *)            echo "अन्य" ;;\nesac\n\n# छोटा circuit — तेज़ और पठनीय\n[[ -d /backup ]] || mkdir -p /backup\ngrep -q "root" /etc/passwd && echo "root मौजूद"' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.4</span> Loops — for, while, until, select</h3><p>दोहराव के चार रूप हैं। <b>for</b> जब सूची पहले से पता हो; <b>while</b> जब तक शर्त सही है; <b>until</b> जब तक शर्त ग़लत है; <b>select</b> जब उपयोगकर्ता को मेनू दिखाना हो। फ़ाइलों पर loop लगाते समय <b>find -print0 + while read -d</b> वाला रूप ही स्पेस/नई-पंक्ति वाले नामों पर सुरक्षित है।</p>' },
  { type:'table', head:['Loop','कब','रूप'], rows:[
    ['for x in सूची','ज्ञात सूची/फ़ाइलें','for f in *.txt; do …; done'],
    ['for ((i=0;i<n;i++))','गिनती जानी हो','C-शैली, bash में'],
    ['while शर्त','जब तक सही','while read -r line; do …; done < file'],
    ['until शर्त','जब तक ग़लत','until ping -c1 host; do sleep 5; done'],
    ['select','मेनू बनाना','select opt in A B C; do …; break; done'],
    ['break / continue','बाहर निकलना / अगला चक्र','loop के अंदर'],
    ['IFS + read -r','पंक्ति को खेतों में तोड़ना','IFS=: read -r user pass uid …'],
    ['find -print0 | while IFS= read -r -d "" f','सुरक्षित फ़ाइल-चक्र','स्पेस वाले नाम भी सुरक्षित'],
  ] },
  { type:'code', code: '#!/usr/bin/env bash\n\n# 1) साधारण for\nfor name in ram shyam mohan; do\n  echo "उपयोगकर्ता: $name"\ndone\n\n# 2) गिनती वाला for\nfor ((i=1; i<=5; i++)); do echo "चक्र $i"; done\n\n# 3) फ़ाइलों पर — glob सुरक्षित है\nfor f in /var/log/*.log; do\n  [[ -e "$f" ]] || continue          # कोई फ़ाइल न हो तो literal glob से बचाव\n  printf "%-30s %s bytes\\n" "${f##*/}" "$(stat -c%s "$f")"\ndone\n\n# 4) पंक्ति-दर-पंक्ति पढ़ना (सही तरीक़ा)\nwhile IFS=: read -r user pass uid gid desc home shell; do\n  (( uid >= 1000 )) && echo "$user -> $shell"\ndone < /etc/passwd\n\n# 5) स्पेस/विचित्र नामों पर पूरी तरह सुरक्षित\nfind /home -type f -name "*.tmp" -print0 |\n  while IFS= read -r -d "" f; do\n    echo "मिटा रहे: $f"\n    # rm -- "$f"      # अभ्यास में comment ही रहने दें\n  done\n\n# 6) until — सेवा आने तक इंतज़ार\ntries=0\nuntil curl -sf http://localhost:8080/health > /dev/null; do\n  (( ++tries > 30 )) && { echo "सेवा नहीं आई"; exit 1; }\n  sleep 2\ndone\necho "सेवा तैयार"\n\n# 7) select — सरल मेनू\nPS3="चुनें: "\nselect opt in "डिस्क जगह" "मेमोरी" "बाहर"; do\n  case "$opt" in\n    "डिस्क जगह") df -h ;;\n    "मेमोरी")   free -h ;;\n    "बाहर")     break ;;\n    *)          echo "ग़लत विकल्प" ;;\n  esac\ndone' },
  { type:'callout', kind:'warn', title:'Loop की तीन आम ग़लतियाँ', html:'<p>1) <b>for f in $(ls)</b> — स्पेस वाले नाम टूट जाते हैं; glob (<code>*.txt</code>) या find -print0 इस्तेमाल करें। 2) <b>pipeline में चर बदलना</b> — <code>cat file | while read …; do n=$((n+1)); done</code> के बाद <code>$n</code> खाली मिलेगा, क्योंकि pipeline का while अलग subshell में चलता है; <code>done &lt; file</code> या process substitution <code>&lt; &lt;(cmd)</code> इस्तेमाल करें। 3) <b>read में -r न लगाना</b> — बिना -r के backslash खा जाता है।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.5</span> Array, Function और विकल्प (getopts)</h3><p><b>Array</b> से एक चर में कई मान रखे जाते हैं और <b>function</b> से दोहराव रोका जाता है। bash के function मान return नहीं करते — वे <b>exit code</b> लौटाते हैं और परिणाम <code>echo</code> से बाहर भेजा जाता है जिसे caller <code>$( )</code> में पकड़ता है। function के अंदर चर हमेशा <code>local</code> घोषित करें, वरना वे पूरी स्क्रिप्ट में बदल जाते हैं।</p>' },
  { type:'code', code: '#!/usr/bin/env bash\n\n# --- Array ---\nservers=(web1 web2 db1)\nservers+=(cache1)\necho "पहला: ${servers[0]}"\necho "सब: ${servers[@]}"\necho "गिनती: ${#servers[@]}"\nfor s in "${servers[@]}"; do echo "जाँच: $s"; done   # quotes ज़रूरी\n\n# --- Function: exit code लौटाता है ---\nhost_up() {\n  local host="$1"\n  ping -c1 -W2 "$host" > /dev/null 2>&1\n}\nif host_up 127.0.0.1; then echo "localhost चालू"; fi\n\n# --- Function: मान लौटाना (echo + command substitution) ---\nfile_size() {\n  local f="$1"\n  [[ -f "$f" ]] || return 1\n  stat -c%s "$f"\n}\nsz=$(file_size /etc/passwd) && echo "/etc/passwd = $sz bytes"\n\n# --- local का महत्व ---\ncount=100\nbump() { local count=1; echo "अंदर: $count"; }\nbump\necho "बाहर: $count"      # 100 ही रहेगा\n\n# --- getopts: मानक विकल्प ---\nusage() { echo "उपयोग: $0 [-d directory] [-n days] [-v]"; exit 1; }\ndir="/var/log"; days=7; verbose=0\nwhile getopts ":d:n:vh" opt; do\n  case "$opt" in\n    d) dir="$OPTARG" ;;\n    n) days="$OPTARG" ;;\n    v) verbose=1 ;;\n    h) usage ;;\n    \\?) echo "अज्ञात विकल्प: -$OPTARG" >&2; usage ;;\n    :)  echo "-$OPTARG के साथ मान चाहिए" >&2; usage ;;\n  esac\ndone\nshift $(( OPTIND - 1 ))     # बचे हुए positional तर्क\n(( verbose )) && echo "dir=$dir days=$days बाक़ी=$*"\n\n# --- here-document: कई पंक्तियाँ एक साथ ---\ncat <<EOF\nरिपोर्ट — $(date +%F)\nहोस्ट: $(hostname)\nजगह:  $(df -h / | awk \'NR==2 {print $5}\')\nEOF\n\n# variable expansion रोकना हो तो delimiter उद्धृत करें\ncat <<\'EOF\'\nयह $VAR जैसा ही छपेगा, बदलेगा नहीं।\nEOF' },
  { type:'table', head:['Array रूप','अर्थ'], rows:[
    ['arr=(a b c)','बनाना'],
    ['arr+=(d)','अंत में जोड़ना'],
    ['${arr[0]}','पहला तत्व (index 0 से)'],
    ['${arr[@]}','सब तत्व — हमेशा "${arr[@]}" लिखें'],
    ['${#arr[@]}','तत्वों की गिनती'],
    ['${!arr[@]}','सब index'],
    ['${arr[@]:1:2}','slice — index 1 से 2 तत्व'],
    ['unset arr[1]','एक तत्व हटाना'],
    ['declare -A map','associative array (key→value), bash 4+'],
    ['map[cpu]=4; ${map[cpu]}','नाम से मान'],
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.6</span> भरोसेमंद स्क्रिप्ट की रीढ़ — set, trap, logging</h3><p>पेशेवर और शौक़िया स्क्रिप्ट का फ़र्क़ यहीं है। डिफ़ॉल्ट रूप से bash <b>त्रुटि पर चलता रहता है</b> — कोई कमांड असफल हुई तो अगली पंक्ति चल पड़ती है, जो विनाशकारी हो सकती है (सोचें: <code>cd /कुछ-नहीं</code> असफल, फिर <code>rm -rf *</code> ग़लत जगह)। <code>set -euo pipefail</code> इस व्यवहार को पलट देता है।</p>' },
  { type:'table', head:['विकल्प','क्या करता है','सावधानी'], rows:[
    ['set -e (errexit)','कोई कमांड असफल हो तो स्क्रिप्ट रुक जाए','if/&&/|| में जाँची गई त्रुटि नहीं रोकती — यही सही है'],
    ['set -u (nounset)','अपरिभाषित चर पर रुक जाए','वैकल्पिक चर के लिए ${var:-} लिखें'],
    ['set -o pipefail','pipeline में किसी भी चरण की विफलता पकड़े','बिना इसके केवल अंतिम कमांड का code मिलता है'],
    ['set -x','हर कमांड छापकर चलाए (debug)','पासवर्ड छप सकते हैं — सावधान'],
    ['set -E','trap ERR functions/subshell में भी लागू','trap के साथ उपयोगी'],
    ['trap … EXIT','स्क्रिप्ट किसी भी तरह बंद हो तो सफ़ाई','अस्थायी फ़ाइल हटाने का सही स्थान'],
    ['trap … INT TERM','Ctrl+C / kill पर सफ़ाई','लंबे काम में ज़रूरी'],
    ['mktemp','सुरक्षित अस्थायी फ़ाइल/folder','नाम का अनुमान नहीं लगाया जा सकता'],
    ['flock','एक समय में एक ही प्रति चले','cron में दोहराव रोकता है'],
    ['logger','syslog/journal में संदेश भेजना','केंद्रीय log के लिए'],
  ] },
  { type:'code', code: '#!/usr/bin/env bash\n# === भरोसेमंद स्क्रिप्ट का ढाँचा (हर स्क्रिप्ट में यही ऊपर रखें) ===\nset -Eeuo pipefail\n\nSCRIPT_NAME="$(basename "$0")"\nTMPDIR_RUN="$(mktemp -d)"\nLOCKFILE="/tmp/${SCRIPT_NAME}.lock"\n\ncleanup() {\n  local rc=$?\n  rm -rf -- "$TMPDIR_RUN"\n  exit "$rc"\n}\ntrap cleanup EXIT\ntrap \'echo "रद्द किया गया" >&2; exit 130\' INT TERM\ntrap \'echo "त्रुटि: पंक्ति $LINENO पर कमांड असफल (code $?)" >&2\' ERR\n\nlog() { printf \'[%s] %s\\n\' "$(date +%FT%T)" "$*" | tee -a "/var/tmp/${SCRIPT_NAME}.log"; }\n\n# एक ही प्रति चले (cron के लिए)\nexec 9>"$LOCKFILE"\nflock -n 9 || { log "पहले से चल रही है — छोड़ रहे"; exit 0; }\n\nlog "शुरू: $SCRIPT_NAME"\n# ... असली काम यहाँ ...\nlog "पूरा हुआ"' },
  { type:'callout', kind:'danger', title:'rm और cd का जानलेवा जोड़', html:'<p>कभी न लिखें: <code>cd "$dir"; rm -rf *</code> — cd असफल हुआ तो rm वर्तमान folder में चलेगा। सही रूप: <code>cd "$dir" || exit 1</code> और <code>rm -rf -- "${dir:?dir खाली है}"/*</code>। चर खाली होने पर <code>${dir:?}</code> स्क्रिप्ट रोक देगा। इसी तरह <code>rm -rf $dir/</code> में dir खाली हो तो यह <code>rm -rf /</code> बन जाता है — <b>हमेशा quotes और :? जाँच</b>।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.7</span> Debugging — bash -x, shellcheck और log</h3><p>स्क्रिप्ट काम न करे तो अनुमान न लगाएँ — तीन औज़ार हैं जो असली कारण दिखा देते हैं।</p>' },
  { type:'table', head:['औज़ार / तरीक़ा','क्या दिखाता है','कैसे'], rows:[
    ['bash -n script.sh','केवल syntax जाँच (चलाता नहीं)','पहली जाँच, हमेशा सुरक्षित'],
    ['bash -x script.sh','हर कमांड विस्तार के बाद छपकर चलती है','सबसे उपयोगी — + चिह्न वाली पंक्तियाँ'],
    ['set -x … set +x','केवल संदिग्ध हिस्से का trace','स्क्रिप्ट के अंदर'],
    ['PS4','trace का prefix बदलना','export PS4=\'+ ${LINENO}: \' → पंक्ति संख्या भी'],
    ['shellcheck','सामान्य ग़लतियाँ, quoting, subshell bug','shellcheck script.sh — हर स्क्रिप्ट पर चलाएँ'],
    ['bash -v','कच्ची पंक्तियाँ भी छापे',' कभी-कभार; -x के साथ'],
    ['trap … ERR','किस पंक्ति पर असफल हुई','ऊपर का ढाँचा'],
    ['tee से log','screen और file दोनों','command 2>&1 | tee run.log'],
    ['time','कितना समय लगा','time ./script.sh'],
    ['strace -f','कौन-सी system call अटकी','गहरी समस्या में'],
  ] },
  { type:'code', code: '# syntax जाँच — कुछ भी नहीं चलेगा\nbash -n backup.sh\n\n# पूरा trace\nbash -x backup.sh 2> trace.log\n\n# पंक्ति संख्या सहित trace\nPS4=\'+ ${BASH_SOURCE}:${LINENO}: \' bash -x backup.sh\n\n# केवल एक हिस्सा ट्रेस करना\nset -x\nrsync -a "$src/" "$dst/"\nset +x\n\n# shellcheck — सबसे किफ़ायती सुधार\nsudo apt install shellcheck        # Debian/Ubuntu\nshellcheck backup.sh\n#   SC2086: Double quote to prevent globbing and word splitting\n#   SC2046: Quote this to prevent word splitting\n#   SC2164: Use cd ... || exit in case cd fails\n# किसी चेतावनी को जान-बूझकर छोड़ना हो तो:\n# shellcheck disable=SC2086\n\n# पूरा run का log\n./backup.sh 2>&1 | tee -a /var/tmp/backup-run.log\necho "exit = ${PIPESTATUS[0]}"     # pipeline के पहले चरण का code' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.8</span> पाँच पूरी, चलने लायक स्क्रिप्ट</h3><p>नीचे की हर स्क्रिप्ट पूरी है — copy करके, नाम देकर, <code>chmod +x</code> करके चला सकते हैं। पहले उन्हें अभ्यास मशीन/VM पर आज़माएँ और हर पंक्ति समझें; उसके बाद ही असली सिस्टम पर लगाएँ।</p>' },
  { type:'html', html:'<h4 class="blk2">स्क्रिप्ट 1 — तारीख़-सहित backup, पुराने अपने आप हटना</h4><p>यह <code>tar.gz</code> बनाता है, उसकी जाँच करता है, checksum लिखता है और तय दिनों से पुराने backup हटाता है।</p>' },
  { type:'code', code: '#!/usr/bin/env bash\n# backup.sh — उपयोग: ./backup.sh /home/student /backup 14\nset -Eeuo pipefail\n\nSRC="${1:?स्रोत folder दें}"\nDST="${2:?backup folder दें}"\nKEEP="${3:-14}"\n\n[[ -d "$SRC" ]] || { echo "स्रोत नहीं मिला: $SRC" >&2; exit 1; }\nmkdir -p -- "$DST"\n\nSTAMP="$(date +%Y%m%d-%H%M%S)"\nNAME="$(basename "$SRC")-$STAMP.tar.gz"\nARCHIVE="$DST/$NAME"\n\necho "backup बन रहा: $ARCHIVE"\ntar -czf "$ARCHIVE" -C "$(dirname "$SRC")" "$(basename "$SRC")"\n\n# जाँच — archive सचमुच पढ़ा जा सकता है?\ntar -tzf "$ARCHIVE" > /dev/null\n( cd "$DST" && sha256sum "$NAME" > "$NAME.sha256" )\n\nSIZE="$(du -h "$ARCHIVE" | cut -f1)"\necho "सफल: $NAME ($SIZE)"\n\n# पुराने हटाएँ (सिर्फ़ इसी नाम-शैली के)\nfind "$DST" -maxdepth 1 -name "$(basename "$SRC")-*.tar.gz*" -mtime "+$KEEP" -print -delete\necho "सफ़ाई पूरी ($KEEP दिन से पुराने हटाए)"' },
  { type:'html', html:'<h4 class="blk2">स्क्रिप्ट 2 — डिस्क-जगह अलर्ट</h4><p>हर mounted फ़ाइल-सिस्टम की भरावट जाँचता है और सीमा पार होने पर चेतावनी देता है। cron में हर घंटे लगाने लायक।</p>' },
  { type:'code', code: '#!/usr/bin/env bash\n# disk-alert.sh — उपयोग: ./disk-alert.sh 85\nset -Eeuo pipefail\nLIMIT="${1:-85}"\nALERT=0\n\nwhile read -r fs size used avail pct mount; do\n  [[ "$fs" == tmpfs || "$fs" == devtmpfs || "$fs" == overlay ]] && continue\n  use="${pct%\\%}"\n  [[ "$use" =~ ^[0-9]+$ ]] || continue\n  if (( use >= LIMIT )); then\n    printf "चेतावनी: %-20s %3s%% भरा  (खाली %s)  %s\\n" "$mount" "$use" "$avail" "$fs"\n    logger -t disk-alert "$mount ${use}% भरा"\n    ALERT=1\n  fi\ndone < <(df -P -h | tail -n +2)\n\nif (( ALERT == 0 )); then echo "सब ठीक — कोई volume ${LIMIT}% से ऊपर नहीं"; fi\nexit "$ALERT"' },
  { type:'html', html:'<h4 class="blk2">स्क्रिप्ट 3 — सेवा चालू है या नहीं, न हो तो चालू करना</h4><p>systemd सेवा की स्थिति जाँचकर ज़रूरत पर restart करता है और हर स्थिति journal में लिखता है।</p>' },
  { type:'code', code: '#!/usr/bin/env bash\n# service-watch.sh — उपयोग: sudo ./service-watch.sh nginx ssh\nset -Eeuo pipefail\n(( $# > 0 )) || { echo "उपयोग: $0 सेवा1 [सेवा2 …]"; exit 1; }\n\nfor svc in "$@"; do\n  if systemctl is-active --quiet "$svc"; then\n    echo "ठीक: $svc चल रही है"\n    continue\n  fi\n  echo "रुकी हुई: $svc — restart कर रहे"\n  logger -t service-watch "$svc निष्क्रिय मिली, restart"\n  if systemctl restart "$svc"; then\n    sleep 2\n    if systemctl is-active --quiet "$svc"; then\n      echo "सफल: $svc दोबारा चालू"\n    else\n      echo "असफल: $svc — journal देखें" >&2\n      journalctl -u "$svc" -n 20 --no-pager >&2\n    fi\n  else\n    echo "restart आदेश असफल: $svc" >&2\n  fi\ndone' },
  { type:'html', html:'<h4 class="blk2">स्क्रिप्ट 4 — CSV से थोक में उपयोगकर्ता बनाना</h4><p>लैब में 40 छात्रों के खाते एक झटके में। CSV का प्रारूप: <code>username,fullname,group</code>।</p>' },
  { type:'code', code: '#!/usr/bin/env bash\n# bulk-users.sh — उपयोग: sudo ./bulk-users.sh students.csv\nset -Eeuo pipefail\nCSV="${1:?CSV फ़ाइल दें}"\n[[ $EUID -eq 0 ]] || { echo "root चाहिए (sudo)" >&2; exit 1; }\n[[ -f "$CSV" ]] || { echo "फ़ाइल नहीं मिली: $CSV" >&2; exit 1; }\n\nmade=0; skipped=0\nwhile IFS=, read -r user full grp; do\n  # header और खाली/comment पंक्तियाँ छोड़ें\n  [[ -z "${user// /}" || "$user" == \\#* || "$user" == username ]] && continue\n  if id "$user" &>/dev/null; then\n    echo "पहले से मौजूद: $user"; (( skipped++ )); continue\n  fi\n  [[ -n "$grp" ]] && ! getent group "$grp" >/dev/null && groupadd "$grp"\n  useradd -m -s /bin/bash -c "$full" ${grp:+-g "$grp"} "$user"\n  # पहली बार लॉगिन पर पासवर्ड बदलना अनिवार्य\n  pass="$(openssl rand -base64 9)"\n  printf \'%s:%s\\n\' "$user" "$pass" | chpasswd\n  chage -d 0 "$user"\n  printf \'%s,%s\\n\' "$user" "$pass" >> new-accounts.csv\n  echo "बना: $user"; (( made++ ))\ndone < "$CSV"\n\nchmod 600 new-accounts.csv 2>/dev/null || true\necho "बने: $made, छोड़े: $skipped — पासवर्ड new-accounts.csv में (सुरक्षित रखें, फिर मिटाएँ)"' },
  { type:'html', html:'<h4 class="blk2">स्क्रिप्ट 5 — पुराने log सिकोड़ना और सीमा से बड़े हटाना</h4><p>logrotate का सरल हाथ-से बनाया रूप — समझने के लिए बहुत अच्छा।</p>' },
  { type:'code', code: '#!/usr/bin/env bash\n# log-tidy.sh — उपयोग: ./log-tidy.sh /var/log/myapp 7 100\nset -Eeuo pipefail\nDIR="${1:?log folder दें}"\nDAYS="${2:-7}"\nMAXMB="${3:-100}"\n[[ -d "$DIR" ]] || { echo "folder नहीं: $DIR" >&2; exit 1; }\n\n# 1) तय दिनों से पुराने .log को gzip करें (पहले से .gz को छोड़ें)\nfind "$DIR" -type f -name "*.log" -mtime "+$DAYS" -print0 |\n  while IFS= read -r -d "" f; do\n    echo "सिकोड़ रहे: $f"\n    gzip -9 -- "$f"\n  done\n\n# 2) MAXMB से बड़ी .gz हटाएँ (सबसे पुरानी पहले)\nfind "$DIR" -type f -name "*.gz" -size +"${MAXMB}M" -printf \'%T@ %p\\0\' |\n  sort -z -n | cut -z -d\' \' -f2- |\n  while IFS= read -r -d "" f; do\n    echo "बहुत बड़ी, हटा रहे: $f"\n    rm -f -- "$f"\n  done\n\n# 3) सारांश\necho "अब कुल आकार: $(du -sh "$DIR" | cut -f1)"' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.9</span> अपने आप चलाना — cron और systemd timer</h3><p>स्क्रिप्ट लिख लेने के बाद अंतिम कदम है उसे समय पर चलाना। <b>cron</b> सरल और हर जगह है; <b>systemd timer</b> आधुनिक है और log, dependency व छूटे हुए run सँभालने में बेहतर।</p>' },
  { type:'table', head:['cron खेत','मान','उदाहरण'], rows:[
    ['मिनट','0–59','30 = हर घंटे के 30वें मिनट'],
    ['घंटा','0–23','2 = रात 2 बजे'],
    ['दिन (महीने का)','1–31','1 = महीने की पहली तारीख़'],
    ['महीना','1–12','*/3 = हर तीसरे महीने'],
    ['सप्ताह का दिन','0–7 (0 व 7 = रवि)','1-5 = सोम–शुक्र'],
    ['*','हर मान','* * * * * = हर मिनट'],
    ['*/15','हर 15वाँ','*/15 * * * * = हर 15 मिनट'],
    [',','सूची','0 8,20 * * * = सुबह 8 व रात 8'],
    ['-','श्रेणी','0 9-17 * * 1-5 = दफ़्तर के घंटे'],
    ['@reboot / @daily / @hourly','छोटे नाम','@daily = 0 0 * * *'],
  ] },
  { type:'code', code: '# --- cron ---\ncrontab -e            # अपनी crontab\n crontab -l           # देखें\n# उदाहरण पंक्तियाँ:\n# 30 2 * * *   /home/student/bin/backup.sh /home/student /backup 14 >> /var/tmp/backup.log 2>&1\n# 0  * * * *   /home/student/bin/disk-alert.sh 85\n# */5 * * * *  /home/student/bin/service-watch.sh nginx\n\n# cron का माहौल बहुत छोटा होता है — पूरा पथ और PATH दें\n# PATH=/usr/local/bin:/usr/bin:/bin\n# SHELL=/bin/bash\n# MAILTO=admin@example.com\n\n# सिस्टम-स्तर: /etc/cron.d/myjob में वही पंक्ति + उपयोगकर्ता का स्तंभ\n# 30 2 * * * root /usr/local/bin/backup.sh ...\n\n# --- systemd timer (आधुनिक) ---\n# /etc/systemd/system/backup.service\n# [Unit]\n# Description=Nightly backup\n# [Service]\n# Type=oneshot\n# ExecStart=/usr/local/bin/backup.sh /home /backup 14\n\n# /etc/systemd/system/backup.timer\n# [Unit]\n# Description=Run backup nightly\n# [Timer]\n# OnCalendar=*-*-* 02:30:00\n# Persistent=true          # मशीन बंद थी तो चालू होते ही चलाए\n# [Install]\n# WantedBy=timers.target\n\nsudo systemctl daemon-reload\nsudo systemctl enable --now backup.timer\nsystemctl list-timers --all\njournalctl -u backup.service -n 50' },
  { type:'callout', kind:'warn', title:'cron में स्क्रिप्ट हाथ से चलती है, cron से नहीं — पाँच कारण', html:'<p>1) <b>PATH अलग</b> — cron का PATH बहुत छोटा है; हर कमांड का पूरा पथ दें या ऊपर PATH सेट करें। 2) <b>कार्य-folder अलग</b> — cron home से चलाता है; स्क्रिप्ट में <code>cd</code> पूरा पथ से करें। 3) <b>अनुमति</b> — <code>chmod +x</code> और सही मालिक। 4) <b>output कहीं नहीं जाता</b> — <code>&gt;&gt; log 2&gt;&amp;1</code> लगाएँ वरना त्रुटि दिखेगी ही नहीं। 5) <b>% का विशेष अर्थ</b> — crontab में <code>%</code> नई पंक्ति माना जाता है; <code>date +\\%F</code> लिखें।</p>' },

  { type:'callout', kind:'exam', title:'परीक्षा/इंटरव्यू में यहाँ से प्रश्न', html:'<p>shebang का काम, chmod +x, <code>"$var"</code> क्यों ज़रूरी, <code>$?</code>/<code>$#</code>/<code>$@</code> का अर्थ, exit code 0 का मतलब, <code>[ ]</code> बनाम <code>[[ ]]</code>, <code>set -euo pipefail</code> के तीनों का काम, cron के पाँच खेत और एक व्यंजक पढ़ना, <code>2&gt;&amp;1</code> का अर्थ, और <code>$( )</code> बनाम backtick — ये सबसे बार-बार पूछे जाते हैं। प्रैक्टिकल में backup स्क्रिप्ट और cron पंक्ति लिखवाना लगभग तय है।</p>' },

  { type:'labs', items:[
    { n:90, title:'पहली स्क्रिप्ट — shebang, अनुमति और PATH', aim:'स्क्रिप्ट बनाने से लेकर कहीं से भी चलाने तक का पूरा चक्र।', tools:['लिनक्स VM', 'nano/vim', 'Terminal'], steps:['~/bin folder बनाएँ; उसमें hello.sh लिखें जिसमें shebang, आपका नाम और date छपे।', 'बिना chmod के ./hello.sh चलाएँ — त्रुटि लिखें; फिर chmod +x करके चलाएँ।', 'bash hello.sh से भी चलाकर दिखाएँ कि अनुमति के बिना भी चलती है।', 'echo $PATH देखें; ~/bin को PATH में जोड़कर केवल hello टाइप करके चलाएँ।', 'जान-बूझकर file को CRLF में बदलकर (unix2dos) चलाएँ; “bad interpreter” त्रुटि लिखें और dos2unix से ठीक करें।', 'bash -n और file दोनों से अपनी स्क्रिप्ट जाँचें।'], result:'चलती hello स्क्रिप्ट, दर्ज की गई दो त्रुटियाँ और उनके हल।' },
    { n:91, title:'Quoting का प्रयोग — टूटता और बचता नाम', aim:'"$var" के बिना होने वाला नुक़सान अपने हाथ से देखना।', tools:['लिनक्स VM', '/tmp में अभ्यास folder'], steps:['/tmp/qtest बनाएँ; उसमें "मेरी फ़ाइल.txt" और "दूसरी फ़ाइल.txt" जैसी स्पेस वाली फ़ाइलें बनाएँ।', 'चर f="मेरी फ़ाइल.txt" रखकर rm $f चलाएँ — त्रुटि/असर लिखें; फिर rm "$f" से सही मिटाएँ।', 'files="*" रखकर echo $files और echo "$files" का अंतर लिखें।', '${f##*/}, ${f%.*}, ${#f} तीनों के परिणाम लिखें।', '${VAR:-default} और ${VAR:?संदेश} दोनों आज़माएँ और व्यवहार नोट करें।', 'निष्कर्ष में तीन नियम लिखें जो आप हर स्क्रिप्ट में मानेंगे।'], result:'quoting के चार प्रयोगों के पहले/बाद परिणाम और लिखित नियम-सूची।' },
    { n:92, title:'शर्त और loop — /etc/passwd से रिपोर्ट', aim:'if, case और while-read से असली डाटा पर काम करना।', tools:['लिनक्स VM', '/etc/passwd', 'awk'], steps:['स्क्रिप्ट लिखें जो तर्क में एक UID सीमा ले (default 1000)।', 'while IFS=: read से /etc/passwd पढ़कर उस सीमा से ऊपर वाले उपयोगकर्ता छापें।', 'हर उपयोगकर्ता के shell पर case लगाएँ — /bin/bash वालों को “पूरा”, nologin वालों को “सेवा खाता” लिखें।', 'गिनती करें और अंत में कुल संख्या छापें (ध्यान: pipeline subshell की समस्या से बचें)।', 'तर्क न देने पर usage दिखाकर exit 1 करें।', 'shellcheck चलाएँ और उसकी हर चेतावनी सुधारें।'], result:'चलती रिपोर्ट-स्क्रिप्ट, उसका आउटपुट और शून्य shellcheck चेतावनी।' },
    { n:93, title:'Backup स्क्रिप्ट लिखकर cron में लगाना', aim:'पूरी backup स्क्रिप्ट बनाकर उसे स्वतः चलाना।', tools:['लिनक्स VM', 'tar', 'crontab', 'अभ्यास folder'], steps:['ऊपर दी backup.sh अपने हाथ से टाइप करें (copy नहीं) और set -Eeuo pipefail का अर्थ हर पंक्ति पर लिखें।', 'एक छोटे folder का backup लेकर tar -tzf से जाँचें और sha256sum -c से मिलान करें।', 'KEEP=0 देकर पुराने हटने की प्रक्रिया जाँचें (केवल अभ्यास folder पर)।', 'crontab -e में हर 5 मिनट वाली पंक्ति लगाएँ, output log में भेजें।', 'दो run के बाद log और बने archives दिखाएँ; फिर cron पंक्ति हटाएँ।', 'जान-बूझकर ग़लत स्रोत देकर देखें कि स्क्रिप्ट सुरक्षित रुकती है।'], result:'दो स्वतः बने सत्यापित archives, cron log और असफल-स्रोत पर सुरक्षित रुकाव।' },
    { n:94, title:'Debugging — टूटी स्क्रिप्ट को bash -x और shellcheck से ठीक करना', aim:'दूसरे की ग़लत स्क्रिप्ट पढ़कर दोष ढूँढ़ना।', tools:['लिनक्स VM', 'shellcheck', 'शिक्षक की दी टूटी स्क्रिप्ट'], steps:['शिक्षक से 5 जान-बूझकर ग़लतियाँ वाली स्क्रिप्ट लें (unquoted var, cd बिना ||, read बिना -r, $10, pipeline गिनती)।', 'पहले bash -n चलाएँ — कौन-सी ग़लती syntax से पकड़ी गई, लिखें।', 'shellcheck चलाएँ और हर SC कोड का अर्थ लिखें।', 'bash -x चलाकर ट्रेस में वह पंक्ति ढूँढ़ें जहाँ मान बिगड़ा।', 'पाँचों ग़लतियाँ सुधारें; दोबारा shellcheck शून्य चेतावनी दिखाएँ।', 'हर सुधार के पहले/बाद का अंतर एक तालिका में लिखें।'], result:'पाँच दोषों की पहचान, SC कोड सहित, और सुधरी स्क्रिप्ट का साफ़ shellcheck।' },
    { n:95, title:'systemd timer बनाकर cron का आधुनिक विकल्प चलाना', aim:'service + timer इकाइयाँ लिखकर अनुसूचित काम कराना।', tools:['लिनक्स VM (systemd)', 'sudo', 'journalctl'], steps:['disk-alert.sh को /usr/local/bin में रखें और chmod 755 करें।', '/etc/systemd/system/disk-alert.service लिखें — Type=oneshot, ExecStart पूरा पथ।', 'disk-alert.timer लिखें — OnBootSec=2min, OnUnitActiveSec=15min, Persistent=true।', 'daemon-reload करके enable --now करें; systemctl list-timers में दिखाएँ।', 'journalctl -u disk-alert.service से दो run का log निकालें।', 'वही काम cron में भी लगाकर दोनों के log/सुविधा की तुलना एक पन्ने में लिखें।'], result:'चलता timer, list-timers का सबूत, journal के दो run और cron से तुलना।' },
  ] },

  { type:'acc', title:'Bash scripting — 14 आम प्रश्न', items:[
    { q:'#!/bin/bash और #!/usr/bin/env bash में क्या फ़र्क़ है?', a:'पहला सीधा /bin/bash चलाता है; दूसरा PATH में bash ढूँढ़ता है। macOS/BSD या कस्टम इंस्टॉल में bash /bin में नहीं होता, इसलिए env वाला रूप अधिक portable है। पर env का जोखिम यह है कि PATH में कोई दुर्भावनापूर्ण bash पहले आ जाए — सुरक्षा-संवेदनशील सिस्टम पर निश्चित पथ बेहतर।' },
    { q:'चर को हमेशा "$var" क्यों लिखें?', a:'बिना अवतरण bash दो काम करता है — word splitting (स्पेस पर तोड़कर कई तर्क) और globbing (*, ? को फ़ाइलों से बदलना)। "मेरी फ़ाइल.txt" एक तर्क की जगह दो बन जाएगा और rm ग़लत फ़ाइलें मिटा सकता है। "$var" पूरा मान एक ही तर्क रखता है।' },
    { q:'$? क्या है और if उसे कैसे इस्तेमाल करता है?', a:'$? पिछले कमांड का exit code है — 0 सफल, बाक़ी असफल। if कोई boolean नहीं देखता; वह शर्त वाली कमांड चलाकर उसका exit code देखता है। 0 आया तो then, नहीं तो else। इसीलिए if grep -q pattern file सीधे काम करता है।' },
    { q:'set -e, -u और -o pipefail — तीनों क्यों?', a:'-e: कोई कमांड असफल हो तो रुको (आगे विनाश न हो)। -u: अनजान चर इस्तेमाल हो तो रुको (टाइपो से खाली मान न फैले)। pipefail: pipeline के किसी भी चरण की विफलता पकड़ो, केवल अंतिम की नहीं। तीनों मिलकर स्क्रिप्ट को “चुपचाप ग़लत” होने से बचाते हैं।' },
    { q:'set -e के बावजूद कुछ त्रुटियाँ क्यों नहीं रोकतीं?', a:'जिस कमांड की त्रुटि पहले से जाँची जा रही है — if की शर्त, && या || के बाईं ओर, या ! के साथ — वहाँ -e नहीं रोकता, क्योंकि आप ख़ुद उसका परिणाम देख रहे हैं। यह सही व्यवहार है। पर command substitution और कुछ subshell मामलों में सावधानी चाहिए; महत्वपूर्ण जाँच स्पष्ट if से करें।' },
    { q:'$(command) और backtick में क्या चुनें?', a:'हमेशा $(command)। यह पढ़ने में साफ़ है, आसानी से नेस्ट होता है — $(dirname "$(readlink -f "$0")") — और इसमें escaping का झंझट कम है। backtick पुराना रूप है जिसमें नेस्ट करने पर \\ लगाने पड़ते हैं।' },
    { q:'pipeline के बाद मेरा चर खाली क्यों हो जाता है?', a:'क्योंकि pipeline का हर भाग अलग subshell में चलता है। cat file | while read …; do n=$((n+1)); done में n उस subshell का था, ख़त्म होते ही मिट गया। हल: done < file, या done < <(cmd) — process substitution से while मुख्य shell में चलता है।' },
    { q:'स्पेस वाले फ़ाइल-नामों पर loop कैसे सुरक्षित लगाएँ?', a:'तीन सुरक्षित तरीक़े — glob: for f in *.txt; do … "$f" …; done; या find … -print0 | while IFS= read -r -d "" f; do …; done; या find … -exec command {} +. कभी for f in $(ls) न लिखें — वह स्पेस पर नाम तोड़ देता है।' },
    { q:'function मान कैसे लौटाए?', a:'bash में return केवल 0–255 exit code के लिए है। मान लौटाने के लिए function उसे echo/printf से छापे और caller उसे result=$(myfunc arg) में पकड़े। कई मान चाहिए तो global/associative array या अलग-अलग पंक्तियाँ छापकर पढ़ें। अंदर के चर हमेशा local घोषित करें।' },
    { q:'2>&1 का क्या अर्थ है और क्रम क्यों मायने रखता है?', a:'2 = stderr, 1 = stdout, > = भेजना। 2>&1 का अर्थ “stderr को वहाँ भेजो जहाँ stdout अभी जा रहा है”। command > log 2>&1 सही है (पहले stdout log पर, फिर stderr उसी पर)। command 2>&1 > log ग़लत है — तब stderr पुरानी screen पर ही जाएगा।' },
    { q:'cron में स्क्रिप्ट नहीं चलती, हाथ से चलती है — क्या जाँचें?', a:'PATH (cron का बहुत छोटा है — पूरा पथ दें), कार्य-folder (cd पूरा पथ से), चलाने की अनुमति, output redirection (>> log 2>&1 लगाएँ वरना त्रुटि छिपी रहेगी), और crontab में % का escape (\\%). साथ ही सही उपयोगकर्ता की crontab में पंक्ति है या नहीं — यह भी देखें।' },
    { q:'cron और systemd timer में आज क्या चुनें?', a:'साधारण, पुराने सिस्टम या एक-पंक्ति काम के लिए cron ठीक है। नए सिस्टम पर timer बेहतर — Persistent=true से छूटा run पकड़ता है, journalctl में पूरा log मिलता है, dependency और resource सीमा लगा सकते हैं, और RandomizedDelaySec से एक साथ भीड़ नहीं लगती।' },
    { q:'shellcheck क्या है और क्यों ज़रूरी है?', a:'यह shell स्क्रिप्ट का static analyser है — बिना चलाए quoting, subshell, cd, array और सैकड़ों आम ग़लतियाँ पकड़ता है और हर एक का SC कोड व सुझाव देता है। हर स्क्रिप्ट को चलाने से पहले एक बार shellcheck करना पेशेवर आदत है; इससे घंटों की debugging बचती है।' },
    { q:'स्क्रिप्ट में पासवर्ड/secret कैसे रखें?', a:'कभी स्क्रिप्ट में सीधे न लिखें। अलग फ़ाइल में रखें जिसकी अनुमति 600 हो और मालिक सीमित; या environment/secret manager से पढ़ें। set -x लगाने पर वे छप सकते हैं, इसलिए trace से पहले उन्हें हटाएँ या set +x करें। git में भी वे फ़ाइलें कभी न जाएँ (.gitignore)।' },
  ] },

  { type:'quiz', store:'lin-script', items:[
    { q:'shebang (#!) का काम क्या है?', o:['स्क्रिप्ट को comment करना','kernel को बताना कि कौन-सा interpreter चलाए','फ़ाइल को executable बनाना','पासवर्ड छिपाना'], a:1, ex:'पहली पंक्ति का #!/usr/bin/env bash kernel को interpreter का पथ देती है। अनुमति अलग से chmod +x से मिलती है।' },
    { q:'स्क्रिप्ट चलाने के लिए कौन-सी अनुमति चाहिए?', o:['पढ़ने की','लिखने की','execute (chmod +x)','कोई नहीं'], a:2, ex:'./script.sh के लिए execute बिट चाहिए। bash script.sh से केवल read से भी चल जाती है क्योंकि interpreter उसे पढ़ता है।' },
    { q:'bash में चर बनाने का सही रूप?', o:['name = "ram"','name="ram"','$name="ram"','set name "ram"'], a:1, ex:'= के दोनों ओर स्पेस नहीं होता। name = "ram" को bash कमांड समझकर त्रुटि देगा।' },
    { q:'"$var" लिखने का मुख्य कारण?', o:['सुंदर दिखना','word splitting और globbing से बचाव','गति बढ़ाना','रंग जोड़ना'], a:1, ex:'बिना quotes मान स्पेस पर टूटकर कई तर्क बन जाता है और * फ़ाइलों से बदल जाता है — यही सबसे आम विनाशकारी bug है।' },
    { q:'$? में क्या रहता है?', o:['स्क्रिप्ट का नाम','पिछले कमांड का exit code','तर्कों की संख्या','PID'], a:1, ex:'0 = सफल, 1–255 = असफल। if इसी को देखता है, कोई boolean नहीं।' },
    { q:'$# और $@ में फ़र्क़?', o:['दोनों समान','$# = तर्कों की गिनती, $@ = सारे तर्क','$# = पहला तर्क, $@ = आख़िरी','$# = PID, $@ = नाम'], a:1, ex:'$# संख्या है; "$@" सारे तर्क अलग-अलग सुरक्षित रूप में देता है — for f in "$@" इसीलिए सही है।' },
    { q:'सफल कमांड का exit code क्या होता है?', o:['1','0','-1','100'], a:1, ex:'लिनक्स में 0 = सफल। यह सामान्य प्रोग्रामिंग के उल्टा लगता है, पर shell-तर्क इसी पर बना है।' },
    { q:'[ ] और [[ ]] में कौन-सा कथन सही है?', o:['दोनों हर shell में चलते हैं','[[ ]] bash-विशिष्ट है और उसमें pattern/regex व && चलते हैं','[ ] ज़्यादा शक्तिशाली है','[[ ]] POSIX है'], a:1, ex:'[ ] POSIX है और हर shell में चलता है। [[ ]] bash/ksh/zsh का है — splitting नहीं, pattern matching और =~ regex मिलता है।' },
    { q:'फ़ाइल मौजूद और साधारण है — यह जाँचने वाला विकल्प?', o:['-d','-e','-f','-s'], a:2, ex:'-f = regular file. -e केवल मौजूद होना, -d directory, -s मौजूद और खाली नहीं।' },
    { q:'संख्या की तुलना के लिए सही operator?', o:['==','-eq','>','='], a:1, ex:'[ ] में संख्या के लिए -eq -ne -lt -le -gt -ge; string के लिए = या !=. (( )) में सामान्य > < चलते हैं।' },
    { q:'set -o pipefail क्या करता है?', o:['pipeline बंद करता है','pipeline के किसी भी चरण की विफलता को exit code बनाता है','output रोकता है','stderr हटाता है'], a:1, ex:'डिफ़ॉल्ट में pipeline का code अंतिम कमांड का होता है। pipefail से बीच की असफलता भी पकड़ी जाती है — grep … | head जैसे मामलों में ज़रूरी।' },
    { q:'set -u का काम?', o:['उपयोगकर्ता बदलना','अपरिभाषित चर पर स्क्रिप्ट रोकना','unicode चालू करना','undo'], a:1, ex:'टाइपो से बना खाली चर आगे विनाश कर सकता है (rm -rf $dir/ जहाँ dir खाली)। -u उसे पकड़कर रोक देता है।' },
    { q:'${dir:?} का उपयोग क्यों?', o:['रंग के लिए','dir खाली हो तो संदेश के साथ स्क्रिप्ट रोकने के लिए','directory बनाने के लिए','लंबाई नापने'], a:1, ex:'rm -rf "${dir:?}"/* में dir खाली हुआ तो स्क्रिप्ट रुक जाएगी — वरना वह rm -rf /* बन जाता।' },
    { q:'command substitution का अनुशंसित रूप?', o:['`command`','$(command)','&command','{command}'], a:1, ex:'$( ) पढ़ने में साफ़ है और आसानी से नेस्ट होता है। backtick पुराना है और नेस्टिंग में escaping माँगता है।' },
    { q:'2>&1 का अर्थ?', o:['stderr को stdout के वर्तमान लक्ष्य पर भेजना','दोनों बंद करना','stdout को stderr बनाना','फ़ाइल दो बार लिखना'], a:0, ex:'command > log 2>&1 सही क्रम है — पहले stdout log पर, फिर stderr वहीं। उल्टा क्रम stderr को screen पर छोड़ देता है।' },
    { q:'cat file | while read …; done के बाद गिनती खाली क्यों मिलती है?', o:['read ग़लत है','while pipeline के subshell में चला, चर वहीं मिट गया','cat ने मिटा दिया','bash का bug'], a:1, ex:'हल: done < file या done < <(cmd) — तब while मुख्य shell में चलता है और चर बचा रहता है।' },
    { q:'स्पेस वाले फ़ाइल-नामों पर सुरक्षित loop?', o:['for f in $(ls)','for f in *.txt; do … "$f" …; done','for f in `find .`','while read f; do …; done < <(ls)'], a:1, ex:'glob सुरक्षित है। सबसे मज़बूत है find -print0 | while IFS= read -r -d "" f. $(ls) और backtick-find दोनों नाम तोड़ते हैं।' },
    { q:'bash function मान कैसे लौटाता है?', o:['return value से','echo करके, caller $( ) में पकड़ता है','exit से','print से'], a:1, ex:'return केवल 0–255 exit code देता है। मान भेजने के लिए stdout पर छापें और command substitution से पकड़ें; अंदर के चर local रखें।' },
    { q:'"${arr[@]}" में quotes क्यों ज़रूरी हैं?', o:['सुंदरता','हर तत्व एक अलग तर्क बना रहे, स्पेस वाले भी','गति','कुछ नहीं'], a:1, ex:'बिना quotes के जिस तत्व में स्पेस है वह टूट जाएगा। "${arr[@]}" bash का विशेष रूप है जो हर तत्व को अलग संरक्षित रखता है।' },
    { q:'cron में */15 * * * * का अर्थ?', o:['हर 15 घंटे','हर 15 मिनट','15 तारीख़ को','हर दिन 15 बजे'], a:1, ex:'पहला खेत मिनट का है; */15 = हर 15वाँ मिनट (0, 15, 30, 45)।' },
    { q:'cron पंक्ति 30 2 * * 1-5 कब चलेगी?', o:['हर 30 मिनट','सोम–शुक्र रात 2:30 बजे','हर महीने की 2 तारीख़','हर 1-5 मिनट'], a:1, ex:'क्रम: मिनट घंटा दिन महीना सप्ताह-दिन। 30 मिनट, 2 बजे, कोई दिन/महीना, सोम–शुक्र।' },
    { q:'cron में स्क्रिप्ट न चलने का सबसे आम कारण?', o:['bash पुराना','छोटा PATH और अलग कार्य-folder, तथा output redirect न होना','रंग','swap'], a:1, ex:'cron का माहौल न्यूनतम होता है। पूरा पथ दें, cd पूरा पथ से करें, और >> log 2>&1 लगाएँ ताकि त्रुटि दिखे।' },
    { q:'systemd timer में Persistent=true का लाभ?', o:['तेज़ चलना','मशीन बंद थी तो चालू होते ही छूटा run चलाना','log बंद करना','root बनना'], a:1, ex:'लैपटॉप/रात बंद रहने वाली मशीन पर यही कारण है कि cron का काम छूट जाता है; timer उसे पकड़ लेता है।' },
    { q:'किसी स्क्रिप्ट को बिना चलाए उसकी ग़लतियाँ पकड़ने वाला औज़ार?', o:['shellcheck (और bash -n)','top','df','ping'], a:0, ex:'bash -n केवल syntax देखता है; shellcheck quoting, subshell, cd जैसी सैकड़ों अर्थ-संबंधी ग़लतियाँ SC कोड के साथ बताता है।' },
    { q:'bash -x क्या दिखाता है?', o:['केवल त्रुटियाँ','हर कमांड विस्तार के बाद, + चिह्न के साथ','फ़ाइल की अनुमति','इतिहास'], a:1, ex:'trace मोड — चर बदलने के बाद असली कमांड छपती है, जिससे पता चलता है कहाँ मान बिगड़ा। PS4 से पंक्ति संख्या भी जोड़ी जा सकती है।' },
    { q:'rm -rf "$dir"/ में dir खाली हो जाए तो क्या होगा?', o:['कुछ नहीं','यह / पर चल सकता है — इसलिए ${dir:?} जाँच ज़रूरी','स्क्रिप्ट अपने आप रुकेगी','केवल current folder मिटेगा'], a:1, ex:'खाली चर से पथ "/" बन जाता है। इसीलिए set -u और "${dir:?message}" दोनों लगाना पेशेवर आदत है।' },
  ] },
  { type:'pills', items:[
    { text:'#!/usr/bin/env bash + chmod +x', kind:'info' },
    { text:'हमेशा "$var"', kind:'danger' },
    { text:'exit 0 = सफल', kind:'ok' },
    { text:'set -Eeuo pipefail', kind:'exam' },
    { text:'$( ) न कि backtick', kind:'tip' },
    { text:'find -print0 + read -d', kind:'tip' },
    { text:'shellcheck हर बार', kind:'ok' },
    { text:'cron: मिन घं दिन माह सप्ताह', kind:'info' },
  ] },
  ]
},
]);
