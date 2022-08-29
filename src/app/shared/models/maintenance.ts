export class Maintenance {
    DayOr10Hours: Array<string> = [
        "Nível de água do radiador", 
        "Nível de óleo do motor", 
        "Nível de óleo da transmissão", 
        "Condição dos freios",
        "Drenar sedimentador",
        "Drenar filtros de combustível",
        "Lubrificar o trator"
    ];
    WeekOr50Hours: Array<string> = [
        "Verificar correias", 
        "Verificação do sistema elétrico", 
        "Verificação do nível de óleo dos sistemas hidráulicos e de transmissão", 
        "Pressão dos pneus"
    ];
    MonthOr250Hours: Array<string> = [
        "Troca do óleo lubrificante do motor e filtro", 
        "Nível de óleo bomba injetora"
    ];
    SemesterOr500Hours: Array<string> = [
        "Desmontagem das rodas e engraxamento", 
        "Substituição da água do radiador e limpeza do radiador", 
        "Substituição dos Filtros de Combustível", 
        "Filtro Primário (pré-filtro)",
        "Filtro Secundário (de combustível)"
    ];
    YearOr1000Hours:Array<string> = [
        "Trocar o óleo dos sistemas hidráulicos e de transmissão (cubos, diferencia, redutor final)", 
        "impar e verificar as engrenagens e rolamentos da transmissão"
    ];
}

