// src/pages/Home.jsx

import React from "react";


function Home() {
    return (
    <div className="max-w-5xl mx-auto"> {/* Увеличили max-w-4xl до max-w-5xl */}
        <h1 className="text-3xl font-bold mb-6 text-center">
            Добро пожаловать в панель управления тестами
        </h1>
        <div className="mb-6 text-lg leading-relaxed">
            <p>
                Вы можете <strong>создавать и редактировать собственные наборы тестов</strong> для чат-бота в Telegram,
                а также создавать <strong>свои тесты</strong>.
            </p>
            <br />
            <p><em> 
                <strong>Кнопки навигации</strong> находятся в нижней части экрана. 
                Возврат на главную со страницы создания или удаления 
                тестов и наборов происходит через кнопку <strong>«Назад» </strong>в левом верхнем углу экрана.
            </em></p> 
            <br />
            <h2 className="text-xl font-semibold mb-2">Наборы тестов</h2>
            <p>
                Если вы хотите поделиться тестами, объедините их в <strong>«Наборы»</strong>: зайдите в раздел
                <strong>«Наборы»</strong> и нажмите <strong>«Create Test Pack»</strong>.
                Сформированный набор можно отправить пользователю по ссылке через <strong>«Share»</strong>.
            </p>
            <br />
            <h2 className="text-xl font-semibold mb-2">Создание тестов</h2>
            <p>Чтобы создать свой тест, перейдите в раздел <strong>«Тесты»</strong> и нажмите на кнопку <strong>«Create Test»</strong>.</p>
            <br />
            <p>
                Можно добавлять как открытые вопросы (со свободным ответом чат-боту), так и закрытые (с вариантами ответов и баллами за них или без баллов,
                если подсчет не требуется).
            </p>
            <br />
            <p className="mb-12">
                <strong><em>Приятного использования!</em></strong>
            </p>
        </div>
    </div>
    );
}


export default Home;