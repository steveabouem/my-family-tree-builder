<?php

namespace App\Entity;

use App\Repository\ExpenseRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ORM\Entity(repositoryClass=ExpenseRepository::class)
 */
class Expense
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $goal_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $description;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGoalId(): ?string
    {
        return $this->goal_id;
    }

    public function setGoalId(string $goal_id): self
    {
        $this->goal_id = $goal_id;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }
}
