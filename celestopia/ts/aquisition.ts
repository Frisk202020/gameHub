export class Aquisition {
    price: number;
    coinValue: number;
    ribbonValue: number;
    starValue: number;

    constructor(price: number, coin: number, ribbon: number, star: number) {
        this.price = price;
        this.coinValue = coin;
        this.ribbonValue = ribbon;
        this.starValue = star;
    }

    display() {
        //TODO: card navigation interface
    }

    static bank = [
        new Aquisition(1050,150,0,1800),   // astropy
        new Aquisition(2400,150,3600,0),   // baloon
        new Aquisition(600,50,1650,0),     // bd
        new Aquisition(3300,4050,1100,0),  // beauty
        new Aquisition(3300,5100,0,0),     // camping
        new Aquisition(2850,3600,0,300),   // car
        new Aquisition(4500,2000,2000,2000), // castle
        new Aquisition(450,1200,0,100),    // chest
        new Aquisition(2100,4200,0,200),   // horse
        new Aquisition(3000,5000,5000,5000), // magic
        new Aquisition(2400,3600,0,150),   // moto
        new Aquisition(1000,100,0,1800),   // necklace
        new Aquisition(2100,3250,1050,200),// picasso
        new Aquisition(3000,7500,300,0),   // pool
        new Aquisition(1050,150,1800,0),   // post
        new Aquisition(2850,3600,0,300),   // tractor
        new Aquisition(3000,300,0,7500),   // vase
        new Aquisition(3000,4500,100,0),   // wine
    ];

    static getRandomAquisition() {
        const i = Math.floor(Math.random() * Aquisition.bank.length);
        const value = Aquisition.bank[i];
        Aquisition.bank[i] = Aquisition.bank[Aquisition.bank.length - 1];
        Aquisition.bank.pop();

        return value;
    }

    static returnAquisitionToBank(aquisition: Aquisition) {
        Aquisition.bank.push(aquisition);
    }
}
