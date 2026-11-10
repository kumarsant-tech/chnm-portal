/* Trade Theory · Deep bilingual layer — अध्याय 16–20 */
(function () {
  "use strict";
  var D = (window.TRADE_DEEP = window.TRADE_DEEP || {});

  D[16] = {
    model3d: null,
    fullForms: ["OSI", "PDU", "MAC", "VLAN", "VTP", "STP", "RSTP", "CLI", "IP", "LAN", "WAN", "AP", "PoE", "ACL", "UTP", "SFP"],
    en: {
      title: "Network Devices — From Hub to Firewall, VLAN, STP and Switch CLI",
      subtitle: "Module 16 · Devices, VLANs and loop prevention",
      tagline: "A switch forwards frames; a router forwards packets; a VLAN divides one switch into many broadcast domains.",
      intro: "This chapter moves from the OSI data path to real devices: hub, bridge, switch, router, gateway, modem, access point and firewall. It then covers L2/L3 switching, VLANs, trunking, VTP, STP loop prevention and switch CLI configuration.",
      outcomes: [
        "Trace PDUs through OSI layers and network devices.",
        "Compare hub, bridge, switch, router, gateway, modem, AP and firewall.",
        "Configure L2/L3 switching, VLANs, trunks and VTP.",
        "Explain STP and prevent switching loops.",
        "Configure a switch with CLI and test IP routing."
      ],
      sections: [
        ["OSI layers, PDUs and the data path", "Each layer adds a header: the transport PDU is a segment/datagram, the network PDU is a packet, the data-link PDU is a frame and the physical layer sends bits. A switch reads MAC addresses, a router reads IP addresses and a firewall applies policy. Encapsulation on send and decapsulation on receive explain where a fault occurs."],
        ["Hub, bridge, switch, router, gateway, modem, access point and firewall", "A hub repeats bits to all ports, creating collisions; a bridge learns MAC addresses and forwards between segments; a switch is a multiport bridge with per-port forwarding; a router connects IP networks; a gateway translates between different protocols; a modem modulates/demodulates a WAN link; an AP bridges wireless and wired; a firewall filters traffic by rule."],
        ["L2/L3 switching, VLAN, trunking and VTP", "A VLAN creates a separate broadcast domain on one physical switch. Access ports carry one VLAN; trunk ports carry many with 802.1Q tags. Inter-VLAN traffic needs a router or L3 switch. VTP distributes VLAN databases in a VTP domain; use a clear domain name and a controlled server/client design."],
        ["STP and loop prevention", "Redundant links can create broadcast storms and MAC-table instability. STP elects a root bridge, assigns port roles and blocks redundant paths; RSTP converges faster. Enable BPDU Guard and PortFast only on edge ports, and verify the topology with show commands before changing links."],
        ["CLI configuration, IP routing and a Packet Tracer bench drill", "Use enable, configure terminal, interface, switchport mode access/trunk, vlan, ip address, no shutdown and show commands. Build two VLANs, a trunk, a router-on-a-stick or L3 switch and test ping between VLANs. Save the configuration and document the port map."]
      ]
    },
    mastery: {
      hi: {
        title: "VLAN और ट्रंक — एक स्विच, कई अलग नेटवर्क",
        lead: "VLAN से सुरक्षा और प्रदर्शन दोनों सुधरते हैं, लेकिन गलत ट्रंक या डुप्लिकेट VTP डोमेन पूरा नेटवर्क बिगाड़ सकता है।",
        paragraphs: [
          "Access पोर्ट पर केवल एक VLAN का untagged फ्रेम जाता है; trunk पोर्ट पर कई VLAN के फ्रेम 802.1Q टैग के साथ जाते हैं। स्विच-टू-स्विच लिंक को trunk बनाएँ और दोनों तरफ allowed VLAN सूची मिलाएँ। Native VLAN दोनों तरफ एक ही रखें और उसे unused VLAN में बदलें।",
          "VTP का मुख्य जोखिम है — गलत स्विच में ऊँचा revision number होने पर वह पूरे डोमेन की VLAN सूची बदल सकता है। नए स्विच को transparent मोड में जोड़ें, फिर जाँचकर client बनाएँ। प्रोडक्शन में VTP पासवर्ड और सही डोमेन रखें।",
          "VLAN के बीच संचार के लिए L3 राउटिंग चाहिए। Router-on-a-stick में एक भौतिक लिंक पर subinterface बनते हैं; L3 स्विच में SVI (Switch Virtual Interface) बनती है। हर VLAN के लिए गेटवे, DHCP और ACL की योजना पहले बनाएँ।"
        ],
        steps: [
          "VLAN ID और नाम की योजना बनाएँ।",
          "Access पोर्ट असाइन करें और स्विच-टू-स्विच trunk बनाएँ।",
          "Allowed VLAN, native VLAN और VTP मोड सत्यापित करें।",
          "L3/SVI या router-on-a-stick से inter-VLAN राउटिंग जाँचें।"
        ],
        table: {
          head: ["डिवाइस/फीचर", "काम", "सामान्य गलती"],
          rows: [
            ["Access port", "एक VLAN में अंतिम डिवाइस", "गलत VLAN असाइन"],
            ["Trunk port", "कई VLAN टैग के साथ", "allowed VLAN बंद"],
            ["STP", "लूप रोकना", "root bridge गलत जगह"],
            ["Inter-VLAN", "VLAN के बीच राउटिंग", "गेटवे गायब"]
          ]
        }
      },
      en: {
        title: "VLANs and trunks — one switch, many separate networks",
        lead: "VLANs improve security and performance, but a wrong trunk or a duplicate VTP domain can break the whole network.",
        paragraphs: [
          "An access port carries untagged frames for one VLAN; a trunk carries several VLANs with 802.1Q tags. Make switch-to-switch links trunks and match the allowed VLAN list on both sides. Keep the native VLAN identical at both ends and move it to an unused VLAN.",
          "VTP's main risk is that a switch with a higher revision number can overwrite the VLAN database for the whole domain. Add a new switch in transparent mode, verify it, then make it a client. Use a VTP password and the correct domain in production.",
          "Inter-VLAN traffic needs Layer 3 routing. Router-on-a-stick uses subinterfaces on one physical link; an L3 switch uses switched virtual interfaces. Plan gateways, DHCP and ACLs for every VLAN before configuring."
        ],
        steps: [
          "Plan VLAN IDs and names.",
          "Assign access ports and build switch-to-switch trunks.",
          "Verify allowed VLANs, native VLAN and VTP mode.",
          "Test inter-VLAN routing through L3/SVI or router-on-a-stick."
        ],
        table: {
          head: ["Device/feature", "Purpose", "Common mistake"],
          rows: [
            ["Access port", "End device in one VLAN", "Wrong VLAN assignment"],
            ["Trunk port", "Multiple tagged VLANs", "Allowed VLAN missing"],
            ["STP", "Prevent loops", "Wrong root bridge"],
            ["Inter-VLAN", "Routing between VLANs", "Missing gateway"]
          ]
        }
      }
    },
    viva: [
      { q: "हब और स्विच में अंतर?", qEn: "Difference between a hub and a switch?", a: "हब सभी पोर्ट पर फ्रेम भेजता है और collision domain साझा है; स्विच MAC सीखकर केवल लक्ष्य पोर्ट पर भेजता है।", aEn: "A hub sends frames to all ports with a shared collision domain; a switch learns MACs and forwards only to the destination port." },
      { q: "VLAN क्या है?", qEn: "What is a VLAN?", a: "एक भौतिक स्विच पर बना तार्किक broadcast domain, जो सुरक्षा और प्रदर्शन बढ़ाता है।", aEn: "A logical broadcast domain on a physical switch that improves security and performance." },
      { q: "ट्रंक पोर्ट पर 802.1Q क्या करता है?", qEn: "What does 802.1Q do on a trunk?", a: "फ्रेम में VLAN ID टैग जोड़ता है ताकि एक लिंक पर कई VLAN जा सकें।", aEn: "It adds a VLAN ID tag so multiple VLANs can share one link." },
      { q: "STP क्यों आवश्यक है?", qEn: "Why is STP needed?", a: "रेडंडेंट लिंक से बनने वाले broadcast storm और switching loop को रोकने के लिए।", aEn: "To prevent broadcast storms and switching loops caused by redundant links." }
    ]
  };

  D[17] = {
    model3d: null,
    fullForms: ["PKI", "CA", "SSL", "TLS", "MAC", "SSID", "AP", "PoE", "PoE+", "VLAN", "WLAN", "RSSI", "SNMP", "RIP", "IGRP", "DHCP"],
    en: {
      title: "Wireless Integration — Certificates, PoE, Performance and Routing",
      subtitle: "Module 17 · Joining wireless to wired",
      tagline: "Wireless is radio planning plus security plus power — not just an access point on the ceiling.",
      intro: "This chapter integrates wireless into a wired LAN. It covers public-key cryptography and digital certificates, MAC filtering, wired+wireless integration, PoE budgets and injectors, performance monitoring, access-network troubleshooting and RIP/IGRP routing.",
      outcomes: [
        "Explain public-key cryptography, certificates and MAC filtering.",
        "Integrate wired and wireless LANs securely.",
        "Calculate a PoE budget and connect APs safely.",
        "Monitor wireless performance and troubleshoot the access network.",
        "Configure basic RIP/IGRP routing and test it."
      ],
      sections: [
        ["Public-key, digital certificate and MAC filtering", "Public-key cryptography uses a key pair: the public key encrypts or verifies, the private key decrypts or signs. A digital certificate binds a public key to an identity and is signed by a CA. MAC filtering is a weak access control because addresses can be spoofed; combine it with WPA2/WPA3-Enterprise."],
        ["Wired + wireless LAN integration", "Connect APs to switch access ports on the correct VLAN; use a management VLAN and a separate client VLAN. Configure SSID, security, DHCP and gateway consistently. Test roaming, channel overlap and uplink capacity. A wireless client should reach wired servers through the same policy path."],
        ["PoE (802.3af/at, budget, injector)", "PoE delivers power over Ethernet. 802.3af provides about 15.4 W per port, 802.3at (PoE+) about 30 W. Add the power draw of every AP, camera and phone, leave headroom and check the switch's total budget. A passive injector must match voltage and polarity."],
        ["Performance monitoring and access-network troubleshooting", "Monitor RSSI, SNR, channel utilisation, retries, client count and throughput. Use 1, 6 and 11 on 2.4 GHz to avoid overlap; prefer 5 GHz for capacity. Check DHCP, VLAN, gateway, authentication and interference. A strong signal with high retries indicates interference, not distance."],
        ["IP routing — RIP and IGRP", "RIP is a distance-vector protocol using hop count, with a maximum of 15 and slow convergence. IGRP is an older Cisco distance-vector protocol using bandwidth and delay metrics. Modern networks prefer OSPF. Configure network statements, verify routes and test failover; avoid routing loops and inconsistent timers."],
        ["Bench drill: adding an AP, PoE budget and a 20-PC wireless check", "Mount the AP, connect the trunk/access port, configure SSID and security, verify PoE draw and channel plan. Connect 20 clients, test DHCP, ping, throughput and roaming. Record RSSI per location and adjust channels or AP placement."]
      ]
    },
    mastery: {
      hi: {
        title: "वायरलेस प्लानिंग — सिग्नल, चैनल और PoE बजट",
        lead: "AP की संख्या सिर्फ कवरेज से तय नहीं होती; क्लाइंट घनत्व, चैनल ओवरलैप और PoE बजट भी उतने ही जरूरी हैं।",
        paragraphs: [
          "2.4 GHz में केवल 1, 6 और 11 चैनल ओवरलैप-मुक्त हैं; बाकी एक-दूसरे में मिलते हैं। 5 GHz में अधिक चैनल और कम व्यवधान होता है, पर दीवारें सिग्नल को जल्दी कमजोर करती हैं। AP की जगह ऊँचाई पर चुनें और धातु/कंक्रीट के पीछे न रखें।",
          "RSSI -65 dBm से बेहतर होना चाहिए, लेकिन बहुत तेज़ सिग्नल भी अच्छा नहीं — क्लाइंट दूर के AP से चिपके रह सकते हैं। Roaming के लिए समान SSID/security और उचित transmit power रखें। बहुत अधिक AP transmit power से co-channel interference बढ़ता है।",
          "PoE स्विच का कुल बजट सभी पोर्ट के योग से कम हो सकता है। 20 AP × 12 W = 240 W, इसलिए 370 W बजट वाला स्विच पर्याप्त है, पर 8 पोर्ट वाले 120 W स्विच पर सब नहीं चलेंगे। हर AP की वास्तविक खपत डेटाशीट से लें और 20-25% हेडरूम रखें।"
        ],
        steps: [
          "साइट सर्वे से AP स्थान और चैनल योजना बनाएँ।",
          "SSID, WPA2/WPA3, VLAN और DHCP मिलाएँ।",
          "PoE वाट बजट और केबल गुणवत्ता जाँचें।",
          "RSSI, retries, throughput और roaming मापकर समायोजित करें।"
        ],
        table: {
          head: ["माप", "लक्ष्य", "समस्या हो तो"],
          rows: [
            ["RSSI", "-65 dBm या बेहतर", "AP स्थान/शक्ति बदलें"],
            ["Channel utilisation", "कम/संतुलित", "चैनल और AP बदलें"],
            ["Retries", "कम", "interference/दूरी जाँचें"],
            ["PoE budget", "20-25% हेडरूम", "स्विच/इंजेक्टर बदलें"]
          ]
        }
      },
      en: {
        title: "Wireless planning — signal, channels and PoE budget",
        lead: "AP count is not decided by coverage alone; client density, channel overlap and PoE budget matter just as much.",
        paragraphs: [
          "In 2.4 GHz only channels 1, 6 and 11 are non-overlapping; the rest overlap. 5 GHz offers more channels and less interference but walls weaken it faster. Mount APs high and avoid metal or concrete obstructions.",
          "RSSI should be better than -65 dBm, but a very strong signal is not always good: clients may stick to a distant AP. Use the same SSID/security and sensible transmit power for roaming. Excessive AP power increases co-channel interference.",
          "A PoE switch's total budget may be less than the sum of its ports. Twenty APs at 12 W need 240 W, so a 370 W switch is adequate but a 120 W eight-port switch is not. Use the datasheet draw for each AP and keep 20–25% headroom."
        ],
        steps: [
          "Plan AP locations and channels from a site survey.",
          "Match SSID, WPA2/WPA3, VLAN and DHCP.",
          "Check the PoE watt budget and cable quality.",
          "Measure RSSI, retries, throughput and roaming, then tune."
        ],
        table: {
          head: ["Metric", "Target", "If poor"],
          rows: [
            ["RSSI", "-65 dBm or better", "Move AP/adjust power"],
            ["Channel utilisation", "Low/balanced", "Change channel and AP"],
            ["Retries", "Low", "Check interference/distance"],
            ["PoE budget", "20–25% headroom", "Change switch/injector"]
          ]
        }
      }
    },
    viva: [
      { q: "पब्लिक-की क्रिप्टोग्राफी कैसे काम करती है?", qEn: "How does public-key cryptography work?", a: "पब्लिक की से एन्क्रिप्ट/सत्यापन और प्राइवेट की से डिक्रिप्ट/हस्ताक्षर; दोनों की जोड़ी बनती है।", aEn: "The public key encrypts or verifies and the private key decrypts or signs; the two form a pair." },
      { q: "डिजिटल सर्टिफिकेट क्या प्रमाणित करता है?", qEn: "What does a digital certificate prove?", a: "CA के हस्ताक्षर से किसी पब्लिक की का किसी पहचान/डोमेन से संबंध।", aEn: "A CA signature binds a public key to an identity or domain." },
      { q: "802.3af और 802.3at में अंतर?", qEn: "Difference between 802.3af and 802.3at?", a: "af लगभग 15.4 W और at (PoE+) लगभग 30 W प्रति पोर्ट देता है।", aEn: "802.3af provides about 15.4 W and 802.3at (PoE+) about 30 W per port." },
      { q: "RIP का अधिकतम hop count?", qEn: "Maximum hop count in RIP?", a: "15; 16 को unreachable माना जाता है।", aEn: "15; 16 is considered unreachable." }
    ]
  };

  D[18] = {
    model3d: "hdd",
    fullForms: ["RAID", "AD", "AD DS", "DC", "DNS", "DHCP", "NIC", "SATA", "SAS", "SSD", "UPS", "NAT", "ICS", "OS", "NTFS"],
    en: {
      title: "Windows Server — RAID, Installation, AD DS, Internet Sharing and Backup",
      subtitle: "Module 18 · Foundations of a server",
      tagline: "A server is a role, not a bigger PC: plan storage, identity, addressing and recovery together.",
      intro: "This chapter builds the server foundation: server hardware and RAID, Windows Server installation and configuration, AD DS and domain controllers, broadband modem and Internet sharing, server management and backup, and a lab server drill from RAID to AD.",
      outcomes: [
        "Explain server concepts, hardware and RAID levels.",
        "Install and configure Windows Server.",
        "Deploy AD DS and a domain controller.",
        "Configure broadband sharing with ICS/NAT.",
        "Manage, monitor and back up a server.",
        "Build a lab server from RAID to AD."
      ],
      sections: [
        ["Server concept, hardware and RAID (0/1/5/10)", "A server provides services to many clients and needs reliability, remote management, ECC memory and redundant power. RAID 0 stripes for speed with no redundancy; RAID 1 mirrors; RAID 5 stripes with parity and tolerates one disk failure; RAID 10 mirrors and stripes. RAID is not a backup."],
        ["Windows Server installation and configuration", "Check hardware compatibility, choose Server Core or Desktop Experience, set a static IP, name the server, apply updates and configure roles. Use strong local passwords, enable remote management, set the time zone and activate the licence. Document the build."],
        ["AD DS and domain controller", "AD DS stores users, computers, groups and policies in a hierarchical directory. Installing it promotes the server to a domain controller and creates DNS. Plan the forest/domain name, set a Directory Services Restore Mode password and back up the system state."],
        ["Broadband modem and Internet sharing (ICS/NAT)", "A modem connects the WAN; a router shares the connection. Windows ICS is simple but limited; RRAS NAT is more configurable. Configure the public/private interfaces, NAT, DNS and DHCP carefully. Avoid double NAT unless required."],
        ["Server management, monitoring and backup", "Use Server Manager, Event Viewer, Performance Monitor and task scheduler. Monitor disk, memory, CPU, services and backup status. Back up system state and data to a separate target, test restores and keep a recovery plan. Patch on a schedule."],
        ["Bench drill: preparing a lab server from RAID to AD", "Create a RAID 1 or 5 volume, install Windows Server, set a static address, install AD DS and DNS, create an OU and a test user, join a client and verify login. Then run a backup and restore a test object."]
      ]
    },
    mastery: {
      hi: {
        title: "RAID की सीमा — उपलब्धता और बैकअप अलग चीजें",
        lead: "RAID डिस्क विफलता से बचाता है, रैनसमवेयर, गलत डिलीट या साइट आपदा से नहीं। RAID के साथ बैकअप अनिवार्य है।",
        paragraphs: [
          "RAID 0 में स्ट्राइपिंग से गति बढ़ती है, पर एक डिस्क जाने पर सारा डेटा जाता है। RAID 1 में मिररिंग से 50% क्षमता उपयोग होती है और एक डिस्क बचती है। RAID 5 में पैरिटी से एक डिस्क बचती है, पर rebuild के दौरान दूसरी डिस्क जाने का जोखिम रहता है। RAID 10 गति और सुरक्षा का संतुलन देता है।",
          "हार्डवेयर RAID में अलग कंट्रोलर होता है; सॉफ्टवेयर RAID CPU का उपयोग करता है। SSD RAID में TRIM और wear levelling का समर्थन जाँचें। RAID rebuild समय लंबा हो सकता है, इसलिए spare disk और monitoring रखें।",
          "AD DS में DNS अनिवार्य है; डोमेन कंट्रोलर का समय सही होना चाहिए। हर DC का system state बैकअप लें और DSRM पासवर्ड सुरक्षित रखें। FSMO roles की स्थिति जानें ताकि DC बदलने पर सेवा बनी रहे।"
        ],
        steps: [
          "डेटा की महत्ता और downtime के अनुसार RAID चुनें।",
          "डिस्क, कंट्रोलर, PSU और UPS की योजना बनाएँ।",
          "Windows Server पर स्थिर IP, नाम, अपडेट और रोल लगाएँ।",
          "AD DS + DNS स्थापित करें और system state बैकअप लें।"
        ],
        table: {
          head: ["RAID", "सहनशीलता", "क्षमता", "उपयोग"],
          rows: [
            ["0", "कोई नहीं", "100%", "अस्थायी/गति"],
            ["1", "1 डिस्क", "50%", "OS/छोटा सर्वर"],
            ["5", "1 डिस्क", "n-1", "फ़ाइल सर्वर"],
            ["10", "1+ डिस्क", "50%", "डेटाबेस/उच्च IOPS"]
          ]
        }
      },
      en: {
        title: "RAID limits — availability and backup are different things",
        lead: "RAID protects against disk failure, not ransomware, accidental deletion or a site disaster. Backup is mandatory alongside RAID.",
        paragraphs: [
          "RAID 0 stripes for speed but loses everything if one disk fails. RAID 1 mirrors and uses 50% capacity while surviving one disk. RAID 5 uses parity and survives one disk, but a second failure during rebuild is a real risk. RAID 10 balances speed and protection.",
          "Hardware RAID uses a dedicated controller; software RAID uses the CPU. For SSD RAID, check TRIM and wear-levelling support. Rebuilds can take hours, so keep a spare disk and monitoring.",
          "AD DS requires DNS and correct time on domain controllers. Back up system state for every DC and protect the DSRM password. Know the FSMO role holders so service survives a DC change."
        ],
        steps: [
          "Choose RAID by data value and downtime tolerance.",
          "Plan disks, controller, PSU and UPS.",
          "Set static IP, name, updates and roles on Windows Server.",
          "Install AD DS + DNS and take a system-state backup."
        ],
        table: {
          head: ["RAID", "Tolerance", "Capacity", "Use"],
          rows: [
            ["0", "None", "100%", "Temporary/speed"],
            ["1", "1 disk", "50%", "OS/small server"],
            ["5", "1 disk", "n-1", "File server"],
            ["10", "1+ disks", "50%", "Database/high IOPS"]
          ]
        }
      }
    },
    viva: [
      { q: "RAID 5 में कितनी डिस्क विफलता सहन होती है?", qEn: "How many disk failures does RAID 5 tolerate?", a: "एक; rebuild के दौरान दूसरी विफलता से डेटा जा सकता है।", aEn: "One; a second failure during rebuild can cause data loss." },
      { q: "AD DS के लिए DNS क्यों आवश्यक है?", qEn: "Why is DNS required for AD DS?", a: "क्लाइंट डोमेन कंट्रोलर और सेवाओं को SRV/A रिकॉर्ड से ढूँढते हैं।", aEn: "Clients locate domain controllers and services through SRV/A records." },
      { q: "ICS और NAT में अंतर?", qEn: "Difference between ICS and NAT?", a: "ICS सरल साझाकरण है; RRAS NAT अधिक नियंत्रण, नियम और राउटिंग देता है।", aEn: "ICS is simple sharing; RRAS NAT offers more control, rules and routing." },
      { q: "सर्वर बैकअप में system state क्या है?", qEn: "What is system state in a server backup?", a: "AD, SYSVOL, रजिस्ट्री, सिस्टम फाइलें और सर्टिफिकेट सेवाएँ — बहाली के लिए आवश्यक।", aEn: "AD, SYSVOL, registry, system files and certificate services needed for recovery." }
    ]
  };

  D[19] = {
    model3d: null,
    fullForms: ["DNS", "DHCP", "A", "AAAA", "CNAME", "MX", "PTR", "SRV", "SOA", "NS", "TTL", "IP", "FQDN", "DORA", "NIC"],
    en: {
      title: "DNS and DHCP — Zones, Records, Scopes and Troubleshooting",
      subtitle: "Module 19 · Naming and address distribution",
      tagline: "DNS names the world; DHCP hands out addresses — when either fails, users say 'the internet is down'.",
      intro: "This chapter covers DNS zones and record types, Windows DNS installation and configuration, DHCP scopes, reservations, options and relay, integration and testing, and a combined DNS/DHCP lab.",
      outcomes: [
        "Explain DNS zones, record types and resolution.",
        "Install and configure Windows DNS with forward/reverse zones.",
        "Configure DHCP scopes, reservations, options and relay.",
        "Integrate DNS and DHCP and troubleshoot them.",
        "Build and verify a DNS + DHCP server lab."
      ],
      sections: [
        ["DNS zones, records (A, AAAA, CNAME, MX, PTR, SRV) and resolution", "A forward zone maps names to addresses; a reverse zone maps addresses to names. An A record maps IPv4, AAAA maps IPv6, CNAME creates an alias, MX points to mail servers, PTR supports reverse lookup and SRV locates services. Resolution walks from the root to the authoritative server, using cache and TTL."],
        ["Installing/configuring DNS on Windows Server (forward/reverse, forwarder)", "Install the DNS role, create forward and reverse zones, enable secure dynamic updates and configure forwarders for external names. Set scavenging for stale records, verify SOA/NS records and test with nslookup from a client. Keep DNS on a domain controller integrated with AD where possible."],
        ["DHCP scope, reservation, options and relay", "A scope defines a range, mask, lease and exclusions. A reservation ties a MAC address to a fixed address. Options provide gateway, DNS, domain name and NTP. A DHCP relay forwards requests across subnets. Use a short lease for guest networks and longer for stable desktops."],
        ["Integration, testing and troubleshooting (ipconfig /release /renew /flushdns)", "Authorise DHCP in AD, integrate DNS updates, and test with ipconfig /release, /renew and /flushdns. Check the lease, scope exhaustion, relay address and firewall. Use nslookup, ping and event logs. A wrong DNS server looks like a broken internet connection."],
        ["Bench drill: DNS and DHCP server lab", "Create a zone, add A/PTR/CNAME records, create a scope with a reservation and options, join a client and verify name resolution and lease. Then introduce a wrong forwarder or exhausted scope and practise the diagnostic sequence."]
      ]
    },
    mastery: {
      hi: {
        title: "DNS और DHCP की परस्पर निर्भरता",
        lead: "DHCP अगर गलत DNS सर्वर दे दे, तो इंटरनेट चालू होने पर भी नाम नहीं खुलेंगे। दोनों सेवाओं को एक साथ जाँचें।",
        paragraphs: [
          "DHCP क्लाइंट को IP, mask, gateway और DNS देता है। यदि स्कोप में DNS विकल्प गलत है, क्लाइंट को पता मिल जाएगा पर वेबसाइट नहीं खुलेगी। DHCP सर्वर पर scope options और server options दोनों देखें; scope option को प्राथमिकता मिलती है।",
          "DNS में forward और reverse zone दोनों बनाएँ। PTR रिकॉर्ड के बिना कुछ एप्लिकेशन रिवर्स lookup पर धीमे हो सकते हैं। CNAME का उपयोग alias के लिए करें, A रिकॉर्ड को hostname के लिए। MX और SRV रिकॉर्ड की प्राथमिकता/weight सही रखें।",
          "AD एकीकृत DNS में dynamic updates और replication महत्वपूर्ण हैं। समय गलत होने पर Kerberos प्रमाणीकरण विफल हो सकता है। DNS कैश साफ करने के लिए ipconfig /flushdns चलाएँ, और सर्वर पर scavenging से पुराने रिकॉर्ड हटाएँ।"
        ],
        steps: [
          "DHCP स्कोप और विकल्प (gateway, DNS, domain) जाँचें।",
          "DNS forward/reverse zone और रिकॉर्ड सत्यापित करें।",
          "ipconfig /release, /renew, /flushdns से क्लाइंट परीक्षण करें।",
          "nslookup और event log से नाम/लीज़ समस्या अलग करें।"
        ],
        table: {
          head: ["लक्षण", "संभावित कारण", "जाँच"],
          rows: [
            ["IP मिला, नाम नहीं खुलता", "गलत DNS विकल्प", "scope option 006"],
            ["APIPA (169.254.x.x)", "DHCP नहीं मिला", "relay/scope exhaustion"],
            ["कुछ नाम पुराने", "stale record/scavenging", "DNS रिकॉर्ड/TTL"],
            ["रिवर्स lookup विफल", "PTR रिकॉर्ड गायब", "reverse zone"]
          ]
        }
      },
      en: {
        title: "The interdependence of DNS and DHCP",
        lead: "If DHCP hands out the wrong DNS server, the internet may be up but names will not resolve. Test both services together.",
        paragraphs: [
          "DHCP gives the client an IP, mask, gateway and DNS. If the scope has the wrong DNS option, the client gets an address but cannot open websites. Check both scope options and server options; the scope option takes precedence.",
          "Create both forward and reverse DNS zones. Without PTR records some applications slow down on reverse lookups. Use CNAME for aliases and A records for hostnames. Keep MX and SRV priorities/weights correct.",
          "In AD-integrated DNS, dynamic updates and replication matter. Wrong time can break Kerberos authentication. Run ipconfig /flushdns to clear the client cache and enable scavenging on the server to remove stale records."
        ],
        steps: [
          "Verify DHCP scope and options (gateway, DNS, domain).",
          "Confirm DNS forward/reverse zones and records.",
          "Test the client with ipconfig /release, /renew and /flushdns.",
          "Use nslookup and event logs to separate name and lease issues."
        ],
        table: {
          head: ["Symptom", "Likely cause", "Check"],
          rows: [
            ["IP works, names fail", "Wrong DNS option", "Scope option 006"],
            ["APIPA (169.254.x.x)", "No DHCP response", "Relay/scope exhaustion"],
            ["Stale names", "Old record/scavenging", "DNS record/TTL"],
            ["Reverse lookup fails", "Missing PTR", "Reverse zone"]
          ]
        }
      }
    },
    viva: [
      { q: "A और CNAME रिकॉर्ड में अंतर?", qEn: "Difference between A and CNAME records?", a: "A सीधे IPv4 पता देता है; CNAME किसी दूसरे नाम का alias बनाता है।", aEn: "An A record maps directly to an IPv4 address; a CNAME creates an alias for another name." },
      { q: "DHCP DORA के चार चरण?", qEn: "What are the four DHCP DORA steps?", a: "Discover, Offer, Request, Acknowledge।", aEn: "Discover, Offer, Request and Acknowledge." },
      { q: "DHCP relay क्यों आवश्यक है?", qEn: "Why is a DHCP relay needed?", a: "अलग सबनेट के क्लाइंट के broadcast को DHCP सर्वर तक पहुँचाने के लिए।", aEn: "To forward broadcasts from clients on other subnets to the DHCP server." },
      { q: "DNS forwarder क्या करता है?", qEn: "What does a DNS forwarder do?", a: "स्थानीय ज़ोन में न मिलने वाली क्वेरी बाहरी DNS सर्वर को भेजता है।", aEn: "It sends queries that are not in local zones to an external DNS server." }
    ]
  };

  D[20] = {
    model3d: null,
    fullForms: ["RRAS", "VPN", "NAT", "PPTP", "L2TP", "IPsec", "SSTP", "IKEv2", "RADIUS", "NPS", "IAS", "LAN", "WAN", "DNS", "DHCP", "MPPE"],
    en: {
      title: "RRAS and VPN — Routing, Remote Access, RADIUS/NPS and Security",
      subtitle: "Module 20 · Secure access from a distance",
      tagline: "A VPN carries private traffic over a public network — authentication and encryption decide whether it is safe.",
      intro: "This chapter covers RRAS installation, LAN routing and NAT; remote access and VPN protocols; RADIUS/IAS/NPS; security, testing and troubleshooting; and a lab drill that builds an RRAS VPN server.",
      outcomes: [
        "Install RRAS and configure LAN routing and NAT.",
        "Compare PPTP, L2TP/IPsec, SSTP and IKEv2.",
        "Explain RADIUS/IAS/NPS authentication.",
        "Secure and troubleshoot remote access.",
        "Build and test an RRAS VPN server."
      ],
      sections: [
        ["RRAS installation, LAN routing and NAT", "RRAS turns Windows Server into a router and remote-access server. Enable LAN routing between interfaces, configure NAT for Internet sharing and set static routes where needed. Use two NICs with clear public/private roles and test routing with ping and tracert."],
        ["Remote access and VPN protocols (PPTP, L2TP/IPsec, SSTP, IKEv2)", "PPTP is obsolete and weak. L2TP/IPsec provides strong encryption but needs UDP 500/4500 and ESP. SSTP uses TLS over TCP 443, which passes many firewalls. IKEv2 is fast and stable across network changes. Choose according to client OS, firewall policy and security."],
        ["RADIUS/IAS/NPS", "RADIUS centralises authentication, authorisation and accounting. Windows NPS (formerly IAS) acts as a RADIUS server for VPN, Wi-Fi 802.1X and switches. Configure clients, policies, shared secrets and logging; use groups for authorisation and certificate-based methods for stronger security."],
        ["Security, testing and troubleshooting", "Use strong authentication (certificates or MFA), least-privilege policies, split/full tunnelling decisions and logging. Test name resolution, routes, ports, certificates and time. A VPN that connects but cannot reach LAN resources usually has a routing, DNS or firewall rule problem."],
        ["Bench drill: RRAS VPN server lab", "Install RRAS, configure a VPN adapter, DHCP relay or static pool, authentication and access policy. Connect a client over a simulated WAN, verify the tunnel, IP configuration, DNS and access to one LAN resource. Record the ports and policy used."]
      ]
    },
    mastery: {
      hi: {
        title: "VPN की सुरक्षा — टनल से आगे पहचान और नीति",
        lead: "टनल बनना पर्याप्त नहीं; कौन जुड़ रहा है, किन संसाधनों तक पहुँचेगा और लॉग कहाँ जाएगा — यह तय करना जरूरी है।",
        paragraphs: [
          "PPTP का MPPE एन्क्रिप्शन कमजोर है, इसलिए उसे बंद रखें। L2TP/IPsec में प्रमाणपत्र या pre-shared key और UDP 500/4500 खुलने चाहिए। SSTP पोर्ट 443 पर TLS का उपयोग करता है, इसलिए होटल/फायरवॉल में अधिक सफल होता है। IKEv2 मोबाइल नेटवर्क बदलने पर जल्दी reconnect करता है।",
          "RADIUS/NPS में shared secret और policy सही होने चाहिए। अधिक अनुमति देने वाली डिफ़ॉल्ट policy खतरनाक है; केवल आवश्यक समूह और समय/डिवाइस शर्तें लागू करें। प्रमाणपत्र-आधारित EAP-TLS पासवर्ड से अधिक सुरक्षित है।",
          "VPN जुड़ने के बाद LAN संसाधन न मिलें तो routing, DNS और firewall जाँचें। क्लाइंट को सही DNS और route मिल रहा है या नहीं देखें। split tunnel से इंटरनेट सीधा जाता है पर सुरक्षा नीति कमजोर हो सकती है; full tunnel अधिक नियंत्रित है।"
        ],
        steps: [
          "उपयुक्त VPN प्रोटोकॉल और प्रमाणीकरण चुनें।",
          "RRAS/NPS में policy, समूह और shared secret सेट करें।",
          "आवश्यक पोर्ट, सर्टिफिकेट और समय सिंक जाँचें।",
          "कनेक्ट होकर DNS, route और LAN संसाधन पहुँच सत्यापित करें।"
        ],
        table: {
          head: ["प्रोटोकॉल", "पोर्ट", "टिप्पणी"],
          rows: [
            ["PPTP", "TCP 1723, GRE", "पुराना, सुरक्षित नहीं"],
            ["L2TP/IPsec", "UDP 500/4500, ESP", "प्रमाणपत्र के साथ मजबूत"],
            ["SSTP", "TCP 443", "फायरवॉल-फ्रेंडली"],
            ["IKEv2", "UDP 500/4500", "मोबाइल के लिए अच्छा"]
          ]
        }
      },
      en: {
        title: "VPN security — identity and policy beyond the tunnel",
        lead: "Building a tunnel is not enough; decide who connects, which resources they reach and where the logs go.",
        paragraphs: [
          "PPTP's MPPE encryption is weak, so disable it. L2TP/IPsec needs certificates or a pre-shared key and UDP 500/4500 open. SSTP uses TLS on port 443 and succeeds more often in hotels and firewalls. IKEv2 reconnects quickly when a mobile network changes.",
          "RADIUS/NPS needs a correct shared secret and policy. A default policy that grants too much is dangerous; allow only the required groups and add time/device conditions. Certificate-based EAP-TLS is stronger than passwords.",
          "If a VPN connects but LAN resources are unreachable, check routing, DNS and firewall. Confirm the client receives the correct DNS and routes. Split tunnelling sends Internet traffic directly but can weaken policy; full tunnelling is more controlled."
        ],
        steps: [
          "Choose the VPN protocol and authentication method.",
          "Set policy, groups and shared secret in RRAS/NPS.",
          "Verify required ports, certificates and time sync.",
          "Connect and test DNS, routes and LAN resource access."
        ],
        table: {
          head: ["Protocol", "Port", "Note"],
          rows: [
            ["PPTP", "TCP 1723, GRE", "Old and insecure"],
            ["L2TP/IPsec", "UDP 500/4500, ESP", "Strong with certificates"],
            ["SSTP", "TCP 443", "Firewall-friendly"],
            ["IKEv2", "UDP 500/4500", "Good for mobile"]
          ]
        }
      }
    },
    viva: [
      { q: "PPTP को क्यों नहीं उपयोग करना चाहिए?", qEn: "Why should PPTP not be used?", a: "इसका MPPE एन्क्रिप्शन कमजोर है और ज्ञात हमले हैं; L2TP/IPsec या IKEv2 चुनें।", aEn: "Its MPPE encryption is weak with known attacks; use L2TP/IPsec or IKEv2." },
      { q: "SSTP किस पोर्ट पर चलता है?", qEn: "Which port does SSTP use?", a: "TCP 443 पर TLS के अंदर, इसलिए अधिकतर फायरवॉल से गुजरता है।", aEn: "TCP 443 inside TLS, so it passes most firewalls." },
      { q: "RADIUS का काम क्या है?", qEn: "What does RADIUS do?", a: "केंद्रीय प्रमाणीकरण, अनुमति और लेखांकन (AAA) प्रदान करता है।", aEn: "It provides centralised authentication, authorisation and accounting (AAA)." },
      { q: "VPN जुड़ा पर LAN न मिले तो क्या जाँचें?", qEn: "VPN connects but LAN is unreachable — what next?", a: "क्लाइंट को मिला IP/route/DNS, सर्वर राउटिंग और फायरवॉल नियम जाँचें।", aEn: "Check the client IP/routes/DNS, server routing and firewall rules." }
    ]
  };
})();
