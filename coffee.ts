/*******************************************************************************
 * Functions for Sample APIs
 *
 * Author: Luu Duc Trung
 * Website: https://github.com/luuductrung1234/micro-smart-esp8266/
 * Email:   s3951127@rmit.edu.vn
 *******************************************************************************/

const SAMPLE_API_URL = "https://api.sampleapis.com"

namespace esp8266 {
    // Flag to indicate whether the request was sent successfully.
    let requestSent = false



    /**
     * Return true if the request was sent successfully.
     */
    //% subcategory="Coffee"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_coffee_request_sent
    //% block="Coffee request sent"
    export function isRequestSent(): boolean {
        return requestSent
    }



    /**
     * Get Coffee by ID.
     * @param coffeeId The Coffee ID we want to get.
     */
    //% subcategory="Coffee"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_get_first_coffee_request
    //% block="send message to Sample Coffee:|Coffee ID %coffeeId"
    export function getCoffeeRequest(coffeeId: number): string {

        // Reset the upload successful flag.
        requestSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) 
            return null

        // Connect to ThingSpeak. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" 
            + SAMPLE_API_URL 
            + "\",80", "OK", 10000) == false) {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return '500'
        }

        // Construct the data to send.
        let data = "GET /coffee/hot/" + coffeeId +" HTTP/1.1\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2), "OK")
        sendCommand(data)

        // Return if "SEND OK" is not received.
        let sentStatus = getResponse("SEND OK", 1000)
        if (sentStatus == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return '400'
        }

        // Return if Sample API response is not 200.
        if (getResponse("HTTP/1.1 304 OK", 10000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return '404'
        }

        // Get the pin value.
        let response = getResponse("[\"", 200)
        value = response.slice(response.indexOf("[\"") + 2, response.indexOf("\"]"))

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        requestSent = true
        return value
    }
}