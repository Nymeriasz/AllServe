# features/buscar_bartenders.feature

Feature: Busca de Bartenders

  Scenario: Acessar a página de busca
    Given que eu estou logado como cliente
    When eu navego para a página "Buscar Bartenders"
    Then eu devo ver o título "Encontre o Bartender Perfeito"