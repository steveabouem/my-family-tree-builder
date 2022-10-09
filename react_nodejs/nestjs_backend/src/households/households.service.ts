import { DataSource } from "typeorm";
import { Injectable } from '@nestjs/common';
import { Household } from 'src/households/household.entity';
import { create } from "domain";

@Injectable
export class HouseholdService () {
    constructor(private dataSource: DataSource) {}

    async create(data: HouseholdCreateDTO)
}