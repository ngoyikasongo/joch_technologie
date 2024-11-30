class JeuCalculMental {
    constructor() {
        this.score = 0;
        this.niveau = 1;
        this.operationActuelle = '';
        this.reponseCorrecte = null;
        this.bonnesReponses = 0;
        this.totalQuestions = 0;
        this.synth = window.speechSynthesis;
    }

    parler(texte) {
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(texte);
        utterance.lang = 'fr-FR';
        utterance.volume = 1;
        utterance.rate = 1;
        this.synth.speak(utterance);
    }

    genererNombres() {
        const max = Math.pow(10, Math.min(this.niveau, 3));
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        return [a, b];
    }

    genererCalcul(operation) {
        let [a, b] = this.genererNombres();
        let calcul = '';
        
        switch(operation) {
            case '+':
                this.reponseCorrecte = a + b;
                calcul = `${a} + ${b}`;
                break;
            case '-':
                this.reponseCorrecte = a - b;
                calcul = `${a} - ${b}`;
                break;
            case '×':
                this.reponseCorrecte = a * b;
                calcul = `${a} × ${b}`;
                break;
            case '÷':
                // Assurer une division exacte
                this.reponseCorrecte = a;
                calcul = `${a * b} ÷ ${b}`;
                break;
        }

        document.getElementById('calcul').textContent = calcul;
        this.parler(calcul.replace('×', 'fois').replace('÷', 'divisé par'));
    }

    verifierReponse(reponseUtilisateur) {
        this.totalQuestions++;
        document.getElementById('totalQuestions').textContent = this.totalQuestions;

        const messageElement = document.getElementById('message');
        let message = '';

        // Permettre une petite marge d'erreur pour les divisions (nombres décimaux)
        const estCorrect = Math.abs(reponseUtilisateur - this.reponseCorrecte) < 0.01;

        if (estCorrect) {
            this.bonnesReponses++;
            this.score += 10 * this.niveau;
            message = "Excellent ! C'est la bonne réponse !";
            messageElement.className = 'message success';
            
            // Augmenter le niveau tous les 5 succès
            if (this.bonnesReponses % 5 === 0) {
                this.niveau = Math.min(this.niveau + 1, 3);
            }
        } else {
            message = `Incorrect. La bonne réponse était ${this.reponseCorrecte}`;
            messageElement.className = 'message error';
        }

        document.getElementById('score').textContent = this.score;
        document.getElementById('niveau').textContent = this.niveau;
        document.getElementById('bonnesReponses').textContent = this.bonnesReponses;
        messageElement.textContent = message;
        this.parler(message);

        // Générer nouveau calcul
        if (this.operationActuelle === 'mix') {
            this.genererCalculMixte();
        } else {
            this.genererCalcul(this.operationActuelle);
        }
    }

    genererCalculMixte() {
        const operations = ['+', '-', '×', '÷'];
        const operationAleatoire = operations[Math.floor(Math.random() * operations.length)];
        this.genererCalcul(operationAleatoire);
    }
}

const jeu = new JeuCalculMental();

function selectionnerOperation(operation) {
    jeu.operationActuelle = operation;
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('userAnswer').value = '';
    
    if (operation === 'mix') {
        jeu.genererCalculMixte();
    } else {
        jeu.genererCalcul(operation);
    }
}

function verifierReponse() {
    const reponseUtilisateur = parseFloat(document.getElementById('userAnswer').value);
    if (!isNaN(reponseUtilisateur)) {
        jeu.verifierReponse(reponseUtilisateur);
        document.getElementById('userAnswer').value = '';
    } else {
        jeu.parler("Veuillez entrer un nombre valide");
    }
}

// Permettre l'utilisation de la touche Entrée
document.getElementById('userAnswer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !document.getElementById('submitBtn').disabled) {
        verifierReponse();
    }
});

// Message de bienvenue
window.onload = function() {
    jeu.parler("Bienvenue dans le jeu de calcul mental ! Choisissez une opération pour commencer");
};