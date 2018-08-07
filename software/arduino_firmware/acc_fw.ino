#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif
#define PIN 6
Adafruit_NeoPixel strip = 
Adafruit_NeoPixel(49, PIN, NEO_GRB + NEO_KHZ800);
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

// If using the breakout with SPI, define the pins for SPI communication.
#define PN532_SCK  (2)
#define PN532_MOSI (3)
#define PN532_SS   (4)
#define PN532_MISO (5)

// If using the breakout or shield with I2C, define just the pins connected
// to the IRQ and reset lines.  Use the values below (2, 3) for the shield!
#define PN532_IRQ   (2)
#define PN532_RESET (3)  // Not connected by default on the NFC Shield

// Uncomment just _one_ line below depending on how your breakout or shield
// is connected to the Arduino:

// Use this line for a breakout with a software SPI connection (recommended):
Adafruit_PN532 nfc(PN532_SCK, PN532_MISO, PN532_MOSI, PN532_SS);

// Use this line for a breakout with a hardware SPI connection.  Note that
// the PN532 SCK, MOSI, and MISO pins need to be connected to the Arduino's
// hardware SPI SCK, MOSI, and MISO pins.  On an Arduino Uno these are
// SCK = 13, MOSI = 11, MISO = 12.  The SS line can be any digital IO pin.
//Adafruit_PN532 nfc(PN532_SS);

// Or use this line for a breakout or shield with an I2C connection:
//Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

void setup(void) {
  Serial.begin(115200);
  Serial.println("Hello!");

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1); // halt
  }
  // Got ok data, print it out!
  Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  
  // configure board to read RFID tags
  nfc.SAMConfig();
  
  Serial.println("Waiting for an ISO14443A Card ...");

#if defined (__AVR_ATtiny85__)
    if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
  #endif
   strip.begin();
  strip.show();
  
}


void loop(void) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)
    
  // Wait for an ISO14443A type cards (Mifare, etc.).  When one is found
  // 'uid' will be populated with the UID, and uidLength will indicate
  // if the uid is 4 bytes (Mifare Classic) or 7 bytes (Mifare Ultralight)
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  
  if (success) {
    // Display some basic information about the card
    Serial.println("Found an ISO14443A card");
    Serial.print("  UID Length: ");Serial.print(uidLength, DEC);Serial.println(" bytes");
    Serial.print("  UID Value: ");
    nfc.PrintHex(uid, uidLength);
    Serial.println("");
    
    if (uidLength == 4)
    {
      // We probably have a Mifare Classic card ... 
      Serial.println("Seems to be a Mifare Classic card (4 byte UID)");
	  
      // Now we need to try to authenticate it for read/write access
      // Try with the factory default KeyA: 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF
      Serial.println("Trying to authenticate block 4 with default KEYA value");
      uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
	  
	  // Start with block 4 (the first block of sector 1) since sector 0
	  // contains the manufacturer data and it's probably better just
	  // to leave it alone unless you know what you're doing
      success = nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, keya);
	  
      if (success)
      {
        Serial.println("Sector 1 (Blocks 4..7) has been authenticated");
        uint8_t data[16];
		
        // If you want to write something to block 4 to test with, uncomment
		// the following line and this text should be read back in a minute
        //memcpy(data, (const uint8_t[]){ 'a', 'd', 'a', 'f', 'r', 'u', 'i', 't', '.', 'c', 'o', 'm', 0, 0, 0, 0 }, sizeof data);
        // success = nfc.mifareclassic_WriteDataBlock (4, data);

        // Try to read the contents of block 4
        success = nfc.mifareclassic_ReadDataBlock(4, data);
		
        if (success)
        {
          // Data seems to have been read ... spit it out
          Serial.println("Reading Block 4:");
          nfc.PrintHexChar(data, 16);
          Serial.println("");
		  
          // Wait a bit before reading the card again
          delay(1000);
        }
        else
        {
          Serial.println("Ooops ... unable to read the requested block.  Try another key?");
        }
      }
      else
      {
        Serial.println("Ooops ... authentication failed: Try another key?");
      }
    }
    
    if (uidLength == 7)
    {
      // We probably have a Mifare Ultralight card ...
      Serial.println("Seems to be a Mifare Ultralight tag (7 byte UID)");
	  
      // Try to read the first general-purpose user page (#4)
      Serial.println("Reading page 4");
      uint8_t data[32];
      success = nfc.mifareultralight_ReadPage (4, data);
      if (success)
      {
        // Data seems to have been read ... spit it out
        nfc.PrintHexChar(data, 4);
        Serial.println("");
		
        // Wait a bit before reading the card again
        delay(1000);
      }
      else
      {
        Serial.println("Ooops ... unable to read the requested page!?");
      }
    }
  }
}


