class TruthOrDare {
    _API_ENDPOINT_MODES = new Map([
        ['truth', 'https://api.truthordarebot.xyz/v1/truth'],
        ['dare', 'https://api.truthordarebot.xyz/v1/dare'],
    ]);

    constructor() {
        this.question = ''
        this.questionSpan = document.querySelector('#question');
        this.questionDiv = document.querySelector('.question');
        this.coverDiv = document.querySelector('.cover');
        this.resetButton = document.querySelector('.reset-btn')

        this.isFullScreen = false;
        this.music = null;
        this.musicPlaying = false;
    }

    init() {
        this.playMusic()
        this.choose();
        this.resetButton.addEventListener('click', () => this.reset())
    }

    choose() {
        document.querySelector('.truth-or-dare').addEventListener('click', e => {
            // play music
            if (!this.musicPlaying && this.music) {
                this.music.loop = true;
                this.music.start();
                this.musicPlaying = true;
            }

            // enable full screen mode
            if (!this.isFullScreen) {


                let elem = document.documentElement;
                elem
                    .requestFullscreen({ navigationUI: "show" })
                    .then(() => {})
                    .catch((err) => {
                        alert(
                            `An error occurred while trying to switch into fullscreen mode: ${err.message} (${err.name})`,
                        );
                    });
            }

            const TARGET = e.target;

            if (TARGET.classList.contains('truth')) {
                // Truth
                this.fetchQuestion('truth')
            }

            if (TARGET.classList.contains('dare')) {
                // Dare
                this.fetchQuestion('dare')
            }
        });
    }

    async fetchQuestion( mode ) {
        this.toggleUI();
       const API = this._API_ENDPOINT_MODES.get(mode);
       const res = await fetch(API);
       this.question = await res.json();
       this.render()
    }

    toggleUI() {
        this.coverDiv.classList.toggle('is-active');
        this.questionDiv.classList.toggle('is-active');
    }

    reset () {
        this.questionSpan.textContent = 'Loading...';
        this.toggleUI();
    }

    async playMusic() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let audioBuffer;
        const gainNode = audioContext.createGain(); // Create a GainNode

        // Connect the GainNode to the destination (speakers)
        gainNode.connect(audioContext.destination);

        await fetch('assets/melancholia.weba')
            .then(response => response.arrayBuffer())
            .then(data => audioContext.decodeAudioData(data))
            .then(decodedData => {
                audioBuffer = decodedData;

                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;

                // Connect the source node to the GainNode
                source.connect(gainNode);
                gainNode.gain.value = 0.5;
                this.music = source;
            })
            .catch(error => {
                console.error('Error loading audio file:', error);
            });
    }

    render ( ) {
        this.questionSpan.textContent = this.question.question;
    }
}

const Game = new TruthOrDare();

// alert :)
confirm('------ Truth or Dare ------ \n \n Remember, You cannot escape once you in! 👻 choose wisely.')
    ? Game.init()
    : window.close();
