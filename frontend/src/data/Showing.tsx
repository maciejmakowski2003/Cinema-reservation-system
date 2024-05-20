import Seat from "./Seat";

export default interface Showing {
    cinema_id: string;
    movie_id: string;
    start_date: Date;
    hall_id: string;
    price: {
        standard: number;
        vip: number;
    };
    format: {
        type: '2D' | '3D' | '4D';
        language: 'subtitled' | 'dubbed' | 'original' | 'voiceover';
    };
    seats: Seat[];
}