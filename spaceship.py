from dataclasses import dataclass

MINIMUM_OXYGEN: int = 60
HIGH_OXYGEN: int = 30

NORMAL_REACTOR_TEMP: int = 800
HIGH_REACTOR_TEMP: int = 1000

NORMAL_RADIATION: int = 50
HIGH_RADIATION: int = 80

NORMAL_PRESSURE: int = 70
HIGH_PRESSURE: int = 40

MINIMUM_ENGINES: int = 2

MINIMUM_EVACUATION_ENGINES: int = 1
MINIMUM_EVACUATION_CREW: int = 1

FUEL_PER_DISTANCE_TWO_ENGINES: int = 2
FUEL_PER_DISTANCE_ONE_ENGINE: int = 4

DANGER_NORMAL: int = 0
DANGER_WARNING: int = 2
DANGER_HIGH: int = 3
DANGER_CRITICAL: int = 4
DANGER_MAX: int = 5

@dataclass
class StationResult:
    status: str
    danger_level: int
    action: str
    evacuation_possible: bool
    required_fuel: int

def check_station(
    oxygen: int,
    reactorTemp: int,
    radiation: int,
    pressure: int,
    engines: int,
    distance: int,
    fuel: int,
    crew: int,
    communication: bool,
    autopilot: bool,
) -> StationResult:

    # расчёт необходимого топлива
    if engines >= MINIMUM_ENGINES:
        required_fuel = distance * FUEL_PER_DISTANCE_TWO_ENGINES
    elif engines == MINIMUM_EVACUATION_ENGINES:
        required_fuel = distance * FUEL_PER_DISTANCE_ONE_ENGINE
    else:
        required_fuel = 0

    # двигатели не работают
    if engines == 0:
        evacuation_possible = False

    # недостаточно топлива для эвакуации
    elif fuel < required_fuel:
        evacuation_possible = False

    # работает автопилот
    elif autopilot:
        evacuation_possible = True

    # эвакуацию экипаж может выполнить эвакуацию вручную
    elif crew >= MINIMUM_EVACUATION_CREW:
        evacuation_possible = True

    else:
        evacuation_possible = False

    # критическая разгерметизация + критическая нехватка кислорода
    if pressure < HIGH_PRESSURE and oxygen < CRITICAL_OXYGEN:
        status = "Критическая разгерметизация + критическая нехватка кислорода"
        danger_level = DANGER_MAX
        action = "Начать эвакуацию"

    # критическая нехватка кислорода
    elif oxygen < HIGH_OXYGEN:
        status = "Критическая нехватка кислорода"
        danger_level = DANGER_MAX
        action = "Начать эвакуацию"

    # критическая разгерметизация
    elif pressure < HIGH_PRESSURE:
        status = "Критическая разгерметизация"
        danger_level = DANGER_MAX
        action = "Устранить разгерметизацию"

    # перегрев реактора
    elif reactorTemp >= HIGH_REACTOR_TEMP:
        status = "Перегрев реактора"
        danger_level = DANGER_CRITICAL
        action = "Аварийно отключить реактор"

    # критическая радиация
    elif radiation >= HIGH_RADIATION:
        status = "Критическая радиация"
        danger_level = DANGER_CRITICAL
        action = "Перейти в защищённый отсек"

    # станция не может двигаться
    elif engines == 0:
        status = "Невозможность движения"
        danger_level = DANGER_HIGH
        action = "Ожидать спасения"

    # недостаточно топлива для эвакуации
    elif fuel < required_fuel:
        status = "Нехватка топлива"
        danger_level = DANGER_HIGH
        action = "Эвакуация невозможна"

    # предупреждение по уровню кислорода
    elif oxygen < MINIMUM_OXYGEN:
        status = "Предупреждение"
        danger_level = DANGER_WARNING
        action = "Контролировать уровень кислорода"

    # предупреждение по температуре реактора
    elif reactorTemp >= NORMAL_REACTOR_TEMP:
        status = "Предупреждение"
        danger_level = DANGER_WARNING
        action = "Контролировать температуру реактора"

    # предупреждение по радиации
    elif radiation >= NORMAL_RADIATION:
        status = "Предупреждение"
        danger_level = DANGER_WARNING
        action = "Контролировать уровень радиации"

    # предупреждение по давлению
    elif pressure < NORMAL_PRESSURE:
        status = "Предупреждение"
        danger_level = DANGER_WARNING
        action = "Контролировать давление"

    # предупреждение по двигателям
    elif engines < MINIMUM_ENGINES:
        status = "Предупреждение"
        danger_level = DANGER_WARNING
        action = "Контролировать двигатели"

    # нормальная работа
    else:
        status = "Нормальная работа"
        danger_level = DANGER_NORMAL
        action = "Продолжать работу"

    # эвакуация невозможна при критическом уровне кислорода
    if oxygen < HIGH_OXYGEN and not evacuation_possible:
        if communication:
            action = "Отправить сигнал бедствия"
        else:
            action = "Ожидание спасения невозможно"

    return StationResult(
        status,
        danger_level,
        action,
        evacuation_possible,
        required_fuel,
    )
