export default interface Seat {
    row: string;
    number: number;
    occupied: boolean;
    type: "vip" | "standard";
}