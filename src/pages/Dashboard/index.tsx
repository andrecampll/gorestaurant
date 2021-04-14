import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type IFood = {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

type Foods = IFood[];

export default function Dashboard() {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     foods: [],
  //     editingFood: {},
  //     modalOpen: false,
  //     editModalOpen: false,
  //   }
  // }

  const [foods, setFoods] = useState<Foods>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      setFoods(response.data);
    };
    
    loadFoods();
  }, []);

  const handleAddFood = async (food: IFood) => {
    try {
      const response = await api.post<IFood>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: IFood) => {
    // const { foods, editingFood } = this.state;

    try {
      const foodUpdated = await api.put<IFood>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      // this.setState({ foods: foodsUpdated });
      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    // const { foods } = this.state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    // this.setState({ foods: foodsFiltered });
    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    // const { modalOpen } = this.state;

    // this.setState({ modalOpen: !modalOpen });
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    // const { editModalOpen } = this.state;

    // this.setState({ editModalOpen: !editModalOpen });
    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: IFood) => {
    // this.setState({ editingFood: food, editModalOpen: true });
    setEditingFood(food);
    setEditModalOpen(true);
  }

  // const { modalOpen, editModalOpen, editingFood, foods } = this.state;

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};
