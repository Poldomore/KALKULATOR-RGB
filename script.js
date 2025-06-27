const tampilanInputSekarang = document.querySelector('.input-sekarang');
const tampilanPerhitunganSebelumnya = document.querySelector('.perhitungan-sebelumnya');
const tombolAngka = document.querySelectorAll('.btn-angka');
const tombolOperator = document.querySelectorAll('.btn-operator');
const tombolFungsi = document.querySelectorAll('.btn-fungsi');
const tombolAllClear = document.querySelector('.btn-fungsi[class*="btn-fungsi"]'); 
const tombolEquals = document.querySelector('.btn-operator[class*="="]');
const tombolDesimal = document.querySelector('.btn-angka[class*="."]');

const sfxAngka = new Audio('angka-audio.aac');
const sfxOperator = new Audio('operator.aac');
const sfxEqual = new Audio('equal.mpeg');

function mainkanSuara(sound) {
    sound.currentTime = 0;
    sound.play();
}

let inputSekarang = '0';
let perhitunganSebelumnya = '';
let operator = undefined;
let hasilDitampilkan = false;

function updateTampilan() {
    tampilanInputSekarang.innerText = inputSekarang;
    if (operator != null) {
        const operatorTampilan = operator === '*' ? '×' : operator;
        tampilanPerhitunganSebelumnya.innerText = `${perhitunganSebelumnya} ${operatorTampilan}`;
    } else {
        tampilanPerhitunganSebelumnya.innerText = '';
    }
}

function tambahAngka(angka) {
    if (hasilDitampilkan) {
        inputSekarang = '';
        hasilDitampilkan = false;
    }
    if(angka === '.' && inputSekarang.includes('.')) return;
    inputSekarang = inputSekarang === '0' && angka !== '.' ? angka : inputSekarang + angka;
}

function pilihOperator(op) {
    if(inputSekarang === '') return;
    if(perhitunganSebelumnya !== '') {
        hitung()
    }
    operator = op === 'x' ? '*' : op;
    perhitunganSebelumnya = inputSekarang;
    inputSekarang = '';
    hasilDiTampilkan = false;
}

function hitung() {
    let hasil;
    const sebelum = parseFloat(perhitunganSebelumnya);
    const sekarang = parseFloat(inputSekarang);

    if (isNaN (sebelum) || isNaN(sekarang)) return;

    switch (operator) {
        case '+':
            hasil = sebelum + sekarang;
            break;
        case '-':
            hasil = sebelum - sekarang;
            break;
        case '*':
            hasil = sebelum * sekarang; 
            break;
        case '/':
           if (sekarang === 0) {
            alert("ERROR: PAS SD BOLOS MULU YA?? GABISA DIBAGI NOLL");
            resetKalkulator();
            return;
           }
           hasil = sebelum / sekarang
           break;
         default:
           return;    
    }
    inputSekarang = hasil.toString();
    operator = undefined;
    perhitunganSebelumnya = '';
    hasilDiTampilkan = true;
}

function resetKalkulator() {
    inputSekarang = '0'
    perhitunganSebelumnya = '';
    operator = undefined;
    hasilDiTampilkan = false;
}

function handleFungsiSpesial(func) {
    const nilaiSekarang = parseFloat(inputSekarang);
    if (isNaN(nilaiSekarang)) return;

    switch (func) {
        case '+/-':
            inputSekarang = (nilaiSekarang * -1).toString();
            break;
        case '%':
            inputSekarang = (nilaiSekarang / 100).toString();    
    }
}

tombolAngka.forEach(button => {
    button.addEventListener('click', () => {
        mainkanSuara(sfxAngka); // Memainkan suara untuk angka
        tambahAngka(button.innerText);
        updateTampilan();
    });
});

tombolFungsi.forEach(button => {
    button.addEventListener('click', () => {
        mainkanSuara(sfxOperator); // Memainkan suara untuk fungsi spesial
        if (button.innerText === 'AC') {
            resetKalkulator();
        } else {
            handleFungsiSpesial(button.innerText);
        }
        updateTampilan();
    });
});

tombolOperator.forEach(button => {
    button.addEventListener('click', () => {
        // Logika suara ditempatkan di dalam kondisi
        if (button.innerText === '=') {
            mainkanSuara(sfxEqual); // Memainkan suara KHUSUS untuk sama dengan
            hitung();
        } else {
            mainkanSuara(sfxOperator); // Memainkan suara untuk operator lain (+, -, x, /)
            pilihOperator(button.innerText);
        }
        updateTampilan();
    });
});

resetKalkulator();
updateTampilan();
