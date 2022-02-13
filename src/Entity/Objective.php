<?php

namespace App\Entity;

use App\Repository\ObjectiveRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ObjectiveRepository::class)
 */
class Objective
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
    private $milestones = [];

     /**
     * @ORM\Column(type="string", length=255)
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="objectives")
     * @ORM\JoinColumn(nullable=false)
     */
    private $created_by;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMilestones(): ?array
    {
        return $this->milestones;
    }

    public function setMilestones(?array $milestones): self
    {
        $this->milestones = $milestones;

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

    public function getCreatedBy(): ?User
    {
        return $this->created_by;
    }

    public function setCreatedBy(?User $created_by): self
    {
        $this->created_by = $created_by;

        return $this;
    }
}
