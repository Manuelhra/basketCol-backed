import XLSX, { WorkBook, WorkSheet } from 'xlsx';

import { ICreateDefensiveAttributesUseCase } from '../../../defensive/application/use-cases/ports/ICreateDefensiveAttributesUseCase';
import { ICreateFinishingAttributesUseCase } from '../../../finishing/application/use-cases/ports/ICreateFinishingAttributesUseCase';
import { ICreatePhysicalAttributesUseCase } from '../../../physical/application/use-cases/ports/ICreatePhysicalAttributesUseCase';
import { ICreateReboundingAttributesUseCase } from '../../../rebounding/application/use-cases/ports/ICreateReboundingAttributesUseCase';
import { ICreateShootingAttributesUseCase } from '../../../shooting/application/use-cases/ports/ICreateShootingAttributesUseCase';
import { ICreateSkillAttributesUseCase } from '../../../skill/application/use-cases/ports/ICreateSkillAttributesUseCase';
import { CreateDefensiveAttributesDTO } from '../../../defensive/application/dtos/CreateDefensiveAttributesDTO';
import { CreateFinishingAttributesDTO } from '../../../finishing/application/dtos/CreateFinishingAttributesDTO';
import { CreatePhysicalAttributesDTO } from '../../../physical/application/dtos/CreatePhysicalAttributesDTO';
import { CreateReboundingAttributesDTO } from '../../../rebounding/application/dtos/CreateReboundingAttributesDTO';
import { CreateShootingAttributesDTO } from '../../../shooting/application/dtos/CreateShootingAttributesDTO';
import { CreateSkillAttributesDTO } from '../../../skill/application/dtos/CreateSkillAttributesDTO';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import {
  ALL_ATTRIBUTES_MAPPINGS,
  DEFENSIVE_ATTRIBUTE_MAPPINGS,
  FINISHING_ATTRIBUTE_MAPPINGS,
  PHYSICAL_ATTRIBUTE_MAPPINGS,
  REBOUNDING_ATTRIBUTE_MAPPINGS,
  SHEET_NAMES,
  SHOOTING_ATTRIBUTE_MAPPINGS,
  SKILL_ATTRIBUTE_MAPPINGS,
} from '../file-upload/excel/constants/mappings';
import { ExcelToDTOMapper } from '../../../../../../shared/infrastructure/file-upload/excel/mappers/ExcelToDTOMapper';
import { IUuidGenerator } from '../../../../../../shared/application/uuid/ports/IUuidGenerator';

interface Dependencies {
  readonly createDefensiveAttributesUseCase: ICreateDefensiveAttributesUseCase;
  readonly createFinishingAttributesUseCase: ICreateFinishingAttributesUseCase;
  readonly createPhysicalAttributesUseCase: ICreatePhysicalAttributesUseCase;
  readonly createReboundingAttributesUseCase: ICreateReboundingAttributesUseCase;
  readonly createShootingAttributesUseCase: ICreateShootingAttributesUseCase;
  readonly createSkillAttributesUseCase: ICreateSkillAttributesUseCase;
  readonly uuidGenerator: IUuidGenerator;
}

export class BulkCreatePlayerUserAttributeCategoriesFromExcelService {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): BulkCreatePlayerUserAttributeCategoriesFromExcelService {
    return new BulkCreatePlayerUserAttributeCategoriesFromExcelService(dependencies);
  }

  public async execute(workbook: WorkBook, userContext: IUserContext): Promise<void> {
    const processingPromises: Promise<void>[] = [];

    ALL_ATTRIBUTES_MAPPINGS.forEach((mapping) => {
      const worksheet: WorkSheet | undefined = workbook.Sheets[mapping.sheetName];

      if (!worksheet) return;

      const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

      switch (mapping.sheetName) {
        case SHEET_NAMES.DEFENSIVE:
          processingPromises.push(this.#processDefensiveAttributes(data, userContext));
          break;
        case SHEET_NAMES.FINISHING:
          processingPromises.push(this.#processFinishingAttributes(data, userContext));
          break;
        case SHEET_NAMES.PHYSICAL:
          processingPromises.push(this.#processPhysicalAttributes(data, userContext));
          break;
        case SHEET_NAMES.REBOUNDING:
          processingPromises.push(this.#processReboundingAttributes(data, userContext));
          break;
        case SHEET_NAMES.SHOOTING:
          processingPromises.push(this.#processShootingAttributes(data, userContext));
          break;
        case SHEET_NAMES.SKILL:
          processingPromises.push(this.#processSkillAttributes(data, userContext));
          break;
      }
    });

    await Promise.all(processingPromises);
  }

  async #processDefensiveAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateDefensiveAttributesDTO>(row, DEFENSIVE_ATTRIBUTE_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.dependencies.createDefensiveAttributesUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(promises);
  }

  async #processFinishingAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateFinishingAttributesDTO>(row, FINISHING_ATTRIBUTE_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.dependencies.createFinishingAttributesUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(promises);
  }

  async #processPhysicalAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreatePhysicalAttributesDTO>(row, PHYSICAL_ATTRIBUTE_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.dependencies.createPhysicalAttributesUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(promises);
  }

  async #processReboundingAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateReboundingAttributesDTO>(row, REBOUNDING_ATTRIBUTE_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.dependencies.createReboundingAttributesUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(promises);
  }

  async #processShootingAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateShootingAttributesDTO>(row, SHOOTING_ATTRIBUTE_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.dependencies.createShootingAttributesUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(promises);
  }

  async #processSkillAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateSkillAttributesDTO>(row, SKILL_ATTRIBUTE_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.dependencies.createSkillAttributesUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(promises);
  }
}
