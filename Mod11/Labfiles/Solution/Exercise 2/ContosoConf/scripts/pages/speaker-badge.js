/// <reference path="../_namespace.js" />

(function () {

    var speakerBadgePage = Object.inherit({
        
        initialize: function (element) {
            this.canvas = element.querySelector("canvas");
            
            this.speakerId = this.canvas.getAttribute("data-speaker-id");
            this.speakerName = this.canvas.getAttribute("data-speaker-name");
            this.canvas.addEventListener("dragover", this.handleDragOver.bind(this));
            this.canvas.addEventListener("drop", this.handleDrop.bind(this));
            
            this.drawBadge();
        },

        handleDragOver: function (event) {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy'; // Makes the browser display a "copy" cursor.
        },

        handleDrop: function (event) {
            event.stopPropagation();
            event.preventDefault();

            var files = event.dataTransfer.files;
            if (files.length == 0) return;

            // More than one file could have been dropped, we'll just use the first.
            var file = files[0];
            if (this.isImageType(file.type)) {
                this.readFile(file)
                    .pipe(this.loadImage)
                    .done(this.drawBadge);
            } else {
                alert("Please drop an image file.");
            }
        },

        drawBadge: function (image) {
            // TODO: Get the canvas's (this.canvas) context and assign to this.context
            this.context = this.canvas.getContext("2d");
            
            // TODO: Draw the following by calling the helper methods of `this`
            //       background
            //       top text
            //       speaker name
            //       image (or placeholder if no image)
            //       bar code (passing this.speakerId)
            this.drawBackground();
            this.drawTopText();
            this.drawSpeakerName();
            if (image) {
                this.drawSpeakerImage(image);
            } else {
                this.drawImagePlaceholder();
            }
            this.drawBarCode(this.speakerId);
        },

        drawBackground: function () {
            // TODO: Fill the canvas with a white rectangle
            this.context.fillStyle = "white";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        },

        drawSpeakerImage: function (image) {
            // TODO: Draw the image on the canvas
            //       Draw only the center square of the image
            //       Draw at:
            //       x, y = 20, 20
            //       w, h = 160, 160
            var size = Math.min(image.width, image.height);
            var sourceX = image.width / 2 - size / 2;
            var sourceY = image.height / 2 - size / 2;
            this.context.drawImage(image, sourceX, sourceY, size, size, 20, 20, 160, 160);
        },

        drawImagePlaceholder: function () {
            this.context.strokeStyle = "2px #888";
            this.context.strokeRect(20, 20, 160, 160);
            this.context.font = "12px sans-serif";
            this.context.textBaseline = "middle";
            this.context.textAlign = "center";
            this.context.fillStyle = "black";
            this.context.fillText("Drag your profile photo here", 100, 100);
        },

        drawTopText: function () {
            this.context.font = "20px sans-serif";
            this.context.fillStyle = "black";
            this.context.textBaseline = "top";
            this.context.textAlign = "left";
            this.context.fillText("ContosoConf 2013 Speaker:", 200, 20);
        },

        drawSpeakerName: function () {
            // TODO: Draw this.speakerName on the canvas
            //       x, y = 200, 60
            //       font = 40px sans-serif
            //       fill style = black
            //       text baseline = top
            //       text align = left
            this.context.font = "40px sans-serif";
            this.context.fileStyle = "black";
            this.context.baseLine = "top";
            this.context.textAlign = "left";
            this.context.fillText(this.speakerName, 200, 60);
        },

        drawBarCode: function (text) {
            text = "*" + text + "*"; // Wrap in "*" deliminators.
            var encodings = {
                "0": "bwbWBwBwb",
                "1": "BwbWbwbwB",
                "2": "bwBWbwbwB",
                "3": "BwBWbwbwb",
                "4": "bwbWBwbwB",
                "5": "BwbWBwbwb",
                "6": "bwBWBwbwb",
                "7": "bwbWbwBwB",
                "8": "BwbWbwBwb",
                "9": "bwBWbwBwb",
                "*": "bWbwBwBwb"
            };
            var x = 200, y = 140, height = 40, thick = 6, thin = 2;
            for (var charIndex = 0; charIndex < text.length; charIndex++) {
                var code = encodings[text[charIndex]];
                for (var stripeIndex = 0; stripeIndex < code.length; stripeIndex++) {
                    if (stripeIndex % 2 === 0) {
                        this.context.fillStyle = "black";
                    } else {
                        this.context.fillStyle = "white";
                    }
                    var isWideStripe = code.charCodeAt(stripeIndex) < 91;
                    if (isWideStripe) {
                        this.context.fillRect(x, y, thick, height);
                        x += thick;
                    } else {
                        this.context.fillRect(x, y, thin, height);
                        x += thin;
                    }
                }

                if (charIndex < text.length - 1) {
                    // Space between each
                    this.context.fillStyle = "white";
                    this.context.fillRect(x, y, thin, height);
                    x += thin;
                }
            }
        },

        isImageType: function (type) {
            var imageTypes = ["image/jpeg", "image/jpg", "image/png"];
            return imageTypes.indexOf(type) === 0;
        },

        readFile: function (file) {
            var reading = $.Deferred();
            var reader = new FileReader();
            var self = this;
            reader.onload = function (loadEvent) {
                var fileDataUrl = loadEvent.target.result;
                reading.resolveWith(self, [fileDataUrl]);
            };
            reader.readAsDataURL(file);
            return reading;
        },

        loadImage: function (imageUrl) {
            var loading = $.Deferred();
            var image = new Image();
            var self = this;
            image.onload = function () {
                loading.resolveWith(self, [image]);
            };
            image.src = imageUrl; // This starts the image loading
            return loading;
        }
        
    });

    var badgeElement = document.querySelector(".badge");
    speakerBadgePage.create(badgeElement);

} ());
// SIG // Begin signature block
// SIG // MIIaVgYJKoZIhvcNAQcCoIIaRzCCGkMCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFGEM/26FeI4o
// SIG // WoS/6zWHwNxvAdN0oIIVJjCCBJkwggOBoAMCAQICEzMA
// SIG // AACdHo0nrrjz2DgAAQAAAJ0wDQYJKoZIhvcNAQEFBQAw
// SIG // eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EwHhcNMTIwOTA0
// SIG // MjE0MjA5WhcNMTMwMzA0MjE0MjA5WjCBgzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjENMAsGA1UECxMETU9QUjEeMBwGA1UE
// SIG // AxMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuqRJbBD7Ipxl
// SIG // ohaYO8thYvp0Ka2NBhnScVgZil5XDWlibjagTv0ieeAd
// SIG // xxphjvr8oxElFsjAWCwxioiuMh6I238+dFf3haQ2U8pB
// SIG // 72m4aZ5tVutu5LImTXPRZHG0H9ZhhIgAIe9oWINbSY+0
// SIG // 39M11svZMJ9T/HprmoQrtyFndNT2eLZhh5iUfCrPZ+kZ
// SIG // vtm6Y+08Tj59Auvzf6/PD7eBfvT76PeRSLuPPYzIB5Mc
// SIG // 87115PxjICmfOfNBVDgeVGRAtISqN67zAIziDfqhsg8i
// SIG // taeprtYXuTDwAiMgEPprWQ/grZ+eYIGTA0wNm2IZs7uW
// SIG // vJFapniGdptszUzsErU4RwIDAQABo4IBDTCCAQkwEwYD
// SIG // VR0lBAwwCgYIKwYBBQUHAwMwHQYDVR0OBBYEFN5R3Bvy
// SIG // HkoFPxIcwbzDs2UskQWYMB8GA1UdIwQYMBaAFMsR6MrS
// SIG // tBZYAck3LjMWFrlMmgofMFYGA1UdHwRPME0wS6BJoEeG
// SIG // RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY0NvZFNpZ1BDQV8wOC0zMS0yMDEw
// SIG // LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
// SIG // Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2Vy
// SIG // dHMvTWljQ29kU2lnUENBXzA4LTMxLTIwMTAuY3J0MA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQAqpPfuwMMmeoNiGnicW8X9
// SIG // 7BXEp3gT0RdTKAsMAEI/OA+J3GQZhDV/SLnP63qJoc1P
// SIG // qeC77UcQ/hfah4kQ0UwVoPAR/9qWz2TPgf0zp8N4k+R8
// SIG // 1W2HcdYcYeLMTmS3cz/5eyc09lI/R0PADoFwU8GWAaJL
// SIG // u78qA3d7bvvQRooXKDGlBeMWirjxSmkVXTP533+UPEdF
// SIG // Ha7Ki8f3iB7q/pEMn08HCe0mkm6zlBkB+F+B567aiY9/
// SIG // Wl6EX7W+fEblR6/+WCuRf4fcRh9RlczDYqG1x1/ryWlc
// SIG // cZGpjVYgLDpOk/2bBo+tivhofju6eUKTOUn10F7scI1C
// SIG // dcWCVZAbtVVhMIIEujCCA6KgAwIBAgIKYQKSSgAAAAAA
// SIG // IDANBgkqhkiG9w0BAQUFADB3MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EwHhcNMTIwMTA5MjIyNTU5WhcNMTMwNDA5MjIy
// SIG // NTU5WjCBszELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjENMAsGA1UE
// SIG // CxMETU9QUjEnMCUGA1UECxMebkNpcGhlciBEU0UgRVNO
// SIG // OkI4RUMtMzBBNC03MTQ0MSUwIwYDVQQDExxNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG
// SIG // 9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzWPD96K1R9n5OZRT
// SIG // rGuPpnk4IfTRbj0VOBbBcyyZj/vgPFvhokyLsquLtPJK
// SIG // x7mTUNEm9YdTsHp180cPFytnLGTrYOdKjOCLXsRWaTc6
// SIG // KgRdFwHIv6m308mro5GogeM/LbfY5MR4AHk5z/3HZOIj
// SIG // EnieDHYnSY+arA504wZVVUnI7aF8cEVhfrJxFh7hwUG5
// SIG // 0tIy6VIk8zZQBNfdbzxJ1QvUdkD8ZWUTfpVROtX/uJqn
// SIG // V2tLFeU3WB/cAA3FrurfgUf58FKu5s9arOAUSqZxlID6
// SIG // /bAjMGDpg2CsDiQe/xHy56VVYpXun3+eKdbNSwp2g/BD
// SIG // BN8GSSDyU1pEsFF6OQIDAQABo4IBCTCCAQUwHQYDVR0O
// SIG // BBYEFM0ZrGFNlGcr9q+UdVnb8FgAg6E6MB8GA1UdIwQY
// SIG // MBaAFCM0+NlSRnAK7UD7dvuzK7DDNbMPMFQGA1UdHwRN
// SIG // MEswSaBHoEWGQ2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY3JsL3Byb2R1Y3RzL01pY3Jvc29mdFRpbWVT
// SIG // dGFtcFBDQS5jcmwwWAYIKwYBBQUHAQEETDBKMEgGCCsG
// SIG // AQUFBzAChjxodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY3Jvc29mdFRpbWVTdGFtcFBDQS5j
// SIG // cnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcN
// SIG // AQEFBQADggEBAFEc1t82HdyAvAKnxpnfFsiQBmkVmjK5
// SIG // 82QQ0orzYikbeY/KYKmzXcTkFi01jESb8fRcYaRBrpqL
// SIG // ulDRanlqs2KMnU1RUAupjtS/ohDAR9VOdVKJHj+Wao8u
// SIG // QBQGcu4/cFmSXYXtg5n6goSe5AMBIROrJ9bMcUnl2h3/
// SIG // bzwJTtWNZugMyX/uMRQCN197aeyJPkV/JUTnHxrWxRrD
// SIG // SuTh8YSY50/5qZinGEbshGzsqQMK/Xx6Uh2ca6SoD5iS
// SIG // pJJ4XCt4432yx9m2cH3fW3NTv6rUZlBL8Mk7lYXlwUpl
// SIG // nSVYULsgVJF5OhsHXGpXKK8xx5/nwx3uR/0n13/PdNxl
// SIG // xT8wggW8MIIDpKADAgECAgphMyYaAAAAAAAxMA0GCSqG
// SIG // SIb3DQEBBQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20x
// SIG // GTAXBgoJkiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNV
// SIG // BAMTJE1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1
// SIG // dGhvcml0eTAeFw0xMDA4MzEyMjE5MzJaFw0yMDA4MzEy
// SIG // MjI5MzJaMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBMIIB
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnJZ
// SIG // XBkwZL8dmmAgIEKZdlNsPhvWb8zL8epr/pcWEODfOnSD
// SIG // GrcvoDLs/97CQk4j1XIA2zVXConKriBJ9PBorE1LjaW9
// SIG // eUtxm0cH2v0l3511iM+qc0R/14Hb873yNqTJXEXcr609
// SIG // 4CholxqnpXJzVvEXlOT9NZRyoNZ2Xx53RYOFOBbQc1sF
// SIG // umdSjaWyaS/aGQv+knQp4nYvVN0UMFn40o1i/cvJX0Yx
// SIG // ULknE+RAMM9yKRAoIsc3Tj2gMj2QzaE4BoVcTlaCKCoF
// SIG // MrdL109j59ItYvFFPeesCAD2RqGe0VuMJlPoeqpK8kbP
// SIG // Nzw4nrR3XKUXno3LEY9WPMGsCV8D0wIDAQABo4IBXjCC
// SIG // AVowDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUyxHo
// SIG // ytK0FlgByTcuMxYWuUyaCh8wCwYDVR0PBAQDAgGGMBIG
// SIG // CSsGAQQBgjcVAQQFAgMBAAEwIwYJKwYBBAGCNxUCBBYE
// SIG // FP3RMU7TJoqV4ZhgO6gxb6Y8vNgtMBkGCSsGAQQBgjcU
// SIG // AgQMHgoAUwB1AGIAQwBBMB8GA1UdIwQYMBaAFA6sgmBA
// SIG // VieX5SUT/CrhClOVWeSkMFAGA1UdHwRJMEcwRaBDoEGG
// SIG // P2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL21pY3Jvc29mdHJvb3RjZXJ0LmNybDBU
// SIG // BggrBgEFBQcBAQRIMEYwRAYIKwYBBQUHMAKGOGh0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWlj
// SIG // cm9zb2Z0Um9vdENlcnQuY3J0MA0GCSqGSIb3DQEBBQUA
// SIG // A4ICAQBZOT5/Jkav629AsTK1ausOL26oSffrX3XtTDst
// SIG // 10OtC/7L6S0xoyPMfFCYgCFdrD0vTLqiqFac43C7uLT4
// SIG // ebVJcvc+6kF/yuEMF2nLpZwgLfoLUMRWzS3jStK8cOeo
// SIG // DaIDpVbguIpLV/KVQpzx8+/u44YfNDy4VprwUyOFKqSC
// SIG // HJPilAcd8uJO+IyhyugTpZFOyBvSj3KVKnFtmxr4HPBT
// SIG // 1mfMIv9cHc2ijL0nsnljVkSiUc356aNYVt2bAkVEL1/0
// SIG // 2q7UgjJu/KSVE+Traeepoiy+yCsQDmWOmdv1ovoSJgll
// SIG // OJTxeh9Ku9HhVujQeJYYXMk1Fl/dkx1Jji2+rTREHO4Q
// SIG // FRoAXd01WyHOmMcJ7oUOjE9tDhNOPXwpSJxy0fNsysHs
// SIG // cKNXkld9lI2gG0gDWvfPo2cKdKU27S0vF8jmcjcS9G+x
// SIG // PGeC+VKyjTMWZR4Oit0Q3mT0b85G1NMX6XnEBLTT+yzf
// SIG // H4qerAr7EydAreT54al/RrsHYEdlYEBOsELsTu2zdnnY
// SIG // CjQJbRyAMR/iDlTd5aH75UcQrWSY/1AWLny/BSF64pVB
// SIG // J2nDk4+VyY3YmyGuDVyc8KKuhmiDDGotu3ZrAB2WrfIW
// SIG // e/YWgyS5iM9qqEcxL5rc43E91wB+YkfRzojJuBj6DnKN
// SIG // waM9rwJAav9pm5biEKgQtDdQCNbDPTCCBgcwggPvoAMC
// SIG // AQICCmEWaDQAAAAAABwwDQYJKoZIhvcNAQEFBQAwXzET
// SIG // MBEGCgmSJomT8ixkARkWA2NvbTEZMBcGCgmSJomT8ixk
// SIG // ARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0
// SIG // IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTA3
// SIG // MDQwMzEyNTMwOVoXDTIxMDQwMzEzMDMwOVowdzELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBMIIBIjANBgkqhkiG9w0BAQEF
// SIG // AAOCAQ8AMIIBCgKCAQEAn6Fssd/bSJIqfGsuGeG94uPF
// SIG // mVEjUK3O3RhOJA/u0afRTK10MCAR6wfVVJUVSZQbQpKu
// SIG // mFwwJtoAa+h7veyJBw/3DgSY8InMH8szJIed8vRnHCz8
// SIG // e+eIHernTqOhwSNTyo36Rc8J0F6v0LBCBKL5pmyTZ9co
// SIG // 3EZTsIbQ5ShGLieshk9VUgzkAyz7apCQMG6H81kwnfp+
// SIG // 1pez6CGXfvjSE/MIt1NtUrRFkJ9IAEpHZhEnKWaol+TT
// SIG // BoFKovmEpxFHFAmCn4TtVXj+AZodUAiFABAwRu233iNG
// SIG // u8QtVJ+vHnhBMXfMm987g5OhYQK1HQ2x/PebsgHOIktU
// SIG // //kFw8IgCwIDAQABo4IBqzCCAacwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAdBgNVHQ4EFgQUIzT42VJGcArtQPt2+7MrsMM1
// SIG // sw8wCwYDVR0PBAQDAgGGMBAGCSsGAQQBgjcVAQQDAgEA
// SIG // MIGYBgNVHSMEgZAwgY2AFA6sgmBAVieX5SUT/CrhClOV
// SIG // WeSkoWOkYTBfMRMwEQYKCZImiZPyLGQBGRYDY29tMRkw
// SIG // FwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0MS0wKwYDVQQD
// SIG // EyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRo
// SIG // b3JpdHmCEHmtFqFKoKWtTHNY9AcTLmUwUAYDVR0fBEkw
// SIG // RzBFoEOgQYY/aHR0cDovL2NybC5taWNyb3NvZnQuY29t
// SIG // L3BraS9jcmwvcHJvZHVjdHMvbWljcm9zb2Z0cm9vdGNl
// SIG // cnQuY3JsMFQGCCsGAQUFBwEBBEgwRjBEBggrBgEFBQcw
// SIG // AoY4aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9j
// SIG // ZXJ0cy9NaWNyb3NvZnRSb290Q2VydC5jcnQwEwYDVR0l
// SIG // BAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQEFBQADggIB
// SIG // ABCXisNcA0Q23em0rXfbznlRTQGxLnRxW20ME6vOvnuP
// SIG // uC7UEqKMbWK4VwLLTiATUJndekDiV7uvWJoc4R0Bhqy7
// SIG // ePKL0Ow7Ae7ivo8KBciNSOLwUxXdT6uS5OeNatWAweaU
// SIG // 8gYvhQPpkSokInD79vzkeJkuDfcH4nC8GE6djmsKcpW4
// SIG // oTmcZy3FUQ7qYlw/FpiLID/iBxoy+cwxSnYxPStyC8jq
// SIG // cD3/hQoT38IKYY7w17gX606Lf8U1K16jv+u8fQtCe9RT
// SIG // ciHuMMq7eGVcWwEXChQO0toUmPU8uWZYsy0v5/mFhsxR
// SIG // VuidcJRsrDlM1PZ5v6oYemIp76KbKTQGdxpiyT0ebR+C
// SIG // 8AvHLLvPQ7Pl+ex9teOkqHQ1uE7FcSMSJnYLPFKMcVpG
// SIG // QxS8s7OwTWfIn0L/gHkhgJ4VMGboQhJeGsieIiHQQ+kr
// SIG // 6bv0SMws1NgygEwmKkgkX1rqVu+m3pmdyjpvvYEndAYR
// SIG // 7nYhv5uCwSdUtrFqPYmhdmG0bqETpr+qR/ASb/2KMmyy
// SIG // /t9RyIwjyWa9nR2HEmQCPS2vWY+45CHltbDKY7R4VAXU
// SIG // QS5QrJSwpXirs6CWdRrZkocTdSIvMqgIbqBbjCW/oO+E
// SIG // yiHW6x5PyZruSeD3AWVviQt9yGnI5m7qp5fOMSn/DsVb
// SIG // XNhNG6HY+i+ePy5VFmvJE6P9MYIEnDCCBJgCAQEwgZAw
// SIG // eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0ECEzMAAACdHo0n
// SIG // rrjz2DgAAQAAAJ0wCQYFKw4DAhoFAKCBvjAZBgkqhkiG
// SIG // 9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgEL
// SIG // MQ4wDAYKKwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQU
// SIG // mQFwh6nqE5voow2yWuh7zdZxM68wXgYKKwYBBAGCNwIB
// SIG // DDFQME6gJoAkAE0AaQBjAHIAbwBzAG8AZgB0ACAATABl
// SIG // AGEAcgBuAGkAbgBnoSSAImh0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9sZWFybmluZyAwDQYJKoZIhvcNAQEBBQAE
// SIG // ggEAN1kFlD7l2v+U4LgCYI0Uadi5GsTii/ViW7vqob7G
// SIG // keTNnAjEjKNWjkIiSMmu6JIwmyoQluXECIQdVJWLB92b
// SIG // pNH3TiBrUJjxpdXZc23glVjjZaqDW4EKVH93QZYnt6Pp
// SIG // z991nmbUj09SRsKZKlpffQi/R0yFDFaPjUtzHJnvhZHV
// SIG // bxzPQwInwMw77G/TfiNFmsOC3eDeLHzc0STTZjI7sZ9/
// SIG // GlkjWUegmHvG24AUjkrcw6kfCW7fGlaBhHvsYJLM25nE
// SIG // OF9fQkPnv2sXnOXDjFno5mG/TJBpvY5R/P7ohdm8tIqy
// SIG // 8mML1j+V8X3RBZJrlOUrcjJuWug2kGOcQtSQoKGCAh8w
// SIG // ggIbBgkqhkiG9w0BCQYxggIMMIICCAIBATCBhTB3MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0ECCmECkkoAAAAAACAwCQYF
// SIG // Kw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0B
// SIG // BwEwHAYJKoZIhvcNAQkFMQ8XDTEyMTExNTAwMDc1OFow
// SIG // IwYJKoZIhvcNAQkEMRYEFOnf1gjDYJQ/47ij6pkRdkca
// SIG // Ytq0MA0GCSqGSIb3DQEBBQUABIIBAKLB1B7fzllI1I+s
// SIG // 10MDp09Q/90Gn/pcVZDuvVEebAcWEsioS8wrHYqelVlB
// SIG // spPojDPg5nwGjP0aprct5Ievu+/z//HaPD3KZ/nGzoX+
// SIG // xPzJ3Qm+a89tqLITMD0H7ezE1+GQWq+qYKD86GvFPRaV
// SIG // 0g9h7bxOhMmhajEDUPPzsRNqPbjyJBWcRv0HCFjDoNDH
// SIG // RKnkgEnMlj6bMnHCrV9NCspJnNI1PIFszmrIkGX25+rk
// SIG // RffICu3SEdDcZ0LEg12IkzUZWfkF3b+R9AdJcZJR9Dhy
// SIG // EYojobEMbplhO5m4SrAmQUvYDZeYpNjdUbENGyutWA7g
// SIG // b+lelMvicw2hXCjTCZo=
// SIG // End signature block
