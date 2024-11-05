import XLSX, { WorkBook, WorkSheet } from 'xlsx';

import {
  ALL_MAPPINGS,
  DEFENSIVE_MAPPINGS,
  FINISHING_MAPPINGS,
  PHYSICAL_MAPPINGS,
  REBOUNDING_MAPPINGS,
  SHEET_NAMES,
  SHOOTING_MAPPINGS,
  SKILL_MAPPINGS,
} from '../excel/constants/ExcelColumnMappings';
import { ExcelToAttributeDTOMapper } from '../excel/mappers/ExcelToAttributeDTOMapper';
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

interface Dependencies {
  readonly createDefensiveAttributesUseCase: ICreateDefensiveAttributesUseCase;
  readonly createFinishingAttributesUseCase: ICreateFinishingAttributesUseCase;
  readonly createPhysicalAttributesUseCase: ICreatePhysicalAttributesUseCase;
  readonly createReboundingAttributesUseCase: ICreateReboundingAttributesUseCase;
  readonly createShootingAttributesUseCase: ICreateShootingAttributesUseCase;
  readonly createSkillAttributesUseCase: ICreateSkillAttributesUseCase;
}

export class BulkCreatePlayerUserAttributeCategoriesService {
  readonly #createDefensiveAttributesUseCase: ICreateDefensiveAttributesUseCase;

  readonly #createFinishingAttributesUseCase: ICreateFinishingAttributesUseCase;

  readonly #createPhysicalAttributesUseCase: ICreatePhysicalAttributesUseCase;

  readonly #createReboundingAttributesUseCase: ICreateReboundingAttributesUseCase;

  readonly #createShootingAttributesUseCase: ICreateShootingAttributesUseCase;

  readonly #createSkillAttributesUseCase: ICreateSkillAttributesUseCase;

  private constructor(dependencies: Dependencies) {
    this.#createDefensiveAttributesUseCase = dependencies.createDefensiveAttributesUseCase;
    this.#createFinishingAttributesUseCase = dependencies.createFinishingAttributesUseCase;
    this.#createPhysicalAttributesUseCase = dependencies.createPhysicalAttributesUseCase;
    this.#createReboundingAttributesUseCase = dependencies.createReboundingAttributesUseCase;
    this.#createShootingAttributesUseCase = dependencies.createShootingAttributesUseCase;
    this.#createSkillAttributesUseCase = dependencies.createSkillAttributesUseCase;
  }

  public static create(dependencies: Dependencies): BulkCreatePlayerUserAttributeCategoriesService {
    return new BulkCreatePlayerUserAttributeCategoriesService(dependencies);
  }

  public async execute(workbook: WorkBook, userContext: IUserContext): Promise<void> {
    const processingPromises: Promise<void>[] = [];

    ALL_MAPPINGS.forEach((mapping) => {
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
    const dtos = data.map((row) => ExcelToAttributeDTOMapper.mapToDTOFromArray<CreateDefensiveAttributesDTO>(row, DEFENSIVE_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.#createDefensiveAttributesUseCase.execute(dto, userContext));
    await Promise.all(promises);
  }

  async #processFinishingAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToAttributeDTOMapper.mapToDTOFromArray<CreateFinishingAttributesDTO>(row, FINISHING_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.#createFinishingAttributesUseCase.execute(dto, userContext));
    await Promise.all(promises);
  }

  async #processPhysicalAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToAttributeDTOMapper.mapToDTOFromArray<CreatePhysicalAttributesDTO>(row, PHYSICAL_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.#createPhysicalAttributesUseCase.execute(dto, userContext));
    await Promise.all(promises);
  }

  async #processReboundingAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToAttributeDTOMapper.mapToDTOFromArray<CreateReboundingAttributesDTO>(row, REBOUNDING_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.#createReboundingAttributesUseCase.execute(dto, userContext));
    await Promise.all(promises);
  }

  async #processShootingAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToAttributeDTOMapper.mapToDTOFromArray<CreateShootingAttributesDTO>(row, SHOOTING_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.#createShootingAttributesUseCase.execute(dto, userContext));
    await Promise.all(promises);
  }

  async #processSkillAttributes(data: Record<string, any>[], userContext: IUserContext): Promise<void> {
    const dtos = data.map((row) => ExcelToAttributeDTOMapper.mapToDTOFromArray<CreateSkillAttributesDTO>(row, SKILL_MAPPINGS.mappings));
    const promises = dtos.map((dto) => this.#createSkillAttributesUseCase.execute(dto, userContext));
    await Promise.all(promises);
  }
}
