interface IAuditableEntity {
  createdAt: string;
  updatedAt: string;
}

export interface AggregateRootHttpResponseDTO extends IAuditableEntity {
  id: string;
}
