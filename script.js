document.addEventListener('DOMContentLoaded', function () {
    const dataInput = document.getElementById('dataInput');
    const groundFreqInput = document.getElementById('groundFreqInput');
    const depFreqInput = document.getElementById('depFreqInput');
    const generateButton = document.getElementById('generateButton');
    const generateSquawkBtn = document.getElementById('generateSquawkBtn');
    const outputResult = document.getElementById('outputResult');
    const outputSquawkResult = document.getElementById('outputSquawkResult');

    generateButton.addEventListener('click', function () {
        const inputData = dataInput.value;
        const depFreq = depFreqInput.value;
        const groundFreq = groundFreqInput.value;

        // Generate IFR PDC based on user input and display the result.
        const generatedIFR = generateIFRFromInput(inputData, depFreq, groundFreq);
        outputResult.textContent = generatedIFR;
    });

    generateSquawkBtn.addEventListener('click', function() {
        const generatedSquawk = generateSquawk();
        outputSquawkResult.textContent = generatedSquawk;
    });

    function generateSquawk() {
        let squawk = "";
        for (let i = 0; i < 4; i++) {
            squawk += String(Math.floor(Math.random() * 8));
        }
        return squawk;
    }

    function extractSID(route) {
        // Regular expression to match SID patterns (letters followed by digits)
        const sidPattern = /\b[A-Z]+\d[A-Z]*\b/g;
        let match = sidPattern.exec(route);

        // Return the first match found, or null if no match is found
        return match ? match[0] : null;
    }

    function generateIFRFromInput(inputData, depFreq, groundFreq) {
        const lines = inputData.split('\n');

        // Extract relevant information from lines
        const preCallsign = lines.find(line => line.includes('Callsign:'));
        const aircraft = lines.find(line => line.includes('Aircraft:'));
        const departing = lines.find(line => line.includes('Departing:'));
        const arriving = lines.find(line => line.includes('Arriving:'));
        const route = lines.find(line => line.includes('Route:'));
        const flightLevel = lines.find(line => line.includes('Flight Level:'));

        // Extract the actual values
        const callsign = preCallsign ? preCallsign.split(': ')[1] : '';
        const aircraftValue = aircraft ? aircraft.split(': ')[1] : '';
        const departingValue = departing ? departing.split(': ')[1] : '';
        const arrivingValue = arriving ? arriving.split(': ')[1] : '';
        const routeValue = route ? route.split(': ')[1] : '';
        const flightLevelValue = flightLevel ? flightLevel.split(': ')[1] : '';

        if (!inputData || inputData.trim() === "") {
            return "Flight plan not entered, please enter a correct flight plan in the right format from ATC24.";
        }

        if (!depFreq || isNaN(depFreq)) {
            return "No valid departure frequency retrieved, please enter valid frequencies.";
        }

        if (!groundFreq || isNaN(groundFreq)) {
            groundFreq = depFreq;
        }

        if (callsign && departingValue && arrivingValue && routeValue && flightLevelValue) {
            let initialAltitude = `${Math.floor(Math.random() * 2) + 1},000`.toString().padStart(3, '0');
            const afterInitial = parseFloat(flightLevelValue).toString().padStart(3, '0');
            const transponder = `${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}`;

            let routeText = routeValue.toUpperCase();
            const fixedRte = routeText;

            // Checking for SIDs
            let sid = extractSID(routeText);
            if (sid) {
                routeText = sid;
                let ifr = `ACARS: PDC | CALLSIGN: ${callsign} | EQUIPMENT: ${aircraftValue} | DEPARTURE: ${departingValue} | DESTINATION: ${arrivingValue} | ROUTE: ${routeText} | ALTITUDE: ${afterInitial} | SQUAWK: ${transponder} | REMARKS: CLEARED ${routeText} DEPARTURE CLIMB VIA SID EXP ${afterInitial} 10 MIN AFT DP, DPFRQ ${depFreq} CTC ${groundFreq} TO PUSH`;
                return ifr.toUpperCase();
            }

            // Checking for GPS Direct
            if (routeText === "N/A" || routeText.toLowerCase().includes("gps") || routeText.toLowerCase().includes("gps-direct") || routeText.toLowerCase().includes("dct") || routeText.toLowerCase().includes("direct")) {
                routeText = "DCT";
                let ifr = `ACARS: PDC | CALLSIGN: ${callsign} | EQUIPMENT: ${aircraftValue} | DEPARTURE: ${departingValue} | DESTINATION: ${arrivingValue} | ROUTE: ${fixedRte} | ALTITUDE: ${afterInitial} | SQUAWK: ${transponder} | REMARKS: CLEARED ${routeText} INITIAL ${initialAltitude} EXP FL${afterInitial} 10 MIN AFT DP, DPFRQ ${depFreq} CTC ${groundFreq} TO PUSH`;
                return ifr.toUpperCase();
            }
            
            // Default message if SID and GPS Direct not found
            return `ACARS: PDC | CALLSIGN: ${callsign} | EQUIPMENT: ${aircraftValue} | DEPARTURE: ${departingValue} | DESTINATION: ${arrivingValue} | ROUTE: ${fixedRte} | ALTITUDE: ${afterInitial} | SQUAWK: ${transponder} | REMARKS: CLEARED RNV ${routeText} INITIAL ${initialAltitude} EXP FL${afterInitial} 10 MIN AFT DP, DPFRQ ${depFreq} CTC ${groundFreq} TO PUSH`;
        } else {
            return `We've received invalid data from your input:\n\n${inputData}`;
        }
    }
});
