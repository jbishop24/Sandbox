TEMPLATE = app
CONFIG += console c++11
CONFIG -= app_bundle
CONFIG -= qt

win32 {
    INCLUDEPATH += "C:/SFML-2.6.1/include"
    LIBS += -L"C:/SFML-2.6.1/lib" \
        -lsfml-graphics \
        -lsfml-window \
        -lsfml-system
    INCLUDEPATH += "C:/glm-0.9.9.8"
}
else {
    LIBS += \
        -lpthread \
        -lsfml-graphics \
        -lsfml-window \
        -lsfml-system
}

SOURCES += \
        main.cpp

DISTFILES += \
    fluids.frag \
    simulation.frag \
    test.frag
