// src/pages/Home.jsx

import React from "react";


function Home() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Добро пожаловать в панель управления тестами
            </h1>

            <div className="mb-6 text-lg leading-relaxed">
                <p className="mb-4">
                    Здесь вы можете <strong>создавать и редактировать наборы тестов</strong> для похождения в Telegram,
                    а также <strong>создавать свои собственные тесты</strong>.
                </p>

                <h2 className="text-xl font-semibold mb-2">Наборы тестов</h2>
                <p className="mb-4">
                    Если вы хотите <strong>поделиться</strong> тестами,
                    объедините их в «Наборы»:
                    зайдите в раздел <strong>«Наборы»</strong> и нажмите 
                    <strong> «Create Test Pack»</strong>. Сформированный набор можно будет
                    легко отправить пользователям по одной ссылке.
                </p>

                <h2 className="text-xl font-semibold mb-2">Создание тестов</h2>
                <p className="mb-4">
                    Чтобы создать собственный тест, перейдите в раздел <strong>«Тесты»</strong> и
                    нажмите на кнопку <strong>«Create Test»</strong>.
                    <br />
                    <strong>При добавлении вопросов можно выбрать как открытый формат (свободный ответ),
                    так и формат теста (с вариантами ответов и баллами за них)</strong>. Это
                    позволяет автоматически подсчитывать суммарный результат прохождения.
                </p>

                <p className="mb-4">
                    <em>Приятного использования!</em>
                </p>
            </div>
        </div>
    );
}


export default Home;