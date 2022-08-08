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

        // Connect to Telegram. Return if failed.
        if (sendCommand("AT+CIPSTART=\"SSL\",\"" 
            + SAMPLE_API_URL 
            + "\",443", "OK", 10000) == false) 
            return null

        // Construct the data to send.
        let data = "GET /coffee/hot/" + coffeeId
        data += " HTTP/1.1\r\n"
        data += "Host: " + SAMPLE_API_URL + "\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        // Return if "SEND OK" is not received.
        let sentStatus = getResponse("SEND OK", 1000)
        if (sentStatus == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return null
        }

        // Validate the response from Telegram.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return null
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        requestSent = true
        return response
    }
}