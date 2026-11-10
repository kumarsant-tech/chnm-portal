/* Trade Theory · Deep bilingual layer — अध्याय 6–10 */
(function () {
  "use strict";
  var D = (window.TRADE_DEEP = window.TRADE_DEEP || {});

  D[6] = {
    model3d: "ram",
    fullForms: ["CPU", "RAM", "ROM", "BIOS", "UEFI", "CMOS", "POST", "DIMM", "SO-DIMM", "DDR", "SPD", "XMP", "TDP", "LGA", "PGA", "BGA", "PCIe", "SATA", "M.2", "PSU"],
    en: {
      title: "Core Components — Processor, RAM, BIOS/UEFI, CMOS and No-Boot Diagnosis",
      subtitle: "Module 6 · Identifying core components",
      tagline: "Board, processor, memory and firmware must agree — compatibility is the first diagnosis.",
      intro: "This chapter identifies the core of the PC: motherboard form factors, power connectors and slots; processor sockets, chipsets and cooling; RAM generations and faults; BIOS/UEFI roles, updates and recovery; CMOS setup and battery replacement; and component-level no-boot diagnosis.",
      outcomes: [
        "Identify motherboard form factors, power connectors, slots and headers.",
        "Match CPU socket, chipset, cooling and power requirements.",
        "Differentiate RAM generations, modules and common faults.",
        "Explain BIOS/UEFI functions, update methods and recovery.",
        "Configure CMOS setup and replace the CMOS battery safely.",
        "Diagnose a no-boot PC at component level."
      ],
      sections: [
        ["Motherboard form factors, power connectors and slots", "ATX, micro-ATX, mini-ITX and proprietary boards differ in size, mounting holes, expansion slots and power headers. Identify the 24-pin ATX connector, 4/8-pin CPU power, SATA and M.2 ports, PCIe x16/x1 slots, fan headers and front-panel pins. Match the case, PSU and board before assembly."],
        ["Processor, socket, chipset, cooling and common faults", "The CPU socket may be LGA (pins on the board) or PGA (pins on the CPU); never bend or touch the contacts. The chipset connects PCIe, USB, SATA and network devices. Cooling needs a correctly mounted heatsink, fresh thermal paste and adequate airflow; overheating causes throttling, shutdowns and random errors."],
        ["RAM types, modules, connectors and faults", "DDR3, DDR4 and DDR5 differ in notch position, voltage and speed and are not interchangeable. DIMMs fit desktops; SO-DIMMs fit laptops. Faults include a dirty edge connector, wrong slot population, unstable XMP and a failed module. Test one stick at a time and use a memory test."],
        ["BIOS/UEFI functions, upgrade and recovery", "BIOS/UEFI initialises hardware, runs POST, provides setup and boots the OS. UEFI adds GPT, Secure Boot, fast boot and a graphical interface. Update firmware only from the vendor with a stable power supply; a failed update can brick the board. Use the vendor recovery method or dual-BIOS feature when available."],
        ["CMOS setup and battery replacement", "CMOS stores time, boot order and hardware settings and is kept alive by a coin cell. Symptoms of a dead cell are lost time, checksum errors and setup resets. Record settings, disconnect power, remove the battery, fit a correct CR2032 cell and restore date, boot order and security settings."],
        ["Bench drill: component-level no-boot diagnosis", "With a minimum configuration, check CPU power, RAM seating, GPU, storage and front-panel wiring. Clear CMOS, test a known-good PSU, then substitute CPU/RAM/board one at a time. Record beep codes and voltages before each substitution so the final diagnosis is evidence-based."]
      ]
    },
    mastery: {
      hi: {
        title: "अनुकूलता मैट्रिक्स — सॉकेट, चिपसेट, RAM और पावर का मिलान",
        lead: "कंप्यूटर असेंबली में सबसे महँगी गलती असंगत भाग खरीदना है। खरीदने से पहले चार चीजें मिलाएँ: सॉकेट, चिपसेट, RAM पीढ़ी और PSU।",
        paragraphs: [
          "CPU सॉकेट (जैसे LGA1700 या AM5) और चिपसेट तय करते हैं कि कौन-सी पीढ़ी का प्रोसेसर चलेगा। मदरबोर्ड निर्माता की QVL (Qualified Vendor List) देखकर RAM की गति और क्षमता जाँचें। DDR4 मॉड्यूल DDR5 स्लॉट में नहीं जाएगा; जबरदस्ती लगाने से स्लॉट और मॉड्यूल दोनों टूट सकते हैं।",
          "PSU की वाट क्षमता केवल कुल जोड़ नहीं है; +12 V रेल पर उपलब्ध करंट देखें। आधुनिक GPU अधिकतर +12 V से चलता है, इसलिए 500 W का सस्ता PSU 12 V पर कमजोर हो सकता है। CPU के लिए 4+4 पिन और GPU के लिए 6+2 पिन कनेक्टर मिलाएँ; केबल को जबरदस्ती न मोड़ें।",
          "कूलिंग में हवा का रास्ता महत्वपूर्ण है — आगे से अंदर, पीछे/ऊपर से बाहर। हीटसिंक को समान रूप से कसें और थर्मल पेस्ट पतली परत में लगाएँ। तापमान बढ़ने पर CPU थ्रॉटल करता है और सिस्टम धीमा या बंद हो सकता है; पंखा घूमना जरूरी है, पर पर्याप्त नहीं।"
        ],
        steps: [
          "CPU सॉकेट और चिपसेट समर्थन जाँचें।",
          "RAM पीढ़ी, गति और QVL अनुकूलता मिलाएँ।",
          "PSU की +12 V रेल और कनेक्टर की जाँच करें।",
          "कूलिंग, केस एयरफ्लो और BIOS अपडेट की आवश्यकता देखें।"
        ],
        table: {
          head: ["भाग", "मिलान करें", "गलत मिलान का परिणाम"],
          rows: [
            ["CPU + सॉकेट", "सॉकेट, चिपसेट, BIOS", "बूट नहीं, पिन मुड़ना"],
            ["RAM + स्लॉट", "DDR पीढ़ी, वोल्टेज", "सिस्टम शुरू नहीं"],
            ["GPU + PSU", "वाट, +12 V, कनेक्टर", "शटडाउन, अस्थिरता"],
            ["मदरबोर्ड + केस", "फॉर्म फैक्टर, स्टैंडऑफ", "शॉर्ट, फिटिंग समस्या"]
          ]
        }
      },
      en: {
        title: "Compatibility matrix — matching socket, chipset, RAM and power",
        lead: "The most expensive assembly mistake is buying incompatible parts. Match four things before purchase: socket, chipset, RAM generation and PSU.",
        paragraphs: [
          "The CPU socket (for example LGA1700 or AM5) and chipset decide which processor generations work. Check the motherboard Qualified Vendor List for RAM speed and capacity. A DDR4 module will not fit a DDR5 slot; forcing it can damage both the slot and the module.",
          "PSU wattage is not just a total: check the current available on the +12 V rail. Modern GPUs draw mostly from +12 V, so a cheap 500 W unit may be weak there. Match 4+4-pin CPU and 6+2-pin GPU connectors, and never force a cable.",
          "Cooling depends on airflow: intake at the front, exhaust at the rear/top. Tighten the heatsink evenly and apply a thin layer of thermal paste. When temperature rises, the CPU throttles and the system slows or shuts down; a spinning fan is necessary but not sufficient."
        ],
        steps: [
          "Verify CPU socket and chipset support.",
          "Match RAM generation, speed and QVL compatibility.",
          "Check the PSU +12 V rail and connector set.",
          "Review cooling, case airflow and BIOS update needs."
        ],
        table: {
          head: ["Part", "Match", "Mismatch result"],
          rows: [
            ["CPU + socket", "Socket, chipset, BIOS", "No boot; bent pins"],
            ["RAM + slot", "DDR generation, voltage", "System will not start"],
            ["GPU + PSU", "Wattage, +12 V, connectors", "Shutdowns, instability"],
            ["Board + case", "Form factor, standoffs", "Short circuit, fitment"]
          ]
        }
      }
    },
    viva: [
      { q: "LGA और PGA सॉकेट में अंतर?", qEn: "Difference between LGA and PGA sockets?", a: "LGA में पिन मदरबोर्ड पर होते हैं; PGA में पिन CPU पर। LGA के संपर्क नाजुक होते हैं, उन्हें छूना नहीं चाहिए।", aEn: "In LGA the pins are on the board; in PGA they are on the CPU. LGA contacts are delicate and must not be touched." },
      { q: "CMOS बैटरी खत्म होने के लक्षण?", qEn: "Symptoms of a dead CMOS battery?", a: "समय बार-बार रीसेट होना, BIOS चेकसम त्रुटि, बूट क्रम और सेटिंग्स का खो जाना।", aEn: "Clock resets, BIOS checksum error, lost boot order and settings." },
      { q: "DDR4 और DDR5 बदले जा सकते हैं?", qEn: "Can DDR4 and DDR5 be swapped?", a: "नहीं, नॉच और वोल्टेज अलग हैं; स्लॉट भी अलग है और जबरदस्ती नुकसान करेगी।", aEn: "No, their notch and voltage differ, and the slots are different; forcing them causes damage." },
      { q: "BIOS अपडेट में सावधानी क्या है?", qEn: "What precautions apply to a BIOS update?", a: "केवल निर्माता की फाइल, स्थिर बिजली/UPS, सही मॉडल और अपडेट के दौरान बिजली न काटें।", aEn: "Use only the vendor file, stable power/UPS and the correct model, and never cut power during the update." }
    ]
  };

  D[7] = {
    model3d: null,
    fullForms: ["RAM", "SO-DIMM", "HDD", "SSD", "SATA", "AHCI", "POST", "BIOS", "UEFI", "CMOS", "LCD", "LED", "USB", "Wi-Fi", "M.2"],
    en: {
      title: "Laptop — Block Diagram, Input System, Disassembly, Battery and Upgrade",
      subtitle: "Module 7 · Laptop servicing",
      tagline: "Small spaces demand discipline: photograph, label and discharge before you open a laptop.",
      intro: "Laptops pack the same subsystems into a portable chassis with tight connectors, a battery and integrated input devices. This chapter covers laptop types and sections, touchpad and docking input, safe disassembly and part replacement, battery/adapter/RAM/storage upgrades, POST and OS installation, repair tools and a no-power drill.",
      outcomes: [
        "Explain laptop types, block diagram and internal sections.",
        "Service touchpad, trackball, trackpoint and docking stations.",
        "Disassemble and reassemble a laptop safely and replace parts.",
        "Test and replace batteries, adapters, RAM, storage and wireless cards.",
        "Interpret POST codes and configure SATA/AHCI during OS installation.",
        "Use modern repair tools and diagnose a no-power laptop."
      ],
      sections: [
        ["Laptop types, block diagram and sections", "Laptops range from ultrabooks to gaming and rugged models. The block diagram includes the SoC/CPU, RAM, storage, display, touch controller, keyboard, battery/charging circuit, wireless card, camera and I/O. The lower assembly holds the board and battery; the upper assembly holds the panel, hinge and input."],
        ["Input system — touchpad, trackball, trackpoint and docking station", "A touchpad uses capacitive sensing and a controller; a trackpoint uses a strain-gauge stick; a trackball rotates a ball sensed optically or mechanically. Docking stations extend ports and power. Faults include a disabled touchpad, loose FPC cable, swollen battery pressing the pad and a dirty trackpoint."],
        ["Disassembly, assembly and part replacement", "Remove power and battery first, then use the service manual and an anti-static workspace. Keep screws in a labelled tray, photograph cable routes and release FPC latches before pulling. Replace parts in reverse order, reconnect antenna cables carefully and test before fitting every screw."],
        ["Battery, adapter, RAM/HDD upgrade and wireless card", "Check adapter voltage and polarity, inspect the DC jack and test the battery with a diagnostic tool. Replace a swollen battery immediately. Upgrade RAM with the correct SO-DIMM generation and storage with the supported M.2/SATA form factor. Reconnect both wireless antenna leads, main and auxiliary."],
        ["POST codes, SATA/AHCI settings and OS installation", "Vendor POST codes narrow a failure to memory, display, storage or board. In setup, select AHCI for SATA, UEFI or legacy boot as required and disable Secure Boot only when the installer demands it. Boot from USB, install drivers in the right order and verify sleep, Wi-Fi, audio and battery charging."],
        ["Latest repair tools and gadgets", "Use precision screwdrivers, plastic pry tools, suction cups, anti-static tweezers, a USB power meter, a DC electronic load, thermal camera, microscope and hot-air rework station as the job requires. Tools do not replace diagnosis; they make a correct repair safer and faster."],
        ["Bench drill: no-power laptop check", "Verify the outlet, adapter voltage and DC jack, then test the battery and charging circuit. Check the power button, board fuse and standby rail. A USB power meter shows whether the adapter negotiates; a bench supply with current limit reveals a short. Record each measurement before replacing the board."]
      ]
    },
    mastery: {
      hi: {
        title: "लैपटॉप खोलने से पहले — बैटरी, केबल और स्क्रू का अनुशासन",
        lead: "लैपटॉप में एक गलत प्लास्टिक क्लिप या खिंचा हुआ FPC केबल महँगा नुकसान कर सकता है। धीरे खोलें, हर चरण की फोटो लें और केबल के latch पहले खोलें।",
        paragraphs: [
          "सबसे पहले एडाप्टर और बैटरी अलग करें। बैटरी अंदर लगी हो तो सर्विस मैनुअल के अनुसार पहले उसका कनेक्टर निकालें। कीबोर्ड, टचपैड, डिस्प्ले और वायरलेस एंटीना के FPC/कोएक्सियल केबल नाजुक होते हैं; उन्हें पकड़कर खींचें नहीं, latch उठाकर धीरे निकालें।",
          "फूली हुई बैटरी को कभी दबाएँ या छेदें नहीं; उसे अग्नि-सुरक्षित पात्र में अलग रखें और अधिकृत रीसाइक्लर को दें। एडाप्टर का वोल्टेज और ध्रुवता मापें; DC जैक ढीला या जला हो तो बदलें। नया चार्जर खरीदते समय वोल्टेज, करंट और कनेक्टर आकार मिलाएँ।",
          "असेंबली के बाद पहले बिना स्क्रू के परीक्षण करें — पावर, डिस्प्ले, कीबोर्ड, टचपैड, Wi-Fi, ऑडियो और चार्जिंग। सब ठीक होने पर स्क्रू लगाएँ। इससे दोबारा खोलने का समय बचता है और प्लास्टिक क्लिप टूटने का जोखिम कम होता है।"
        ],
        steps: [
          "एडाप्टर/बैटरी अलग करें और ESD सुरक्षा लगाएँ।",
          "सर्विस मैनुअल देखकर स्क्रू और केबल latch क्रम से खोलें।",
          "बैटरी की सूजन, DC जैक, FPC और एंटीना केबल जाँचें।",
          "बिना स्क्रू टेस्ट करें, फिर असेंबल कर अंतिम सत्यापन करें।"
        ],
        table: {
          head: ["समस्या", "पहले जाँचें", "जोखिम"],
          rows: [
            ["चार्ज नहीं होता", "एडाप्टर, DC जैक, बैटरी", "गलत ध्रुवता से बोर्ड जलना"],
            ["डिस्प्ले खाली", "RAM, डिस्प्ले केबल, POST", "कनेक्टर टूटना"],
            ["टचपैड बंद", "Fn shortcut, FPC, बैटरी सूजन", "केबल कटना"],
            ["Wi-Fi कमजोर", "एंटीना main/aux", "कनेक्टर टूटना"]
          ]
        }
      },
      en: {
        title: "Before opening a laptop — discipline with battery, cables and screws",
        lead: "One broken plastic clip or stretched FPC cable can cost more than the repair. Open slowly, photograph each step and release cable latches first.",
        paragraphs: [
          "Disconnect the adapter and battery first; if the battery is internal, disconnect its connector before anything else. Keyboard, touchpad, display and wireless antenna cables are fragile. Do not pull them by the wire; lift the latch and slide the FPC out gently.",
          "Never press or puncture a swollen battery. Keep it in a fire-safe container and hand it to an authorised recycler. Measure adapter voltage and polarity; replace a loose or burnt DC jack. When buying a charger, match voltage, current and connector size.",
          "After assembly, test before fitting the screws: power, display, keyboard, touchpad, Wi-Fi, audio and charging. Only then fasten the chassis. This saves a second teardown and reduces the risk of breaking plastic clips."
        ],
        steps: [
          "Disconnect adapter/battery and apply ESD protection.",
          "Follow the service manual for screw and cable-latch order.",
          "Inspect battery swelling, DC jack, FPC and antenna leads.",
          "Test without screws, then assemble and do a final check."
        ],
        table: {
          head: ["Problem", "Check first", "Risk"],
          rows: [
            ["Not charging", "Adapter, DC jack, battery", "Reverse polarity can burn the board"],
            ["Blank display", "RAM, display cable, POST", "Broken connector"],
            ["Touchpad dead", "Fn shortcut, FPC, swollen battery", "Cable damage"],
            ["Weak Wi-Fi", "Main/aux antenna", "Broken connector"]
          ]
        }
      }
    },
    viva: [
      { q: "लैपटॉप बैटरी फूल जाए तो क्या करें?", qEn: "What should be done with a swollen laptop battery?", a: "उपयोग बंद करें, दबाएँ नहीं, अग्नि-सुरक्षित पात्र में रखें और अधिकृत रीसाइक्लर से बदलवाएँ।", aEn: "Stop using it, do not press it, store it in a fire-safe container and replace it through an authorised recycler." },
      { q: "SO-DIMM कहाँ लगता है?", qEn: "Where is SO-DIMM used?", a: "लैपटॉप, मिनी-PC और कुछ ऑल-इन-वन में छोटे आकार का मेमोरी मॉड्यूल।", aEn: "In laptops, mini PCs and some all-in-one systems as a compact memory module." },
      { q: "FPC केबल कैसे निकालें?", qEn: "How do you remove an FPC cable?", a: "पहले latch/क्लिप खोलें, फिर केबल को सीधा धीरे खींचें; तार को न खींचें।", aEn: "Release the latch/clip first, then slide the cable out gently; never pull the wires." },
      { q: "लैपटॉप में AHCI क्यों चुनते हैं?", qEn: "Why select AHCI on a laptop?", a: "यह SATA के आधुनिक फीचर (NCQ, hot-plug) देता है और OS इंस्टॉलेशन/SSD प्रदर्शन के लिए अनुकूल है।", aEn: "It enables modern SATA features such as NCQ and hot-plug and suits OS installation and SSD performance." }
    ]
  };

  D[8] = {
    model3d: null,
    fullForms: ["LED", "LCD", "PCB", "USB", "LAN", "IP", "PSU", "ADC", "HV", "Toner", "OCR", "SMPS"],
    en: {
      title: "Printers — Dot Matrix, Laser, Inkjet, Drivers and Network Printing",
      subtitle: "Module 8 · Printing technology",
      tagline: "A print defect is a clue: follow paper, toner, laser and fuser to find its cause.",
      intro: "Printers combine mechanics, optics, electronics and software. This chapter compares printer types, explains dot-matrix, laser and inkjet mechanisms, drivers and self-tests, network printing, mechanical parts and sensors, and a print-quality diagnosis drill.",
      outcomes: [
        "Compare printer types and explain their block diagrams and uses.",
        "Service dot-matrix head, carriage, ribbon and paper feed.",
        "Explain the laser electrophotographic process, toner, drum and fuser.",
        "Maintain inkjet print heads, cartridges and refill systems.",
        "Install drivers, run self-tests and configure network printing.",
        "Diagnose print-quality defects from their pattern."
      ],
      sections: [
        ["Printer types, block diagrams and uses", "Impact printers (dot matrix) strike a ribbon; non-impact printers include laser, inkjet, thermal and LED. A printer block includes the controller, memory, interface, mechanism, sensors and power supply. Choose by volume, cost per page, media and connectivity."],
        ["Dot matrix: head, carriage, ribbon, paper feed and interface", "A dot-matrix head fires pins through an inked ribbon; a carriage motor moves the head and a stepper feeds paper. Common faults are a worn ribbon, bent or stuck pins, a dirty platen, a broken carriage belt and a paper sensor. Adjust the head gap for multi-part forms."],
        ["Laser printer: electrophotographic process, toner, drum and fuser", "The six stages are charge, expose, develop, transfer, fuse and clean. A primary charge roller charges the drum, the laser writes the image, toner develops it, the transfer roller moves it to paper and the fuser melts it permanently. Never touch the drum surface or open a hot fuser."],
        ["Inkjet: print head, cartridge, refilling and maintenance", "A piezoelectric or thermal head fires ink droplets through nozzles. Problems include clogged nozzles, air in the cartridge, a dirty wiper, a leaking seal and a failed print head. Run the built-in clean/align cycle, use fresh ink and avoid touching the nozzle plate."],
        ["Drivers, self-test, diagnostics and network printing", "Install the correct driver for the OS and model, then print a self-test and a status page. For network printing, assign a static IP or DHCP reservation, open the required ports and add the printer by IP or hostname. Check ping, web interface and driver port before replacing hardware."],
        ["Mechanical parts, sensors, power supply and control board", "The paper path contains pickup rollers, registration sensors, exit sensors and a duplex unit. Sensors may be optical or mechanical; dust causes false paper jams. The power supply provides logic and high-voltage rails for charging and transfer. Diagnose with sensor status and error codes."],
        ["Bench drill: diagnosing print-quality defects", "Map the defect to the process: repeated marks suggest a drum or roller circumference, vertical lines suggest a dirty laser window or drum, smudging suggests the fuser, and missing colours suggest a nozzle or cartridge. Measure the repeat distance and match it to the roller diameter."]
      ]
    },
    mastery: {
      hi: {
        title: "प्रिंट दोष का पैटर्न पढ़ना — दूरी से कारण तक",
        lead: "प्रिंट में दोहराया जाने वाला निशान संयोग नहीं है; उसकी दूरी बताती है कि कौन-सा रोलर या ड्रम दोषपूर्ण है।",
        paragraphs: [
          "लेज़र प्रिंटर में ड्रम, चार्ज रोलर, ट्रांसफर रोलर और फ्यूज़र रोलर के व्यास अलग होते हैं। अगर पेज पर हर 38 mm पर दाग आता है, तो संभवतः उस परिधि वाला रोलर खराब है। दोष की दूरी मापकर सर्विस मैनुअल के रोलर व्यास से मिलाएँ।",
          "इंकजेट में नोज़ल बंद होने पर रंग की धारियाँ या गायब हिस्से आते हैं। पहले built-in cleaning चलाएँ, फिर alignment sheet प्रिंट करें। बार-बार cleaning से स्याही बर्बाद होती है; यदि तीन प्रयास में सुधार न हो तो कारतूस/हेड की जाँच करें।",
          "डॉट-मैट्रिक में रिबन सूखा होने पर हल्का प्रिंट आता है और पिन टूटने पर एक ऊर्ध्वाधर रेखा गायब रहती है। मल्टी-पार्ट फॉर्म के लिए हेड गैप समायोजित करें। नेटवर्क प्रिंटर में पहले ping और वेब पेज जाँचें, फिर ड्राइवर पोर्ट; हर बार हार्डवेयर बदलना महँगी गलती है।"
        ],
        steps: [
          "दोष का पैटर्न और दोहराव की दूरी मापें।",
          "टोनर/कारतूस, ड्रम, फ्यूज़र और पेपर पथ की जाँच करें।",
          "सेल्फ-टेस्ट और क्लीन/अलाइन चक्र चलाएँ।",
          "नेटवर्क प्रिंटर में IP, पोर्ट और ड्राइवर सत्यापित करें।"
        ],
        table: {
          head: ["दोष", "संभावित कारण", "समाधान"],
          rows: [
            ["दोहराए दाग", "ड्रम/रोलर की परिधि", "रोलर साफ/बदलें"],
            ["खरोंच/काली धारी", "ड्रम पर खरोंच", "ड्रम बदलें"],
            ["टोनर छूटता है", "फ्यूज़र ठंडा/खराब", "फ्यूज़र जाँचें"],
            ["रंग गायब", "नोज़ल/कारतूस", "क्लीन/अलाइन/बदलें"]
          ]
        }
      },
      en: {
        title: "Reading print-defect patterns — from distance to cause",
        lead: "A repeating mark is not random; its spacing tells you which roller or drum is faulty.",
        paragraphs: [
          "In a laser printer the drum, charge roller, transfer roller and fuser roller have different diameters. A mark every 38 mm probably comes from a roller with that circumference. Measure the repeat distance and match it to the roller diameters in the service manual.",
          "In an inkjet, clogged nozzles cause colour bands or missing areas. Run the built-in cleaning, then print an alignment sheet. Repeated cleaning wastes ink; if three attempts do not help, inspect the cartridge or print head.",
          "A dry ribbon makes dot-matrix output faint, and a broken pin removes one vertical line. Set the head gap for multi-part forms. On a network printer, check ping and the web page before the driver port; replacing hardware first is an expensive mistake."
        ],
        steps: [
          "Measure the defect pattern and repeat distance.",
          "Inspect toner/cartridge, drum, fuser and paper path.",
          "Run the self-test and clean/align cycle.",
          "For network printers, verify IP, port and driver."
        ],
        table: {
          head: ["Defect", "Likely cause", "Fix"],
          rows: [
            ["Repeating spots", "Drum/roller circumference", "Clean or replace roller"],
            ["Scratch/black line", "Scratched drum", "Replace drum"],
            ["Toner rubs off", "Cold or failed fuser", "Check fuser"],
            ["Missing colour", "Nozzle/cartridge", "Clean, align or replace"]
          ]
        }
      }
    },
    viva: [
      { q: "लेज़र प्रिंटर के छह चरण बताइए।", qEn: "Name the six laser printing stages.", a: "चार्ज, एक्सपोज़, डेवलप, ट्रांसफर, फ्यूज़ और क्लीन।", aEn: "Charge, expose, develop, transfer, fuse and clean." },
      { q: "फ्यूज़र का काम क्या है?", qEn: "What does the fuser do?", a: "ऊष्मा और दबाव से टोनर को कागज़ पर स्थायी रूप से पिघलाकर चिपकाता है।", aEn: "It melts and bonds toner permanently to the paper using heat and pressure." },
      { q: "डॉट-मैट्रिक में हेड गैप क्यों समायोजित करते हैं?", qEn: "Why adjust the head gap on a dot-matrix printer?", a: "मल्टी-पार्ट फॉर्म या मोटे कागज़ पर पिन की टक्कर सही रखने के लिए।", aEn: "To keep the pins at the correct impact distance for multi-part or thick paper." },
      { q: "नेटवर्क प्रिंटर न मिले तो क्या जाँचें?", qEn: "What do you check when a network printer is not found?", a: "पावर/नेटवर्क LED, IP, ping, वेब इंटरफ़ेस, पोर्ट और ड्राइवर।", aEn: "Power/network LEDs, IP, ping, web interface, port and driver." }
    ]
  };

  D[9] = {
    model3d: null,
    fullForms: ["ADF", "OCR", "CCD", "CIS", "MFD", "MFP", "USB", "LAN", "PDF", "TIFF", "JPEG", "PNG", "RFID", "BCR"],
    en: {
      title: "Scanner and MFD — Scanning, ADF, OCR, Barcode and Firmware Updates",
      subtitle: "Module 9 · From image to data",
      tagline: "A scanner is an optical path plus software — clean the path and choose the right resolution.",
      intro: "A scanner turns paper into pixels; OCR turns those pixels into editable text. This chapter covers flatbed and ADF scanning, OCR installation, barcode and network scanners, MFDs and special printers, firmware updates, scan quality and a copy-defect drill.",
      outcomes: [
        "Explain scanner operation, ADF, OCR and installation.",
        "Configure barcode and network scanners.",
        "Compare MFD, passbook, high-speed, line and network printers.",
        "Update firmware safely on boards, printers, scanners and modems.",
        "Maintain scan quality through glass, ADF and preventive care.",
        "Diagnose scan and copy defects."
      ],
      sections: [
        ["Scanner working, ADF, OCR and installation", "A flatbed scanner lights the document, reflects it through mirrors and a lens onto a CCD/CIS sensor, converts the analogue signal with an ADC and transfers the image. An ADF pulls sheets past the sensor for multi-page work. OCR software recognises characters and needs a straight, high-contrast scan."],
        ["Barcode scanner and network scanner", "A barcode reader illuminates bars and decodes the reflected pattern; laser, CCD and imager types differ in range and media. A network scanner has its own IP address and sends scans by SMB, FTP, email or cloud. Configure the address, destination and authentication before testing."],
        ["MFD, passbook printer, high-speed/line/network printer", "An MFD combines printing, scanning, copying and faxing with one controller. A passbook printer handles stiff booklets with a special platen. Line printers print a whole line at once for high-volume forms. Network printers need an IP, queue and driver."],
        ["Firmware updates for motherboard, printer, scanner and modem", "Firmware is permanent software inside a device. Download only from the vendor, verify the model and version, connect a UPS and never power off during flashing. Some devices recover through a bootloader or dual image; others need service. Record the old and new version."],
        ["Scan quality: glass, ADF path and preventive maintenance", "Clean the glass and white reference strip, inspect ADF rollers and separation pad, and remove dust from the sensor path. Choose resolution by use: 200–300 dpi for text, 300–600 dpi for OCR and higher for photos. Keep the lid closed to avoid background light."],
        ["Bench drill: diagnosing scan and copy defects", "A vertical line that appears in scanning but not copying points to the sensor or software; a line in both points to glass or optics. ADF skew suggests rollers or guides. Copy quality that is poor while printing is good isolates the scanner section, not the print engine."]
      ]
    },
    mastery: {
      hi: {
        title: "स्कैन गुणवत्ता और OCR — पिक्सल से पाठ तक",
        lead: "अच्छा स्कैन सिर्फ उच्च DPI नहीं है; साफ ग्लास, सीधा दस्तावेज़, सही रंग मोड और उपयुक्त फ़ाइल प्रारूप जरूरी हैं।",
        paragraphs: [
          "टेक्स्ट दस्तावेज़ के लिए 300 dpi grayscale या black-and-white सबसे अच्छा है; बहुत अधिक DPI फ़ाइल को भारी बनाता है और OCR को धीमा करता है। फोटो के लिए 600 dpi और colour चुनें। PDF/A दीर्घकालिक संग्रह के लिए, JPEG फोटो के लिए और TIFF उच्च गुणवत्ता संग्रह के लिए उपयुक्त है।",
          "OCR की सटीकता के लिए पेज को सीधा रखें, झुर्रियाँ हटाएँ और विपरीत पृष्ठभूमि से बचें। हिंदी/देवनागरी OCR के लिए सही भाषा चुनें; गलत भाषा मॉडल अक्षरों को गलत पहचानता है। स्कैन के बाद OCR परिणाम को पढ़कर सुधारें, क्योंकि 100% सटीकता दुर्लभ है।",
          "ADF में पेपर जाम बार-बार आए तो रोलर और separation pad की सफाई/बदली करें। नेटवर्क स्कैनर में SMB शेयर के लिए उपयोगकर्ता नाम, पासवर्ड और अनुमति जाँचें; फायरवॉल पोर्ट बंद हो तो स्कैन फ़ाइल गंतव्य तक नहीं पहुँचती।"
        ],
        steps: [
          "ग्लास, सफेद पट्टी और ADF रोलर साफ करें।",
          "उपयोग के अनुसार DPI, रंग मोड और फ़ाइल प्रारूप चुनें।",
          "OCR के लिए सही भाषा चुनकर परिणाम सत्यापित करें।",
          "नेटवर्क स्कैन में IP, शेयर अनुमति और पोर्ट जाँचें।"
        ],
        table: {
          head: ["उपयोग", "DPI", "प्रारूप"],
          rows: [
            ["सामान्य टेक्स्ट", "200–300", "PDF/JPEG"],
            ["OCR", "300–400", "PDF (searchable)"],
            ["फोटो", "600", "JPEG/TIFF"],
            ["अभिलेख", "300–600", "PDF/A"]
          ]
        }
      },
      en: {
        title: "Scan quality and OCR — from pixels to text",
        lead: "A good scan is not just high DPI; it needs clean glass, a straight page, the right colour mode and a suitable file format.",
        paragraphs: [
          "For text, 300 dpi grayscale or black-and-white works best; very high DPI makes huge files and slows OCR. Use 600 dpi colour for photos. PDF/A suits long-term archiving, JPEG suits photos and TIFF suits high-quality masters.",
          "For OCR accuracy, keep the page straight, remove wrinkles and avoid a busy background. Select the correct language for Hindi/Devanagari; a wrong language model misreads characters. Always proofread the OCR output because 100% accuracy is rare.",
          "If an ADF jams repeatedly, clean or replace the rollers and separation pad. On a network scanner, verify the username, password and permissions for the SMB share; a closed firewall port prevents the file from reaching its destination."
        ],
        steps: [
          "Clean the glass, white strip and ADF rollers.",
          "Choose DPI, colour mode and file format for the purpose.",
          "Select the correct OCR language and proofread the result.",
          "Verify IP, share permission and ports for network scanning."
        ],
        table: {
          head: ["Use", "DPI", "Format"],
          rows: [
            ["General text", "200–300", "PDF/JPEG"],
            ["OCR", "300–400", "Searchable PDF"],
            ["Photo", "600", "JPEG/TIFF"],
            ["Archive", "300–600", "PDF/A"]
          ]
        }
      }
    },
    viva: [
      { q: "OCR क्या करता है?", qEn: "What does OCR do?", a: "स्कैन किए गए चित्र के अक्षरों को पहचानकर संपादन योग्य पाठ में बदलता है।", aEn: "It recognises characters in a scanned image and converts them into editable text." },
      { q: "ADF का उपयोग क्या है?", qEn: "What is an ADF used for?", a: "कई पेजों को स्वचालित रूप से स्कैनर के सेंसर के सामने से गुजारकर एक-एक करके स्कैन करना।", aEn: "It feeds multiple pages past the scanner sensor automatically for batch scanning." },
      { q: "फर्मवेयर अपडेट में UPS क्यों आवश्यक है?", qEn: "Why is a UPS needed during a firmware update?", a: "बिजली जाने पर फ्लैशिंग बीच में रुक सकती है और डिवाइस स्थायी रूप से बंद हो सकता है।", aEn: "A power cut can interrupt flashing and permanently disable the device." },
      { q: "स्कैन में लगातार धारी क्यों आती है?", qEn: "Why does a scan show a continuous line?", a: "ग्लास/सेंसर पर धूल, खरोंच या ADF पथ की गंदगी; पहले ग्लास और सेंसर साफ करें।", aEn: "Dust or a scratch on the glass/sensor, or dirt in the ADF path; clean the glass and sensor first." }
    ]
  };

  D[10] = {
    model3d: null,
    fullForms: ["LCD", "TFT", "IPS", "CRT", "LED", "OLED", "VGA", "HDMI", "DVI", "DP", "GPU", "RAM", "PCB", "PWM", "EDID"],
    en: {
      title: "Monitor and Display — Specifications, Display Cards, Drivers, LCD/CRT and Projectors",
      subtitle: "Module 10 · Display servicing",
      tagline: "No display can start at the cable, card, driver or panel — isolate the layer before replacing it.",
      intro: "Displays convert digital signals into visible images. This chapter covers monitor types and specifications, display-card buses and memory, driver installation, LCD/TFT versus CRT servicing, projector and touch-panel installation, and a no-display diagnosis drill.",
      outcomes: [
        "Read monitor specifications and use front-panel controls.",
        "Explain display-card buses, memory and components.",
        "Install, replace and configure display drivers.",
        "Service LCD/TFT and CRT displays safely.",
        "Install an LCD projector and touch panel.",
        "Diagnose no-display and unstable-image faults."
      ],
      sections: [
        ["Monitor types, specifications and front controls", "Monitors differ in panel technology, resolution, refresh rate, response time, brightness, contrast and ports. IPS gives wide viewing angles, VA gives deep contrast and TN is fast and cheap. Use front controls or the OSD to set input, brightness, colour and auto-adjust."],
        ["Display card: bus, memory and components", "A display card contains a GPU, VRAM, cooling, power stages and output ports. It connects over PCIe and may need auxiliary power. Faults include no output, artefacts, overheating, fan failure and a loose card. Test the card in another slot or system before declaring it dead."],
        ["Installing, replacing and configuring display drivers", "Remove the old driver cleanly, install the vendor driver for the GPU and OS, then set resolution and refresh rate. A generic driver may show a picture but lacks features. On laptops, switchable graphics need both integrated and discrete drivers in the correct order."],
        ["LCD/TFT versus CRT — servicing and adjustment", "An LCD uses a backlight, polarisers, TFT array and colour filters; a CRT uses an electron gun and phosphor coating. CRT carries high voltage and must be discharged before service. LCD faults include backlight failure, dead pixels, a damaged inverter/LED driver and a cracked panel."],
        ["LCD projector and touch-panel installation", "Mount the projector at the correct throw distance, adjust focus and keystone, and connect HDMI/VGA. A touch panel needs USB or serial control, driver installation and calibration. Check the signal source, resolution and cable length; long HDMI runs may need an extender."],
        ["Bench drill: no-display and unstable-image diagnosis", "Confirm monitor power and input, swap the cable, test another monitor and another port. Boot in safe mode, check the driver, reseat the GPU and test integrated video. Flicker or artefacts under load suggest overheating, power or VRAM; a stable image in BIOS but not in the OS suggests the driver."]
      ]
    },
    mastery: {
      hi: {
        title: "डिस्प्ले निदान की परतें — सिग्नल, कार्ड, ड्राइवर, पैनल",
        lead: "काले पर्दे का मतलब सीधे मॉनिटर खराब नहीं। सिग्नल स्रोत, केबल, ग्राफ़िक्स कार्ड, ड्राइवर और पैनल — एक-एक परत अलग करें।",
        paragraphs: [
          "पहले मॉनिटर की पावर LED और इनपुट स्रोत देखें। कंप्यूटर चालू है पर मॉनिटर 'No Signal' दिखाता है तो केबल और पोर्ट बदलें। BIOS/POST स्क्रीन दिखती है पर Windows में चित्र नहीं आता, तो समस्या ड्राइवर या रिज़ॉल्यूशन में है; BIOS में भी कुछ नहीं दिखे तो हार्डवेयर/पावर की जाँच करें।",
          "LCD मॉनिटर में बैकलाइट, LED ड्राइवर और TFT पैनल अलग होते हैं। टॉर्च से स्क्रीन पर हल्का चित्र दिखे तो बैकलाइट/इनवर्टर की समस्या है; पूरी स्क्रीन काली और LED बंद हो तो पावर बोर्ड जाँचें। CRT में हाई वोल्टेज होता है, उसे डिस्चार्ज किए बिना न खोलें।",
          "प्रोजेक्टर में थ्रो दूरी, फोकस और कीस्टोन महत्वपूर्ण हैं। बहुत लंबा HDMI केबल सिग्नल गिरा सकता है; extender या छोटा केबल आज़माएँ। टच पैनल में USB केबल और ड्राइवर की जाँच करें, फिर कैलिब्रेशन करें।"
        ],
        steps: [
          "मॉनिटर पावर, इनपुट और केबल बदलकर जाँचें।",
          "दूसरे पोर्ट/मॉनिटर और BIOS आउटपुट से कार्ड अलग करें।",
          "Safe Mode में ड्राइवर/रिज़ॉल्यूशन जाँचें।",
          "आर्टिफैक्ट/फ्लिकर में तापमान, पावर और GPU रीसीट जाँचें।"
        ],
        table: {
          head: ["लक्षण", "स्तर", "जाँच"],
          rows: [
            ["No Signal", "केबल/इनपुट", "केबल और स्रोत बदलें"],
            ["BIOS दिखता है, Windows नहीं", "ड्राइवर", "Safe Mode/ड्राइवर"],
            ["टॉर्च से हल्का चित्र", "बैकलाइट", "LED ड्राइवर/इनवर्टर"],
            ["आर्टिफैक्ट/फ्लिकर", "GPU/पावर/ताप", "रीसीट, तापमान, दूसरा PC"]
          ]
        }
      },
      en: {
        title: "Layers of display diagnosis — signal, card, driver, panel",
        lead: "A black screen does not automatically mean a dead monitor. Isolate the signal source, cable, graphics card, driver and panel one layer at a time.",
        paragraphs: [
          "Check the monitor power LED and input source first. If the PC is on but the monitor shows 'No Signal', swap the cable and port. If the BIOS/POST screen appears but Windows shows no image, suspect the driver or resolution; if nothing appears even in BIOS, check hardware and power.",
          "An LCD has a separate backlight, LED driver and TFT panel. If a torch reveals a faint image, the backlight or inverter is faulty; if the screen is completely dark with no LED, check the power board. A CRT carries high voltage and must be discharged before opening.",
          "For a projector, throw distance, focus and keystone matter. A very long HDMI cable can drop the signal; try an extender or a shorter cable. On a touch panel, verify the USB cable and driver, then calibrate."
        ],
        steps: [
          "Check monitor power, input and a different cable.",
          "Test another port/monitor and isolate the card via BIOS output.",
          "Check the driver and resolution in Safe Mode.",
          "For artefacts/flicker, check temperature, power and reseat the GPU."
        ],
        table: {
          head: ["Symptom", "Layer", "Check"],
          rows: [
            ["No Signal", "Cable/input", "Swap cable and source"],
            ["BIOS visible, Windows not", "Driver", "Safe Mode/driver"],
            ["Faint image under torch", "Backlight", "LED driver/inverter"],
            ["Artefacts/flicker", "GPU/power/heat", "Reseat, temperature, second PC"]
          ]
        }
      }
    },
    viva: [
      { q: "IPS और TN पैनल में अंतर?", qEn: "Difference between IPS and TN panels?", a: "IPS में रंग और व्यूइंग एंगल बेहतर, TN में प्रतिक्रिया समय तेज़ और लागत कम।", aEn: "IPS offers better colour and viewing angles; TN offers faster response and lower cost." },
      { q: "LCD में बैकलाइट की भूमिका?", qEn: "What is the role of an LCD backlight?", a: "पैनल के पीछे से प्रकाश देती है; TFT क्रिस्टल उसे नियंत्रित करके चित्र बनाते हैं।", aEn: "It supplies light behind the panel; the TFT crystals modulate it to form the image." },
      { q: "BIOS में चित्र है पर Windows में नहीं, क्यों?", qEn: "Why is there an image in BIOS but not in Windows?", a: "अधिकतर ड्राइवर, रिज़ॉल्यूशन/रीफ्रेश रेट या GPU मोड की समस्या; Safe Mode में जाँचें।", aEn: "Usually a driver, resolution/refresh rate or GPU mode issue; check in Safe Mode." },
      { q: "CRT खोलने से पहले क्या करना चाहिए?", qEn: "What must be done before opening a CRT?", a: "पावर बंद करके हाई-वोल्टेज कैपेसिटर/ट्यूब को सुरक्षित डिस्चार्ज करें; बिना प्रशिक्षण न खोलें।", aEn: "Power down and safely discharge the high-voltage capacitor/tube; do not open without training." }
    ]
  };
})();
