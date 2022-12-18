import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Targets } from "./Targets";

// This code is for defining DB table
@Entity("CALIBERS", { schema: "sharpshooter" })
export class Calibers {
    @PrimaryGeneratedColumn({ type: "int", name: "ID" })
    id: number;    

    @Column("decimal", { name: "SIZE", precision: 10, scale: 6, nullable: false })
    size: string;

    @OneToMany(() => Targets, (targets) => targets.calibers)
    targets: Targets[];
}