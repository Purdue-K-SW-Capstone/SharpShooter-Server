import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Calibers } from "./Calibers";


@Entity("TARGETS", { schema: "sharpshooter" })
export class Targets {
    @PrimaryGeneratedColumn({ type: "int", name: "ID" })
    id: number;    

    @Column("decimal", { name: "REAL_GROUP_SIZE", precision: 10, scale: 6 })
    realGroupSize: string;

    @Column("decimal", { name: "COMPUTER_GROUP_SIZE", precision: 10, scale: 6 })
    computerGroupSize: string;

    @Column("int", { name: "BULLET_COUNT" })
    bulletCount: number;

    @Column("int", { name: "CALIBER_ID" })
    caliberId: number;

    @CreateDateColumn({ type: "timestamp", name: "CREATED_AT", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", name: "UPDATED_AT", nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", name: "DELETED_AT", nullable: true })
    deletedAt: Date;

    @ManyToOne(() => Calibers, (calibers) => calibers.targets)
    @JoinColumn([{ name: "CALIBER_ID", referencedColumnName: "id" }])
    calibers: Calibers;
}