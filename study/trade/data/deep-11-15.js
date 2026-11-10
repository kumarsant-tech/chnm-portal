/* Trade Theory · Deep bilingual layer — अध्याय 11–15 */
(function () {
  "use strict";
  var D = (window.TRADE_DEEP = window.TRADE_DEEP || {});

  D[11] = {
    model3d: "motherboard",
    fullForms: ["CPU", "RAM", "GPU", "BIOS", "UEFI", "PCIe", "SATA", "SSD", "HDD", "PSU", "DDR", "M.2", "TPM", "XMP"],
    en: {
      title: "Upgrading — Motherboard, CPU, RAM, Graphics Card, BIOS and Software",
      subtitle: "Module 11 · Making an old PC faster at a sensible cost",
      tagline: "An upgrade is worth doing only when the bottleneck is removed, not when a part merely looks newer.",
      intro: "Upgrades should solve a measured bottleneck. This chapter covers motherboard, CPU, RAM and graphics upgrades; BIOS updates and extra settings; system and application software updates; upgrade limits, specifications and economics; and a RAM/SSD upgrade with verification.",
      outcomes: [
        "Plan motherboard, CPU, RAM and graphics upgrades for compatibility.",
        "Update BIOS safely and configure additional settings.",
        "Update system and application software without breaking drivers.",
        "Evaluate upgrade limits, specifications and cost-effectiveness.",
        "Perform and verify a RAM/SSD upgrade."
      ],
      sections: [
        ["Motherboard, CPU, RAM and graphics card upgrades", "Match the socket, chipset, RAM generation, case size and PSU before buying. A CPU upgrade may need a BIOS update; a GPU upgrade may need more +12 V current and physical clearance. A motherboard swap may require a new Windows licence and driver reinstall. Plan the whole chain, not one part."],
        ["BIOS upgrade and additional settings", "Download the exact vendor update, read the release notes, connect a UPS and use the built-in flash tool. After updating, restore settings deliberately: boot order, AHCI, virtualisation, Secure Boot and fan curves. Never interrupt flashing or use an unverified file."],
        ["System and application software updates", "Update the OS, drivers, firmware and applications from trusted sources. Create a restore point or image first. Update chipset and storage drivers before optional utilities, reboot when asked and verify device manager for warnings. Remove abandoned software rather than stacking updates forever."],
        ["Upgrade limits, specifications and economy", "A CPU upgrade is limited by socket and cooling; RAM by slot count and generation; storage by interface and form factor; graphics by PSU, slot and case. Compare the cost with a new or used system and with the user's real workload. An SSD usually gives the most visible improvement for the least money."],
        ["Bench drill: RAM/SSD upgrade and verification", "Record the original specification and benchmark, power down and discharge, fit the correct SO-DIMM/DIMM or M.2/SATA drive, then verify capacity, speed, SMART, boot time and application launch. Run a stability test and keep the old part labelled for rollback."]
      ]
    },
    mastery: {
      hi: {
        title: "अपग्रेड से पहले बाधा (bottleneck) मापें",
        lead: "सबसे तेज़ CPU लगाने से भी धीमा सिस्टम तेज़ नहीं होगा यदि बाधा डिस्क, RAM या ताप है। पहले मापें, फिर खरीदें।",
        paragraphs: [
          "Task Manager, Resource Monitor और benchmarking tools से देखें कि कौन-सा संसाधन 100% पर है। HDD 100% और CPU 30% हो तो SSD सबसे बड़ा सुधार देगा। RAM भरी रहती हो और disk paging हो रही हो तो RAM बढ़ाएँ। GPU 100% और CPU कम हो तो ग्राफ़िक्स अपग्रेड सार्थक है।",
          "अपग्रेड की कुल लागत में नया PSU, कूलर, केस और संभावित Windows लाइसेंस जोड़ें। पुराने सॉकेट पर महँगा CPU खरीदने से बेहतर हो सकता है कि बोर्ड+CPU+RAM का बंडल बदला जाए। हर अपग्रेड के बाद पहले जैसा काम चलाकर वास्तविक सुधार मापें, केवल स्पेसिफिकेशन न देखें।",
          "BIOS अपडेट तभी करें जब नया CPU/सिक्योरिटी फिक्स उसकी माँग करे। बिजली जाने पर बोर्ड ब्रिक हो सकता है; UPS अनिवार्य है। अपडेट से पहले मौजूदा वर्ज़न और सेटिंग्स की फोटो लें, ताकि रोलबैक या री-कॉन्फ़िगर आसान हो।"
        ],
        steps: [
          "Task Manager/benchmark से बाधा पहचानें।",
          "सॉकेट, RAM पीढ़ी, PSU और केस की अनुकूलता जाँचें।",
          "कुल लागत की तुलना नए/पुराने सिस्टम से करें।",
          "अपग्रेड के बाद पहले/बाद का प्रदर्शन मापकर सत्यापित करें।"
        ],
        table: {
          head: ["बाधा", "संकेत", "किफायती अपग्रेड"],
          rows: [
            ["धीमी डिस्क", "Disk 100%, boot धीमा", "SATA/NVMe SSD"],
            ["कम RAM", "paging, कई टैब पर रुकावट", "RAM मॉड्यूल"],
            ["ग्राफ़िक्स", "GPU 100%, गेम में फ्रेम गिरना", "GPU + PSU"],
            ["ताप/थ्रॉटल", "तापमान उच्च, क्लॉक गिरना", "कूलर/पेस्ट/एयरफ्लो"]
          ]
        }
      },
      en: {
        title: "Measure the bottleneck before upgrading",
        lead: "Even the fastest CPU will not help if the bottleneck is storage, RAM or heat. Measure first, then buy.",
        paragraphs: [
          "Use Task Manager, Resource Monitor and benchmarks to see which resource sits at 100%. If the HDD is at 100% while the CPU is at 30%, an SSD gives the biggest gain. If RAM is full and the system is paging, add memory. If the GPU is at 100% and the CPU is low, a graphics upgrade makes sense.",
          "Include a new PSU, cooler, case and possible Windows licence in the total cost. On an old socket, a board+CPU+RAM bundle may be better value than an expensive CPU. After each upgrade, measure the real improvement with the same workload instead of trusting specifications.",
          "Update BIOS only when a new CPU or security fix requires it. A power failure can brick the board, so a UPS is mandatory. Photograph the current version and settings so rollback or reconfiguration is easy."
        ],
        steps: [
          "Identify the bottleneck with Task Manager/benchmarks.",
          "Check socket, RAM generation, PSU and case compatibility.",
          "Compare total cost with a new or used system.",
          "Verify the upgrade by measuring before/after performance."
        ],
        table: {
          head: ["Bottleneck", "Signal", "Cost-effective upgrade"],
          rows: [
            ["Slow storage", "Disk 100%, slow boot", "SATA/NVMe SSD"],
            ["Low RAM", "Paging, stalls with tabs", "RAM module"],
            ["Graphics", "GPU 100%, low game FPS", "GPU + PSU"],
            ["Heat/throttle", "High temperature, low clock", "Cooler/paste/airflow"]
          ]
        }
      }
    },
    viva: [
      { q: "अपग्रेड से पहले क्या मापना चाहिए?", qEn: "What should be measured before an upgrade?", a: "CPU, RAM, डिस्क और GPU का उपयोग व तापमान, ताकि असली बाधा पता चले।", aEn: "CPU, RAM, disk and GPU usage plus temperature to find the real bottleneck." },
      { q: "BIOS अपग्रेड में UPS क्यों?", qEn: "Why use a UPS during a BIOS upgrade?", a: "फ्लैशिंग के बीच बिजली जाने पर मदरबोर्ड स्थायी रूप से बंद हो सकता है।", aEn: "A power loss during flashing can permanently brick the motherboard." },
      { q: "SSD अपग्रेड का सबसे बड़ा लाभ?", qEn: "Biggest benefit of an SSD upgrade?", a: "बूट, एप्लिकेशन लोड और फ़ाइल खोलने की गति में बड़ा सुधार।", aEn: "A large improvement in boot, application loading and file access speed." },
      { q: "CPU अपग्रेड की सीमाएँ क्या हैं?", qEn: "What limits a CPU upgrade?", a: "सॉकेट, चिपसेट, BIOS समर्थन, कूलिंग और PSU/बोर्ड की क्षमता।", aEn: "Socket, chipset, BIOS support, cooling and PSU/board capability." }
    ]
  };

  D[12] = {
    model3d: null,
    fullForms: ["USB", "U3", "SD", "microSD", "NAS", "SAN", "DAS", "DAT", "LTO", "WORM", "RAID", "RPO", "RTO", "SSD", "HDD"],
    en: {
      title: "Backup Devices — Pen Drive, U3, Memory Card, Zip, Tape, Optical Media and Strategy",
      subtitle: "Module 12 · The second, third and fourth copy of your data",
      tagline: "A backup is only real after a successful restore test.",
      intro: "Backup is a strategy, not a device. This chapter covers pen drives, U3, memory cards and external USB drives; Zip, tape and DAT; optical writers and WORM media; backup strategy, verification and new trends; and a backup/restore drill.",
      outcomes: [
        "Choose and service pen drives, memory cards and external USB drives.",
        "Explain Zip, tape and DAT backup devices.",
        "Compare CD/DVD/Blu-ray writers and archival media.",
        "Design a 3-2-1 backup strategy and verify restores.",
        "Perform a backup and restore verification."
      ],
      sections: [
        ["Pen drive, U3, memory card and external USB drive", "A pen drive uses NAND flash and a USB controller; U3 added a portable application launcher. Memory cards use SD/microSD interfaces, and external USB drives package a HDD/SSD with a bridge board. Faults include a broken connector, corrupt file system, controller failure and unsafe ejection."],
        ["Zip drive, tape drive and DAT", "Zip disks offered removable magnetic storage in the 1990s; tape drives such as DAT and LTO write sequentially and remain useful for large archival backups. Tape is cheap per terabyte but slow for random access and needs a catalogue for restore."],
        ["CD/DVD/Blu-ray writer, MOD and WORM", "Optical writers burn dye or phase-change layers with a laser. Blu-ray offers higher capacity; MOD is magneto-optical; WORM media can be written once and read many times for compliance. Keep discs away from light, heat and scratches and verify after burning."],
        ["Backup strategy, verification and new trends", "Follow 3-2-1: three copies, two media types, one offsite; add one offline or immutable copy against ransomware. Define RPO and RTO, schedule full and incremental backups, encrypt sensitive data and test restores regularly. Cloud backup is convenient but still needs a local copy and retention policy."],
        ["Bench drill: backup and restore verification", "Select a folder, back it up to two destinations, record checksums, delete the source copy in a test area, restore and compare. A backup that has never been restored is only a hope. Log the date, size, destination and result."]
      ]
    },
    mastery: {
      hi: {
        title: "3-2-1 और रैनसमवेयर — बैकअप की असली परीक्षा",
        lead: "रैनसमवेयर नेटवर्क से जुड़े बैकअप को भी एन्क्रिप्ट कर सकता है। इसलिए कम से कम एक प्रति ऑफ़लाइन या immutable होनी चाहिए।",
        paragraphs: [
          "3-2-1 का मतलब: डेटा की तीन प्रतियाँ, दो अलग मीडिया पर और एक स्थान से बाहर। इसका विस्तार 3-2-1-1-0 है — एक ऑफ़लाइन प्रति, शून्य सत्यापित त्रुटियाँ। हर संगठन को RPO (कितना डेटा खो सकता है) और RTO (कितनी जल्दी बहाली चाहिए) तय करना चाहिए।",
          "बैकअप को समय-समय पर restore करके जाँचें। केवल 'बैकअप सफल' संदेश पर भरोसा न करें; फ़ाइल खोलकर, checksum मिलाकर और डेटाबेस शुरू करके देखें। इंक्रीमेंटल और फुल बैकअप का शेड्यूल बनाएँ और पुरानी प्रतियाँ नियम के अनुसार हटाएँ।",
          "USB ड्राइव को सुरक्षित निकालें, कभी लिखते समय न निकालें। महत्वपूर्ण डेटा एन्क्रिप्ट करें और बैकअप मीडिया को लॉकर/अलग स्थान पर रखें। क्लाउड बैकअप इंटरनेट बंद होने पर काम नहीं आएगा; इसलिए लोकल प्रति अनिवार्य है।"
        ],
        steps: [
          "RPO/RTO और डेटा की प्राथमिकता तय करें।",
          "तीन प्रतियाँ, दो मीडिया, एक ऑफ़साइट और एक ऑफ़लाइन रखें।",
          "एन्क्रिप्शन, शेड्यूल और रिटेंशन लागू करें।",
          "नियमित restore टेस्ट और checksum सत्यापन करें।"
        ],
        table: {
          head: ["मीडिया", "गति", "उपयोग"],
          rows: [
            ["External HDD/SSD", "तेज़", "दैनिक/साप्ताहिक बैकअप"],
            ["NAS", "नेटवर्क", "केंद्रीय शेयर बैकअप"],
            ["Tape/LTO", "धीमा", "बड़ा दीर्घकालिक संग्रह"],
            ["Optical WORM", "मध्यम", "कानूनी/अपरिवर्तनीय संग्रह"]
          ]
        }
      },
      en: {
        title: "3-2-1 and ransomware — the real test of a backup",
        lead: "Ransomware can encrypt backups that are online. Keep at least one copy offline or immutable.",
        paragraphs: [
          "3-2-1 means three copies of data, on two different media, with one offsite. It extends to 3-2-1-1-0: one offline copy and zero verified errors. Every organisation must define RPO (how much data it can lose) and RTO (how fast it must recover).",
          "Test restores periodically. Do not trust a 'backup successful' message; open files, compare checksums and start the database. Schedule full and incremental backups and retire old copies according to a retention policy.",
          "Eject USB drives safely and never while writing. Encrypt sensitive backups and keep media in a locker or separate site. Cloud backup fails when the internet is down, so a local copy is mandatory."
        ],
        steps: [
          "Define RPO/RTO and data priority.",
          "Keep three copies, two media, one offsite and one offline.",
          "Apply encryption, schedule and retention.",
          "Run regular restore tests and checksum verification."
        ],
        table: {
          head: ["Media", "Speed", "Use"],
          rows: [
            ["External HDD/SSD", "Fast", "Daily/weekly backup"],
            ["NAS", "Network", "Central share backup"],
            ["Tape/LTO", "Slow", "Large long-term archive"],
            ["Optical WORM", "Moderate", "Legal/immutable archive"]
          ]
        }
      }
    },
    viva: [
      { q: "3-2-1 नियम क्या है?", qEn: "What is the 3-2-1 rule?", a: "तीन प्रतियाँ, दो अलग मीडिया और एक प्रति ऑफ़साइट; रैनसमवेयर के लिए एक ऑफ़लाइन प्रति जोड़ें।", aEn: "Three copies, two different media and one offsite; add one offline copy against ransomware." },
      { q: "बैकअप सत्यापन कैसे करें?", qEn: "How do you verify a backup?", a: "फ़ाइलें restore करके खोलें, checksum मिलाएँ और आवश्यक सेवा/डेटाबेस चलाकर देखें।", aEn: "Restore files, open them, compare checksums and run the required service/database." },
      { q: "टेप बैकअप का लाभ?", qEn: "Advantage of tape backup?", a: "प्रति TB लागत कम और दीर्घकालिक ऑफ़लाइन संग्रह के लिए उपयुक्त; रैंडम एक्सेस धीमा है।", aEn: "Low cost per TB and good for long-term offline archives; random access is slow." },
      { q: "USB ड्राइव निकालते समय सावधानी?", qEn: "Precaution when removing a USB drive?", a: "पहले 'Safely Remove' करें; लिखते समय निकालने से फ़ाइल सिस्टम खराब हो सकता है।", aEn: "Use 'Safely Remove' first; unplugging during a write can corrupt the file system." }
    ]
  };

  D[13] = {
    model3d: null,
    fullForms: ["SoC", "RAM", "eMMC", "LCD", "OLED", "USB", "Wi-Fi", "OS", "OTA", "ADB", "IMEI", "MAC", "ESD", "PMIC"],
    en: {
      title: "Tablet — Parts, Block Diagram, Troubleshooting, Flashing and Android/iOS Ecosystem",
      subtitle: "Module 13 · Small board, big care",
      tagline: "A tablet is a sealed computer: diagnose power, display and touch before opening the glass.",
      intro: "Tablets integrate the computer, battery, touch and display in a sealed chassis. This chapter covers parts and the block diagram, multimeter tests, advanced troubleshooting and part replacement, flashing and OS recovery, the Android/iOS ecosystem and a charging-fault drill.",
      outcomes: [
        "Identify tablet parts and explain the block diagram.",
        "Use a multimeter to test battery, charging and power rails.",
        "Troubleshoot and replace common tablet parts.",
        "Flash firmware, upgrade the OS and remove malware safely.",
        "Compare Android and iOS ecosystems and hybrid app tools.",
        "Diagnose a tablet that does not charge."
      ],
      sections: [
        ["Tablet parts, block diagram and multimeter test", "A tablet contains a SoC, RAM, eMMC/UFS storage, display, touch digitizer, cameras, wireless combo, battery, PMIC and charging port. Test the charger voltage, battery voltage, charging current and USB port continuity. A swollen battery or a bent charging port is a safety issue."],
        ["Advanced troubleshooting and part replacement", "Use safe mode, recovery, battery statistics and log tools to isolate software from hardware. Replace the digitizer or display with heat and care; the adhesive and fragile ribbons are the main risks. After replacement, test touch, display, cameras, Wi-Fi and charging."],
        ["Flashing, OS upgrade, virus cleaning and formatting", "Flashing rewrites firmware and can erase data; use only the exact model firmware and a charged battery. For malware, boot safe mode, remove suspicious profiles/apps, scan and reset if needed. A factory reset erases everything; back up first."],
        ["Android/iOS ecosystem and PhoneGap", "Android is open and supports sideloading and varied hardware; iOS is closed and controlled by Apple. Both use app stores, cloud sync and update mechanisms. PhoneGap/Apache Cordova packages web apps into hybrid mobile apps using a WebView and plugins."],
        ["Bench drill: a tablet that does not charge", "Check the charger and cable with a USB meter, clean the port, test battery voltage and inspect the charging IC/PMIC. A port that wiggles needs re-soldering or replacement. If current is zero with a good charger, check the protection circuit and battery connector before replacing the board."]
      ]
    },
    mastery: {
      hi: {
        title: "टैबलेट की सुरक्षित सर्विसिंग — ग्लास, बैटरी और फर्मवेयर",
        lead: "टैबलेट खोलना सबसे नाजुक काम है: गर्मी से गोंद खोलें, प्लास्टिक टूल इस्तेमाल करें और बैटरी को कभी न छेदें।",
        paragraphs: [
          "डिस्प्ले और डिजिटाइज़र अक्सर अलग-अलग होते हैं। सिर्फ टच काम न करे तो डिजिटाइज़र/कनेक्टर जाँचें; चित्र न आए तो डिस्प्ले केबल/पैनल। गर्म हवा से गोंद नरम करें, प्लास्टिक प्राई टूल से धीरे उठाएँ और फ्लैट केबल को मोड़ें नहीं।",
          "फ्लैशिंग से पहले मॉडल नंबर, बिल्ड और क्षेत्र (region) की पुष्टि करें। गलत फर्मवेयर से डिवाइस ब्रिक हो सकता है। बैटरी 50% से अधिक चार्ज रखें, USB केबल स्थिर रखें और प्रक्रिया के बीच में न निकालें।",
          "बैटरी सूजन, गर्मी, बार-बार रीस्टार्ट और चार्जिंग पोर्ट की चिंगारी सुरक्षा के संकेत हैं। ऐसे डिवाइस को तुरंत बंद करें और बैटरी बदलें। पानी लगे डिवाइस को चालू न करें; पहले पावर अलग करके सुखाएँ और कनेक्टर साफ करें।"
        ],
        steps: [
          "चार्जर, केबल, पोर्ट और बैटरी वोल्टेज मापें।",
          "सूजी बैटरी/जला पोर्ट देखकर सुरक्षा निर्णय लें।",
          "सही मॉडल फर्मवेयर और पर्याप्त चार्ज के साथ फ्लैश करें।",
          "टच, डिस्प्ले, कैमरा, Wi-Fi और चार्जिंग का परीक्षण करें।"
        ],
        table: {
          head: ["लक्षण", "संभावित कारण", "जाँच"],
          rows: [
            ["चार्ज नहीं", "पोर्ट/चार्जर/PMIC", "USB मीटर, पोर्ट, बैटरी"],
            ["टच काम नहीं", "डिजिटाइज़र/कनेक्टर", "टच पैनल केबल"],
            ["चित्र नहीं", "डिस्प्ले/पैनल केबल", "बैकलाइट और केबल"],
            ["बार-बार रीस्टार्ट", "बैटरी/फर्मवेयर/ताप", "बैटरी वोल्टेज, सुरक्षित मोड"]
          ]
        }
      },
      en: {
        title: "Safe tablet servicing — glass, battery and firmware",
        lead: "Opening a tablet is delicate: soften adhesive with heat, use plastic tools and never puncture the battery.",
        paragraphs: [
          "The display and digitizer are often separate. If only touch fails, inspect the digitizer and connector; if there is no image, check the display cable and panel. Soften adhesive with warm air, lift with a plastic pry tool and never fold a flat cable.",
          "Before flashing, confirm the model number, build and region. Wrong firmware can brick the device. Keep the battery above 50%, secure the USB cable and never disconnect during the process.",
          "Battery swelling, heat, repeated restarts and a sparking charging port are safety signals. Power down and replace the battery immediately. Do not power on a liquid-damaged device; disconnect power, dry it and clean the connectors first."
        ],
        steps: [
          "Measure charger, cable, port and battery voltage.",
          "Make a safety decision on a swollen battery or burnt port.",
          "Flash the correct model firmware with adequate charge.",
          "Test touch, display, camera, Wi-Fi and charging."
        ],
        table: {
          head: ["Symptom", "Likely cause", "Check"],
          rows: [
            ["Not charging", "Port/charger/PMIC", "USB meter, port, battery"],
            ["Touch dead", "Digitizer/connector", "Touch panel cable"],
            ["No image", "Display/panel cable", "Backlight and cable"],
            ["Repeated restarts", "Battery/firmware/heat", "Battery voltage, safe mode"]
          ]
        }
      }
    },
    viva: [
      { q: "टैबलेट में PMIC क्या है?", qEn: "What is a PMIC in a tablet?", a: "Power Management IC — चार्जिंग, बैटरी और विभिन्न रेल के वोल्टेज को नियंत्रित करता है।", aEn: "Power Management IC: it controls charging, battery and the various voltage rails." },
      { q: "फ्लैशिंग से पहले क्या जाँचें?", qEn: "What to check before flashing?", a: "सही मॉडल/क्षेत्र का फर्मवेयर, पर्याप्त बैटरी, स्थिर USB और बैकअप।", aEn: "Correct model/region firmware, adequate battery, stable USB and a backup." },
      { q: "टच काम न करे पर डिस्प्ले ठीक हो, क्या जाँचें?", qEn: "If display works but touch does not, what do you check?", a: "डिजिटाइज़र, टच कनेक्टर, स्क्रीन प्रोटेक्टर और सॉफ्टवेयर/कैलिब्रेशन।", aEn: "The digitizer, touch connector, screen protector and software/calibration." },
      { q: "लिक्विड डैमेज डिवाइस को पहले क्या करना चाहिए?", qEn: "What is the first step for a liquid-damaged device?", a: "पावर बंद/बैटरी अलग करें, चालू न करें, सुखाकर कनेक्टर साफ करें और जाँचें।", aEn: "Power off/disconnect the battery, do not power on, dry it, clean connectors and inspect." }
    ]
  };

  D[14] = {
    model3d: null,
    fullForms: ["UPS", "AVR", "SMPS", "VRLA", "AGM", "SLA", "IGBT", "MOSFET", "PWM", "LCD", "LED", "BIS", "THD"],
    en: {
      title: "UPS — Types, Battery, Inverter, Control, Maintenance, Diagnosis and Service",
      subtitle: "Module 14 · Keeping work running when power fails",
      tagline: "A UPS buys time, not energy: size the load, test the battery and keep the transfer path healthy.",
      intro: "A UPS protects equipment from outages and poor power quality. This chapter covers UPS types and block diagrams, batteries and chargers, inverters, control and specifications, preventive maintenance and battery replacement, and fault diagnosis and service.",
      outcomes: [
        "Explain UPS types, block diagrams and working.",
        "Test and maintain batteries, chargers and inverters.",
        "Read UPS specifications, controls and indicators.",
        "Perform preventive maintenance and replace batteries safely.",
        "Diagnose and service common UPS faults."
      ],
      sections: [
        ["UPS types, block diagram and working", "Offline UPS switches to battery after a short transfer; line-interactive adds an AVR; online UPS converts AC to DC and back continuously for zero transfer time. The block diagram includes input filter, charger, battery, inverter, static switch and output. Choose by load criticality and runtime."],
        ["Battery, charger and inverter", "VRLA/AGM/SLA batteries store energy and must be charged with the correct voltage and current. A charger controls bulk, absorption and float stages. The inverter converts DC to AC using MOSFET/IGBT switching and PWM; a bad battery or inverter causes short runtime or no output."],
        ["Control, specifications and indicators", "The control board monitors mains, battery, load and temperature and drives the LCD/LED indicators and alarm. Read VA/W rating, power factor, runtime curve, transfer time, input range and battery type. Do not load a UPS above its rated capacity."],
        ["Preventive maintenance and battery replacement", "Keep the UPS ventilated, clean the vents, check terminals for corrosion and test runtime under load every few months. Replace batteries in matched sets, observe polarity and torque, and dispose of lead-acid batteries through authorised recyclers. Record the replacement date."],
        ["Faults, diagnosis and service (bench drill)", "No output with mains present suggests the fuse, input relay, charger or inverter. A short runtime suggests an aged battery or a charger that never reaches float. Overload alarms require load reduction. Measure battery voltage, charging current, output waveform and transfer time before replacing the board."]
      ]
    },
    mastery: {
      hi: {
        title: "UPS की रनटाइम गणना और बैटरी स्वास्थ्य",
        lead: "UPS केवल VA पर नहीं चुना जाता; वास्तविक लोड, पावर फैक्टर, रनटाइम और बैटरी की उम्र देखें।",
        paragraphs: [
          "रनटाइम लगभग बैटरी की क्षमता (Ah) × बैटरी वोल्टेज × inverter efficiency ÷ लोड (W) से अनुमानित होता है। उदाहरण: 12 V, 7 Ah बैटरी और 100 W लोड पर लगभग 0.7 घंटा सैद्धांतिक; वास्तविक रनटाइम उम्र और तापमान के कारण कम होगा। नई बैटरी पर भी लोड टेस्ट करें।",
          "बैटरी की उम्र 3-5 वर्ष होती है; गर्म जगह में कम। सूजी, लीक या गर्म बैटरी तुरंत बदलें। एक ही स्ट्रिंग में पुरानी और नई बैटरी मिलाने से चार्जिंग असंतुलित होती है; सेट में बदलें।",
          "ऑनलाइन UPS लगातार इन्वर्टर से चलता है, इसलिए दक्षता कम पर सुरक्षा अधिक होती है। लाइन-इंटरैक्टिव AVR वोल्टेज सुधारता है। किसी भी UPS पर लोड बढ़ाने से पहले वाट क्षमता और पावर फैक्टर देखें; केवल VA संख्या भरोसेमंद नहीं है।"
        ],
        steps: [
          "लोड के वाट और UPS की वाट क्षमता मिलाएँ।",
          "बैटरी वोल्टेज, चार्ज करंट और टर्मिनल जाँचें।",
          "लोड पर रनटाइम और ट्रांसफर समय मापें।",
          "बैटरी सेट में बदलें और रीसाइक्लिंग रिकॉर्ड रखें।"
        ],
        table: {
          head: ["लक्षण", "संभावित कारण", "जाँच"],
          rows: [
            ["मेन्स पर आउटपुट नहीं", "फ्यूज/रिले/इन्वर्टर", "इनपुट और आउटपुट वोल्टेज"],
            ["रनटाइम बहुत कम", "पुरानी/कमजोर बैटरी", "लोड टेस्ट, चार्ज वोल्टेज"],
            ["ओवरलोड अलार्म", "क्षमता से अधिक लोड", "लोड घटाएँ"],
            ["बैटरी गर्म/सूजी", "खराब बैटरी/चार्जर", "तुरंत बदलें, चार्जर जाँचें"]
          ]
        }
      },
      en: {
        title: "UPS runtime estimation and battery health",
        lead: "A UPS is not selected by VA alone; consider real load, power factor, runtime and battery age.",
        paragraphs: [
          "Runtime is roughly battery capacity (Ah) × battery voltage × inverter efficiency ÷ load (W). For example, a 12 V, 7 Ah battery at 100 W gives about 0.7 hour theoretical; real runtime is lower because of age and temperature. Load-test even a new battery.",
          "Battery life is 3–5 years, less in a hot room. Replace a swollen, leaking or hot battery immediately. Mixing old and new batteries in one string unbalances charging; replace the set together.",
          "An online UPS runs continuously through the inverter, so efficiency is lower but protection is higher. A line-interactive unit adds AVR. Before adding load, check watt rating and power factor; the VA number alone is not enough."
        ],
        steps: [
          "Match load watts with UPS watt rating.",
          "Check battery voltage, charging current and terminals.",
          "Measure runtime and transfer time under load.",
          "Replace batteries as a set and record recycling."
        ],
        table: {
          head: ["Symptom", "Likely cause", "Check"],
          rows: [
            ["No output on mains", "Fuse/relay/inverter", "Input and output voltage"],
            ["Very short runtime", "Old/weak battery", "Load test, charge voltage"],
            ["Overload alarm", "Load above rating", "Reduce load"],
            ["Hot/swollen battery", "Bad battery/charger", "Replace now; check charger"]
          ]
        }
      }
    },
    viva: [
      { q: "ऑनलाइन और ऑफलाइन UPS में अंतर?", qEn: "Difference between online and offline UPS?", a: "ऑनलाइन लगातार इन्वर्टर से चलता है (शून्य ट्रांसफर); ऑफलाइन बिजली जाने पर बैटरी पर स्विच करता है।", aEn: "Online runs continuously through the inverter (zero transfer); offline switches to battery when mains fails." },
      { q: "VRLA बैटरी क्या है?", qEn: "What is a VRLA battery?", a: "Valve-Regulated Lead-Acid — सीलबंद लेड-एसिड बैटरी जिसमें गैस वाल्व से निकलती है।", aEn: "Valve-Regulated Lead-Acid: a sealed lead-acid battery that vents gas through a valve." },
      { q: "UPS का रनटाइम कैसे बढ़ाएँ?", qEn: "How can UPS runtime be increased?", a: "लोड घटाएँ या बड़ी/अधिक बैटरी क्षमता लगाएँ; बैटरी स्वस्थ और चार्जर सही होना चाहिए।", aEn: "Reduce load or add larger/more battery capacity; batteries must be healthy and the charger correct." },
      { q: "बैटरी बदलते समय सुरक्षा?", qEn: "Safety when replacing batteries?", a: "ध्रुवता, दस्ताने, धातु के औज़ार से बचाव, वेंटिलेशन और अधिकृत रीसाइक्लिंग।", aEn: "Observe polarity, wear gloves, avoid metal tools, ventilate and recycle through an authorised channel." }
    ]
  };

  D[15] = {
    model3d: null,
    fullForms: ["OSI", "TCP", "IP", "UDP", "IPv4", "IPv6", "CIDR", "VLSM", "DNS", "DHCP", "ARP", "ICMP", "FTP", "SSH", "HTTP", "HTTPS", "LAN", "WAN", "MAC", "MTU", "TTL"],
    en: {
      title: "IP Networking — OSI/TCP-IP, Ports, IPv4 Subnetting, IPv6, Utilities and FTP/Telnet",
      subtitle: "Module 15 · Address, port and the path of a packet",
      tagline: "A packet needs an address, a port and a route — troubleshoot each layer separately.",
      intro: "Networking is layered. This chapter covers the OSI and TCP/IP models, protocols and ports, IPv4 classes and subnetting, supernetting, IPv6 basics and transition, TCP/IP utilities, FTP/Telnet and an IP connectivity drill.",
      outcomes: [
        "Explain OSI/TCP-IP layers, protocols and ports.",
        "Calculate IPv4 subnets and supernets.",
        "Describe IPv6 addressing and transition methods.",
        "Use TCP/IP utilities for troubleshooting.",
        "Explain FTP, Telnet and common protocol behaviour.",
        "Test IP connectivity in a lab."
      ],
      sections: [
        ["OSI/TCP-IP models, protocols and ports", "OSI has seven layers: physical, data link, network, transport, session, presentation and application. TCP/IP condenses them into network access, internet, transport and application. Protocols map to layers: Ethernet at data link, IP at internet, TCP/UDP at transport and HTTP, DNS, DHCP, FTP at application. Well-known ports include 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS and 3389 RDP."],
        ["IPv4 classes, subnetting and supernetting", "IPv4 is 32 bits. Classes A/B/C differ in default masks; private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. Subnetting borrows host bits for networks; calculate network, broadcast, usable range and host count. Supernetting combines contiguous networks into a shorter prefix."],
        ["IPv6 basics and transition", "IPv6 is 128 bits, written as eight hexadecimal groups, with compressed zeros and a single ::. It removes broadcast and adds link-local, global unicast and multicast addresses. Transition methods include dual stack, tunnelling and translation; SLAAC lets hosts form addresses from router advertisements."],
        ["TCP/IP utilities and troubleshooting", "Use ipconfig/ifconfig, ping, tracert/traceroute, nslookup/dig, arp, netstat/ss, telnet and curl. Work bottom-up: link and IP first, then gateway, DNS, port and application. A successful ping proves IP reachability but not that the service or firewall allows the required port."],
        ["Protocols, FTP/Telnet and IP class revision", "FTP uses separate control (21) and data channels, active/passive modes and optional TLS (FTPS). Telnet is plain text and unsafe; use SSH. SMTP sends mail, POP3/IMAP retrieve it, DNS resolves names and DHCP supplies addresses. Know which protocol is connection-oriented and which is best-effort."],
        ["Bench drill: checking IP connectivity in the lab", "Configure two PCs and a switch, assign addresses in the same subnet, test ping, then change to different subnets and add a router. Verify ARP, gateway, DNS and a blocked port. Record each command and result to build a repeatable troubleshooting sequence."]
      ]
    },
    mastery: {
      hi: {
        title: "सबनेटिंग की गणना — बिट्स से व्यावहारिक रेंज तक",
        lead: "सबनेटिंग में जल्दी बनने वाली गलती है broadcast और network address को होस्ट मान लेना। हर सबनेट में दोनों आरक्षित होते हैं।",
        paragraphs: [
          "IPv4 पता 32 बिट का होता है। /24 में 24 नेटवर्क बिट और 8 होस्ट बिट रहते हैं, इसलिए 256 पते और 254 उपयोगी होस्ट मिलते हैं। /26 में 6 होस्ट बिट रहते हैं: 64 पते, 62 होस्ट। नेटवर्क पता वह होता है जिसमें सभी होस्ट बिट 0 हों और broadcast में सभी 1।",
          "सबनेट की सीमा 256 में से block size के गुणकों पर बनती है। /26 का block size 64 है, इसलिए 192.168.1.0, .64, .128, .192 चार सबनेट बनते हैं। उपयोगी रेंज पहले पते से दूसरे अंतिम पते तक .1 से .62, .65 से .126 आदि होती है।",
          "VLSM से अलग-अलग आकार के सबनेट बनाए जाते हैं — बड़े विभाग को /24, छोटे पॉइंट-टू-पॉइंट लिंक को /30। सुपरनेटिंग कई contiguous नेटवर्क को छोटे prefix में जोड़ती है। गणना के बाद हमेशा नेटवर्क, broadcast और gateway की पुष्टि करें।"
        ],
        steps: [
          "प्रीफ़िक्स से होस्ट बिट और block size निकालें।",
          "नेटवर्क पता, पहला होस्ट, अंतिम होस्ट और broadcast लिखें।",
          "VLSM से आवश्यकता के अनुसार सबनेट बाँटें।",
          "गेटवे और DNS कॉन्फ़िगर कर ping/tracert से सत्यापित करें।"
        ],
        table: {
          head: ["प्रीफ़िक्स", "होस्ट बिट", "कुल पते", "उपयोगी होस्ट"],
          rows: [
            ["/24", "8", "256", "254"],
            ["/25", "7", "128", "126"],
            ["/26", "6", "64", "62"],
            ["/30", "2", "4", "2 (पॉइंट-टू-पॉइंट)"]
          ]
        }
      },
      en: {
        title: "Subnetting calculations — from bits to usable ranges",
        lead: "The common subnetting mistake is treating the network and broadcast addresses as hosts. Both are reserved in every subnet.",
        paragraphs: [
          "An IPv4 address is 32 bits. A /24 has 24 network bits and 8 host bits, giving 256 addresses and 254 usable hosts. A /26 leaves 6 host bits: 64 addresses and 62 hosts. The network address has all host bits 0 and the broadcast has all host bits 1.",
          "Subnet boundaries fall on multiples of the block size. A /26 has a block size of 64, so 192.168.1.0, .64, .128 and .192 are four subnets. The usable range runs from the first address to the last before broadcast: .1–.62, .65–.126 and so on.",
          "VLSM creates subnets of different sizes: a /24 for a large department and a /30 for a point-to-point link. Supernetting combines contiguous networks into a shorter prefix. After calculating, always confirm the network, broadcast and gateway."
        ],
        steps: [
          "Derive host bits and block size from the prefix.",
          "Write the network, first host, last host and broadcast.",
          "Allocate subnets with VLSM according to need.",
          "Configure gateway and DNS and verify with ping/tracert."
        ],
        table: {
          head: ["Prefix", "Host bits", "Total addresses", "Usable hosts"],
          rows: [
            ["/24", "8", "256", "254"],
            ["/25", "7", "128", "126"],
            ["/26", "6", "64", "62"],
            ["/30", "2", "4", "2 (point-to-point)"]
          ]
        }
      }
    },
    viva: [
      { q: "OSI की सात परतें बताइए।", qEn: "Name the seven OSI layers.", a: "Physical, Data Link, Network, Transport, Session, Presentation और Application।", aEn: "Physical, Data Link, Network, Transport, Session, Presentation and Application." },
      { q: "TCP और UDP में अंतर?", qEn: "Difference between TCP and UDP?", a: "TCP connection-oriented, reliable और क्रम बनाए रखता है; UDP connectionless, तेज़ पर delivery की गारंटी नहीं।", aEn: "TCP is connection-oriented and reliable with ordering; UDP is connectionless, fast but not guaranteed." },
      { q: "/26 में कितने उपयोगी होस्ट?", qEn: "How many usable hosts in a /26?", a: "62 — 64 कुल में से network और broadcast हटाकर।", aEn: "62 — 64 total minus the network and broadcast addresses." },
      { q: "ping सफल पर वेबसाइट न खुले, क्या जाँचें?", qEn: "Ping succeeds but a website does not open — what next?", a: "DNS, पोर्ट 80/443, फायरवॉल और प्रॉक्सी/ब्राउज़र सेटिंग जाँचें।", aEn: "Check DNS, ports 80/443, firewall and proxy/browser settings." }
    ]
  };
})();
