/* Trade Theory · Deep bilingual layer — अध्याय 21–25 */
(function () {
  "use strict";
  var D = (window.TRADE_DEEP = window.TRADE_DEEP || {});

  D[21] = {
    model3d: null,
    fullForms: ["AD", "OU", "AGDLP", "GPO", "LSDOU", "DC", "DNS", "FSMO", "SMB", "NTFS", "ACL", "RADIUS"],
    en: {
      title: "Active Directory — Objects, Group Scope, AGDLP and Group Policy",
      subtitle: "Module 21 · Directory and policy",
      tagline: "Put users in groups, groups in permissions — never assign permission directly to a person.",
      intro: "Active Directory is the identity and policy backbone of a Windows network. This chapter covers AD objects, OUs and group scope, AGDLP permission design, Group Policy scope and processing order, file/print resources and auditing, and a Sales-share lab.",
      outcomes: [
        "Explain AD objects, OUs and group scopes.",
        "Design permissions using AGDLP.",
        "Configure GPO scope, processing order and settings.",
        "Publish file/print resources and enable auditing.",
        "Plan and verify a share, group and GPO lab."
      ],
      sections: [
        ["AD objects, OU and group scope", "AD stores users, computers, groups and printers as objects in a domain tree. An OU organises objects for delegation and policy, not for security boundaries. Group scope determines membership and where permissions apply: domain local, global and universal groups serve different roles."],
        ["AGDLP and permission design", "AGDLP: put Accounts into Global groups, Global groups into Domain Local groups, and assign Permissions to the Domain Local group. This scalable pattern keeps permissions stable when users move. Use role-based groups, avoid nesting confusion and document every permission."],
        ["Group Policy scope, processing order (LSDOU) and settings", "GPOs apply in Local, Site, Domain, OU order; later policies win unless an OU blocks inheritance or uses enforced. Link GPOs at the right level, filter by group, and test with gpresult and RSOP. Separate security baselines from user-experience settings."],
        ["File/print resources, auditing and troubleshooting", "Create shares with NTFS permissions and share permissions aligned, map drives by GPO or script, and publish printers with drivers. Enable auditing for sensitive folders, review events and troubleshoot with effective access, gpresult and event logs. Deny access explicitly only when necessary."],
        ["Lab drill: Sales share, group permissions and GPO — from plan to record", "Create a Sales OU, users, a global role group and a domain local permission group, apply AGDLP to a share, then link a GPO for drive mapping. Verify with a test user, capture gpresult and document the design."]
      ]
    },
    mastery: {
      hi: {
        title: "AGDLP और GPO — स्केलेबल अनुमति डिज़ाइन",
        lead: "सीधे व्यक्ति को फ़ोल्डर अनुमति देना छोटे नेटवर्क में चलता है, बड़े नेटवर्क में हार। AGDLP से अनुमति स्थिर और ऑडिट-योग्य रहती है।",
        paragraphs: [
          "AGDLP का उदाहरण: रवि और सीता Sales टीम में हैं। दोनों को 'Sales-Global' समूह में डालें, उसे 'Sales-Share-DL' में डालें, और 'Sales-Share-DL' को फ़ोल्डर पर Modify अनुमति दें। किसी कर्मचारी के जाने पर केवल उसका अकाउंट हटाएँ; फ़ोल्डर अनुमति छूने की जरूरत नहीं।",
          "GPO का क्रम LSDOU है: Local, Site, Domain, OU। OU पर लगी नीति Domain से बाद लागू होती है, इसलिए जीतती है। Inheritance Block और Enforced का उपयोग सोच-समझकर करें; बहुत सारी enforced नीतियाँ समस्या ढूँढना कठिन बना देती हैं।",
          "हर GPO का एक उद्देश्य, अच्छा नाम और परिवर्तन लॉग रखें। लागू करने से पहले टेस्ट OU में जाँचें और gpresult /r से पुष्टि करें कि कौन-सी नीति लागू हुई। सुरक्षा बेसलाइन और उपयोगकर्ता सुविधा नीतियों को अलग रखें।"
        ],
        steps: [
          "OU संरचना और भूमिका-आधारित समूह बनाएँ।",
          "AGDLP के अनुसार अनुमति लागू करें।",
          "GPO को सही स्तर पर लिंक और फ़िल्टर करें।",
          "gpresult/RSOP और टेस्ट यूज़र से सत्यापित करें।"
        ],
        table: {
          head: ["समूह", "प्रकार", "उदाहरण"],
          rows: [
            ["Global", "उपयोगकर्ता भूमिका", "Sales-Global"],
            ["Domain Local", "संसाधन अनुमति", "Sales-Share-DL"],
            ["Universal", "कई डोमेन", "कंपनी-व्यापी भूमिका"],
            ["OU", "नीति/प्रतिनिधित्व", "Sales OU"]
          ]
        }
      },
      en: {
        title: "AGDLP and GPO — scalable permission design",
        lead: "Assigning a permission directly to a person works in a small network and fails at scale. AGDLP keeps permissions stable and auditable.",
        paragraphs: [
          "Example: Ravi and Sita work in Sales. Put both in 'Sales-Global', put that group in 'Sales-Share-DL', and give 'Sales-Share-DL' Modify permission on the folder. When an employee leaves, remove only the account; the folder permission stays unchanged.",
          "GPO order is LSDOU: Local, Site, Domain, OU. An OU policy applies after the domain policy and therefore wins. Use inheritance blocking and enforcement carefully; too many enforced policies make troubleshooting hard.",
          "Give every GPO one purpose, a clear name and a change log. Test in a pilot OU and confirm with gpresult /r which policy applied. Keep security baselines separate from user-experience settings."
        ],
        steps: [
          "Build the OU structure and role-based groups.",
          "Apply permissions according to AGDLP.",
          "Link and filter GPOs at the correct level.",
          "Verify with gpresult/RSOP and a test user."
        ],
        table: {
          head: ["Group", "Type", "Example"],
          rows: [
            ["Global", "User role", "Sales-Global"],
            ["Domain Local", "Resource permission", "Sales-Share-DL"],
            ["Universal", "Cross-domain", "Company-wide role"],
            ["OU", "Policy/delegation", "Sales OU"]
          ]
        }
      }
    },
    viva: [
      { q: "AGDLP का पूरा अर्थ क्या है?", qEn: "What does AGDLP stand for?", a: "Account, Global group, Domain Local group, Permission — खाते को ग्लोबल समूह में, उसे डोमेन लोकल में, और अनुमति डोमेन लोकल को।", aEn: "Account, Global group, Domain Local group, Permission — put accounts in global groups, global in domain local, and assign permission to the domain local group." },
      { q: "GPO का प्रोसेसिंग क्रम?", qEn: "What is the GPO processing order?", a: "Local, Site, Domain, OU (LSDOU); बाद में लागू नीति सामान्यतः जीतती है।", aEn: "Local, Site, Domain, OU (LSDOU); later policy normally wins." },
      { q: "OU सुरक्षा सीमा क्यों नहीं है?", qEn: "Why is an OU not a security boundary?", a: "OU संगठन/नीति के लिए है; सुरक्षा अनुमति समूह और ACL से नियंत्रित होती है।", aEn: "An OU is for organisation/policy; security is controlled by groups and ACLs." },
      { q: "gpresult क्या दिखाता है?", qEn: "What does gpresult show?", a: "उपयोगकर्ता/कंप्यूटर पर लागू GPO और उनके परिणाम।", aEn: "The GPOs applied to a user/computer and their result." }
    ]
  };

  D[22] = {
    model3d: null,
    fullForms: ["IIS", "DNS", "SSL", "TLS", "HTTPS", "HSTS", "FTP", "FTPS", "SFTP", "URL", "CSR", "CA", "SMB", "NTFS", "ACL"],
    en: {
      title: "IIS Web Hosting — Binding, SSL/TLS, FTP and Backup",
      subtitle: "Module 22 · Web server and data safety",
      tagline: "A website is a name, a binding, a certificate and a content path — verify all four.",
      intro: "IIS publishes websites and applications on Windows Server. This chapter covers installation, sites, bindings and virtual directories; DNS and SSL/TLS for secure hosting; FTP publishing; backup types, scheduling and tested restore; and a lab that publishes lab.local and verifies backup.",
      outcomes: [
        "Install IIS and create a site with bindings and virtual directories.",
        "Configure DNS and SSL/TLS for HTTPS and HSTS.",
        "Publish content over FTP and secure file transfer.",
        "Plan backups and perform a tested restore.",
        "Publish and verify a lab site with backup."
      ],
      sections: [
        ["IIS installation, site, binding and virtual directory", "Install the Web Server role with the required features, create a site with a physical path and bind it to an IP, port and host header. A virtual directory maps a URL path to another folder. Set the application pool identity and NTFS permissions so the worker process can read content without excess rights."],
        ["DNS, SSL/TLS certificate and secure hosting (HTTPS, HSTS)", "Create an A/CNAME record for the site name and verify resolution. Generate a CSR, obtain a certificate from a CA or internal PKI, bind it to port 443 and test the chain. Redirect HTTP to HTTPS, enable HSTS after testing and keep the private key protected."],
        ["FTP publishing and file transfer services", "IIS FTP can use basic or Windows authentication, with read/write permissions and isolation. Prefer FTPS or SFTP over plain FTP. Open only the required passive port range in the firewall and verify upload/download with a client. Log transfers and review permissions."],
        ["Backup types, scheduling and tested restore", "A backup plan covers site content, configuration, certificates, databases and logs. Full, incremental and differential backups differ in speed and restore complexity. Store copies off the server, encrypt them and schedule regular restore tests. A certificate backup must include the private key and password."],
        ["Lab drill: publishing lab.local and verifying backup-restore", "Create the DNS record, IIS site, binding and test page. Install the certificate, enable HTTPS and redirect. Upload content by FTPS, back up the site and configuration, delete a test file, restore and verify. Document every step and port."]
      ]
    },
    mastery: {
      hi: {
        title: "HTTPS की श्रृंखला — DNS से सर्टिफिकेट तक",
        lead: "वेबसाइट न खुले तो सिर्फ IIS दोषी नहीं; DNS, फायरवॉल, बाइंडिंग, सर्टिफिकेट और NTFS अनुमति — पाँचों जाँचें।",
        paragraphs: [
          "पहले nslookup से नाम का IP जाँचें। फिर फायरवॉल में 80/443 खुला है या नहीं, IIS बाइंडिंग में host header सही है या नहीं, और application pool चल रहा है या नहीं देखें। 403 त्रुटि अक्सर NTFS/anonymous authentication की समस्या है, 404 गलत path या binding की।",
          "सर्टिफिकेट में नाम (SAN), वैधता और पूरी chain जाँचें। आंतरिक CA का root client पर trusted होना चाहिए। निजी key सुरक्षित रखें और export करते समय पासवर्ड लगाएँ। HTTP से HTTPS पर redirect करें, फिर HSTS चालू करें।",
          "FTP की जगह FTPS/SFTP उपयोग करें; plain FTP में पासवर्ड खुले जाते हैं। Passive mode के लिए पोर्ट रेंज फायरवॉल में खोलें। अपलोड के बाद फ़ाइल अनुमति और वेब से पहुँच की जाँच करें।"
        ],
        steps: [
          "DNS नाम और IP सत्यापित करें।",
          "IIS बाइंडिंग, app pool और NTFS अनुमति जाँचें।",
          "सर्टिफिकेट chain, नाम और 443 बाइंडिंग जाँचें।",
          "HTTP→HTTPS redirect और HSTS लागू कर परीक्षण करें।"
        ],
        table: {
          head: ["त्रुटि", "संभावित कारण", "जाँच"],
          rows: [
            ["404", "path/binding गलत", "site path, host header"],
            ["403", "NTFS/auth/anonymous", "permissions, authentication"],
            ["HTTPS warning", "chain/नाम गलत", "certificate SAN/root"],
            ["FTP login fail", "auth/ports", "FTPS, passive range"]
          ]
        }
      },
      en: {
        title: "The HTTPS chain — from DNS to certificate",
        lead: "If a website does not open, IIS is not the only suspect; check DNS, firewall, binding, certificate and NTFS permission.",
        paragraphs: [
          "First check the name-to-IP mapping with nslookup. Then confirm ports 80/443 are open, the IIS binding host header is correct and the application pool is running. A 403 usually means NTFS or anonymous authentication; a 404 means a wrong path or binding.",
          "Check the certificate name (SAN), validity and full chain. An internal CA root must be trusted on the client. Protect the private key and password-protect exports. Redirect HTTP to HTTPS, then enable HSTS.",
          "Use FTPS or SFTP instead of plain FTP, which sends passwords in clear text. Open the passive port range in the firewall. After upload, verify file permissions and web access."
        ],
        steps: [
          "Verify the DNS name and IP.",
          "Check IIS binding, app pool and NTFS permission.",
          "Check certificate chain, name and port 443 binding.",
          "Apply HTTP→HTTPS redirect and HSTS, then test."
        ],
        table: {
          head: ["Error", "Likely cause", "Check"],
          rows: [
            ["404", "Wrong path/binding", "Site path, host header"],
            ["403", "NTFS/auth/anonymous", "Permissions, authentication"],
            ["HTTPS warning", "Wrong chain/name", "Certificate SAN/root"],
            ["FTP login fail", "Auth/ports", "FTPS, passive range"]
          ]
        }
      }
    },
    viva: [
      { q: "IIS बाइंडिंग क्या तय करती है?", qEn: "What does an IIS binding define?", a: "IP, पोर्ट और host header — यानी किस पते/नाम पर साइट सुनाई देगी।", aEn: "IP, port and host header — which address/name the site listens on." },
      { q: "HTTPS के लिए क्या आवश्यक है?", qEn: "What is required for HTTPS?", a: "वैध सर्टिफिकेट, 443 बाइंडिंग, सही chain और निजी key।", aEn: "A valid certificate, port 443 binding, correct chain and private key." },
      { q: "403 और 404 में अंतर?", qEn: "Difference between 403 and 404?", a: "403 अनुमति नहीं; 404 फ़ाइल/पथ नहीं मिला।", aEn: "403 means forbidden; 404 means the file/path was not found." },
      { q: "वेब बैकअप में क्या शामिल करें?", qEn: "What should a web backup include?", a: "साइट फ़ाइलें, कॉन्फ़िगरेशन, सर्टिफिकेट (key सहित), डेटाबेस और लॉग।", aEn: "Site files, configuration, certificates (with key), databases and logs." }
    ]
  };

  D[23] = {
    model3d: null,
    fullForms: ["OS", "BIOS", "UEFI", "ACL", "IPsec", "GPO", "SIEM", "SOC", "MFA", "RDP", "SMB", "NTFS", "USB", "UPS", "RPO", "RTO"],
    en: {
      title: "Server Security — Hardening, Auditing, Firewall and Incident Response",
      subtitle: "Module 23 · Hardening and monitoring",
      tagline: "Reduce the attack surface first, then detect what remains.",
      intro: "A server must be hardened before it is monitored. This chapter covers account, service, patch and port hardening; audit policy, event logs and monitoring; Windows Firewall and IPsec; malware protection, backup and incident response; and a hardening baseline drill.",
      outcomes: [
        "Harden accounts, services, patches and network ports.",
        "Configure audit policy and event-log monitoring.",
        "Use Windows Firewall and IPsec rules.",
        "Plan malware protection, backup and incident response.",
        "Build and verify a server hardening baseline."
      ],
      sections: [
        ["Hardening — accounts, services, patch and ports", "Rename or disable default accounts, enforce strong passwords and least privilege, remove unnecessary roles, disable unused services and close unused ports. Apply patches on a schedule and after risk review. Disable SMBv1, restrict RDP and remove unused USB storage where policy requires."],
        ["Audit policy, event logs and monitoring", "Enable auditing for logon, account management, policy change, privilege use and object access. Forward logs to a central collector so an attacker cannot simply clear them. Monitor failed logons, new admin accounts, service changes and unexpected restarts. Alert on patterns, not only single events."],
        ["Windows Firewall and IPsec", "Use the firewall profile for domain, private and public networks; allow only required ports and scope them to trusted addresses. IPsec can authenticate and encrypt traffic between servers. Test rules carefully and log dropped packets when troubleshooting."],
        ["Malware protection, backup and incident response", "Use endpoint protection, controlled updates and application restrictions. Keep offline/immutable backups and test restores. An incident response plan defines identification, containment, eradication, recovery and lessons learned. Preserve evidence and communicate through a single owner."],
        ["Lab drill: DC01 hardening baseline and audit verification", "Apply a baseline: admin rename, password policy, SMBv1 off, RDP restricted, firewall rules, audit policy and backup. Then attempt a failed logon and a blocked port, and verify that events appear in the log. Document the before/after state."]
      ]
    },
    mastery: {
      hi: {
        title: "हार्डनिंग बेसलाइन — कम सतह, अधिक दृश्यता",
        lead: "हार्डनिंग का उद्देश्य सर्वर को अजेय बनाना नहीं, हमले की सतह घटाना और हर महत्वपूर्ण घटना दिखाना है।",
        paragraphs: [
          "हर सेवा और पोर्ट एक दरवाजा है। जो सेवा उपयोग नहीं हो रही, उसे बंद करें; जो पोर्ट आवश्यक नहीं, उसे फायरवॉल से ब्लॉक करें। RDP को सीधे इंटरनेट पर न खोलें; VPN या jump host का उपयोग करें और MFA लगाएँ।",
          "ऑडिट लॉग स्थानीय रहें तो हमलावर उन्हें मिटा सकता है। लॉग को केंद्रीय सर्वर/SIEM पर भेजें और केवल स्टोर न करें — अलर्ट बनाएँ। रात में admin लॉगिन, अचानक नया admin अकाउंट और बार-बार failed logon जैसे संकेत देखें।",
          "इंसिडेंट रिस्पॉन्स में पहले फैलाव रोकें, फिर सबूत सुरक्षित रखें। तुरंत फॉर्मेट या वाइप करना सबूत नष्ट कर सकता है। बैकअप से बहाली से पहले पुष्टि करें कि बैकअप भी संक्रमित नहीं है।"
        ],
        steps: [
          "अनावश्यक अकाउंट, सेवा, रोल और पोर्ट हटाएँ।",
          "मजबूत पासवर्ड, MFA, least privilege और पैच लागू करें।",
          "ऑडिट नीति और केंद्रीय लॉग/अलर्ट सेट करें।",
          "ऑफ़लाइन बैकअप और इंसिडेंट रिस्पॉन्स योजना जाँचें।"
        ],
        table: {
          head: ["जोखिम", "हार्डनिंग", "निगरानी"],
          rows: [
            ["खुला RDP", "VPN/jump host + MFA", "RDP लॉगिन अलर्ट"],
            ["पुराना SMB", "SMBv1 बंद", "SMB ऑडिट"],
            ["अनावश्यक सेवा", "सेवा disable", "सेवा परिवर्तन लॉग"],
            ["रैनसमवेयर", "ऑफ़लाइन बैकअप", "फ़ाइल एन्क्रिप्शन/मास डिलीट अलर्ट"]
          ]
        }
      },
      en: {
        title: "A hardening baseline — smaller surface, greater visibility",
        lead: "Hardening is not about making a server invincible; it is about reducing the attack surface and making every important event visible.",
        paragraphs: [
          "Every service and port is a door. Disable services that are not used and block ports that are not required. Do not expose RDP directly to the Internet; use a VPN or jump host and enforce MFA.",
          "If audit logs stay local, an attacker can erase them. Forward logs to a central collector/SIEM and create alerts, not just storage. Watch for after-hours admin logins, new admin accounts and repeated failed logons.",
          "In incident response, contain the spread first and preserve evidence. Immediately formatting or wiping can destroy evidence. Before restoring from backup, confirm the backup itself is not infected."
        ],
        steps: [
          "Remove unnecessary accounts, services, roles and ports.",
          "Apply strong passwords, MFA, least privilege and patches.",
          "Configure audit policy and central logging/alerts.",
          "Verify offline backups and the incident response plan."
        ],
        table: {
          head: ["Risk", "Hardening", "Monitoring"],
          rows: [
            ["Exposed RDP", "VPN/jump host + MFA", "RDP login alerts"],
            ["Legacy SMB", "Disable SMBv1", "SMB audit"],
            ["Unused service", "Disable service", "Service change log"],
            ["Ransomware", "Offline backup", "Mass encryption/deletion alerts"]
          ]
        }
      }
    },
    viva: [
      { q: "हार्डनिंग का उद्देश्य क्या है?", qEn: "What is the goal of hardening?", a: "हमले की सतह घटाना — अनावश्यक खाते, सेवाएँ, पोर्ट और अधिकार हटाना।", aEn: "Reduce the attack surface by removing unnecessary accounts, services, ports and rights." },
      { q: "ऑडिट लॉग केंद्रीय क्यों करते हैं?", qEn: "Why centralise audit logs?", a: "स्थानीय लॉग हमलावर मिटा सकता है; केंद्रीय संग्रह से छेड़छाड़ और निगरानी आसान होती है।", aEn: "An attacker can erase local logs; central collection resists tampering and enables monitoring." },
      { q: "RDP को सुरक्षित कैसे करें?", qEn: "How do you secure RDP?", a: "सीधे इंटरनेट पर न खोलें; VPN/jump host, MFA, सीमित IP और मजबूत पासवर्ड।", aEn: "Do not expose it directly; use VPN/jump host, MFA, IP restriction and strong passwords." },
      { q: "इंसिडेंट में पहला कदम?", qEn: "First step in an incident?", a: "फैलाव रोकना और सबूत सुरक्षित रखना, फिर जाँच और बहाली।", aEn: "Contain the spread and preserve evidence, then investigate and recover." }
    ]
  };

  D[24] = {
    model3d: null,
    fullForms: ["OS", "CLI", "SSH", "SFTP", "NFS", "SMB", "LVM", "APT", "DNF", "YUM", "RPM", "DEB", "GRUB", "SUID", "SGID", "UUID", "NIC"],
    en: {
      title: "Linux Server — Permissions, Packages, SSH and Troubleshooting",
      subtitle: "Module 24 · Open-source server",
      tagline: "In Linux, ownership and permission bits decide access before any application runs.",
      intro: "This chapter builds Linux server skills: filesystem and users/groups, permissions with chmod/chown/umask, installation and package management, services, networking, SSH and file sharing, monitoring and troubleshooting, and a Linux file-server drill.",
      outcomes: [
        "Manage Linux filesystems, users, groups and permissions.",
        "Install software with apt/dnf and manage partitions.",
        "Configure services, SSH and Samba/NFS sharing.",
        "Monitor and troubleshoot with top, df, journalctl and ss.",
        "Build a Linux file server with users, shares and SSH."
      ],
      sections: [
        ["Filesystem, users/groups and permissions (rwx, chmod/chown, umask)", "Linux permissions have owner, group and other classes with read/write/execute bits. chmod sets modes, chown changes ownership and umask controls default permissions. Directories need execute to enter. Understand SUID, SGID and sticky bit, and avoid 777 as a shortcut."],
        ["Installation, partitioning and package management (apt/dnf)", "Plan /, /home, /var and swap; use LVM for flexible growth. Debian/Ubuntu uses apt and .deb; Fedora/RHEL uses dnf/yum and .rpm. Update indexes, install only trusted repositories, and verify services after upgrades."],
        ["Services, networking, SSH and file sharing (Samba/NFS)", "systemd starts and enables services with systemctl. Configure static networking, hostname and DNS. SSH uses keys and should disable root login and password auth where possible. Samba shares files with Windows; NFS shares with Unix clients; match UID/GID and permissions."],
        ["Monitoring, logs and troubleshooting (top, df, journalctl, ss)", "Use top/htop for CPU and memory, df/du for disk, free for memory, ss for sockets and journalctl for logs. Check service status, firewall and SELinux/AppArmor before changing configuration. Test with curl, ping, ssh and mount, and record the change."],
        ["Lab drill: Linux file server — users, shares, SSH and verification", "Create users and groups, a shared directory with SGID, Samba and/or NFS exports, SSH key login, firewall rules and a backup. Verify access from a client, check logs and reboot to confirm persistence."]
      ]
    },
    mastery: {
      hi: {
        title: "Linux अनुमति बिट्स — 777 से बचें",
        lead: "हर फ़ाइल को 777 देना समस्या का समाधान नहीं, सुरक्षा का अंत है। सही मालिक, समूह और न्यूनतम बिट चुनें।",
        paragraphs: [
          "rwx = 4+2+1 = 7। 755 का अर्थ मालिक को पूरा अधिकार, समूह और अन्य को पढ़ने/चलाने का। 644 फ़ाइल के लिए सामान्य है, 600 निजी फ़ाइल के लिए। डायरेक्टरी में x बिट के बिना उसके अंदर प्रवेश नहीं हो सकता, चाहे r बिट हो।",
          "SGID किसी डायरेक्टरी में बनने वाली फ़ाइल का समूह उसी डायरेक्टरी का समूह बनाता है — साझा फ़ोल्डर के लिए उपयोगी। Sticky bit (जैसे /tmp पर 1777) दूसरों को केवल अपनी फ़ाइल हटाने देता है। SUID का उपयोग कम करें और नियमित ऑडिट करें।",
          "umask डिफ़ॉल्ट अनुमति घटाता है: umask 022 से नई फ़ाइल 644 और डायरेक्टरी 755 बनती है। SSH में password की जगह key, root login बंद और sudo का सीमित उपयोग करें। SELinux/AppArmor चालू रखें और उसे disable करके समस्या न छिपाएँ।"
        ],
        steps: [
          "मालिक और समूह तय कर chown/chgrp लगाएँ।",
          "न्यूनतम chmod बिट्स सेट करें; 777 से बचें।",
          "umask और SGID से साझा फ़ोल्डर नीति लागू करें।",
          "SSH key, firewall और SELinux स्थिति सत्यापित करें।"
        ],
        table: {
          head: ["अनुमति", "अर्थ", "उपयोग"],
          rows: [
            ["644", "rw-r--r--", "सामान्य फ़ाइल"],
            ["755", "rwxr-xr-x", "प्रोग्राम/डायरेक्टरी"],
            ["600", "rw-------", "निजी फ़ाइल"],
            ["2775", "rwxrwsr-x", "साझा SGID फ़ोल्डर"]
          ]
        }
      },
      en: {
        title: "Linux permission bits — avoid 777",
        lead: "Giving every file 777 is not a solution; it is the end of security. Choose the correct owner, group and minimum bits.",
        paragraphs: [
          "rwx = 4+2+1 = 7. 755 gives the owner full rights and group/others read and execute. 644 is normal for files and 600 for private files. Without the execute bit on a directory you cannot enter it, even with read permission.",
          "SGID makes new files in a directory inherit the directory's group, which suits shared folders. The sticky bit (such as 1777 on /tmp) lets others delete only their own files. Minimise SUID and audit it regularly.",
          "umask removes default permissions: umask 022 creates files as 644 and directories as 755. Use SSH keys instead of passwords, disable root login and limit sudo. Keep SELinux/AppArmor enabled rather than hiding problems by disabling it."
        ],
        steps: [
          "Set owner and group with chown/chgrp.",
          "Apply minimum chmod bits and avoid 777.",
          "Use umask and SGID for shared-folder policy.",
          "Verify SSH keys, firewall and SELinux state."
        ],
        table: {
          head: ["Mode", "Meaning", "Use"],
          rows: [
            ["644", "rw-r--r--", "Normal file"],
            ["755", "rwxr-xr-x", "Program/directory"],
            ["600", "rw-------", "Private file"],
            ["2775", "rwxrwsr-x", "Shared SGID folder"]
          ]
        }
      }
    },
    viva: [
      { q: "chmod 755 का अर्थ?", qEn: "What does chmod 755 mean?", a: "मालिक rwx, समूह r-x, अन्य r-x — प्रोग्राम/डायरेक्टरी के लिए सामान्य।", aEn: "Owner rwx, group r-x, others r-x — normal for a program/directory." },
      { q: "umask 022 से नई फ़ाइल कैसी बनती है?", qEn: "What mode does umask 022 give a new file?", a: "644 — डिफ़ॉल्ट 666 में से 022 घटाकर।", aEn: "644 — 666 default minus 022." },
      { q: "SSH में root login क्यों बंद करें?", qEn: "Why disable root login over SSH?", a: "हमलावर को सीधे सर्वोच्च अधिकार न मिलें; सामान्य यूज़र + sudo सुरक्षित है।", aEn: "It prevents an attacker from getting direct superuser access; a normal user plus sudo is safer." },
      { q: "journalctl किसके लिए है?", qEn: "What is journalctl used for?", a: "systemd लॉग देखने/फ़िल्टर करने के लिए — सेवा और बूट समस्याएँ जाँचने हेतु।", aEn: "Viewing and filtering systemd logs to diagnose service and boot problems." }
    ]
  };

  D[25] = {
    model3d: null,
    fullForms: ["DoS", "DDoS", "MITM", "XSS", "SQLi", "CSRF", "VPN", "DMZ", "UTM", "IDS", "IPS", "WPA2", "WPA3", "EAP", "RADIUS", "SIEM", "SOC", "ACL", "MFA"],
    en: {
      title: "Network Security — Attacks, Firewall, DMZ, Wireless and VPN",
      subtitle: "Module 25 · Defending the perimeter",
      tagline: "Assume one control will fail: layer identity, segmentation, monitoring and recovery.",
      intro: "This chapter covers threats and attacks, defence in depth, firewalls and ACLs, DMZ and UTM, wireless security and 802.1X, VPN and monitoring, hardening and policy, and a DMZ design drill for a CHNM office.",
      outcomes: [
        "Explain common attacks and defence-in-depth.",
        "Configure firewall rules, ACLs and a DMZ.",
        "Secure wireless with WPA2/WPA3 and 802.1X.",
        "Use VPN, monitoring and hardening as layers.",
        "Design DMZ rules and a security policy."
      ],
      sections: [
        ["Threats, attacks and defence-in-depth (DoS, MITM, phishing, ransomware)", "Threats include malware, phishing, DoS/DDoS, MITM, password attacks, SQL injection, XSS and ransomware. Defence in depth combines patching, least privilege, segmentation, filtering, monitoring, backups and user awareness. No single control stops everything."],
        ["Firewall, ACL, DMZ and UTM", "A firewall enforces rules by zone, address, port and application. An ACL permits or denies traffic in order; place specific rules before general ones and log denies. A DMZ hosts public services between the Internet and the LAN. UTM combines firewall, antivirus, IPS and web filtering."],
        ["Wireless security and 802.1X (WPA2/WPA3, EAP, RADIUS)", "WEP is broken; use WPA2/WPA3 with strong passphrases. WPA2/WPA3-Enterprise uses 802.1X, EAP and RADIUS for per-user authentication. Segment guest Wi-Fi from the corporate LAN and use client isolation where appropriate."],
        ["VPN, monitoring, hardening and security policy", "A VPN encrypts remote traffic and should use strong authentication. Monitor firewall, DNS and authentication logs, and alert on anomalies. Harden servers and network devices, patch promptly and maintain an incident response plan. A written policy defines acceptable use, access, backup and reporting."],
        ["Lab drill: DMZ rules and a security policy for the CHNM office", "Design three zones: Internet, DMZ and internal. Allow only 80/443 to the web server, restrict management to an admin network, and block DMZ-to-LAN except required database ports. Document rules, owner, review date and test each allow/deny case."]
      ]
    },
    mastery: {
      hi: {
        title: "डिफेंस-इन-डेप्थ — एक नियंत्रण विफल हो तो दूसरा रोके",
        lead: "कोई फायरवॉल अकेला सुरक्षा नहीं देता। पहचान, विभाजन, पैच, निगरानी, बैकअप और प्रशिक्षण मिलकर सुरक्षा बनाते हैं।",
        paragraphs: [
          "DMZ में सार्वजनिक वेब सर्वर रखें, पर उसे आंतरिक LAN तक सीधी पहुँच न दें। वेब सर्वर से डेटाबेस तक केवल आवश्यक पोर्ट खोलें और उसे न्यूनतम अधिकार वाले खाते से चलाएँ। DMZ से LAN की ओर सभी ट्रैफिक डिफ़ॉल्ट रूप से ब्लॉक करें।",
          "फिशिंग और रैनसमवेयर के लिए तकनीकी नियंत्रण पर्याप्त नहीं; उपयोगकर्ता प्रशिक्षण, MFA, ईमेल फ़िल्टर और ऑफ़लाइन बैकअप आवश्यक हैं। किसी भी संदिग्ध लिंक/अटैचमेंट को खोलने से पहले रिपोर्ट करने की संस्कृति बनाएँ।",
          "वायरलेस में WPA3 या WPA2-Enterprise, 802.1X और RADIUS उपयोग करें। गेस्ट नेटवर्क को अलग VLAN में रखें और क्लाइंट आइसोलेशन चालू करें। WPS बंद रखें और डिफ़ॉल्ट admin पासवर्ड बदलें।",
          "सुरक्षा नीति में बताएँ कि कौन क्या उपयोग कर सकता है, पासवर्ड/MFA नियम क्या हैं, लॉग कितने समय रखेंगे और घटना की रिपोर्ट कैसे होगी। नीति को वर्ष में कम से कम एक बार समीक्षा करें।"
        ],
        steps: [
          "संपत्ति और डेटा के अनुसार ज़ोन/वर्गीकरण बनाएँ।",
          "DMZ, ACL और न्यूनतम पोर्ट नियम लागू करें।",
          "MFA, पैच, लॉग/अलर्ट और ऑफ़लाइन बैकअप रखें।",
          "नीति, प्रशिक्षण और घटना अभ्यास नियमित करें।"
        ],
        table: {
          head: ["हमला", "मुख्य नियंत्रण", "अतिरिक्त परत"],
          rows: [
            ["Phishing", "ईमेल फ़िल्टर, प्रशिक्षण", "MFA, लिंक जाँच"],
            ["Ransomware", "ऑफ़लाइन बैकअप", "EDR, segmentation"],
            ["MITM", "TLS/VPN, 802.1X", "Certificate pinning"],
            ["DDoS", "Rate limit, upstream", "CDN/scrubbing"],
            ["SQLi/XSS", "Input validation", "WAF, least privilege"]
          ]
        }
      },
      en: {
        title: "Defence in depth — when one control fails, another holds",
        lead: "No firewall secures a network alone. Identity, segmentation, patching, monitoring, backup and training together create security.",
        paragraphs: [
          "Place public web servers in a DMZ but do not give them direct access to the internal LAN. Open only the required database port from the web server and run it with a least-privilege account. Block all DMZ-to-LAN traffic by default.",
          "Technical controls are not enough for phishing and ransomware; user training, MFA, email filtering and offline backup are essential. Build a culture where suspicious links or attachments are reported before they are opened.",
          "Use WPA3 or WPA2-Enterprise with 802.1X and RADIUS. Put guest Wi-Fi in a separate VLAN and enable client isolation. Disable WPS and change default admin passwords.",
          "A security policy states who may use what, password/MFA rules, log retention and how to report an incident. Review it at least once a year."
        ],
        steps: [
          "Create zones and classification based on assets and data.",
          "Apply DMZ, ACL and minimum-port rules.",
          "Maintain MFA, patches, logs/alerts and offline backups.",
          "Run regular policy review, training and incident exercises."
        ],
        table: {
          head: ["Attack", "Primary control", "Additional layer"],
          rows: [
            ["Phishing", "Email filter, training", "MFA, link inspection"],
            ["Ransomware", "Offline backup", "EDR, segmentation"],
            ["MITM", "TLS/VPN, 802.1X", "Certificate pinning"],
            ["DDoS", "Rate limit, upstream", "CDN/scrubbing"],
            ["SQLi/XSS", "Input validation", "WAF, least privilege"]
          ]
        }
      }
    },
    viva: [
      { q: "DMZ क्या है?", qEn: "What is a DMZ?", a: "इंटरनेट और आंतरिक LAN के बीच सार्वजनिक सेवाओं के लिए अलग सुरक्षा क्षेत्र।", aEn: "A separate security zone for public services between the Internet and the internal LAN." },
      { q: "फिशिंग से बचाव के उपाय?", qEn: "How do you prevent phishing?", a: "ईमेल फ़िल्टर, लिंक/डोमेन जाँच, MFA और उपयोगकर्ता प्रशिक्षण।", aEn: "Email filtering, link/domain inspection, MFA and user training." },
      { q: "802.1X क्या प्रदान करता है?", qEn: "What does 802.1X provide?", a: "नेटवर्क में प्रवेश से पहले उपयोगकर्ता/डिवाइस का प्रमाणीकरण, RADIUS के साथ।", aEn: "User/device authentication before network access, typically with RADIUS." },
      { q: "रैनसमवेयर से बचाव का सबसे मजबूत कदम?", qEn: "Strongest defence against ransomware?", a: "ऑफ़लाइन/immutable बैकअप और टेस्टेड restore; साथ में segmentation और patching।", aEn: "Offline/immutable backups with tested restores, plus segmentation and patching." }
    ]
  };
})();
