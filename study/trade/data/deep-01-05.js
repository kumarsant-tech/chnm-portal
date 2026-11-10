/* Trade Theory · Deep bilingual layer — अध्याय 1–5 */
(function () {
  "use strict";
  var D = (window.TRADE_DEEP = window.TRADE_DEEP || {});

  D[1] = {
    model3d: null,
    fullForms: ["PPE", "RCCB", "ELCB", "MCB", "MCCB", "GFCI", "CPR", "AED", "ESD", "MSDS", "WEEE", "RoHS", "EPR", "SOP", "OJT"],
    en: {
      title: "Safety — Manual Handling, Earthing, Electrical Safety, First Aid and E-Waste",
      subtitle: "Module 1 · Foundations of safety",
      tagline: "Protect people first, then equipment — every job begins with a hazard check.",
      intro: "This chapter builds the safety habits a computer hardware technician uses every day: lifting and shifting fragile equipment, understanding earthing, working safely at an outlet, giving first aid after physical or electrical injury, and disposing of e-waste responsibly. It ends with a bench drill that turns these rules into an inspection routine.",
      outcomes: [
        "Lift and move heavy or fragile equipment using correct posture and team handling.",
        "Identify earthing types and verify that a socket is safely earthed.",
        "Connect, switch on and switch off equipment in the correct safe order.",
        "Give basic first aid for cuts, burns, fractures, fainting and electric shock.",
        "Segregate and dispose of e-waste through authorised recyclers."
      ],
      sections: [
        ["Lifting and shifting fragile and heavy equipment", "Plan the route, check the weight and use a trolley or a second person. Keep the load close to the body, bend the knees, keep the back straight and never twist while lifting. Remove jewellery, wear closed shoes and clear cables from the path before moving a rack, UPS or CRT monitor."],
        ["Earthing and identifying types of earthing", "Earthing gives fault current a low-resistance path to the ground so protective devices trip quickly. Study plate, pipe, rod and strip earthing, and learn to check the earth wire, earth pit and test link. A live-to-earth voltage test and a socket tester are basic verification tools."],
        ["Electrical safety at the outlet: connecting and switching on/off", "Switch off at the socket before plugging or unplugging, hold the plug body rather than the cable, and match the load to the socket rating. Switch on loads one at a time, keep water away, and never daisy-chain multiple extension boards. An RCCB or ELCB protects people; an MCB protects wiring."],
        ["First aid for physical injuries", "Stop bleeding with direct pressure, clean and cover cuts, cool burns with running water for at least twenty minutes, and immobilise suspected fractures. Do not remove deeply embedded objects. Record the incident, inform the supervisor and arrange medical review even when the injury looks minor."],
        ["First aid for electrical accidents", "First isolate the supply; never touch the casualty while they are in contact with a live conductor. Use a dry insulating object to separate the source, call emergency help, check breathing and pulse, and start CPR if trained. Treat electrical burns at entry and exit points and watch for delayed heart rhythm problems."],
        ["E-waste management", "E-waste contains lead, mercury, cadmium and brominated flame retardants. Store dead boards, batteries, toner and lamps in labelled, leak-proof bins; never burn or break them. Hand over to authorised recyclers, keep a manifest, and follow RoHS, WEEE and EPR principles. Delete data before disposal."],
        ["Bench drill: safety inspection before repair", "Before opening any equipment, complete a five-minute inspection: isolate power, discharge stored energy, check the workbench, inspect tools and PPE, and confirm the fire extinguisher and first-aid box. Record the asset, fault and safety observations in the job card."],
        ["Safety quick revision and emergency card", "Keep a pocket card with emergency numbers, the nearest first-aid box, the main breaker location and the evacuation route. Rehearse the response sequence: isolate, warn, assist, call, record. Safety knowledge is useful only when it becomes an automatic reflex."]
      ]
    },
    mastery: {
      hi: {
        title: "सुरक्षा संस्कृति — जोखिम मूल्यांकन से आपातकालीन योजना तक",
        lead: "परीक्षा में अंक के लिए नहीं, जान बचाने के लिए सुरक्षा सीखें। असली कार्यशाला में हर काम से पहले तीन प्रश्न पूछें: क्या खतरा हो सकता है, उसे कैसे रोकूँगा, और कुछ गलत हुआ तो पहले क्या करूँगा?",
        paragraphs: [
          "जोखिम मूल्यांकन (risk assessment) में खतरे की गंभीरता और उसकी संभावना दोनों देखी जाती है। करंट लगना, भारी उपकरण गिरना, केमिकल छलकना, आग लगना और डेटा चोरी — हर खतरे के लिए नियंत्रण का क्रम है: पहले खतरा हटाओ, फिर उसे इंजीनियरिंग नियंत्रण से अलग करो, फिर प्रशासनिक नियम लगाओ, और अंत में PPE का उपयोग करो। PPE हमेशा अंतिम रक्षा है, पहला समाधान नहीं।",
          "LOTO (Lock Out, Tag Out) का अर्थ है मशीन का ब्रेकर बंद करके ताला और टैग लगाना, ताकि कोई अचानक बिजली चालू न कर दे। कैपेसिटर वाले उपकरणों में बिजली बंद करने के बाद भी चार्ज रहता है; इसलिए SMPS, मॉनिटर और UPS खोलने से पहले निर्धारित समय तक डिस्चार्ज करें और वोल्टेज मापकर पुष्टि करें।",
          "आपातकालीन योजना में तीन चीजें लिखी होनी चाहिए: निकासी का रास्ता, प्राथमिक चिकित्सा बॉक्स की जगह और आग बुझाने का यंत्र। साल में कम से कम एक बार मॉक ड्रिल करें। दुर्घटना के बाद रिपोर्ट लिखना कागजी काम नहीं है — वही रिपोर्ट बताती है कि नियंत्रण कहाँ विफल हुआ और नियम कैसे सुधारना है।"
        ],
        steps: [
          "खतरा पहचानें और जोखिम को कम/मध्यम/उच्च में चिह्नित करें।",
          "पहले खतरा हटाएँ, फिर इंजीनियरिंग नियंत्रण, प्रशासनिक नियंत्रण और PPE लगाएँ।",
          "बिजली बंद कर LOTO लगाएँ और स्टोर किए चार्ज को डिस्चार्ज करें।",
          "घटना के बाद रिपोर्ट भरें और जड़ कारण पर सुधार लागू करें।"
        ],
        table: {
          head: ["खतरा", "संभावित नुकसान", "पहला नियंत्रण"],
          rows: [
            ["खुला फेज तार या टूटा अर्थ", "करंट लगना, मृत्यु", "सप्लाई बंद करना, RCCB/ELCB लगाना"],
            ["भारी UPS/रैक उठाना", "कमर या पैर की चोट", "ट्रॉली और दो व्यक्ति"],
            ["टोनर/बैटरी का रिसाव", "जलन, ज़हर", "दस्ताना, MSDS पढ़ना, सुरक्षित डिब्बा"],
            ["धूल भरी वर्कशॉप", "आग, साँस की समस्या", "सफाई, निकासी, धूल-रहित कवर"]
          ]
        }
      },
      en: {
        title: "Safety culture — from risk assessment to emergency planning",
        lead: "Learn safety to save lives, not just to pass an exam. Before every job ask three questions: what can go wrong, how will I prevent it, and what will I do first if it does?",
        paragraphs: [
          "Risk assessment weighs both the severity of a hazard and the chance of it happening. For shock, falling equipment, chemical spills, fire and data theft, use the hierarchy of controls: eliminate the hazard, then engineer it out, then apply administrative rules, and use personal protective equipment last. PPE is the final barrier, never the first solution.",
          "LOTO means Lock Out, Tag Out: switch off the breaker, lock it, attach a warning tag and verify the isolation, so nobody can restore power unexpectedly. Capacitors hold charge after shutdown, so discharge an SMPS, monitor or UPS for the specified time and measure the voltage before touching the primary side.",
          "An emergency plan must name the exit route, the first-aid box and the fire extinguisher. Run a mock drill at least once a year. Writing an incident report is not paperwork: it shows where a control failed and how the procedure must improve."
        ],
        steps: [
          "Identify hazards and rate each risk as low, medium or high.",
          "Apply elimination, engineering controls, administrative controls, then PPE.",
          "Isolate power, apply LOTO and discharge stored energy.",
          "Complete an incident report and fix the root cause."
        ],
        table: {
          head: ["Hazard", "Possible harm", "Primary control"],
          rows: [
            ["Open phase or broken earth", "Shock, fatality", "Isolate supply; install RCCB/ELCB"],
            ["Lifting a UPS or rack", "Back or foot injury", "Trolley and two-person lift"],
            ["Toner or battery leakage", "Burns, poisoning", "Gloves, read MSDS, sealed bin"],
            ["Dusty workshop", "Fire, breathing problems", "Clean, ventilate, use dust covers"]
          ]
        }
      }
    },
    viva: [
      { q: "अर्थिंग क्यों आवश्यक है?", qEn: "Why is earthing necessary?", a: "फॉल्ट करंट को कम प्रतिरोध से जमीन तक भेजकर धातु भाग को सुरक्षित रखती है और RCCB/MCB को तेजी से ट्रिप कराती है।", aEn: "It gives fault current a low-resistance path to earth, keeps metal bodies safe and makes RCCB/MCB trip quickly." },
      { q: "RCCB और MCB में अंतर बताइए।", qEn: "Differentiate RCCB and MCB.", a: "RCCB असंतुलित धारा (लीकेज) पकड़कर व्यक्ति को बचाता है; MCB अधिक धारा/शॉर्ट से तार और उपकरण बचाता है।", aEn: "An RCCB detects unbalanced leakage current and protects people; an MCB trips on overload or short circuit and protects wiring and equipment." },
      { q: "बिजली का झटका लगे तो पहला कदम क्या है?", qEn: "What is the first step after an electric shock?", a: "पहले सप्लाई बंद करें या सूखी इंसुलेटिंग वस्तु से व्यक्ति को स्रोत से अलग करें; बिना सुरक्षा उसे न छुएँ, फिर मदद बुलाएँ।", aEn: "Isolate the supply or separate the casualty with a dry insulating object; never touch them while live, then call for help." },
      { q: "ई-कचरा सामान्य कचरे में क्यों नहीं डालना चाहिए?", qEn: "Why must e-waste not go into normal bins?", a: "उसमें सीसा, पारा, कैडमियम जैसे जहरीले पदार्थ होते हैं जो मिट्टी-पानी को दूषित करते हैं; इसे अधिकृत रीसाइक्लर को दें।", aEn: "It contains toxic lead, mercury and cadmium that pollute soil and water; hand it to an authorised recycler." }
    ]
  };

  D[2] = {
    model3d: "smps",
    fullForms: ["AC", "DC", "SCR", "TRIAC", "DIAC", "UJT", "IC", "Op-Amp", "SMPS", "PWM", "PFC", "ATX", "PSU", "VSB", "MOSFET", "PCB", "SMD", "ESR", "EMI"],
    en: {
      title: "Power Supply — SCR/TRIAC, Op-Amp, IC Regulator and SMPS",
      subtitle: "Module 2 · Power electronics",
      tagline: "From 230 V AC input to stable 3.3 V, 5 V and 12 V DC — understand every stage.",
      intro: "Every computer board runs on DC, but the wall supplies AC. This chapter follows that journey: SCR/TRIAC devices that control AC, Op-Amps that amplify signals, regulators that hold voltage steady and the PC SMPS that powers the whole system. It also teaches safe tracing from mains to the 3.3/5/12 V rails.",
      outcomes: [
        "Explain the structure, terminals, working and testing of SCR, TRIAC and DIAC.",
        "Describe the basic uses of Op-Amp, differential amplifier, IC 555 and linear ICs.",
        "Compare Zener, shunt, series and IC voltage regulators.",
        "Compare linear and switch-mode supplies and identify PC SMPS rails and ratings.",
        "Trace the primary, switching and secondary sections of an SMPS to locate faults.",
        "Perform a safe ATX SMPS test sequence and load test."
      ],
      sections: [
        ["DIAC, SCR and TRIAC — working, ratings and applications", "An SCR is a four-layer PNPN device with anode, cathode and gate; it conducts one way and latches on after a gate pulse. A TRIAC is a bidirectional switch used for AC dimmers and fan regulators, while a DIAC is a bidirectional break-over trigger used with a TRIAC. Test junctions with a meter, but confirm real switching on a current-limited load."],
        ["Differential amplifier, Op-Amp, IC 555 and linear ICs", "A differential amplifier amplifies the difference between two inputs and rejects common-mode noise. An Op-Amp adds very high gain; negative feedback turns it into a stable amplifier, buffer, filter or comparator. IC 555 works as an astable or monostable timer to generate clocks, PWM and delays. Linear ICs include LM358, LM324, LM386 and LM393."],
        ["Voltage regulators — Zener, shunt, series and IC types", "A Zener regulator clamps voltage across a load but wastes current; a shunt regulator uses a parallel element; a series regulator uses a pass transistor; and a three-terminal IC such as 7805, 7812, 7905 or LM317 gives a fixed or adjustable output. Check input-output dropout, load current, ripple rejection and heatsink requirement."],
        ["Linear versus switch-mode supply; PC SMPS types and ratings", "A linear supply burns excess voltage as heat, so efficiency is low but noise is very low. An SMPS chops the input at high frequency, uses a transformer and PWM feedback, and reaches high efficiency in a smaller size. PC SMPS rails are +12 V, +5 V, +3.3 V, -12 V and +5 VSB; check wattage, per-rail current, 80 PLUS rating and connector count."],
        ["SMPS main sections and circuit tracing", "Trace the primary protector and EMI filter, bridge rectifier, PFC stage, bulk capacitor, switching MOSFET, transformer, secondary Schottky rectifiers, LC filter and feedback optocoupler. The primary side is lethal; the secondary side is safe only after confirming discharge. Follow the rail from connector to filter to rectifier to transformer winding."],
        ["Fault finding in PC and laptop SMPS", "Start with the fuse, 5 VSB, PS-ON signal and standby LED. A blown fuse usually means a shorted MOSFET, bridge or capacitor — never fit a bigger fuse. No 5 VSB points to the primary standby circuit; 5 VSB present but no rails points to PS-ON, PWM, protection or secondary shorts. Laptop adapters need a CC-CV load test and DC-jack inspection."],
        ["Bench drill: ATX SMPS test sequence from mains to rails", "Work on an isolated bench with a series bulb or current-limited supply. Verify 5 VSB, short PS-ON to common, measure each rail with no load, then add a controlled load and check voltage, ripple and fan operation. Record results, cool down, discharge capacitors and reassemble."]
      ]
    },
    mastery: {
      hi: {
        title: "SMPS की मरम्मत — सुरक्षित ट्रेसिंग, शॉर्ट का कारण और लोड टेस्ट",
        lead: "SMPS की सबसे बड़ी गलती है फ्यूज बदलकर बिजली देना। फ्यूज लोड नहीं, सुरक्षा है; वह उड़ा है तो सर्किट में शॉर्ट है। पहले कारण ढूँढें, फिर फ्यूज बदलें।",
        paragraphs: [
          "प्राथमिक हिस्से में bridge rectifier, PFC, बड़ा bulk capacitor, MOSFET और PWM IC होते हैं। बिजली बंद करने के बाद बल्क कैपेसिटर खतरनाक वोल्टेज रखता है; उसे प्रतिरोध या डिस्चार्ज लैंप से खाली करके मल्टीमीटर से पुष्टि करें। MOSFET के D-S टर्मिनल, bridge के डायोड और bulk capacitor की ESR जाँचें।",
          "द्वितीयक हिस्से में Schottky डायोड, इंडक्टर, फिल्टर कैपेसिटर और feedback optocoupler होते हैं। 5 VSB आना चाहिए भले PS-ON न हो; अगर 5 VSB ठीक है और PS-ON के बाद रेल नहीं आती, तो PWM, optocoupler, TL431, output Schottky या protection circuit जाँचें। फूला हुआ कैपेसिटर और जला हुआ डायोड सबसे सामान्य कारण हैं।",
          "लोड टेस्ट के बिना SMPS को ठीक मत कहिए। खाली चलने पर वोल्टेज सही दिख सकता है, लेकिन लोड आने पर गिर जाता है। प्रतिरोध या पुरानी HDD जैसा सुरक्षित लोड लगाकर +12 V, +5 V और +3.3 V को एक साथ मापें, रिपल देखें और 10-15 मिनट तापमान जाँचें।"
        ],
        steps: [
          "मेन्स अलग करें, बल्क कैपेसिटर डिस्चार्ज करें और वोल्टेज शून्य सत्यापित करें।",
          "फ्यूज, bridge, MOSFET, bulk capacitor और प्राथमिक शॉर्ट जाँचें।",
          "5 VSB और PS-ON जाँचें; फिर output Schottky, optocoupler और TL431 जाँचें।",
          "नियंत्रित लोड पर तीनों मुख्य रेल, रिपल और तापमान 10-15 मिनट देखें।"
        ],
        table: {
          head: ["लक्षण", "संभावित कारण", "जाँच"],
          rows: [
            ["फ्यूज उड़ा, कुछ नहीं चलता", "MOSFET/bridge/capacitor शॉर्ट", "डायोड और D-S रेडिंग जाँच"],
            ["5 VSB नहीं", "Standby circuit, स्टार्टअप प्रतिरोध", "प्राथमिक स्टैंडबाय वोल्टेज"],
            ["PS-ON के बाद रेल नहीं", "PWM/feedback/optocoupler", "TL431, opto, output शॉर्ट"],
            ["लोड पर वोल्टेज गिरता है", "सूखा कैपेसिटर, खराब Schottky", "ESR और लोड टेस्ट"]
          ]
        }
      },
      en: {
        title: "SMPS repair — safe tracing, finding the short and load testing",
        lead: "The worst SMPS mistake is replacing the fuse and powering on. A fuse protects the circuit; if it blew, a short exists. Find the cause first, then replace the fuse.",
        paragraphs: [
          "The primary side contains the bridge rectifier, PFC stage, bulk capacitor, switching MOSFET and PWM controller. After shutdown the bulk capacitor still holds dangerous voltage; discharge it with a resistor or lamp and confirm zero volts with a meter. Check MOSFET drain-source resistance, bridge diodes and capacitor ESR.",
          "The secondary side has Schottky rectifiers, inductors, filter capacitors and the feedback optocoupler. The 5 VSB rail should be present even before PS-ON; if standby is good but no rail appears after PS-ON, inspect the PWM controller, optocoupler, TL431, output Schottky and protection circuit. Swollen capacitors and shorted diodes are the most common failures.",
          "Never call an SMPS repaired without a load test. It may show correct voltage unloaded but collapse under load. Apply a safe load such as a resistor or an old HDD, measure +12 V, +5 V and +3.3 V together, observe ripple and check temperature for 10–15 minutes."
        ],
        steps: [
          "Disconnect mains, discharge the bulk capacitor and verify zero volts.",
          "Check the fuse, bridge, MOSFET, bulk capacitor and primary shorts.",
          "Verify 5 VSB and PS-ON; then test output Schottky, optocoupler and TL431.",
          "Run a controlled load and watch all rails, ripple and temperature for 10–15 minutes."
        ],
        table: {
          head: ["Symptom", "Likely cause", "Check"],
          rows: [
            ["Blown fuse, dead unit", "Shorted MOSFET/bridge/capacitor", "Diode and drain-source readings"],
            ["No 5 VSB", "Standby circuit, startup resistor", "Primary standby voltage"],
            ["No rails after PS-ON", "PWM/feedback/optocoupler", "TL431, opto, output short"],
            ["Voltage drops under load", "Dry capacitor, weak Schottky", "ESR and load test"]
          ]
        }
      }
    },
    viva: [
      { q: "SMPS लीनियर सप्लाई से अधिक दक्ष क्यों है?", qEn: "Why is an SMPS more efficient than a linear supply?", a: "यह ट्रांजिस्टर को switch की तरह चलाकर कम ऊष्मा बनाता है और उच्च आवृत्ति ट्रांसफॉर्मर से छोटे आकार में अधिक शक्ति देता है।", aEn: "It switches the transistor instead of dropping voltage as heat, and a high-frequency transformer delivers more power in a smaller size." },
      { q: "5 VSB का क्या काम है?", qEn: "What is the purpose of 5 VSB?", a: "यह स्टैंडबाय रेल है जो बिजली बंद होने पर भी मदरबोर्ड को PS-ON और वेक-अप सिग्नल देती है।", aEn: "It is the standby rail that keeps the motherboard alive for PS-ON and wake signals even when the PC is off." },
      { q: "फ्यूज उड़ने पर सीधे नया फ्यूज क्यों नहीं लगाना चाहिए?", qEn: "Why not simply replace a blown fuse?", a: "फ्यूज शॉर्ट का परिणाम है; कारण ठीक किए बिना नया फ्यूज भी उड़ेगा और सर्किट को और नुकसान हो सकता है।", aEn: "The fuse is a symptom of a short; a new fuse will blow again and may cause more damage." },
      { q: "SMPS का लोड टेस्ट कैसे करें?", qEn: "How do you load-test an SMPS?", a: "PS-ON को कॉमन से जोड़कर नियंत्रित लोड लगाएँ और तीनों मुख्य रेल, रिपल तथा तापमान मापें।", aEn: "Tie PS-ON to common, apply a controlled load, then measure all main rails, ripple and temperature." }
    ]
  };

  D[3] = {
    model3d: "pc",
    fullForms: ["CPU", "GPU", "RAM", "ROM", "BIOS", "UEFI", "CMOS", "POST", "PSU", "PCIe", "SATA", "ESD", "SMPS", "HDD", "SSD"],
    en: {
      title: "PC Architecture, Diagnosis and Preventive Maintenance",
      subtitle: "Module 3 · Understanding the whole PC",
      tagline: "A computer is a set of subsystems working together — diagnose by following data and power.",
      intro: "This chapter connects the visible parts of a PC to the way they work together. You will learn the block diagram, safe handling, preventive and corrective maintenance, diagnostic software, POST and beep codes, repair-versus-replace decisions and a structured no-display drill.",
      outcomes: [
        "Draw and explain the main PC subsystems and their data paths.",
        "Handle boards, drives and modules safely against ESD and physical damage.",
        "Prepare a preventive maintenance schedule and tool kit.",
        "Use diagnostic programs and interpret their limits.",
        "Read POST beep codes and visible symptoms to isolate a fault.",
        "Decide between repair and replacement using serviceability and cost.",
        "Follow a nine-step no-display diagnosis."
      ],
      sections: [
        ["PC subsystems and block diagram", "The CPU, chipset, RAM, GPU, storage, PSU and I/O form a set of buses and controllers. The CPU talks to RAM over the memory bus and to devices over PCIe and chipset links; the PSU supplies every rail. Draw the diagram from power source to subsystem, then from device to CPU, to see where a fault can break the chain."],
        ["Safe handling of PCs, sub-assemblies and components", "Work on a clean, grounded mat, wear an ESD strap and touch the bare metal chassis before handling boards. Hold cards by their edges, never touch gold contacts or pins, store CPUs and RAM in anti-static bags and keep screws organised by location. Photograph cable routing before disassembly."],
        ["Preventive and corrective maintenance, tools and schedule", "Preventive maintenance includes dust removal, fan and heatsink cleaning, thermal paste renewal, cable checks, backup verification and UPS battery testing. Corrective maintenance starts after a fault and follows diagnosis, repair and verification. Keep a schedule by environment: dusty workshops need shorter intervals than a clean office."],
        ["Diagnostic programs: need, features, limits and examples", "Diagnostic tools test RAM, storage, battery, temperature and devices, and can log results for comparison. They cannot find every intermittent fault, a loose connector or a damaged trace. Use them as evidence, not as a replacement for observation and measurement. Examples include memory tests, SMART tools, vendor diagnostics and burn-in utilities."],
        ["POST, beep codes and visible or audible symptoms", "POST checks CPU, RAM, video and boot devices before the OS starts. A single beep often means success; repeated or patterned beeps identify memory, video or keyboard faults depending on the BIOS vendor. No display with spinning fans suggests RAM, GPU, power or board; no power at all suggests the PSU, switch or mains."],
        ["Serviceability and economy of repair versus replacement", "Compare part cost with current market value, labour time, warranty, data risk and availability. Repair a business laptop with valuable data; replace an old board when the replacement costs more than a working used unit. Always inform the customer of the trade-off in writing."],
        ["Bench drill: nine-step diagnosis when the display stays blank", "1) Confirm power at the socket and PSU switch. 2) Listen for fans and beeps. 3) Reseat RAM and GPU. 4) Test with minimum components. 5) Try a known-good PSU. 6) Clear CMOS. 7) Test the monitor and cable. 8) Check the CPU and socket. 9) Substitute the motherboard. Record every step."]
      ]
    },
    mastery: {
      hi: {
        title: "नो-बूट की व्यवस्थित जाँच — अनुमान नहीं, प्रमाण से निदान",
        lead: "बिना डिस्प्ले वाला कंप्यूटर सबसे आम कार्यशाला समस्या है। इसे हिस्सों को बदल-बदलकर नहीं, क्रम से जाँचना चाहिए।",
        paragraphs: [
          "पहले बाहरी कारण हटाएँ: पावर सॉकेट, PSU का 115/230 V स्विच, मॉनिटर केबल और इनपुट चयन। फिर मिनिमम कॉन्फ़िगरेशन बनाएँ — केवल CPU, एक RAM, मदरबोर्ड और PSU। यदि इस पर POST दिखता है, तो धीरे-धीरे HDD, GPU और अन्य RAM जोड़कर दोषपूर्ण भाग पहचानें।",
          "बीप कोड BIOS निर्माता के अनुसार बदलते हैं, इसलिए मदरबोर्ड का मैनुअल देखें। लगातार बीप अक्सर RAM या वीडियो की ओर इशारा करती है; बिल्कुल चुप रहना पावर या CPU की समस्या हो सकती है। मल्टीमीटर से 12 V, 5 V और 3.3 V जाँचें, और CMOS क्लियर करके बेसिक सेटिंग बहाल करें।",
          "हर चरण का परिणाम जॉब कार्ड में लिखें। इससे पता चलता है कि कौन-सा बदलाव समस्या हल करता है और ग्राहक को ईमानदारी से बताया जा सकता है कि पैसा कहाँ लगा। बिना प्रमाण वाला 'मदरबोर्ड बदल दिया' गलत निदान और ग्राहक का भरोसा दोनों खो देता है।"
        ],
        steps: [
          "बाहरी पावर, केबल, मॉनिटर इनपुट और PSU स्विच जाँचें।",
          "मिनिमम कॉन्फ़िगरेशन पर POST और बीप कोड देखें।",
          "RAM/GPU रीसीट करें, CMOS क्लियर करें, ज्ञात-अच्छा PSU आज़माएँ।",
          "हर चरण का परिणाम लिखें और बदले गए भाग की पुष्टि करें।"
        ],
        table: {
          head: ["लक्षण", "पहले जाँचें", "अगला कदम"],
          rows: [
            ["पंखा चलता है, डिस्प्ले नहीं", "RAM, GPU, मॉनिटर केबल", "रीसीट और मिनिमम कॉन्फ़िगरेशन"],
            ["कोई बीप नहीं, पावर नहीं", "PSU, स्विच, मदरबोर्ड", "PSU जंपर और रेल वोल्टेज"],
            ["बार-बार बीप", "RAM या वीडियो", "एक-एक स्टिक/कार्ड बदलें"],
            ["POST के बाद रुकना", "स्टोरेज/बूट सेटिंग", "केबल, BIOS बूट क्रम, SMART"]
          ]
        }
      },
      en: {
        title: "Systematic no-boot diagnosis — evidence, not guesswork",
        lead: "A PC with no display is the most common workshop problem. Diagnose it in a sequence instead of swapping parts randomly.",
        paragraphs: [
          "Remove external causes first: the wall socket, the 115/230 V selector on the PSU, the monitor cable and the selected input. Then build a minimum configuration: CPU, one RAM module, motherboard and PSU. If POST appears, add the HDD, GPU and remaining RAM one at a time to identify the faulty part.",
          "Beep codes differ by BIOS vendor, so consult the motherboard manual. Repeated beeps usually point to RAM or video; complete silence may indicate power or CPU. Measure 12 V, 5 V and 3.3 V with a meter and clear CMOS to restore basic settings.",
          "Record the result of every step in the job card. It shows which change solved the problem and lets you explain the bill honestly. Claiming 'the motherboard was replaced' without evidence leads to a wrong diagnosis and lost trust."
        ],
        steps: [
          "Check external power, cables, monitor input and the PSU selector.",
          "Observe POST and beep codes in the minimum configuration.",
          "Reseat RAM/GPU, clear CMOS and try a known-good PSU.",
          "Record each result and confirm the replaced part."
        ],
        table: {
          head: ["Symptom", "Check first", "Next step"],
          rows: [
            ["Fans run, no display", "RAM, GPU, monitor cable", "Reseat and minimum build"],
            ["No beep, no power", "PSU, switch, board", "PSU jumper and rail voltage"],
            ["Repeated beeps", "RAM or video", "Swap one stick/card at a time"],
            ["Stops after POST", "Storage/boot settings", "Cable, boot order, SMART"]
          ]
        }
      }
    },
    viva: [
      { q: "POST क्या है?", qEn: "What is POST?", a: "Power-On Self-Test — बिजली चालू होते ही BIOS/UEFI द्वारा CPU, RAM, वीडियो और बूट डिवाइस की बुनियादी जाँच।", aEn: "Power-On Self-Test: the BIOS/UEFI checks CPU, RAM, video and boot devices as soon as power is applied." },
      { q: "ESD से बचाव कैसे करें?", qEn: "How do you prevent ESD damage?", a: "एंटी-स्टैटिक मैट और रिस्ट स्ट्रैप लगाएँ, चेसिस को छुएँ, कार्ड के किनारे पकड़ें और मॉड्यूल एंटी-स्टैटिक बैग में रखें।", aEn: "Use an anti-static mat and wrist strap, touch the chassis, hold cards by the edges and store modules in anti-static bags." },
      { q: "मिनिमम कॉन्फ़िगरेशन क्यों बनाते हैं?", qEn: "Why build a minimum configuration?", a: "गैर-जरूरी भाग हटाकर यह पता लगाना आसान होता है कि RAM, GPU या स्टोरेज में से कौन बूट रोक रहा है।", aEn: "Removing non-essential parts makes it easier to identify whether RAM, GPU or storage is blocking the boot." },
      { q: "मरम्मत या प्रतिस्थापन का निर्णय कैसे लें?", qEn: "How do you decide repair versus replacement?", a: "भाग की कीमत, श्रम, वारंटी, डेटा जोखिम और उपलब्धता की तुलना करें; मरम्मत बहुत महँगी हो तो प्रतिस्थापन बेहतर है।", aEn: "Compare part cost, labour, warranty, data risk and availability; replace when repair costs more than a sound alternative." }
    ]
  };

  D[4] = {
    model3d: null,
    fullForms: ["USB", "PS/2", "DIN", "LED", "CCD", "CIS", "OCR", "ADF", "RFID", "PCB", "ESD", "HID"],
    en: {
      title: "Input Devices — Keyboard, Mouse, Light Pen, Scanner and Digitizer",
      subtitle: "Module 4 · Input subsystems",
      tagline: "Every keystroke and click travels through a matrix, a controller and a bus — learn the path.",
      intro: "Input devices convert human action into digital codes. This chapter traces the keyboard matrix and scan codes, keyboard faults and servicing, mouse types and repairs, the principles of the light pen, digitizer and scanner, interface cables and a practical matrix test.",
      outcomes: [
        "Explain the keyboard block diagram, controller, LED driver and matrix.",
        "Diagnose and service keyboard faults on DIN, PS/2 and USB models.",
        "Compare mouse technologies and repair common faults.",
        "Describe the working of light pen, digitizer and scanner.",
        "Identify interface cables and connectors and replace them safely.",
        "Test a keyboard matrix and scan codes on the bench."
      ],
      sections: [
        ["Keyboard: block diagram, controller, LED driver and matrix", "The controller scans rows and columns of a matrix; when a key closes a row-column junction, it generates a scan code and sends it over USB or PS/2. The LED driver controls Caps Lock, Num Lock and Scroll Lock. A membrane or mechanical switch provides the contact, and debounce logic prevents multiple codes from one press."],
        ["Keyboard faults and servicing (DIN, PS/2, USB)", "Common faults are a damaged cable, dirty or worn contacts, a spilled-liquid membrane, a dead controller or a broken connector. Test with another port and a known-good keyboard, check continuity of the cable, clean the membrane and inspect PS/2 pins. Replace rather than repair when the membrane is torn."],
        ["Mouse: types, interface, faults and servicing", "An optical or laser mouse illuminates the surface and compares successive images to calculate movement. A mechanical mouse uses a ball and rollers. Faults include a worn cable at the strain relief, a dirty sensor window, a failed switch, a weak battery and a damaged USB receiver. Clean, re-solder or replace as appropriate."],
        ["Working principles of light pen, digitizer and scanner", "A light pen detects the scan position of a CRT beam; a digitizer senses the position of a stylus on a tablet through electromagnetic or capacitive coupling. A flatbed scanner illuminates the document, reflects light through mirrors and a lens to a CCD/CIS sensor, converts it with an ADC and sends the image over USB."],
        ["Interface cables, connectors and replacement practice", "Identify USB A/B/C, PS/2 mini-DIN, DIN, serial DB9 and video connectors by shape and pin count. Check pin continuity, shield and strain relief. When replacing a cable, match the pinout, solder cleanly, insulate the shield and test all functions before returning the device."],
        ["Bench drill: keyboard matrix and scan-code test", "Open a known-good keyboard, trace rows and columns, short one junction at a time and observe the character produced. Record the row-column map and explain how the controller converts it into a scan code. This proves understanding of the matrix rather than memorising key layouts."]
      ]
    },
    mastery: {
      hi: {
        title: "इनपुट डिवाइस की व्यावसायिक सर्विसिंग",
        lead: "कीबोर्ड और माउस सस्ते लगते हैं, लेकिन लैब में इनकी खराबी सबसे अधिक समय बर्बाद करती है। मैट्रिक्स और केबल की समझ से मरम्मत तेज और सही होती है।",
        paragraphs: [
          "कीबोर्ड में हर कुंजी एक switch है जो पंक्ति और स्तंभ को जोड़ता है। कंट्रोलर पंक्तियों को एक-एक करके स्कैन करता है और स्तंभ से पढ़ता है; एक साथ कई कुंजियाँ दबाने पर ghosting रोकने के लिए diode या anti-ghosting लॉजिक लगाया जाता है। इसीलिए कुछ सस्ते कीबोर्ड में 3-4 कुंजियाँ एक साथ नहीं पकड़तीं।",
          "USB कीबोर्ड में HID (Human Interface Device) ड्राइवर सामान्य होता है, जबकि PS/2 में IRQ और अलग प्रोटोकॉल होता है। PS/2 को गर्म अवस्था में निकालना/लगाना मदरबोर्ड कंट्रोलर को नुकसान पहुँचा सकता है। केबल का strain-relief हिस्सा सबसे पहले टूटता है; निरंतरता परीक्षण से टूटा तार पकड़ें।",
          "स्कैनर की गुणवत्ता ग्लास की सफाई, ADF रोलर, लैंप और सेंसर पर निर्भर करती है। धुंधली या धारीदार स्कैन में पहले ग्लास साफ करें, फिर कैलिब्रेशन और रिज़ॉल्यूशन जाँचें। OCR के लिए 300 dpi या अधिक और सीधा दस्तावेज़ रखें; तिरछा स्कैन अक्षर पहचान खराब करता है।"
        ],
        steps: [
          "पोर्ट बदलकर और ज्ञात-अच्छा डिवाइस लगाकर खराबी की पुष्टि करें।",
          "केबल निरंतरता, कनेक्टर पिन और strain relief जाँचें।",
          "मैट्रिक्स/सेंसर साफ करें और टूटी ट्रेस/switch की मरम्मत करें।",
          "सभी कुंजियाँ, LED, स्क्रॉल और स्कैन गुणवत्ता से सत्यापन करें।"
        ],
        table: {
          head: ["लक्षण", "संभावित कारण", "समाधान"],
          rows: [
            ["कुछ कुंजियाँ काम नहीं करतीं", "मैट्रिक्स ट्रेस/switch खराब", "मैट्रिक्स जाँच, सफाई/मरम्मत"],
            ["कीबोर्ड पहचान में नहीं", "केबल/कनेक्टर/कंट्रोलर", "निरंतरता और दूसरा पोर्ट"],
            ["माउस कर्सर कूदता है", "गंदा सेंसर/सतह", "सेंसर और माउस पैड साफ करें"],
            ["स्कैन में धारियाँ", "ग्लास/ADF/लैंप", "ग्लास सफाई और कैलिब्रेशन"]
          ]
        }
      },
      en: {
        title: "Professional servicing of input devices",
        lead: "Keyboards and mice look cheap, but their failures waste the most lab time. Understanding the matrix and cable turns repair into a fast, accurate job.",
        paragraphs: [
          "Every key is a switch joining a row and a column. The controller scans rows one by one and reads columns; diodes or anti-ghosting logic prevent false keys when several are pressed together. That is why inexpensive keyboards cannot register some three- or four-key combinations.",
          "A USB keyboard uses the generic HID driver, while PS/2 uses a different protocol and interrupt. Plugging or unplugging PS/2 while powered can damage the board controller. The cable strain relief breaks first; a continuity test locates the broken conductor.",
          "Scanner quality depends on a clean glass, ADF rollers, lamp and sensor. For streaky scans, clean the glass first, then check calibration and resolution. Use 300 dpi or more and keep the document straight for OCR; a skewed scan reduces character recognition."
        ],
        steps: [
          "Confirm the fault with another port and a known-good device.",
          "Check cable continuity, connector pins and strain relief.",
          "Clean the matrix/sensor and repair broken traces or switches.",
          "Verify every key, LED, scroll function and scan quality."
        ],
        table: {
          head: ["Symptom", "Likely cause", "Fix"],
          rows: [
            ["Some keys dead", "Matrix trace/switch", "Trace test, clean or repair"],
            ["Keyboard not detected", "Cable/connector/controller", "Continuity and second port"],
            ["Cursor jumps", "Dirty sensor/surface", "Clean sensor and use a mouse pad"],
            ["Lines in scan", "Glass/ADF/lamp", "Clean glass and calibrate"]
          ]
        }
      }
    },
    viva: [
      { q: "कीबोर्ड मैट्रिक्स कैसे काम करता है?", qEn: "How does a keyboard matrix work?", a: "कंट्रोलर पंक्तियों को स्कैन करता है; दबी कुंजी संबंधित स्तंभ को जोड़ती है और स्थिति से स्कैन-कोड बनता है।", aEn: "The controller scans rows; a pressed key connects its column, and the row-column position produces a scan code." },
      { q: "PS/2 कीबोर्ड को चालू अवस्था में क्यों नहीं निकालना चाहिए?", qEn: "Why should a PS/2 keyboard not be unplugged while powered?", a: "इससे मदरबोर्ड का PS/2 कंट्रोलर स्थायी रूप से खराब हो सकता है; पहले सिस्टम बंद करें।", aEn: "It can permanently damage the motherboard PS/2 controller; shut down first." },
      { q: "ऑप्टिकल माउस कैसे गति पहचानता है?", qEn: "How does an optical mouse detect movement?", a: "सतह की लगातार तस्वीरें लेकर उनके अंतर से X-Y गति की गणना करता है।", aEn: "It captures successive surface images and calculates X-Y movement from their differences." },
      { q: "स्कैनर में CCD और CIS में क्या अंतर है?", qEn: "What is the difference between CCD and CIS in a scanner?", a: "CCD दर्पण और लेंस से प्रकाश पाता है और बेहतर गहराई देता है; CIS सीधे दस्तावेज़ के पास रहता है और पतला/सस्ता होता है।", aEn: "CCD uses mirrors and a lens for better depth; CIS sits close to the document and is thinner and cheaper." }
    ]
  };

  D[5] = {
    model3d: "hdd",
    fullForms: ["HDD", "SSD", "RPM", "SATA", "PATA", "IDE", "AHCI", "NVMe", "MBR", "GPT", "SMART", "PCB", "ESD", "RAID"],
    en: {
      title: "Storage — HDD, CD/DVD Drives, Ports and Jumper Settings",
      subtitle: "Module 5 · Data storage",
      tagline: "Spinning platters, optical pits and flash cells all store the same bits — service them differently.",
      intro: "Storage holds the operating system and the user's data, so every service decision has a data-risk dimension. This chapter covers hard-disk construction and geometry, optical drive optics and mechanics, ports and jumpers, data recovery and disposal, and modern SSD/SMART concepts.",
      outcomes: [
        "Explain HDD construction, geometry, interfaces and servicing.",
        "Describe CD/DVD optics, mechanics, control circuits and servicing.",
        "Configure ports, jumpers and motherboard storage settings.",
        "Protect data during repair, recovery and disposal.",
        "Read SMART data and explain SSD, bad sectors and wear."
      ],
      sections: [
        ["Hard disk: construction, geometry, interfaces and servicing", "A hard disk has rotating platters, a spindle motor, read/write heads on an actuator, a preamp and a controller PCB. Geometry uses cylinders, heads and sectors; the controller translates logical block addresses to physical locations. Interfaces include PATA/IDE and SATA; never open the sealed chamber in a workshop."],
        ["CD/DVD ROM drive: optics, mechanics, control circuits and servicing", "A laser diode shines through a lens and grating onto the disc; reflected light is read by a photodetector and decoded. A servo controls focus, tracking, sled and spindle. Common faults are a dirty lens, weak laser, worn belt, stuck tray and bad spindle motor. Clean the lens gently and test with a known-good disc."],
        ["Ports, jumpers and motherboard settings", "Legacy IDE used master/slave jumpers and a ribbon cable; SATA uses point-to-point links and needs no master/slave setting. In BIOS/UEFI select AHCI for SATA, enable or disable CSM, set the boot order and confirm that NVMe drives appear under the correct storage controller. Match cable and port generation for full speed."],
        ["Data security, recovery and disposal", "Before repair, ask about backups and obtain consent before touching data. For logical corruption use imaging and recovery tools; for physical clicking or dropped drives, stop and refer to a clean-room specialist. For disposal, overwrite or cryptographically erase the drive and record the serial number; shredding is used for high sensitivity."],
        ["SSD, S.M.A.R.T. and bad sectors — understanding modern storage", "An SSD stores data in NAND flash and needs TRIM, wear levelling and spare blocks; it has no platters or seek time. SMART reports reallocated sectors, pending sectors, power-on hours, temperature and SSD wear indicators. A few reallocated sectors are a warning; a rising pending count plus slow reads means back up immediately."]
      ]
    },
    mastery: {
      hi: {
        title: "डेटा पहले — स्टोरेज रिपेयर में गलती की कीमत",
        lead: "डिस्क ठीक करने से पहले यह तय करें कि डेटा बचाना है या डिवाइस। ग्राहक का डेटा खोना किसी भी मरम्मत से बड़ी विफलता है।",
        paragraphs: [
          "अजीब आवाज़ (clicking, ticking) आने पर डिस्क को बार-बार चालू न करें। हेड अंदर की प्लेटर को खरोंच सकता है; हर सेकंड डेटा की संभावना घटती है। ऐसी डिस्क को बंद करके क्लीन-रूम रिकवरी या इमेजिंग की ओर भेजें। अगर डिस्क फिर भी पढ़ी जा रही है, तो पहले पूरी डिस्क की इमेज बनाएँ, फिर उस इमेज पर रिकवरी करें।",
          "SATA केबल, पावर कनेक्टर और पोर्ट बदलकर शुरुआत करें। BIOS में डिस्क दिखना लेकिन बूट न होना अक्सर बूट सेक्टर, MBR/GPT या केबल की समस्या है। SMART में Reallocated Sector Count और Pending Sector Count देखें; बढ़ती संख्या डिस्क के जाने का संकेत है।",
          "SSD में TRIM चालू रखें और 15-20% खाली जगह छोड़ें। पुरानी HDD को 'फॉर्मेट' करके बेचना सुरक्षित नहीं है; डेटा रिकवरी संभव है। संवेदनशील डेटा के लिए फिजिकल डिस्ट्रक्शन या कम से कम कई बार ओवरराइट करें और रिकॉर्ड रखें।"
        ],
        steps: [
          "डिस्क की आवाज़ सुनें; असामान्य आवाज़ पर तुरंत बंद करें।",
          "केबल/पोर्ट बदलें और SMART रिपोर्ट पढ़ें।",
          "रिपेयर से पहले पूरी ड्राइव की इमेज बनाएँ।",
          "डिस्पोज़ल से पहले सुरक्षित इरेज़ और सीरियल रिकॉर्ड करें।"
        ],
        table: {
          head: ["संकेत", "अर्थ", "कार्रवाई"],
          rows: [
            ["Clicking/ticking", "हेड/मोटर की यांत्रिक खराबी", "बंद करें, डेटा रिकवरी विशेषज्ञ"],
            ["Pending sectors बढ़ रहे", "पढ़ने में अस्थिर सेक्टर", "तुरंत बैकअप, डिस्क बदलें"],
            ["SMART OK पर बूट नहीं", "MBR/बूट सेक्टर/केबल", "इमेज, बूट रिपेयर जाँच"],
            ["SSD धीमा/भरा", "TRIM बंद, कम खाली जगह", "TRIM चालू, जगह खाली करें"]
          ]
        }
      },
      en: {
        title: "Data first — the cost of a storage repair mistake",
        lead: "Before repairing a disk, decide whether you are saving the data or the device. Losing a customer's data is a bigger failure than any repair.",
        paragraphs: [
          "Do not keep powering a disk that clicks or ticks. The head can scratch the platter and every second reduces recovery chances. Stop and refer it for clean-room recovery or imaging. If the disk is still readable, image the whole drive first and run recovery on the image, never on the original.",
          "Start with the SATA cable, power connector and port. A disk visible in BIOS but unable to boot often has a boot-sector, MBR/GPT or cable problem. Read Reallocated Sector Count and Pending Sector Count in SMART; a rising count signals a failing drive.",
          "Keep TRIM enabled on SSDs and leave 15–20% free space. Formatting an old HDD before selling is not secure because data can be recovered. For sensitive data use physical destruction or multiple overwrite passes and keep a record."
        ],
        steps: [
          "Listen to the drive; stop immediately on abnormal noise.",
          "Swap cable/port and read the SMART report.",
          "Image the entire drive before any repair attempt.",
          "Securely erase and record the serial before disposal."
        ],
        table: {
          head: ["Signal", "Meaning", "Action"],
          rows: [
            ["Clicking/ticking", "Head/motor mechanical failure", "Stop; use a recovery specialist"],
            ["Rising pending sectors", "Unstable read sectors", "Back up now; replace drive"],
            ["SMART OK but no boot", "MBR/boot sector/cable", "Image and check boot repair"],
            ["SSD slow/full", "TRIM off, little free space", "Enable TRIM; free space"]
          ]
        }
      }
    },
    viva: [
      { q: "HDD में सीक टाइम क्या है?", qEn: "What is seek time in an HDD?", a: "हेड को सही ट्रैक तक पहुँचने में लगने वाला समय; रोटेशनल लेटेंसी सही सेक्टर आने का समय है।", aEn: "The time for the head to reach the correct track; rotational latency is the wait for the correct sector." },
      { q: "SATA और PATA में मुख्य अंतर?", qEn: "Main difference between SATA and PATA?", a: "SATA सीरियल, पॉइंट-टू-पॉइंट और पतला केबल; PATA पैरेलल, मास्टर/स्लेव जंपर और चौड़ी रिबन केबल।", aEn: "SATA is serial, point-to-point and uses a thin cable; PATA is parallel, uses master/slave jumpers and a wide ribbon cable." },
      { q: "SMART क्या बताता है?", qEn: "What does SMART report?", a: "डिस्क का स्वास्थ्य — रीएलोकेटेड सेक्टर, पावर-ऑन घंटे, तापमान और विफलता के पूर्वानुमान।", aEn: "Drive health: reallocated sectors, power-on hours, temperature and failure prediction." },
      { q: "डिस्क बेचने से पहले क्या करना चाहिए?", qEn: "What should be done before selling a disk?", a: "डेटा को सुरक्षित रूप से मिटाएँ (ओवरराइट/क्रिप्टो इरेज़) या ड्राइव को नष्ट करें; सादा फॉर्मेट पर्याप्त नहीं है।", aEn: "Securely erase the data (overwrite or cryptographic erase) or destroy the drive; a simple format is not enough." }
    ]
  };
})();
