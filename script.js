document.addEventListener('DOMContentLoaded', function () {
    const dataInput = document.getElementById('dataInput');
    const groundFreqInput = document.getElementById('groundFreqInput');
    const depFreqInput = document.getElementById('depFreqInput');
    const generateButton = document.getElementById('generateButton');
    const outputResult = document.getElementById('outputResult');

    generateButton.addEventListener('click', function () {
        const inputData = dataInput.value;
        const depFreq = depFreqInput.value;
        const groundFreq = groundFreqInput.value;


        // Generate IFR PDC based on user input and display the result.
        const generatedIFR = generateIFRFromInput(inputData, depFreq, groundFreq);
        outputResult.textContent = generatedIFR;
    }); 

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

        if (inputData === "") {
            return "Flight plan not entered, please enter a correct flight plan in the right format from ATC24.";
        }
    
        if (groundFreq === "" || depFreq === "") {
            return "Empty frequencies retrieved, please enter valid frequencies.";
        }

        if (callsign && departingValue && arrivingValue && routeValue && flightLevelValue) {
            const initialAltitude = `${Math.floor(Math.random() * 2) + 1},000`;
            const afterInitial = parseFloat(flightLevelValue);
            const transponder = `${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}`;
    
            let routeText = routeValue;
            if (routeText === "N/A" || routeText.toLowerCase() === "gps direct") {
                routeText = "DCT";
            }

            let ifr = `ACARS: PDC | CALLSIGN: ${callsign} | EQUIPMENT: ${aircraftValue} | DEPARTURE: ${departingValue} | DESTINATION: ${arrivingValue} | ROUTE: ${routeText} | ALTITUDE: ${afterInitial} | SQUAWK: ${transponder} | REMARKS: CLEARED ${routeText} INITIAL ${initialAltitude} EXP FL${afterInitial} 10 MIN AFT DP, DPFRQ ${depFreq} CTC ${groundFreq} TO PUSH`;
            return ifr.toUpperCase();
        } else {
            return `Missing data from your input:\n${inputData}`;
        }
    }
});