void ledShowYes(){

strip.setPixelColor(3,  strip.Color(255, 0, 0));
strip.setPixelColor(10, strip.Color(255, 0, 0));
strip.setPixelColor(17, strip.Color(255, 0, 0));
strip.setPixelColor(24, strip.Color(255, 0, 0));
strip.show();
delay(250);
strip.setPixelColor(23, strip.Color(255, 0, 0));
strip.setPixelColor(22, strip.Color(255, 0, 0));
strip.setPixelColor(21, strip.Color(255, 0, 0));
strip.show();
delay(250);
strip.setPixelColor(31, strip.Color(255, 0, 0));
strip.setPixelColor(38, strip.Color(255, 0, 0));
strip.setPixelColor(45, strip.Color(255, 0, 0));
strip.show();
delay(250);
strip.setPixelColor(27, strip.Color(255, 0, 0));
strip.setPixelColor(26, strip.Color(255, 0, 0));
strip.setPixelColor(25, strip.Color(255, 0, 0));
strip.show();
}

void ledShowNo(){

strip.setPixelColor(3,  strip.Color(0, 255, 0));
strip.setPixelColor(4,  strip.Color(0, 255, 0));
strip.setPixelColor(10,  strip.Color(0, 255, 0));
strip.setPixelColor(9,  strip.Color(0, 255, 0));
strip.setPixelColor(8,  strip.Color(0, 255, 0));
strip.setPixelColor(7,  strip.Color(0, 255, 0));
strip.setPixelColor(17,  strip.Color(0, 255, 0));
strip.setPixelColor(18,  strip.Color(0, 255, 0));
strip.setPixelColor(19,  strip.Color(0, 255, 0));
strip.setPixelColor(20,  strip.Color(0, 255, 0));
strip.setPixelColor(24,  strip.Color(0, 255, 0));
strip.setPixelColor(23,  strip.Color(0, 255, 0));
strip.setPixelColor(22,  strip.Color(0, 255, 0));
strip.setPixelColor(21,  strip.Color(0, 255, 0));

delay(250);
strip.setPixelColor(27,  strip.Color(0, 255, 0));
strip.setPixelColor(26,  strip.Color(0, 255, 0));
strip.setPixelColor(25,  strip.Color(0, 255, 0));
strip.setPixelColor(28,  strip.Color(0, 255, 0));
strip.setPixelColor(29,  strip.Color(0, 255, 0));
strip.setPixelColor(30,  strip.Color(0, 255, 0));
strip.setPixelColor(31,  strip.Color(0, 255, 0));
strip.setPixelColor(40,  strip.Color(0, 255, 0));
strip.setPixelColor(39,  strip.Color(0, 255, 0));
strip.setPixelColor(38,  strip.Color(0, 255, 0));
strip.setPixelColor(44,  strip.Color(0, 255, 0));
strip.setPixelColor(45,  strip.Color(0, 255, 0));

delay(250);

strip.setPixelColor(2,  strip.Color(0, 255, 0));
strip.setPixelColor(12,  strip.Color(0, 255, 0));
strip.setPixelColor(11,  strip.Color(0, 255, 0));
strip.setPixelColor(14,  strip.Color(0, 255, 0));
strip.setPixelColor(15,  strip.Color(0, 255, 0));
strip.setPixelColor(16,  strip.Color(0, 255, 0));

//3 4 10 9 8 7  17 18 19 20 24 23 22 21
//27 26 25 28 29 30 31 40 39 38 44 45 
//2 12 11 14 15 16 
//32 33 34 37 36 

delay(250);

strip.setPixelColor(32,  strip.Color(0, 255, 0));
strip.setPixelColor(33,  strip.Color(0, 255, 0));
strip.setPixelColor(34,  strip.Color(0, 255, 0));
strip.setPixelColor(37,  strip.Color(0, 255, 0));
strip.setPixelColor(36,  strip.Color(0, 255, 0));

}

