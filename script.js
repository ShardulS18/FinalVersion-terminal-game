    // Initialize the terminal with cursor options
    const terminal = new Terminal({
        cursorBlink: true,    
        cursorStyle: 'block', 
        fontSize: 14,         
        fontFamily: 'monospace' 
    });
    terminal.open(document.getElementById('terminal-container'));

    // Display a welcome message
    terminal.write("Welcome to the dream portal!\r\nIf any doubts refer to the commands given in the hoverbar.\r\nType 'start' to begin.\r\n$ ");

    // Set up a command buffer to capture input
    let commandBuffer = "";
    let quoteTimer = null;

    // Added initial state
    let currentScene = 'initial';
    let images = {};
    let currentSound = null;

   // Handle key input in the terminal
terminal.onData((data) => {
    // Convert the input to a character code
    const code = data.charCodeAt(0);

    // Check for arrow keys (up/down)
    if (data === '\x1B[A' || data === '\x1B[B') {
        // Prevent up/down arrow keys from working
        return;
    }

    if (code === 13) { 
        executeCommand(commandBuffer);
        commandBuffer = ""; 
    } 
    else if (code === 127) {
        if (commandBuffer.length > 0) {
            commandBuffer = commandBuffer.slice(0, -1);
            terminal.write("\b \b");
        }
    } 
    else {
        commandBuffer += data;
        terminal.write(data);
    }
});

    // Modified command execution function
    function executeCommand(command) {
        terminal.write("\r\n");
        
        switch(command.trim().toLowerCase()) {
            case 'start':
                if (currentScene === 'initial') {
                    terminal.write("Starting your journey...\r\nUse ls command to list where you can go or what you can use\r\n");
                    showLighthouseScene();
                    playSound('ocean_waves');
                }
                break;

            case 'whoami':
                if (currentScene === 'lighthouse-moved') {
                    terminal.write("Initiating self-discovery...\r\n");
                    showQuote();
                }
                break;

            case 'ls':
                switch(currentScene) {
                    case 'lighthouse-moved':
                        terminal.write("You are in a dream type 'whoami' command to proceed.\r\n");
                        break;
                    case 'bedroom':
                        terminal.write("Available options:\r\n- dining room (directory)\r\n- washroom (directory)\r\n- phone (file)\r\n");
                        break;
                    case 'dining-room':
                        terminal.write("Need to brush teeth first.\r\n");
                        break;
                    case 'washroom':
                        terminal.write("Available options:\r\n- brush teeth (file)\r\n");
                        break;
                    default:
                        terminal.write("No options available.\r\n");
                }
                break;

            case 'cat phone':
                if (currentScene === 'bedroom') {
                    loadPhoneScene();
                    playSound('phone_pickup');
                }
                break;
            case 'q':
                if(currentScene === 'phone') {
                    returnToBedroomScene();
                }
                break;

            case 'cd dining room':
                if (currentScene === 'bedroom') {
                    loadDiningRoomScene();
                    playSound('footsteps_level0');
                }
                break;

            case 'cd washroom':
                if (currentScene === 'bedroom') {
                    loadWashroomScene();
                    playSound('footsteps_to_washroom');
                    playSound('water_running');
                }
                break;

            case 'cat brush teeth':
                if (currentScene === 'washroom') {
                    loadPortalScene();
                    playSound('portal_opening');
                }
                break;

            case 'cd ..':
                if (['dining-room'].includes(currentScene)) {
                    returnToBedroomScene();
                    playSound('footsteps_level0');
                } else if (['washroom'].includes(currentScene)){
                    returnToBedroomScene();
                    playSound('footsteps_to_washroom');
                }
                break;
            case 'clear':
                terminal.clear();
                terminal.scrollToTop();
                terminal.write("Welcome to the dream portal!\r\nIf any doubts refer to the commands given in the hoverbar.");
                break;

            default:
                terminal.write(`Command not found: ${command}\r\n`);
        }

        terminal.write("\r\n$ ");
    }

    // Initialize PIXI application and load assets
    const app = new PIXI.Application();
    app.init({ background: "#000000", resizeTo: window })
    .then(async () => {
        document.getElementById("pixi-container").appendChild(app.view);

        // Load all required textures
        const textures = await loadTextures();
        createSprites(textures);
    });

    async function loadTextures() {
        return {
            lighthouse: await PIXI.Assets.load("Lighthouse.svg"),
            background: await PIXI.Assets.load("Background.svg"),
            boy: await PIXI.Assets.load("Boy.svg"),
            clouds: await PIXI.Assets.load("Clouds.svg"),
            rock : await PIXI.Assets.load("Rock.svg"),
            backgroundrock : await PIXI.Assets.load("BackgroundRock.svg"),
            backgroundrock2 : await PIXI.Assets.load("BackgroundRock2.svg"),
            bedroom: await PIXI.Assets.load("BedroomScene.svg"),
            phone: await PIXI.Assets.load("PhoneScene.svg"),
            diningRoom: await PIXI.Assets.load("DiningRoom.svg"),
            washroom: await PIXI.Assets.load("WashroomScene.svg"),
            portal: await PIXI.Assets.load("PortalScene.svg"),
            quote: await PIXI.Assets.load("QuoteScene.svg"),
            bedroomObjective: await PIXI.Assets.load("bedroomObjective.svg"),
            returnBedroom: await PIXI.Assets.load("BedroomScene2.svg"),
        };
    }

    function createSprites(textures) {
        // Create sprites for each texture with default properties
        Object.keys(textures).forEach(key => {
            const sprite = new PIXI.Sprite(textures[key]);
            sprite.alpha = 0; // Only set alpha as a default
            app.stage.addChild(sprite);
            images[key] = sprite;
        });

        // Configure individual sprites with specific properties
        // Background
        images.background.anchor.set(0.5);
        images.background.scale.set(1.0);
        images.background.x = app.screen.width / 3;
        images.background.y = app.screen.height / 2;
        images.background.zIndex = 0;

        // Lighthouse
        images.lighthouse.anchor.set(0.2);
        images.lighthouse.scale.set(0.7);
        images.lighthouse.x = app.screen.width / 13;
        images.lighthouse.y = app.screen.height / 5;
        images.lighthouse.zIndex = 2;

        // Background rock
        images.backgroundrock.anchor.set(0.5);
        images.backgroundrock.scale.set(1.0);
        images.backgroundrock.x = app.screen.width / 4;
        images.backgroundrock.y = app.screen.height / 1.63;
        images.backgroundrock.zIndex = 1;

        // Boy
        images.boy.anchor.set(0.45);
        images.boy.x = app.screen.width / 2;
        images.boy.y = app.screen.height / 2;
        images.boy.zIndex = 3;

        // Clouds
        images.clouds.anchor.set(0.5);
        images.clouds.x = app.screen.width / 2.5;
        images.clouds.y = app.screen.height / 2.5;
        images.clouds.zIndex = 0;

        // Rock
        images.rock.anchor.set(0.45);
        images.rock.x = app.screen.width / 20;
        images.rock.y = app.screen.height / 1.1;
        images.rock.zIndex = 3;

        // Background rock 2
        images.backgroundrock2.anchor.set(0.45);
        images.backgroundrock2.x = app.screen.width / 10;
        images.backgroundrock2.y = app.screen.height / 1.1;
        images.backgroundrock2.zIndex = 2;

        //Bedroom Objective
        images.bedroomObjective.anchor.set(0.5);
        images.bedroomObjective.scale.set(1.0);
        images.bedroomObjective.x = app.screen.width / 1;
        images.bedroomObjective.y = app.screen.height / 15;
        images.bedroomObjective.alpha = 0;
        images.bedroomObjective.zIndex = 0;

        // Scene sprites (bedroom, phone, dining room, etc.)
        const sceneSprites = ['bedroom', 'phone', 'diningRoom', 'washroom', 'portal', 'quote', 'returnBedroom'];
        sceneSprites.forEach(key => {
            if (images[key]) {
                images[key].anchor.set(0.5);
                images[key].x = app.screen.width / 3;
                images[key].y = app.screen.height / 2;
                images[key].zIndex = 0;
            }
        });
    }

    async function initializeSounds() {
        const backgroundMusic = document.getElementById('backgroundMusic0');
        
        // Optional: Set volume
        backgroundMusic.volume = 0.1;
        
        try {
            // Play the background music
            await backgroundMusic.play();
        } catch (error) {
            console.error('Error playing background music:', error);
        }
    }

    function playSound(soundId) {
        // Stop the currently playing sound, if any
        if (currentSound) {
            currentSound.pause();
            currentSound.currentTime = 0; // Reset to the beginning
        }
    
        // Play the new sound
        currentSound = document.getElementById(soundId);
        if (currentSound) {
            try {
                currentSound.play();
            } catch (error) {
                console.error(`Error playing sound ${soundId}:`, error);
            }
        }
    }
    

    function showLighthouseScene() {
        currentScene = 'lighthouse';
        
        // Fade in lighthouse scene elements
        Object.values(images).forEach(sprite => {
            sprite.alpha = 0;
        });
        
        const lighthouseElements = ['lighthouse', 'background', 'boy', 'clouds','backgroundrock','rock','backgroundrock2'];
        lighthouseElements.forEach(element => {
            if (images[element]) {
                gsap.to(images[element], {
                    alpha: 1,
                    duration: 1,
                    ease: "power1.inOut"
                });
            }
        });

        // Schedule the transition after 3 seconds
        setTimeout(() => {
            if (currentScene === 'lighthouse') {
                animateTransition();
            }
        }, 3000);

        
    }

    function showQuote() {
        currentScene = 'quote';
        
        // Fade out lighthouse scene elements
        ['lighthouse', 'background', 'boy', 'clouds','backgroundrock','rock','backgroundrock2'].forEach(element => {
            if (images[element]) {
                gsap.to(images[element], {
                    alpha: 0,
                    duration: 1,
                    ease: "power1.inOut"
                });
            }
        });

        // Position and fade in the quote image
        if (images.quote) {
            images.quote.anchor.set(0.5);
        images.quote.x = app.screen.width / 3;
        images.quote.y = app.screen.height / 2;
            
            // Fade in quote
            gsap.to(images.quote, {
                alpha: 1,
                duration: 1,
                ease: "power1.inOut"
            });

            // Schedule quote fadeout and bedroom scene transition
            setTimeout(() => {
                if (currentScene === 'quote') {
                    // Fade out quote
                    gsap.to(images.quote, {
                        alpha: 0,
                        duration: 1,
                        ease: "power1.inOut",
                        onComplete: () => {
                            loadBedroomScene();
                        }
                    });
                }
            }, 5000);  // Show quote for 5 seconds
        }
    }

    function animateTransition() {
        if (currentScene === 'lighthouse') {
            gsap.to([images.clouds, images.lighthouse], { x: '-=40', duration: 3 });
            gsap.to([images.boy, images.rock], { x: '+=40', duration: 3 });
            currentScene = 'lighthouse-moved';
        }
    }

    function loadBedroomScene() {
        playSound('alarm_clock');
        initializeSounds();
        currentScene = 'bedroom';
        // First fade out all other scenes
        const otherScenes = ['phone', 'diningRoom', 'washroom', 'portal'];
        otherScenes.forEach(scene => {
            if (images[scene]) {
                gsap.to(images[scene], {
                    alpha: 0,
                    duration: 1
                });
            }
        });
        
    // Then fade in bedroom
    gsap.to(images.bedroom, {
        alpha: 1,
        duration: 1,
        onComplete: () => {
            // After bedroom is fully loaded, wait 3 seconds then animate overlay
            setTimeout(() => {
                if (currentScene === 'bedroom' && images.bedroomObjective) {
                    // Position the overlay off-screen to the left
                    images.bedroomObjective.x = -images.bedroomObjective.width;
                    images.bedroomObjective.alpha = 1;
                    
                    // Animate it sliding in from the left
                    gsap.to(images.bedroomObjective, {
                        x: app.screen.width / 6, // Match the position of other scenes
                        duration: 1.5,
                        ease: "power2.out"
                    });
                }
            }, 3000);
        }
    });
    }

    function returnToBedroomScene() {
        currentScene = 'bedroom';  // Keep the same scene state as regular bedroom
        
        // Fade out all other scenes including the main bedroom
        const otherScenes = ['phone', 'diningRoom', 'washroom', 'portal', 'bedroom'];
        otherScenes.forEach(scene => {
            if (images[scene]) {
                gsap.to(images[scene], {
                    alpha: 0,
                    duration: 1
                });
            }
        });
        
        // Fade in returnBedroom and objective overlay
        gsap.to([images.returnBedroom, images.bedroomObjective], {
            alpha: 1,
            duration: 1
        });

        // Update the bedroom sprite reference to use returnBedroom
        images.bedroom = images.returnBedroom;
    }

    function loadPhoneScene() {
        currentScene = 'phone';
        // First fade out bedroom completely
        gsap.to([images.bedroom,images.bedroomObjective], {
            alpha: 0,
            duration: 1,
            onComplete: () => {
                // Then fade in phone
                gsap.to(images.phone, {
                    alpha: 1,
                    duration: 1
                });
            }
        });
    }

    function loadDiningRoomScene() {
        currentScene = 'dining-room';
        // Fade out both bedroom and bedroomOverlay simultaneously
        gsap.to([images.bedroom, images.bedroomObjective], { 
            alpha: 0, 
            duration: 1 
        });
        gsap.to(images.diningRoom, { 
            alpha: 1, 
            duration: 1 
        });
    }

    function loadWashroomScene() {
        currentScene = 'washroom';
        // Fade out both bedroom and bedroomOverlay simultaneously
        gsap.to([images.bedroom, images.bedroomObjective], { 
            alpha: 0, 
            duration: 1 
        });
        gsap.to(images.washroom, { 
            alpha: 1, 
            duration: 1 
        });
    }

    function loadPortalScene() {
        currentScene = 'portal';
        console.log('Transitioning to portal scene...');
        
        // Fade out washroom
        gsap.to(images.washroom, { 
            alpha: 0, 
            duration: 1,
            onComplete: () => {
                // Fade in background first, then start animation
                gsap.to(images.portal, {
                    alpha: 1,
                    duration: 0.5,
                    onComplete: startPortalAnimation
                });
            }
        });

        terminal.write("WHOAAAAAAA\r\n");
    }

    function startPortalAnimation() {
        let currentFrame = 1;
        const totalFrames = 5;
        const frameDuration = 0.5; // Duration each frame is shown in seconds
        
        // Show first frame
        gsap.to(images[`portal${currentFrame}`], {
            alpha: 1,
            duration: 0.5
        });

        // Function to handle frame transitions
        function nextFrame() {
            if (currentFrame <= totalFrames) {
                // Fade out current frame
                gsap.to(images[`portal${currentFrame}`], {
                    alpha: 0,
                    duration: frameDuration / 2
                });

                currentFrame++;

                if (currentFrame <= totalFrames) {
                    // Fade in next frame
                    gsap.to(images[`portal${currentFrame}`], {
                        alpha: 1,
                        duration: frameDuration / 2
                    });
                    
                    // Schedule next frame
                    setTimeout(nextFrame, frameDuration * 1000);
                } else {
                    // Fade out background and transition to next level
                    gsap.to(images.portalBackground, {
                        alpha: 0,
                        duration: frameDuration,
                        onComplete: () => {
                            window.location.href = 'index2.html';
                        }
                    });
                }
            }
        }

        // Start the frame animation after showing first frame
        setTimeout(nextFrame, frameDuration * 1000);
    }

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    
    // Update sprite positions
    Object.values(images).forEach(sprite => {
        sprite.x = app.screen.width / 2;
        sprite.y = app.screen.height / 2;
    });
});