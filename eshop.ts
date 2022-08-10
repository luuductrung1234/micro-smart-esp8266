/*******************************************************************************
 * Functions for EShop APIs
 *
 * Author: Luu Duc Trung
 * Website: https://github.com/luuductrung1234/micro-smart-esp8266/
 * Email:   s3951127@rmit.edu.vn
 *******************************************************************************/

const ESHOP_API_URL = "18.140.168.23"

namespace esp8266 {
    // Flag to indicate whether the request was sent successfully.
    let eshopRequestSent = false



    /**
     * Return true if the request was sent successfully.
     */
    //% subcategory="EShop"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_eshop_request_sent
    //% block="EShop request sent"
    export function isEshopRequestSent(): boolean {
        return eshopRequestSent
    }



    /**
     * Pick one ticket.
     */
    //% subcategory="EShop"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_pick_one_ticket_request
    //% block="pick up one ticket from EShop"
    export function pickRequest(): string {

        // Reset the upload successful flag.
        eshopRequestSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false)
            return null

        //Connect to server. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" 
            + ESHOP_API_URL 
            + "\",80", "OK", 10000) == false)
        {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return null
        }
            

        // Construct the data to send.
        let data = "GET /api/v1/tickets/:pick"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2), "OK")
        sendCommand(data)

        // Return if "SEND OK" is not received.
        let sentStatus = getResponse("SEND OK", 1000)
        if (sentStatus == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return null
        }

        // Return if Sample API response is not 200.
        let response = getResponse("+IPD", 10000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return null
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        eshopRequestSent = true
        return response.replace("+IPD,15:", "")
    }
}